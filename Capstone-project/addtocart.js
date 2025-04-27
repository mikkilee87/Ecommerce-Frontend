const cartIcon = document.querySelector("#cart-icon");
const cart = document.querySelector(".cart");
const cartClose = document.querySelector("#cart-close");
const cartContent = document.querySelector(".cart-content");
const totalPriceElement = document.querySelector(".total-price");
const modalContainer = document.getElementById("modal-container");


//Track cart item count
let cartItemCount = 0;
let totalPrice = 0.00;

//function to show modal when item is added to cart
function showAddToCartModal (product, quantity, variantInfo) {

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
    priceElement.textContent = `$${totalPrice}`;

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

//function to show modal when a variety hasn't been selected
function showErrorModal (errorMessage) {
    //get modal elements
    const productNameElement = document.getElementById("modal-product-name");
    const quantityElement = document.getElementById("modal-quantity");
    const priceElement = document.getElementById("modal-price");
    const closeBtn = document.getElementById("modal-close");
    const continueShoppingBtn = document.getElementById("continue-shopping");
    const viewCartBtn = document.getElementById("view-cart");

    const modalTitle = document.querySelector("#cart-modal h2");
    modalTitle.textContent = "Error";

    //hide unnecessary Elements
    quantityElement.parentElement.style.display = "none";
    priceElement.parentElement.style.display = "none";
    viewCartBtn.style.display = "none";

    //set error message
    productNameElement.textContent = errorMessage;

    //rename continue shopping button
    continueShoppingBtn.textContent = "OK";

    //show modal
    modalContainer.classList.add("show");

    const closeModal = function () {
        //resets modal to original state
        modalTitle.textContent = "Item added to cart!";
        quantityElement.parentElement.style.display = "block";
        priceElement.parentElement.style.display = "block";
        viewCartBtn.style.display = "block";
        continueShoppingBtn.textContent = "Continue Shopping";

        modalContainer.classList.remove("show");

    };

    closeBtn.addEventListener("click", closeModal);

    modalContainer.addEventListener("click", function(event) {
        if (event.target === modalContainer) {
            closeModal();
        }
    });
    continueShoppingBtn.addEventListener("click", closeModal);
}

//cart functionality
function initializeCart () {
    //cart toggle functionality
    cartIcon.addEventListener("click", () => cart.classList.add("active"));
    cartClose.addEventListener("click", () => cart.classList.remove("active"));

    //load cart items from localStorage
    const savedCart = localStorage.getItem("cart");
    if (savedCart) {
        const cartItems = JSON.parse(savedCart);
        cartItems.forEach(item => {
            //create cart box element for each saved item
            const cartBox = document.createElement("div");
            cartBox.classList.add("cart-box");

            //create and add image element
            const img = document.createElement("img");
            img.src = item.image;
            img.classList.add("cart-img");
            cartBox.appendChild(img);

            //create detail container
            const detailDiv = document.createElement("div");
            detailDiv.classList.add("cart-detail");

            //create and add product title
            const titleElement = document.createElement("h2");
            titleElement.classList.add("cart-product-title");
            titleElement.textContent = item.name;
            detailDiv.appendChild(titleElement);

            //create and add price
            const priceElement = document.createElement("span");
            priceElement.classList.add("cart-price");
            priceElement.textContent = `$${item.price}`;
            detailDiv.appendChild(priceElement);

            //create quantity container
            const quantityDiv = document.createElement("div");
            quantityDiv.classList.add("cart-quantity");

            //create decrement button
            const decrementBtn = document.createElement("button");
            decrementBtn.id = "decrement";
            decrementBtn.textContent = "-";
            decrementBtn.style.color = item.quantity > 1 ? "#333" : "#999";
            quantityDiv.appendChild(decrementBtn);

            //create quantity number
            const numberSpan = document.createElement("span");
            numberSpan.classList.add("number");
            numberSpan.textContent = item.quantity;
            quantityDiv.appendChild(numberSpan);

            //create increment button
            const incrementBtn = document.createElement("button");
            incrementBtn.id = "increment";
            incrementBtn.textContent = "+";
            quantityDiv.appendChild(incrementBtn);

            //add qty div to details
            detailDiv.appendChild(quantityDiv);

            //add detail div to cartBox
            cartBox.appendChild(detailDiv);

            //create remove icon
            const removeIcon = document.createElement("i");
            removeIcon.classList.add("ri-delete-bin-line", "cart-remove");
            cartBox.appendChild(removeIcon);

            //add event listners for remove button
            removeIcon.addEventListener("click", () => {
                cartBox.remove();
                updateCartCount(-1);
                updateTotalPrice();

                //update localStorage when removing item
                const productTitle = cartBox.querySelector(".cart-product-title").textContent;
                let storedCart = JSON.parse(localStorage.getItem("cart") || "[]");
                storedCart = storedCart.filter(item => item.name !== productTitle);
                localStorage.setItem("cart", JSON.stringify(storedCart));
            });

            //add event listeners for qty buttons
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

                const productTitle = cartBox.querySelector(".cart-product-title").textContent;
                let storedCart = JSON.parse(localStorage.getItem("cart") || "[]");
                const itemIndex = storedCart.findIndex(item => item.name === productTitle);
                if (itemIndex !== -1) {
                    storedCart[itemIndex].quantity = qty;
                    localStorage.setItem("cart", JSON.stringify(storedCart));
                }
            });
            //add cart box to cart content
            cartContent.appendChild(cartBox);
        });
    }

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
    totalPrice = total.toFixed(2);
};

