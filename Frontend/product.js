function jsDropdown() {
    let dropdownList = document.getElementById("product-options");
    const listOfItems = [
        {
            name: "Full Shoe Design",
            price: 110.00,
        },
        {
            name:"Small Side Design",
            price: 95.00,
        },
        {
            name: "Front Design",
            price: 95.00,
        },
        {
            name:"Full Shoe Design + Shoe",
            price: 180.00,
        },
        {
            name: "Small Side Design + Shoe",
            price: 165.00,
        },
        {
            name: "Front Design + Shoe",
            price: 165.00,
        },
    ];

listOfItems.forEach((item) => {
    let option = document.createElement("option");
    option.text = item.name;
    option.value = item.price;
    dropdownList.add(option);
    });
}

function addToCart() {
    let dropdownList = document.getElementById("prodcut-options");
    let myCurrentItem = dropdownList.options[dropdownList.selectedIndex].text;
    let myCurrentPrice = Number(dropdownList.value);
    let myStoredPrice = Number(localStorage.getItem("totalPrice")) || 0;
    let myTotalPrice = myCurrentPrice + myStoredPrice;
    console.log("test button")
;  alert(
    myCurrentItem +
      " added to your Cart. \nTotal price is $" +
      myTotalPrice.toFixed(2)
  );
  localStorage.setItem("totalPrice", myTotalPrice.toFixed(2));
}

function updatePrice(price) {
    document.getElementById("current-price").innerHTML = "$" + price;
  }
  document.addEventListener("DOMContentLoaded", function () {
    jsDropdown();
    let dropdownList = document.getElementById("product-options");
    let savedDdSelection = localStorage.getItem("selectedItem");
    if (savedDdSelection) {
      dropdownList.value = savedDdSelection;
      updatePrice(savedDdSelection);
    } else {
      let initialPrice = dropdownList.value;
      updatePrice(initialPrice);
    }
    dropdownList.addEventListener("change", function () {
      let itemPrice = dropdownList.value;
      updatePrice(itemPrice);
      localStorage.setItem("selectedItem", itemPrice);
    });
  });