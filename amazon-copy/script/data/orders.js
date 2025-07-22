import { cart } from "./cart.js"

export const orders = JSON.parse(localStorage.getItem('orders')) || []

export function placeOrder(total){
  const cartArray = cart.map( cartItem =>  {
    return  { id: cartItem.id,
              quantity: cartItem.quantity,
              deliveryOption: cartItem.deliveryOptions[cartItem.option] 
            }
  })

  orders.push({
    datePlaced: "August 12",
    total,
    id: ((10 ** 20)  * Math.random()).toFixed(0),
    cartInfo: cartArray.filter( () => true)
  });

  
}