//defines API endpoint
const orderApi = "http://3.136.18.203:8000/orders/"

let cart = [];

//Payment method mapping
const paymentMethodMapping = {
    "credit card": "CREDIT_CARD",
    "debit card": "DEBIT_CARD",
    "payPal": "PAYPAL",
    "cash on delivery": "CASH_ON_DELIVERY"
};

//Load cart when page loads
document.addEventListener("DOMContentLoaded", function() {
    loadCart();
    displayCartTotal();
    
    //Sets up checkout button click event
    document.getElementById("checkout-btn").addEventListener('click', checkout);
});

//loads cart from localStorage
function loadCart() {
    const savedCart = localStorage.getItem("cart");
    if (savedCart) {
        cart = JSON.parse(savedCart);
    } else {
        //If no cart exists, creates a redirect message
        alert('Your cart is empty. Please add items before checkout.');
        window.location.href = "products.html";
        
    }
}

//display cart total in the total amount field
function displayCartTotal() {
    const totalAmount = calculateTotal();
    document.getElementById("total-amount").value = `$${totalAmount}`;
}

//calculates total from cart items
function calculateTotal() {
    return cart.reduce((total, item) => {
        return total + (item.price * item.quantity);
    }, 0).toFixed(2);
}

//get the selected payment method from radio buttons
function getSelectedPaymentMethod() {
    
    const paymentRadios = document.getElementsByName("payment");
    
    //Loops through payments to find which one was checked
    for (let i = 0; i < paymentRadios.length; i++) {
        if (paymentRadios[i].checked) {
            const humanValue = paymentRadios[i].value;

            return paymentMethodMapping[humanValue] || humanValue;
        }
    }
    
    
    return "Credit_Card";
}

//Process checkout
function checkout() {
    
    const shippingAddress = document.getElementById("query").value;
    
    //Validates shipping address
    if (!shippingAddress) {
        alert('Please enter a shipping address');
        return;
    }

    //get total amount from input field and removes $ if present
    let totalAmount = document.getElementById("total-amount").value;
    if (totalAmount.startsWith ("$")) {
        totalAmount = totalAmount.substring(1);
    }
    totalAmount = parseFloat(totalAmount).toFixed(2);
    //validates total amount
    if (isNaN(totalAmount) || totalAmount <=0) {
        alert('Please eneter a valid amount');
        return;
    }
    
    //creates a random customer id between 1000 and 9999
    const customerId = Math.floor(Math.random() * 9000) + 1000;
    
    //generates current date-time in ISO 8601 format
    const orderDate = new Date().toISOString();
    
   
    const paymentMethod = getSelectedPaymentMethod();
    
   //prepares order data
    const orderData = {
        
        customer_id: customerId,
        order_date: orderDate,
        total_amount: totalAmount,
        payment_method: paymentMethod,
        shipping_address: shippingAddress,
        
        //cart items
        items: cart.map(item => ({
            product: item.id,
            quantity: item.quantity
        }))
    };
    
    
    const checkoutBtn = document.getElementById("checkout-btn");
    const originalBtnText = checkoutBtn.innerHTML;
    checkoutBtn.innerHTML = '<i class="ri-loader-2-line"></i> Processing...';
    checkoutBtn.disabled = true;
    
    //sends order to API
    fetch(orderApi, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(orderData)
    })
    .then(response => {
        if (!response.ok) {
            throw new Error(`Error: ${response.status}`);
        }
        return response.json();
    })
    .then(data => {
        console.log("Order submitted successfully:", data);
        
        //Store order details in localStorage
        const orderSummary = {
            order_id: data.id, 
            customer_id: customerId,
            order_date: orderDate,
            total_amount: totalAmount,
            payment_method: paymentMethod,
            shipping_address: shippingAddress,
            items: cart
        };
        
        localStorage.setItem("lastOrder", JSON.stringify(orderSummary));
        
        //Clears the cart
        localStorage.removeItem("cart");
        
       //Shows confirmation message
        alert(`Order placed successfully! Your order ID is: ${data.id}`);
              
    })
    //No redirect - User stays on the checkout page
    .catch(error => {
        console.error('Checkout error:', error);
        alert('There was an error processing your order. Please try again.');
        
        //Resets the button
        checkoutBtn.innerHTML = originalBtnText;
        checkoutBtn.disabled = false;
    });
}