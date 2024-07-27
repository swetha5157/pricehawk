import axios from "axios";
import * as cheerio from 'cheerio';
import { extractCurrency, extractPrice } from "../utils";
import { Product } from "@/types";

export async function scrapeAmazonProduct(url: string): Promise<Product | null> {
  if (!url) return null;

  const username = String(process.env.BRIGHT_DATA_USERNAME);
  const password = String(process.env.BRIGHT_DATA_PASSWORD);
  const port = 22225;
  const session_id = (1000000 * Math.random()) | 0;
  const proxy = `http://${username}-session-${session_id}:${password}@brd.superproxy.io:${port}`;

  try {
    // Fetch product page
    const response = await axios.get(url, {
      proxy: false,
      httpsAgent: new (require('https').Agent)({ proxy })
    });

    const $ = cheerio.load(response.data);
    const title = $('#title').text().trim();
    const currentPrice = extractPrice(
      $('.priceToPay span.a-price-whole'),
      $('a.size.base.a-color-price'),
      $('.a-button-selected .a-color-base'),
      $('.a-price.a-text-price')
    );
    const originalPrice = extractPrice(
      $('#priceblock_ourprice'),
      $('#priceblock_dealprice'),
      $('.a-price.a-text-price span.a-offscreen'),
      $('#listPrice'),
      $('.a-size-base.a-color-price')
    );

    const outofstock = $('#availability span').text().trim().toLowerCase() === 'currently unavailable';

    const imgs = 
      $('#imgBlkFront').attr('data-a-dynamic-image') || 
      $('#landingImage').attr('data-a-dynamic-image') || 
      '{}';
    const imgUrls = Object.keys(JSON.parse(imgs));

    const currency = extractCurrency($('.a-price-symbol'));
    const discountPrice = $('.savingsPercentage').text().replace(/[-%]/g, "");
    const stars = 
      $('#averageCustomerReviews .a-size-base.a-color-base').text().trim() || 
      $('.a-declarative .a-size-base.a-color-base').text().trim() || 
      $('.a-popover-trigger.a-declarative .a-size-base.a-color-base').text().trim() || 
      $('.a-size-base.a-color-base').text().trim();

    // Construct data object from scraped info
    const data: Product = {
        url,
        currency: currency || '',
        image: imgUrls[0],
        title,
        currentPrice: Number(currentPrice) || Number(originalPrice),
        originalPrice: Number(originalPrice) || Number(currentPrice),
        priceHistory: [],
        discountPrice: Number(discountPrice),
        category: 'category',
        stars: Number(stars.replace(/[^\d.-]/g, '')) || 0, // Assuming stars are numerical
        isOutOfStock: outofstock,
        lowestPrice: Number(currentPrice) || Number(originalPrice),
        highestPrice: Number(originalPrice) || Number(currentPrice),
        averagePrice: (Number(currentPrice) + Number(originalPrice)) / 2,
    };

    return data;
  } catch (e: any) {
    console.error("Error details:", e);
    throw new Error(`Failed to scrape product: ${e.message}`);
  }
}
