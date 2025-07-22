import { orders } from "./data/orders.js";
import { formatCurrency, getProduct } from "./utils/utils.js";
import { cart } from "./data/cart.js";


document.addEventListener('DOMContentLoaded', () => {
  renderOrders()
  updateCartCount()
})

function renderOrders(){
  const ordersPageElement = document.querySelector('.order__page')

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
    order.cartInfo.forEach((cart, cartIndex) => {

      let productToAdd = getProduct(cart.id)
      htmlMain += `
        <div class="product">
          <img class="product__image" src="./${productToAdd.image}" alt="">
          <div class="product__info">
            <div>
              <p class="order__name">${productToAdd.name}</p>
              <p class="order__time nowrap">Arriving on: August ${cart.deliveryOption.days}</p>
              <p class="order__quantity nowrap">Quantity: ${cart.quantity}</p><a class= "buy-again-link" href= "./index.html"><button class="buy-again primary__btn">Buy it again</button></a>
            </div>
            <div>
              <a class="track-package secondary__btn" href="./tracking.html?orderId=${order.id}&productId=${cart.id}&cartIndex=${cartIndex}">Track package</a>
            </div>
          </div>
        </div>
      `
      }
    );
    
    

    const section = document.createElement('section')
    section.classList.add('order__details')
    section.innerHTML = `${htmlHead}<div class= "products">${htmlMain}</div>`

    ordersPageElement.append(section)

    
  }
    
}

function updateCartCount(){
  let cartCount = 0
  const cartCountElement = document.querySelector('.cart-count-js')

  for(let cartItem of cart){
    cartCount += cartItem.quantity
  }

    cartCountElement.textContent = cartCount
}