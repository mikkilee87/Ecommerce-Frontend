document.addEventListener("DOMContentLoaded", function() {

    const cartIcon = document.querySelector("#cart-icon");
    const cart = document.querySelector(".cart");
    const cartClose = document.querySelector("#cart-close");
    const cartContent = document.querySelector(".cart-content");
    const buyNowButton = document.querySelector(".btn-buy");
    
    let cartItemCount = 0;

    if (cartIcon) cartIcon.addEventListener("click", () => cart.classList.add("active"));
    if (cartClose) cartClose.addEventListener("click", () => cart.classList.remove("active"));


    const addCartButtons = document.querySelectorAll(".add-cart");
    addCartButtons.forEach(button => {
        button.addEventListener("click", event => {
            const productBox = event.target.closest(".product-box");
            addProductToCart(productBox);
        });
    });

    const detailsAddCartBtn = document.getElementById("details-add-cart-btn");
    if (detailsAddCartBtn) {
        detailsAddCartBtn.addEventListener("click", function() {
            addProductFromDetailPage();
        });
    }

    const buyNowBtn = document.getElementById("buy-now-btn");
    if (buyNowBtn) {
        buyNowBtn.addEventListener("click", function() {
            addProductFromDetailPage();
            window.location.href = "checkout.html";
        });
    }

    if (buyNowBtn) {
        buyNowBtn.addEventListener("click", function() {
            const cartBoxes = cartContent.querySelectorAll(".cart-box");
            if (cartBoxes.length === 0) {
                alert("Your cart is empty. Please add items to your cart before buying.");
                return;
            }

            cartBoxes.forEach(cartBox => cartBox.remove());
            cartItemCount = 0;
            updateCartCount(0);
            updateTotalPrice();

            alert("Thank you for your purchase!");
        });
    }

    function addProductToCart(productBox) {
        if (!productBox) return;

        const productImgSrc = productBox.querySelector("img").src;
        const productTitle = productBox.querySelector(".product-title").textContent;
        const productPrice = productBox.querySelector(".price").textContent;
        const productId = productBox.dataset.productId || "unknown";

        addToCartBtn(productId, null, productImgSrc, productTitle, productPrice, 1);
    }
    
})