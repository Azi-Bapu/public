import { convertToPercent} from "../utils/utils.js"
import { getProduct } from "../utils/utils.js"
import { products } from "./products.js"

export const cart = JSON.parse(localStorage.getItem('cart')) || []

export function addToCart(productId){
  let productRepeat = false
  let productToAdd = getProduct(productId)

  for(let cartItem of cart){
    if(cartItem.id === productId){
      productRepeat = true
      cartItem.quantity += productToAdd.quantity
      cartItem.cost = productToAdd.priceCents * cartItem.quantity,
      cartItem.deliveryOptions[1].cost = convertToPercent(cartItem.cost, 10);
      cartItem.deliveryOptions[2].cost = convertToPercent(cartItem.cost, 30);
    }
  }


  if(productRepeat === false){
    cart.push({
      id: `${productToAdd.getId()}`, 
      quantity: productToAdd.quantity,
      cost: productToAdd.priceCents * productToAdd.quantity, 
      option: 0,
      deliveryOptions : 
      [
        {
          days: 7,
          cost: 0,
          checked: true
        },
        {
          days: 5,
          cost: convertToPercent(productToAdd.priceCents * productToAdd.quantity, 10),
          checked: false
        },
        {
          days: 1,
          cost: convertToPercent(productToAdd.priceCents * productToAdd.quantity, 30),
          checked: false
        }
      ]
    });
  }

  // Reset product's quantity to 1
  for(let product of products){
    if(product.getId() === productId){
      product.quantity = 1
    }
  }

  localStorage.setItem('cart', JSON.stringify(cart))
}

export function removeFromCart(cartId){
  cart.forEach( (cartItem, cartIndex) =>  {
    if(cartItem.id === cartId){
      cart.splice(cartIndex, 1)
    }
  });
}

export function cleanCart(){ 
  cart.splice(0)
  console.log(cart)
}