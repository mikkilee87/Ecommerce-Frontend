//get the product ID from the URL
const urlParams = new URLSearchParams(window.location.search);
const productId = urlParams.get("product_id");

//defines the API urls
const productApi = `http://3.136.18.203:8000/products/${productId}/`;
const categoriesApi = "http://3.136.18.203:8000/categories/";

//Elements
const productDetailContainer = document.getElementById("product-detail-container");
const productNotFoundContainer = document.getElementById("product-not-found");

//fetch function
function fetchData(url) {
    return fetch(url)
    .then(response => {
        if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.json();
    });
}

//function to show "product not found" message
function showProductNotFound() {
    //hides the product container
    productDetailContainer.style.display = "none";

    //shows the "product not found" message
    productNotFoundContainer.style.display = "block";
}

//function to get the single product data
function getSingleProduct() {
    if (!productId) {
        showProductNotFound();
        return;
    }

    Promise.all([
        fetchData(productApi),
        fetchData(categoriesApi),
    ])
    .then(([product, categories]) => {
        //Finds the category for this product
        const category = categories.find(cat => cat.category_id === product.category);

        //formats pricing
        const priceToUse = product.starting_at_price || product.price || 0;
        const price_str = priceToUse.toString().split(".");

        if (price_str.length === 1) price_str.push("00");
        if (price_str[1].length === 1) price_str[1] += "0";

        //updates the DOM with product details
        document.querySelector(".product-title").textContent = product.name;
        document.querySelector(".product-detail-img img").src = product.picture_url || "placeholder.jpg";
        document.querySelector(".details").textContent = product.description || "";
        document.querySelector(".product-quantity").textContent = `Stock Quantity: ${product.stock_quantity}`;
        document.querySelector(".product-price span").textContent = "$";
        document.querySelector(".product-price p").textContent = `${price_str[0]}.${price_str[1]}`;

        //adds category name if available and sets the default price
        if (product.varieties && product.varieties.length > 0) {
            //if there are variants, start with $0.00
            document.querySelector(".product-price p").textContent = "0.00";
        } else {
            //if no variants, show the regular price
            document.querySelector(".product-price p").textContent = `${price_str[0]}.${price_str[1]}`;
        }
        
        if (category) {
            document.querySelector(".product-category").textContent = category.name;
        }

        //handles product varieties
        if (product.varieties && product.varieties.length > 0) {
            const variantSelect = document.getElementById("product-variant");

            //clears any existing option
            variantSelect.innerHTML = '<option value="">Select a variety</option>';

            //adds each variety as an option
            product.varieties.forEach(variety => {
                const option = document.createElement("option");
                option.value = variety.price;
                console.log(variety);
                option.textContent = variety.name;
                option.dataset.price = variety.price;
                variantSelect.appendChild(option);
            });
            document.querySelector(".variation-selection").style.display = "block";

            //adds an event listener when a variant is selected to update price
            variantSelect.addEventListener("change", function() {
                const selectedOption = this.options[this.selectedIndex];
                if (selectedOption.value) {
                    const varietyPrice = selectedOption.dataset.price;
                    const priceParts = varietyPrice.toString().split(".");
                    if (priceParts.length === 1) priceParts.push("00");
                    if (priceParts[1].length === 1) priceParts[1] += "0";

                    document.querySelector(".product-price p").textContent = `${priceParts[0]}.${priceParts[1]}`;    
                } else {
                    document.querySelector(".product-price p").textContent = "0.00";
                }
            });
        } else {
            document.querySelector(".variation-selection").style.display = "none";
        }

        //shows product details
        productDetailContainer.style.display = "block";

        //updates page title
        document.title = `${product.name} - Your Store Name`;

        //sets up purchase buttons after product is loaded
        if (window.cartFunctions && window.cartFunctions.setupProductDetailButtons) {
            window.cartFunctions.setupProductDetailButtons(product);
        }
    })
    .catch(error => {
        console.error("Error loading product:", error);
        showProductNotFound();
    });              
}

//sets up quantity controls
function setupQuantityControls() {
    const quantityElement = document.querySelector(".quantity");
    const minusButton = document.querySelector(".quantity-minus");
    const plusButton = document.querySelector(".quantity-plus");

    let quantity = 1;

    minusButton.addEventListener("click", () => {
        if (quantity > 1) {
            quantity--;
            quantityElement.textContent = quantity;
        }
    });

    plusButton.addEventListener("click", () => {
            quantity++;
            quantityElement.textContent = quantity;
    });
}

//Intialize
setupQuantityControls();
getSingleProduct();