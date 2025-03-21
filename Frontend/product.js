const PRODUCT_OPTIONS = [
  { name: "Full Shoe Design", price: 110.00, },
  { name:"Small Side Design", price: 95.00, },
  { name: "Front Design", price: 95.00, },
  { name:"Full Shoe Design + Shoe", price: 180.00, },
  { name: "Small Side Design + Shoe", price: 165.00, },
  { name: "Front Design + Shoe", price: 165.00, },
];

function initializeDropdown() {
const dropdownList = document.getElementById("product-options");
dropdownList.innerHTML = "";
PRODUCT_OPTIONS.forEach((product) => {
  const option = document.createElement("option");
  option.text = product.name;
  option.value = product.price;
  dropdownList.appendChild(option);
});
}

function addToCart() {
const dropdownList = document.getElementById("product-options");
const selectedIndex = dropdownList.selectedIndex;

const selectedItem = dropdownList.options[selectedIndex].text;
const selectedPrice = Number(dropdownList.value);

const cartTotal = parseFloat(localStorage.getItem("totalPrice")) || 0.00;
const newTotal = cartTotal + selectedPrice;

localStorage.setItem("totalPrice", newTotal);

alert(
selectedItem +
" added to your Cart. \nTotal price is $" +
newTotal.toFixed(2)
);

}

function updateDisplayedPrice(price) {
const priceElement = document.getElementById("current-price");
priceElement.textContent = `$${price}`;
}
document.addEventListener("DOMContentLoaded", () => {
initializeDropdown();

const dropdownList = document.getElementById("product-options");

const savedSelection = localStorage.getItem("selectedItem");
if (savedSelection) {
dropdownList.value = savedSelection;
}

updateDisplayedPrice(dropdownList.value);

dropdownList.addEventListener("change", () => {
const selectedPrice = dropdownList.value;
updateDisplayedPrice(selectedPrice);
localStorage.setItem("selectedItem", selectedPrice);
});
});

const open = document.getElementById("open");
const modal_container = document.getElementById("modal-container");
const close = document.getElementById("close");

open.addEventListener("click", () => {
modal_container.classList.add("show");  
});

close.addEventListener("click", () => {
modal_container.classList.remove("show");  
});

function displayCart() {
  const cart = JSON.parse(localStorage.getItem(CART_KEY)) || [];
  const cartItemsList = document.getElementById("cart-items-list");
  const cartTotalElement = document.getElementById("cart-total");
  const cartTotalItems = document.getElementById("cart-total-items");
  const eachItemQuantity = document.getElementById("each-item-quantity");

  cartItemsList.innerHTML = "";

  let total = 0;
  cart.forEach((item) => {
    total += item.price;
 
    const listItem = document.createElement("li");
    listItem.textContent = `${item.name} - $${item.price.toFixed(2)}`;
    cartItemsList.appendChild(listItem);
  });

  cartTotalElement.textContent = total.toFixed(2);
  cartTotalItems.textContent = cart.length;
}