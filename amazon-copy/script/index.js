import { products } from "./data/products.js"
import { cart, addToCart } from "./data/cart.js"
import { formatCurrency } from "./utils/utils.js"


document.addEventListener('DOMContentLoaded', () => {
  renderPage()
})

let options = ''
for(let i = 1; i <= 10; i++){
  options += `<option value="${i}">${i}</option>`
}

function renderPage(){
  renderProducts()
  initSearch()
  updateCartCount()
}

function renderProducts() {
  const amazonMainElement = document.getElementById('amazon__products-js')
  let html = ''
  
  for(let product of products){
    
    html += `
      <article class="product__preview">
        <div class="product-image__frame">
          <img class="product-image__icon" src="./${product.image}" alt="${product.name} product image" width="679" height="753">
        </div>
        <div class="product__name two-line-clip">${product.name}</div>
        <div class="product__rating">
          <img class="rating-star" src="./images/ratings/rating-${product.ratingStarNo()}.png" alt="${product.name} rating" width="192" height="38">
          <span class="rating-count">${product.rating.count}</span>
        </div>
        <div class="product__cost">$${formatCurrency(product.priceCents)}</div>
        <select class="product__quantity product-quantity-js" name="product-quantity" data-productid= "${product.getId()}">
        ${options}
        </select>
        <div class="product__extra">
          <div class="add-to-cart__notification">Added</div>
        </div>
        <button class="add-to-cart primary__btn" data-productid="${product.getId()}">Add to Cart</button>
      </article>
    `
  }
  amazonMainElement.innerHTML = html;
}

// Synchronous event delegation for add-to-cart and quantity change
document.addEventListener('click', function(e) {
  if (e.target.matches('.add-to-cart')) {
    const productId = e.target.dataset.productid;
    addToCart(productId);
    renderProducts();
    updateCartCount();
  }
});

document.addEventListener('input', function(e) {
  if (e.target.matches('.product-quantity-js')) {
    const selectedQuantity = Number(e.target.value);
    const selectedId = e.target.dataset.productid;
    for (let product of products) {
      if (product.getId() === selectedId) {
        product.quantity = selectedQuantity;
      }
    }
  }
});

function updateCartCount(){
  let cartCount = 0
  const cartCountElement = document.querySelector('.cart-count-js')

  for(let cartItem of cart){
    cartCount += cartItem.quantity
  }

    cartCountElement.textContent = cartCount
}

function initSearch(){
  const searchElement = document.querySelector('.search-bar-js')
  searchElement.addEventListener('input', debounce(renderSearched, 250))
}

function debounce(fn, delay){

  let setIndex = 0
  return (e) => {
    console.log(e.target.value) 
    if(setIndex) clearTimeout(setIndex)
    if(e.target.value.length !== 0){
        setIndex = setTimeout(() => {
        fn(e)
      }, delay)
    } 
  }
}

function renderSearched(event){
  //Cross checking the searched with names of the general array of Products to filter out a new array, and push the array of classes through renderProducts()
  console.log(`${event.target.value} SENT`)
}