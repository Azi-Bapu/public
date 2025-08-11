import { cart, removeFromCart, cleanCart } from "./data/cart.js";
import { orders, placeOrder } from "./data/orders.js";
import { convertToPercent, formatCurrency, getProduct } from "./utils/utils.js";

let itemsCount = 0 
let itemsCost = 0
let deliveryFee = 0 // The total of the checked radio inputs
let tax = 0
let preTax = 0
let postTax = 0

document.addEventListener('DOMContentLoaded', () => {
  renderPage()
});

function renderPage(){
  renderOrderSummary()
  renderPaymentSummary()
  renderRadioValues()
  updateItemsCount()
}

function renderOrderSummary(){
  let html = ''
  const orderSummaryElement = document.querySelector('#order-summary-js')

  for(let cartItem of cart){
    let productToAdd = getProduct(cartItem.id)
    const optionPicked = cartItem.option
    const dayPicked = cartItem.deliveryOptions[optionPicked].days
   
    html += `
        <div class="order">
            <h3 class="delivery__date">Delivery date: Tuesday, June ${dayPicked}</h3>
          <section class="delivery-grid">
            <div class="delivery__preview">
              <div class="delivery-image__frame">
                <img src="./${productToAdd.image}" alt="${productToAdd.name} product image" class="delivery__image">
              </div>
              <div class="order__info">
                <p class="two-line-clip item__title">${productToAdd.name}</p>
                <p class="item__cost">$${formatCurrency(cartItem.cost)}</p>
                <p>Quantity: ${cartItem.quantity} <span class= "nowrap"><a class="update__link" href="./index.html">Update</a> <a class="update__link delete-button-js" data-cartid= "${cartItem.id}">Delete</a></span></p>
              </div>
            </div>
            <div class="delivery__options" >
              <p class="option__title">Choose a delivery option:</p>
              <div class="option__container">
                <input class="radio-input radio-input-js" type="radio" name="option-${cartItem.id}" data-cartid="${cartItem.id}" data-deliveryOption= "0">
                <label class="option" for="option-${cartItem.id}" >
                  <span class="delivery-option__date delivery__date">Tuesday, June 21 </span>
                  <span class="delivery-option__cost">FREE Shipping</span>
                </label>
              </div>
              <div class="option__container">
                <input class="radio-input radio-input-js" type="radio" name="option-${cartItem.id}" data-cartid="${cartItem.id}" data-deliveryOption= "1" >
                <label class="option" for="option-${cartItem.id}" >
                  <span class="delivery-option__date delivery__date">Wednesday, June 15</span>
                  <span class="delivery-option__cost">$${formatCurrency(cartItem.deliveryOptions[1].cost)} - Shipping</span>
                </label>
              </div>
              <div class="option__container">
                <input class="radio-input radio-input-js" type="radio" name="option-${cartItem.id}" data-cartid="${cartItem.id}" data-deliveryOption= "2">
                <label class="option" for="option-${cartItem.id}" >
                  <span class="delivery-option__date delivery__date">Monday, June 13</span>
                  <span class="delivery-option__cost">$${formatCurrency(cartItem.deliveryOptions[2].cost)} - Shipping</span>
                </label>
              </div>
            </div>
          </section>
        </div>
      `
  }

  orderSummaryElement.innerHTML = html
}

function renderPaymentSummary(){
  itemsCount = 0 
  itemsCost = 0
  deliveryFee = 0 // The total of the checked radio inputs
  tax = 0
  preTax = 0
  postTax = 0
  
  const paymentSummaryElement = document.querySelector('#payment-summary-js')

  for(let cartItem of cart){
    const optionPicked = cartItem.option
    itemsCount += cartItem.quantity
    itemsCost += cartItem.cost
    deliveryFee += cartItem.deliveryOptions[optionPicked].cost
  }

  preTax = itemsCost + deliveryFee
  tax = convertToPercent(preTax, 10)
  postTax = preTax + tax

  let html = `
    <h3 class="summary__title">Order Summary</h3>
    <p><span>Items (${itemsCount}):</span><span>$${formatCurrency(itemsCost)}</span></p>
    <p><span>Shipping & handling:</span><span class="pre-tax-cost">$${formatCurrency(deliveryFee)}</span></p>
    <p><span>Total before tax:</span><span>$${formatCurrency(preTax)}</span></p>
    <p class="est-tax"><span>Estimated tax (10%):</span><span>$${formatCurrency(tax)}</span></p>
    <p class="order-total"><span>Order total:</span><span>$${formatCurrency(postTax)}</span></p><a class= "place-order__link" ><button class="primary__btn place-order__btn place-order-btn-js">Place your order</button></a>
    
  `

  paymentSummaryElement.innerHTML = html
}

document.addEventListener('click', function(e) {
  if (e.target.matches('.delete-button-js')) {
    const cartId = e.target.dataset.cartid;
    removeFromCart(cartId);
    localStorage.setItem('cart', JSON.stringify(cart));
    renderPage();
  }
  if (e.target.matches('.place-order-btn-js')) {
    if (cart.length !== 0) {
      placeOrder(postTax);
      localStorage.setItem('orders', JSON.stringify(orders));
      cleanCart();
      localStorage.setItem('cart', JSON.stringify(cart));
      renderOrderSummary();
      renderPaymentSummary();
      updateItemsCount();
      document.location.href = './ordersPage.html';
    }
  }
});

document.addEventListener('input', function(e) {
  if (e.target.matches('.radio-input-js')) {
    const cartId = e.target.dataset.cartid;
    const deliveryOption = e.target.dataset.deliveryoption;
    for (let cartItem of cart) {
      if (cartItem.id === cartId) {
        cartItem.option = deliveryOption;
        cartItem.deliveryOptions.forEach((option, optionIndex) => {
          option.checked = (deliveryOption == optionIndex);
        });
      }
    }
    renderRadioValues();
    localStorage.setItem('cart', JSON.stringify(cart));
    renderPage();
  }
});

function  renderRadioValues(){

  for(let cartItem of cart){
    let index = 0
    const radioElements = document.querySelectorAll(`input[name="option-${cartItem.id}"]`)  
    for(let radio of radioElements){
      radio.checked = cartItem.deliveryOptions[index].checked
      index +=1
    }
    
  }

}

function updateItemsCount(){
  let count = cart.length
  const itemsCount = document.querySelector('.item-count-js')
  itemsCount.textContent = count
}