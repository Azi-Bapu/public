import { products } from "../data/products.js"

export function convertToPercent(number, percentage){
  return (number * percentage ) / 100
}

export function formatCurrency(inCents){
  return (inCents / 100).toFixed(2)
}

// Get  the product object using the product's ID
export function getProduct(productId){
  for(let product of products){
      if(product.getId() === productId){
        return product
      }
    }
}