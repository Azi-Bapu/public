import { cart } from "./data/cart.js"
import { orders } from "./data/orders.js"
import { getProduct } from "./utils/utils.js"





document.addEventListener('DOMContentLoaded', () => {
  if(orders.length !== 0) renderTrackingPage()
  updateCartCount()
})

function renderTrackingPage(){
  const url = new URL(window.location.href)
  const orderId = url.searchParams.get('orderId')
  const productId = url.searchParams.get('productId')
  const cartIndex = url.searchParams.get('cartIndex')

  let html = ''
  let orderedItem
  const trackingMainPage = document.querySelector('.tracking-page-js')
  const product = getProduct(productId)
   
  for(let order of orders){
    if(orderId === order.id) orderedItem = order 
  }
  

  html += `
    <a class="view-orders__link" href="./ordersPage.html#order-${orderedItem.id}">View all orders</a>
    <h2 class="arrival-time">Arriving on Monday, June ${orderedItem.cartInfo[cartIndex].deliveryOption.days}</h2>
    <p class="arrival-order">${product.name}</p>
    <p class="arrival-qty">Quantity: ${orderedItem.cartInfo[cartIndex].quantity}</p>
    <div class="arrival-image__frame">
      <img class="arrival-image" src="./${product.image}" alt="">
    </div>
    <div class="arrival__stages">
      <p>Preparing</p>
      <p class="current-status">Shipped</p>
      <p>Delivered</p>
    </div>
    <div class="progress__bar">
      <span class="left-bar"></span>
      <span class="right-bar"></span>
    </div>
  `
  trackingMainPage.innerHTML = html
}

function updateCartCount(){
  let cartCount = 0
  const cartCountElement = document.querySelector('.cart-count-js')

  for(let cartItem of cart){
    cartCount += cartItem.quantity
  }

    cartCountElement.textContent = cartCount
}