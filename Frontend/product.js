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

    const cartTotal = parseFloat(localStorage.getItem("totalPrice")) || 0;
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