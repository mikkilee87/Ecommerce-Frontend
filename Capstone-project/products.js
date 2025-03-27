const template = document.getElementById("product-template")
const container = document.getElementById("product-container")
const productsApi = "http://3.136.18.203:8000/products/";
const categoriesApi = "http://3.136.18.203:8000/categories/";

function fetchData(url) {
    return fetch(url)
    .then(response => {
        if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.json();
    });
}

function getData() {
    Promise.all([
        fetchData(productsApi),
        fetchData(categoriesApi),
    ])
    .then(([products, categories]) => {
        container.innerHTML = '';

        products.forEach(item => {

            const category = categories.find(cat => cat.category_id === item.category);

            const productElement = template.content.cloneNode(true);

            const priceToUse = item.starting_at_price || item.price || 0;
            const price_str = priceToUse.toString().split(".");

            if (price_str.length === 1) price_str.push("00");
            if (price_str[1].length === 1) price_str[1] += "0";

            productElement.querySelector(".product-link").href += item.product_id;
            productElement.querySelector(".img-box .product-link").href = `/product.html?id=${item.product_id || item.id}`;
            productElement.querySelector(".img-box img").src = item.picture_url || "placeholder.jpg";
            productElement.querySelector(".product-title").textContent = item.name;
            productElement.querySelector(".product-description").textContent = item.description || "";
            productElement.querySelector(".product-quantity").textContent += item.stock_quantity;
            productElement.querySelector(".product-price").children[0].textContent += price_str[0];
            productElement.querySelector(".product-price").children[1].textContent += price_str[1];

            if (category) {
                productElement.querySelector(".product-category").textContent = category.name;

                if (category.name === "Dogs" || category.name.includes("Dog")) {
                    productElement.querySelector(".product-box").classList.add("dog-product");
                } else if (category.name === "Cats" || category.name.includes("Cat")) {
                    productElement.querySelector(".product-box").classList.add("cat-product");
                }
            }
            container.appendChild(productElement);
        });
    })
    .catch(error => {
        console.error("Error loading products:", error);
    });
}

getData();