import { products } from "./data/products.js"
import { cart, addToCart } from "./data/cart.js"
/* import { renderCart } from "./checkout.js" */




document.addEventListener('DOMContentLoaded', () => {
  renderProducts()
  updateCartQuantity()
  initAddToCartHandler()
})

function renderProducts() {
  const amazonMainElement = document.getElementById('amazon__products-js')
  const fragment = document.createDocumentFragment()

  const arrayOfProducts = products.map( (product) => {
    return (
      `
        <div class="product-image__frame">
          <img class="product-image__icon" src="./${product.image}" alt="${product.name}" width="679"height="753">
        </div>
        <div class="product__name two-line-clip">${product.name}</div>
        <div class="product__rating">
          <img class="rating-star" src="./images/ratings/rating-${product.ratingStarNo()}.png" alt="" width="192" height="38">
          <span class="rating-count">${product.rating.count}</span>
        </div>
        <div class="product__cost">$${product.priceInDollars()}</div>
        <select class="product__quantity" name="product-quantity" id="product-quantity">
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
        <button class="add-to-cart primary__btn">Add to Cart</button>
      `
    );
  });

  arrayOfProducts.forEach( (product) => {
    const article = document.createElement('article')
    article.classList.add('product__preview')
    article.innerHTML += product
    fragment.append(article)
  });

  amazonMainElement.append(fragment)
}

function initAddToCartHandler () {
  const addToCartBtnElements = document.querySelectorAll('.add-to-cart')
  addToCartBtnElements.forEach( (button, btnIndex) => {
    button.addEventListener( 'click', () => {
      addToCart(button, btnIndex)
      updateCartQuantity()
    });
  });
}

function updateCartQuantity(){
  let count = 0
  const cartCountElement = document.getElementById('cart__quantity-js')

  cart.forEach( (cartItem) => {
    console.log(cartItem.qty)
    count += cartItem.qty
  });

  cartCountElement.textContent = count?.toString() || '0'
}