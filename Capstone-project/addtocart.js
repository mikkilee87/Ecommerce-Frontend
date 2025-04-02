const cartIcon = document.querySelector("#cart-icon");
const cart = document.querySelector(".cart");
const cartClose = document.querySelector("#cart-close");
const cartContent = document.querySelector(".cart-content");
const totalPriceElement = document.querySelector(".total-price");
const modalContainer = document.getElementById("modal-container");


//Track cart item count
let cartItemCount = 0;

//function to show modal when item is added to cart
function showAddToCartModal (product, quantity, totalPrice, variantInfo) {

    //get modal elements
    const productNameElement = document.getElementById("modal-product-name");
    const quantityElement = document.getElementById("modal-quantity");
    const priceElement = document.getElementById("modal-price");
    const closeBtn = document.getElementById("modal-close");
    const continueShoppingBtn = document.getElementById("continue-shopping");
    const viewCartBtn = document.getElementById("view-cart");

    //set product details in modal
    const variantText = variantInfo ? `-${variantInfo.name}` : '';
    productNameElement.textContent = `${product.name}${variantText}`;
    quantityElement.textContent = quantity;
    priceElement.textContent = `$${totalPrice.toFixed(2)}`;

    //show the modal
    modalContainer.classList.add("show");

    const closeModal = function () {
        modalContainer.classList.remove("show");
    };

    closeBtn.addEventListener("click", closeModal);

    modalContainer.addEventListener("click", function(event) {
        if (event.target === modalContainer) {
            closeModal();
        }
    });

    continueShoppingBtn.addEventListener("click", closeModal);

    viewCartBtn.addEventListener("click", function () {
        closeModal();
        cart.classList.add("active");
    });
}

//cart functionality
function initializeCart () {
    //cart toggle functionality
    cartIcon.addEventListener("click", () => cart.classList.add("active"));
    cartClose.addEventListener("click", () => cart.classList.remove("active"));

    //buy now button in cart
    const buyNowButton = document.querySelector(".btn-buy");
    if (buyNowButton) {
        buyNowButton.addEventListener("click", () => {
            const cartBoxes = cartContent.querySelectorAll(".cart-box");
            if (cartBoxes.length === 0) {
                return;
            }
            //redirect to checkout
            window.location.href = "checkout.html";
        });
    }

    //set initial cart count from existing items
    const cartBoxes = cartContent.querySelectorAll(".cart-box");
    cartItemCount = cartBoxes.length;
    updateCartCount(0);
    updateTotalPrice();
}

//update cart counter indicator
function updateCartCount(change) {
    const cartItemCountBadge = document.querySelector(".cart-item-count");

    if (typeof change === 'number') {
        cartItemCount += change;
    }
    
    if (cartItemCount > 0) {
        cartItemCountBadge.style.visibility = "visible";
        cartItemCountBadge.textContent = cartItemCount;
    } else {
        cartItemCountBadge.style.visibility = "hidden";
        cartItemCountBadge.textContent = "";
    }
};

//calculate and update total price
function updateTotalPrice() {
    const cartBoxes = cartContent.querySelectorAll(".cart-box");
    let total = 0;
    cartBoxes.forEach(cartBox => {
        const priceElement = cartBox.querySelector(".cart-price");
        const quantityElement = cartBox.querySelector(".number");
        const price = priceElement.textContent.replace("$", "");
        const quantity = quantityElement.textContent;
        total += price * quantity;
    });
    totalPriceElement.textContent = `$${total.toFixed(2)}`; 
};

