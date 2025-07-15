import { orders } from "./data/orders.js";

document.addEventListener('DOMContentLoaded', () => {
  renderOrders()
});

function renderOrders() {
  const ordersMainElement = document.querySelector('main')
  const fragment = document.createDocumentFragment()

  const arrayOfOrders = orders.map( (product, index) => {
    return (
    `
      <div class="date-cost-id">
        <p class="date">
          <span class="nowrap">Order Placed:</span><span class="nowrap">August 12</span>
        </p>
        <p class="cost">
          <span class="nowrap">Total:</span><span class="nowrap">$${product.totalCost / 100}</span>
        </p>
        <p class="id">
          <span class="nowrap">Order ID:</span><span>${product.id}</span>
        </p>
      </div>
      <div class="products">
        <div class="product">
          <img class="product__image" src="./${product.item[0].image}" alt="">
          <div class="product__info">
            <div>
              <p class="order__name">${product.item[0].name}</p>
              <p class="order__time nowrap">Arriving on: August 15</p>
              <p class="order__quantity nowrap">Quantity: ${product.item[0].qty}</p>
              <button class="buy-again primary__btn">Buy it again</button>
            </div>
            <div>
              <a class="track-package secondary__btn" href="./tracking.html">Track package</a>
            </div>
          </div>
        </div>
        <div class="product">
          <img class="product__image" src="./${product.item[1].image}" alt="">
          <div class="product__info">
            <div>
              <p class="order__name">${product.item[1].name}</p>
              <p class="order__time nowrap">Arriving on: August 15</p>
              <p class="order__quantity nowrap">Quantity: ${product.item[1].qty}</p>
              <button class="buy-again primary__btn">Buy it again</button>
            </div>
            <div>
              <a class="track-package secondary__btn" href="./tracking.html">Track package</a>
            </div>
          </div>
        </div>
        <div class="product">
          <img class="product__image" src="./${product.item[2].image}" alt="">
          <div class="product__info">
            <div>
              <p class="order__name">${product.item[2].name}</p>
              <p class="order__time nowrap">Arriving on: August 15</p>
              <p class="order__quantity nowrap">Quantity: ${product.item[2].qty}</p>
              <button class="buy-again primary__btn">Buy it again</button>
            </div>
            <div>
              <a class="track-package secondary__btn" href="./tracking.html">Track package</a>
            </div>
          </div>
        </div>
      </div>
    `
    ) 
  });

  arrayOfOrders.forEach( (product) => {
    const section = document.createElement('section')
    section.classList.add('order__details')
    section.innerHTML += product  
    fragment.append(section)
  });

  ordersMainElement.append(fragment)
}