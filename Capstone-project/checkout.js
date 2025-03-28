const orderApi = "http://3.136.18.203:8000/orders/"

let cart = [];

const paymentMethodMapping = {
    "credit card": "Credit_Card",
    "debit card": "Debit_Card",
    "payPal": "Paypal",
    "cash on delivery": "cod"
};


document.addEventListener("DOMContentLoaded", function() {
    loadCart();
    displayCartTotal();
    
    
    document.getElementById("checkout-btn").addEventListener('click', checkout);
});

function loadCart() {
    const savedCart = localStorage.getItem("cart");
    if (savedCart) {
        cart = JSON.parse(savedCart);
    } else {
        
        alert('Your cart is empty. Please add items before checkout.');
        
    }
}


function displayCartTotal() {
    const totalAmount = calculateTotal();
    document.getElementById("total-amount").value = `$${totalAmount}`;
}


function calculateTotal() {
    return cart.reduce((total, item) => {
        return total + (item.price * item.quantity);
    }, 0).toFixed(2);
}


function getSelectedPaymentMethod() {
    
    const paymentRadios = document.getElementsByName("payment");
    
    
    for (let i = 0; i < paymentRadios.length; i++) {
        if (paymentRadios[i].checked) {
            const humanValue = paymentRadios[i].value;

            return paymentMethodMapping[humanValue] || humanValue;
        }
    }
    
    
    return "Credit_Card";
}


function checkout() {
    
    const shippingAddress = document.getElementById("query").value;
    
    
    if (!shippingAddress) {
        alert('Please enter a shipping address');
        return;
    }

    let totalAmount = document.getElementById("total-amount").value;
    if (totalAmount.startsWith ("$")) {
        totalAmount = totalAmount.substring(1);
    }
    totalAmount = parseFloat(totalAmount).toFixed(2);
    if (isNaN(totalAmount) || totalAmount <=0) {
        alert('Please eneter a valid amount');
        return;
    }
    
    
    const customerId = Math.floor(Math.random() * 9000) + 1000;
    
    
    const orderDate = new Date().toISOString();
    
   
    const paymentMethod = getSelectedPaymentMethod();
    
   
    const orderData = {
        
        customer_id: customerId,
        order_date: orderDate,
        total_amount: totalAmount,
        payment_method: paymentMethod,
        shipping_address: shippingAddress,
        
        
        status: "pending",
        
        
        items: cart.map(item => ({
            product: item.id,
            quantity: item.quantity
        }))
    };
    
    
    const checkoutBtn = document.getElementById("checkout-btn");
    const originalBtnText = checkoutBtn.innerHTML;
    checkoutBtn.innerHTML = '<i class="ri-loader-2-line"></i> Processing...';
    checkoutBtn.disabled = true;
    
    
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
        
        
        localStorage.removeItem("cart");
        
       
        alert(`Order placed successfully! Your order ID is: ${data.id}`);
              
    })
    .catch(error => {
        console.error('Checkout error:', error);
        alert('There was an error processing your order. Please try again.');
        
    
        checkoutBtn.innerHTML = originalBtnText;
        checkoutBtn.disabled = false;
    });
}