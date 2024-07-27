import { PriceHistoryItem, Product } from "@/types";

const Notification = {
  WELCOME: 'WELCOME',
  CHANGE_OF_STOCK: 'CHANGE_OF_STOCK',
  LOWEST_PRICE: 'LOWEST_PRICE',
  THRESHOLD_MET: 'THRESHOLD_MET',
}

const THRESHOLD_PERCENTAGE = 40;
export function extractPrice(...ele:any){
    for(const e of ele){
        const priceText=e.text().trim();
        if(priceText) return priceText.replace(/[^\d.]/g, '');
    }
    return '';
}

export function extractCurrency(ele:any){
    const currencyText=ele.text().trim().slice(0,1);
    return currencyText?currencyText:'';
}

export function getHighestPrice(priceList: PriceHistoryItem[]) {
    let highestPrice = priceList[0];
  
    for (let i = 0; i < priceList.length; i++) {
      if (priceList[i].price > highestPrice.price) {
        highestPrice = priceList[i];
      }
    }
  
    return highestPrice.price;
  }
  
  export function getLowestPrice(priceList: PriceHistoryItem[]) {
    let lowestPrice = priceList[0];
  
    for (let i = 0; i < priceList.length; i++) {
      if (priceList[i].price < lowestPrice.price) {
        lowestPrice = priceList[i];
      }
    }
  
    return lowestPrice.price;
  }
  
  export function getAveragePrice(priceList: PriceHistoryItem[]) {
    const sumOfPrices = priceList.reduce((acc, curr) => acc + curr.price, 0);
    const averagePrice = sumOfPrices / priceList.length || 0;
  
    return averagePrice;
  }

  export function formatNumber(value: number, locale: string = 'en-IN'): string {
    return new Intl.NumberFormat(locale).format(value);
  }

  export const getEmailNotifType = (
    scrapedProduct: Product,
    currentProduct: Product
  ) => {
    const lowestPrice = getLowestPrice(currentProduct.priceHistory);
  
    if (scrapedProduct.currentPrice < lowestPrice) {
      return Notification.LOWEST_PRICE as keyof typeof Notification;
    }
    if (!scrapedProduct.isOutOfStock && currentProduct.isOutOfStock) {
      return Notification.CHANGE_OF_STOCK as keyof typeof Notification;
    }
    if (scrapedProduct.discountPrice >= THRESHOLD_PERCENTAGE) {
      return Notification.THRESHOLD_MET as keyof typeof Notification;
    }
  
    return null;
  };
  