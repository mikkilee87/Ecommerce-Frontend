const template = document.getElementById("product-template")
const container = document.getElementById("product-container")
const productsApi = "http://3.136.18.203:8000/products/";
const categoriesApi = "http://3.136.18.203:8000/categories/";

document.addEventListener("DOMContentLoaded", function() {     
    const productsLink = document.getElementById("products-link");      
    productsLink.addEventListener('click', function(e){         
        const currentPage = window.location.pathname.split('/').pop();          
        if (currentPage === "products.html") {             
            e.preventDefault();             
            window.location.href = "products.html";         
        }     
    }); 
})