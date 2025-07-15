import { cart } from "./data/cart.js"

const dateFormat = ( () => {
  const format = {
    weekday: 'long',
    month: 'long',
    day: 'numeric'
  }

  return (date) => date.toLocaleDateString('en-US', format)
})();

document.addEventListener('DOMContentLoaded', () => {
  renderCart()
})

export function renderCart() {
  const checkoutElement = document.getElementById('delivery__info-js')
  const fragment = document.createDocumentFragment()
  const today = new Date()

  const arrayOfCheckoutItems = cart.map( (cartItem, cartIndex) => {
    return (
      `
        <h3 class="delivery__date">Delivery date: ${dateFormat(today)}</h3>
        <section class="delivery-grid">
          <div class="delivery__preview">
            <div class="delivery-image__frame">
              <img src="./${cartItem.image}" alt="" class="delivery__image">
            </div>
            <div class="order__info">
              <p class="two-line-clip item__title">${cartItem.name}</p>
              <p class="item__cost">$${cartItem.priceInDollars()}</p>
              <p class= "nowrap">Quantity: ${cartItem.qty}<a class="update__link" href="">Update</a> <a class="update__link" href="">Delete</a></p>
            </div>
          </div>
          <div class="delivery__options">
            <p class="option__title">Choose a delivery option:</p>
            <div class="option__container">
              <input class="radio-input" type="radio" name="option-${cartIndex}">
              <label class="option" for="option-${cartIndex}" >
                <span class="delivery-option__date delivery__date">${dateFormat( new Date(today - (7*24*60*60*1000)) )}</span>
                <span class="delivery-option__cost">FREE Shipping</span>
              </label>
            </div>
            <div class="option__container">
              <input class="radio-input" type="radio" name="option-${cartIndex}">
              <label class="option" for="option-${cartIndex}" >
                <span class="delivery-option__date delivery__date">${dateFormat( new Date(today - (3*24*60*60*1000)) )}</span>
                <span class="delivery-option__cost">$${cartItem.priceCents / 1000} - Shipping</span>
              </label>
            </div>
            <div class="option__container">
              <input class="radio-input" type="radio" name="option-${cartIndex}">
              <label class="option" for="option-${cartIndex}" >
                <span class="delivery-option__date delivery__date">${dateFormat( new Date(today - (24*60*60*1000)) )}</span>
                <span class="delivery-option__cost">$${2 * (cartItem.priceCents / 1000)} - Shipping</span>
              </label>
            </div>
          </div>
        </section>
      `
    ) 
  });

  arrayOfCheckoutItems.forEach( (checkoutItem) => {
    const div = document.createElement('div')
    div.classList.add('order')
    div.innerHTML += checkoutItem
    fragment.append(div)
  });

  checkoutElement.append(fragment)
}