//function to add product to cart panel without the use of html
function addProductToCartPanel(product, quantity, variantPrice) {
    const variantInfo = variantPrice && product.varieties ?
    product.varieties.find(v => v.price === variantPrice) : null;

    const productTitle = product.name + (variantInfo ? `- ${variantInfo.name}`: '');
    const productPrice = variantInfo ? variantInfo.price : product.price;
    const productImgSrc = product.picture_url || 'placeholder.jpg';

    //creates a cart item and saves to localStorage
    const cartItem = {
        id: product.id || Math.random().toString(36).substr(2,9),
        name: productTitle,
        price: productPrice,
        quantity: quantity,
        image: productImgSrc
    }

    //gets existing cart from localStorage

    let storedCart = [];
    const savedCart = localStorage.getItem("cart");
    if (savedCart) {
        storedCart = JSON.parse(savedCart);
    }

    //check if product is already in cart
    const existingItemIndex = storedCart.findIndex(item => item.name === productTitle);

    if (existingItemIndex !== -1) {
        storedCart[existingItemIndex].quantity += quantity;
    } else {
        storedCart.push(cartItem);
    }

    //save cart to localStorage
    localStorage.setItem("cart", JSON.stringify(storedCart));
    
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

        //update localStorage when removing item
        const productTitle = cartBox.querySelector(".cart-product-title").textContent;
        let storedCart = JSON.parse(localStorage.getItem("cart") || "[]");
        storedCart = storedCart.filter(item => item.name !== productTitle);
        localStorage.setItem("cart", JSON.stringify(storedCart));
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

        const productTitle = cartBox.querySelector(".cart-product-title").textContent;
        let storedCart = JSON.parse(localStorage.getItem("cart") || "[]");
        const itemIndex = storedCart.findIndex(item => item.name === productTitle);
        if (itemIndex !== -1) {
            storedCart[itemIndex].quantity = qty;
            localStorage.setItem("cart", JSON.stringify(storedCart));
        }
    });

    //update cart count and toal price
    updateCartCount(1);
    updateTotalPrice();

    //show modal with item added
    showAddToCartModal(product, quantity,variantInfo);
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

//setup for product detail page purchase buttons
function setupProductDetailButtons(product) {
    const addToCartBtn = document.getElementById("details-add-cart-btn");
    const buyNowButton = document.getElementById("buy-now-btn");

    if (addToCartBtn) {
        addToCartBtn.addEventListener("click", () => {
            const quantity = parseInt(document.querySelector(".quantity").textContent);

            //get variant info if available
            const variantSelect = document.getElementById("product-variant");

            //checks if variants exist and if user has selected one
            if (product.varieties && product.varieties.length > 0 &&
                (!variantSelect.value || variantSelect.value === "")) {
                //show error modal
                showErrorModal("Please select a variety before adding to cart");
                return;
            }


            console.log(variantSelect);
            let variantId = null;

            if (variantSelect && variantSelect.value) {
                variantId = variantSelect.value;
            }
            //add to cart panel
            addProductToCartPanel(product, quantity, variantId);
        });
    }

    if (buyNowButton) {
        buyNowButton.addEventListener("click", () => {
            const quantity = parseInt(document.querySelector(".quantity").textContent);

            const variantSelect = document.getElementById("product-variant");
            //checks if variants exist and if user has selected one
            if (product.varieties && product.varieties.length > 0 &&
                (!variantSelect.value || variantSelect.value === "")) {
                //show error modal
                showErrorModal("Please select a variety before adding to cart");
                return;
            }

            let variantId = null;

            if (variantSelect && variantSelect.value) {
                variantId = variantSelect.value;
            }
            addProductToCartPanel(product, quantity, variantId);
            //redirect to checkout
            window.location.href = "checkout.html"
        });
    }
}

//intialize on page load
document.addEventListener("DOMContentLoaded", () => {
    initializeCart();
    setupListingPageButtons();
});

//export functions for use in other files
window.cartFunctions = {
    addProductToCartPanel,
    updateCartCount,
    updateTotalPrice,
    setupProductDetailButtons,
}