//function to add product to cart panel without the use of html
function addProductToCartPanel(product, quantity, variantId) {
    const variantInfo = variantId && product.varieties ?
    product.varieties.find(v => v.id === variantId) : null;

    const productTitle = product.name + (variantInfo ? `- ${variantInfo.name}`: '');
    const productPrice = variantInfo ? variantInfo.price : product.price;
    const productImgSrc = product.picture_url || 'placeholder.jpg';
    
    //check if product is already in cart
    const cartItems = cartContent.querySelectorAll(".cart-product-title");
    for (let item of cartItems) {
        if (item.textContent === productTitle) {
            //find the quantity element and increment it
            const cartBox = item.closest('.cart-box');
            const numberElement = cartBox.querySelector(".number");
            let currentQty = parseInt(numberElement.textContent);
            numberElement.textContent = currentQty + quantity;

            updateTotalPrice();

            showAddToCartModal(product,currentQty + quantity, productPrice * (currentQty + quantity), variantInfo);
            return;
        }
    }

    //creates cart box element without using html in js code
    const cartBox = document.createElement("div");
    cartBox.classList.add("cart-box");

    //create and add image element
    const img = document.createElement("img");
    img.src = productImgSrc;
    img.classList.add("cart-img");
    cartBox.appendChild(img);

    //create detail container
    const detailDiv = document.createElement("div");
    detailDiv.classList.add("cart-detail");

    //create and add product title
    const titleElement = document.createElement("h2");
    titleElement.classList.add("cart-product-title");
    titleElement.textContent = productTitle;
    detailDiv.appendChild(titleElement);

    //create and add price
    const priceElement = document.createElement("span");
    priceElement.classList.add("cart-price");
    priceElement.textContent = `$${productPrice}`;
    detailDiv.appendChild(priceElement);

    //create quantity container
    const quantityDiv = document.createElement("div");
    quantityDiv.classList.add("cart-quantity");

    //create decrement button
    const decrementBtn = document.createElement("button");
    decrementBtn.id = "decrement";
    decrementBtn.textContent = "-";
    quantityDiv.appendChild(decrementBtn);

    //create quantity number
    const numberSpan = document.createElement("span");
    numberSpan.classList.add("number");
    numberSpan.textContent = quantity;
    quantityDiv.appendChild(numberSpan);

    //create increment button
    const incrementBtn = document.createElement("button");
    incrementBtn.id = "increment";
    incrementBtn.textContent = "+";
    quantityDiv.appendChild(incrementBtn);

    //add quantity div to details
    detailDiv.appendChild(quantityDiv);

    //add detail div to cartBox
    cartBox.appendChild(detailDiv);

    //create remove icon
    const removeIcon = document.createElement("i");
    removeIcon.classList.add("ri-delete-bin-line", "cart-remove");
    cartBox.appendChild(removeIcon);

    //add cart box to cart content
    cartContent.appendChild(cartBox);

    removeIcon.addEventListener("click", () => {
        cartBox.remove();
        updateCartCount(-1);
        updateTotalPrice();
    });

    quantityDiv.addEventListener("click", event => {
        let qty = parseInt(numberSpan.textContent);

        if (event.target.id === "decrement" && qty > 1) {
            qty--;
            if (qty === 1) {
                decrementBtn.style.color = "#999";
            }
        } else if (event.target.id === "increment") {
            qty++;
            decrementBtn.style.color = "#333";
        }
        numberSpan.textContent = qty;
        updateTotalPrice();
    });

    //update cart count and toal price
    updateCartCount(1);
    updateTotalPrice();
}

//for add-cart button on product page
function setupListingPageButtons() {
    const addCartButtons = document.querySelectorAll(".add-cart");
    if (addCartButtons.length > 0) {
        addCartButtons.forEach(button => {
            button.addEventListener("click", event => {
                const productBox = event.target.closest(".product-box");

                //extract product info
                const productImgSrc = productBox.querySelector("img").src;
                const productTitle = productBox.querySelector(".product-title").textContent;
                const productPrice = productBox.querySelector(".price").textContent.replace("$", "");

                //create simplified product object
                const product = {
                    name: productTitle,
                    picture_url: productImgSrc,
                    price: parseFloat(productPrice)
                };

                //add to cart panel
                addProductToCartPanel(product, 1, null);
            });
        });
    }
}

function setupProductDetailButtons(product) {
    const addToCartBtn = document.getElementById("details-add-cart-btn");
    const buyNowButton = document.getElementById("buy-now-btn");

    if (addToCartBtn) {
        addToCartBtn.addEventListener("click", () => {
            const quantity = parseInt(document.querySelector(".quantity").textContent);

            const variantSelect = document.getElementById("product-variant");
            let variantId = null;

            if (variantSelect && variantSelect.value) {
                variantId = variantSelect.value;
            }
            addProductToCartPanel(product, quantity, variantId);
        });
    }

    if (buyNowButton) {
        buyNowButton.addEventListener("click", () => {
            const quantity = parseInt(document.querySelector(".quantity").textContent);

            const variantSelect = document.getElementById("product-variant");
            let variantId = null;

            if (variantSelect && variantSelect.value) {
                variantId = variantSelect.value;
            }
            addProductToCartPanel(product, quantity, variantId);

            window.location.href = "checkout.html"
        });
    }
}

document.addEventListener("DOMContentLoaded", () => {
    initializeCart();
    setupListingPageButtons();
});

window.cartFunctions = {
    addProductToCartPanel,
    updateCartCount,
    updateTotalPrice,
    setupProductDetailButtons,
}