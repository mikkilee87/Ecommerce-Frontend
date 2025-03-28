const urlParams = new URLSearchParams(window.location.search);
const productId = urlParams.get("product_id");

const productsApi = `http://3.136.18.203:8000/products/${productId}/`;
const categoriesApi = "http://3.136.18.203:8000/categories/";

const productDetailContianer = document.getElementById("product-detail-container");
const productNotFoundContainer = document.getElementById("product-not-found");

function fetchData(url) {
    return fetch(url)
    .then(response => {
        if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.json();
    });
}

function showProductNotFound() {
    productDetailContianer.style.display = "none";

    productNotFoundContainer.style.display = "block";
}

function getSingleProduct() {
    if (!productId) {
        showProductNotFound();
        return;
    }

    Promise.all([
        fetchData(productsApi),
        fetchData(categoriesApi),
    ])
    .then(([products, categories]) => {
        const category = categories.find(cat => cat.category_id === item.category);

        const priceToUSe = product.starting_at_price || product.price || 0;
        const price_str = priceToUse.toString().split(".");

        if (price_str.length === 1) price_str.push("00");
        if (price_str[1].length === 1) price_str[1] += "0";

        document.querySelector(".product-title").textContent = product.name;
        document.querySelector(".product-detail-img img").src = product_picture_url || "placeholder.jpg";
        document.querySelector(".details").textContent = product.description || "";
        document.querySelector(".product-quantity").textContent = `Stock Quantity: ${product.stock_quantity}`;
        document.querySelector(".product-price span").textContent = "$";
        document.querySelector(".product-price sup").textContent = `$price_str[0].${price_str[1]}`;

        if (category) {
            document.querySelector(".product-category").textContent = category.name;
        }

        if (product.varieties && product.varieties.length > 0) {
            const variantSelect = document.getElementById("product-variant");

            variantSelect.innerHTML = '<option value="">Select a variety</option>';

            product.varieties.forEach(variety => {
                const option = document.createElement("option");
                option.value = variety.id;
                option.textContent = variety.name;
                option.dataset.price = variety.price;
                variantSelect.appendChild(option);
            });
            document.querySelector(".variant-selection").style.display = "block";

            variantSelect.addEventListener("change", function() {
                const selectedOption = this.options[this.selectedIndex];
                if (selectedOption.value) {
                    const VarietyPrice = selectedOption.dataset.price;
                    const priceParts = VarietyPrice.toString().split(".");
                    if (priceParts.length === 1) priceParts.push("00");
                    if (priceParts[1].length === 1) priceParts[1] += "0";

                    document.querySelector(".product-price sup").textContent = `${priceParts[0]}.${priceParts[1]}`;    
                } else {
                    document.querySelector(".product-price sup").textContent = `${priceParts[0]}.${priceParts[1]}`;
                }
            });
        } else {
            document.querySelector(".variation-selection").style.display = "none";
        }
        productDetailContianer.style.display = "block";
        document.title = `${product.name} - Your Store Name`;
    })
    .catch(error => {
        console.error("Error loading product:", error);
        showProductNotFound();
    });              
}

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

    plusButtonButton.addEventListener("click", () => {
        if (quantity > 1) {
            quantity--;
            quantityElement.textContent = quantity;
        }
    });
}

setupQuantityControls();
getSingleProduct();
