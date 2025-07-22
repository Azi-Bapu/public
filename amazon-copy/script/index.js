import { products } from "./data/products.js"
import { cart, addToCart } from "./data/cart.js"
import { formatCurrency } from "./utils/utils.js"


document.addEventListener('DOMContentLoaded', () => {
  renderPage()
})

function renderPage(){
  renderProducts()
  initAddToCartHandler()
  initSelectProductQtyHandler()
  updateCartCount()
}

function renderProducts() {
  const amazonMainElement = document.getElementById('amazon__products-js')
  let html = ''

  for(let product of products){
    html += `
      <article class= "product__preview">
        <div class="product-image__frame">
          <img class="product-image__icon" src="./${product.image}" alt="${product.name}" width="679"height="753">
        </div>
        <div class="product__name two-line-clip">${product.name}</div>
        <div class="product__rating">
          <img class="rating-star" src="./images/ratings/rating-${product.ratingStarNo()}.png" alt="" width="192" height="38">
          <span class="rating-count">${product.rating.count}</span>
        </div>
        <div class="product__cost">$${formatCurrency(product.priceCents)}</div>
        <select class="product__quantity product-quantity-js" name="product-quantity" data-productid= "${product.getId()}">
          <option value="1">1</option>
          <option value="2">2</option>
          <option value="3">3</option>
          <option value="4">4</option>
          <option value="5">5</option>
          <option value="6">6</option>
          <option value="7">7</option>
          <option value="8">8</option>
          <option value="9">9</option>
          <option value="10">10</option>
        </select>
        <div class="product__extra">
          <div class= "add-to-cart__notification">Added</div>
        </div>
        <button class="add-to-cart primary__btn" data-productid= "${product.getId()}">Add to Cart</button>
      </article>
    `
  }

  amazonMainElement.innerHTML = html

}

function initAddToCartHandler(){
  const addBtnElements = document.querySelectorAll('.add-to-cart')
  addBtnElements.forEach( (button) =>  {
    button.addEventListener('click', () => {
      const productId = button.dataset.productid
      addToCart(productId)
      renderPage()
    });
  });
}
 
function initSelectProductQtyHandler(){
  const selectElements = document.querySelectorAll('.product-quantity-js')
  for(let select of selectElements){
    select.addEventListener('input', () => {
      const selectedQuantity = Number(select.value)
      const selectedId = select.dataset.productid
      
      for(let product of products){
        if(product.getId() === selectedId){
          product.quantity = selectedQuantity
        }
      }
    });
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