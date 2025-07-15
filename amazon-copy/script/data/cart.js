import { products } from "./products.js"

export const cart = [{
    id: "e43638ce-6aa0-4b85-b27f-e1d07eb678c6",
    image: "images/products/athletic-cotton-socks-6-pairs.jpg",
    name: "Black and Gray Athletic Cotton Socks - 6 Pairs",
    rating: {
      stars: 4.5,
      count: 87
    },
    qty: 1,
    priceCents: 1090,
    keywords: [
      "socks",
      "sports",
      "apparel"
    ],

    getId(){
      return  this.id
    },

    priceInDollars() {
      return this.priceCents / 100
    },

    ratingStarNo(){
      return this.rating.stars * 10
    }
  },
];

export function addToCart(button, btnIndex) {
  let repeatStatus, repeatIdex 

  cart.forEach( (cartItem, cartItemIndex) => {
    // Compare the IDs of the items in the Cart with the current product-button pair. If true then the product already resides in the Cart
    if (cartItem.getId() === products[btnIndex].getId()) {
      repeatIdex = cartItemIndex
      repeatStatus = true // Assigns true only if the IDs match
    }
  });
  // If repeatStatus is true then only the Cart Quantity increases
  if(repeatStatus){
    cart[repeatIdex].qty += 1
    /* renderCart() */
    console.log(cart)
    // Disable button for 500ms to avoid functionality overload
    button.disabled = true
    setTimeout( () => {
      button.disabled = false
    }, 500);
    return
  }

  cart.push(products[btnIndex])
  console.log(cart)
  
  /* renderCart() */
  button.disabled = true
  setTimeout( () => {
    button.disabled = false
  }, 500);
}