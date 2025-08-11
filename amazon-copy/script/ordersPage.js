import { orders } from "./data/orders.js";
import { formatCurrency, getProduct, updateCartCount } from "./utils/utils.js";


document.addEventListener('DOMContentLoaded', () => {
  renderOrders()
  updateCartCount()
})

function renderOrders() {
  const ordersPageElement = document.querySelector('.order__page')
  let html = ''

  for(let order of orders){
    let htmlHead = ''
    let htmlMain = ''

    htmlHead += `
      <div id="order-${order.id}" class="date-cost-id">
        <p class="date">
          <span class="nowrap">Order Placed:</span><span class="nowrap">${order.datePlaced}</span>
        </p>
        <p class="cost">
          <span class="nowrap">Total:</span><span class="nowrap">$${formatCurrency(order.total)}</span>
        </p>
        <p class="id">
          <span class="nowrap">Order ID:</span><span>${order.id}</span>
        </p>
      </div>
    `
    const htmlMainArray = order.cartInfo.map((cart, cartIndex) => {
      let productToAdd = getProduct(cart.id);
      return `
        <div class="product">
          <img class="product__image" src="./${productToAdd.image}" alt="${productToAdd.name} product image">
          <div class="product__info">
            <div>
              <p class="order__name">${productToAdd.name}</p>
              <p class="order__time nowrap">Arriving on: August ${cart.deliveryOption.days}</p>
              <p class="order__quantity nowrap">Quantity: ${cart.quantity}</p><a class="buy-again-link" href="./index.html"><button class="buy-again primary__btn">Buy it again</button></a>
            </div>
            <div>
              <a class="track-package secondary__btn" href="./tracking.html?orderId=${order.id}&productId=${cart.id}&cartIndex=${cartIndex}">Track package</a>
            </div>
          </div>
        </div>
      `;
    });
    htmlMain = htmlMainArray.join('');
    html += `<section class="order__details">${htmlHead}<div class="products">${htmlMain}</div></section>`;
  }
  ordersPageElement.innerHTML = `<h1 class="page__title">Your Orders</h1>${html}`;
}