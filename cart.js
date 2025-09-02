
document.addEventListener('DOMContentLoaded', () => {
    const cartItemsContainer = document.querySelector('.cart-items');
    const grandTotalElement = document.getElementById('grand-total');
    let cart = JSON.parse(localStorage.getItem('cart')) || [];

    function updateCart() {
        // Save to localStorage
        localStorage.setItem('cart', JSON.stringify(cart));
        renderCartItems();
        updateGrandTotal();
    }

    function renderCartItems() {
        cartItemsContainer.innerHTML = ''; // Clear existing items
        if (cart.length === 0) {
            cartItemsContainer.innerHTML = '<p>Your cart is empty.</p>';
            return;
        }

        cart.forEach(item => {
            const itemElement = document.createElement('div');
            itemElement.classList.add('cart-item');
            itemElement.innerHTML = `
                <div class="item-details">
                    <img src="${item.img}" alt="${item.title}">
                    <div class="item-info">
                        <h3>${item.title}</h3>
                        <p>$${item.price.toFixed(2)}</p>
                        <button class="remove-btn" data-id="${item.id}">Remove</button>
                    </div>
                </div>
                <div class="item-quantity">
                    <button class="quantity-btn" data-id="${item.id}" data-change="-1">-</button>
                    <span class="quantity-value">${item.quantity}</span>
                    <button class="quantity-btn" data-id="${item.id}" data-change="1">+</button>
                </div>
                <div class="item-total">$${(item.price * item.quantity).toFixed(2)}</div>
            `;
            cartItemsContainer.appendChild(itemElement);
        });
    }
    
    function updateGrandTotal() {
        const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        grandTotalElement.textContent = `$${total.toFixed(2)}`;
    }

    // Event Delegation for buttons
    cartItemsContainer.addEventListener('click', (e) => {
        const target = e.target;
        const id = target.dataset.id;

        // Handle remove button
        if (target.classList.contains('remove-btn')) {
            cart = cart.filter(item => item.id !== id);
            updateCart();
        }

        // Handle quantity buttons
        if (target.classList.contains('quantity-btn')) {
            const change = parseInt(target.dataset.change, 10);
            const item = cart.find(item => item.id === id);
            if (item) {
                item.quantity += change;
                if (item.quantity <= 0) {
                    // Remove item if quantity is 0 or less
                    cart = cart.filter(cartItem => cartItem.id !== id);
                }
            }
            updateCart();
        }
    });

    // Initial render
    renderCartItems();
    updateGrandTotal();
});