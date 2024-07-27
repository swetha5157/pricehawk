"use client"
import { scrapeAndStoreProduct } from '@/lib/action';
import React, { FormEvent, useState } from 'react'



const isValidAmazonProductURL=(url:string)=>{
try{
  const parsedURL=new URL(url);
  const hostname=parsedURL.hostname;
  if(
    hostname.includes('amazon.com')|| 
    hostname.includes('amazon.') ||
    hostname.endsWith('amazon')
  ) return true;
}catch(e){
  return false;
}
}
const SearchBar = () => {
  const [searchPrompt,setSearchPrompt]=useState('')
 const [isLoading,setIsLoading]=useState(false);

    const handleSubmit=async (event:FormEvent<HTMLFormElement>)=>{
      event.preventDefault();
      const isValidLink=isValidAmazonProductURL(searchPrompt)
  if(!isValidLink) return alert('Please provide a valid amazon link')
    try{
   setIsLoading(true);
   //scrape the product
   const product =await scrapeAndStoreProduct(searchPrompt);
  }catch(e){
    setIsLoading(false);
    alert('An error occured');
  }finally{
    setIsLoading(false);
  }
    }
  return (
    <>
<form 
className="flex flex-wrap gap-4 mt-12"
 onSubmit={handleSubmit}>
 <input
  type='text'
  value={searchPrompt}
  onChange={(e)=>setSearchPrompt(e.target.value)} 
  placeholder='Enter product link' 
  className='searchbar-input'
  />
<button 
type="submit" 
className='searchbar-btn'
disabled={searchPrompt==='' }>
   {isLoading? 'Searching...':"Search"}
</button>
</form>
      
    </>

  )
}

export default SearchBar

