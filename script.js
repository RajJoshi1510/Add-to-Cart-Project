
//DOM
const cards = document.querySelectorAll('.card');
const right_arrow = document.querySelector('.arrow.right');
const left_arrow = document.querySelector('.arrow.left');
const shopping_cart_icon = document.querySelector('.shopping-cart');
const cart_btns = document.querySelectorAll('.add-to-cart');

//Slider Logic 
let left = 0;
let card_size = 25.4;
let total_card_size = cards.length * card_size - card_size * 4;

if (window.matchMedia('(max-width: 768px)').matches) {
    card_size = 52;
    total_card_size = cards.length * card_size - card_size * 2;
}

left_arrow.onclick = () => {
    left -= card_size;
    if (left <= 0) left = 0;
    moveCards(left);
    checkArrowVisibility(left);
};

left_arrow.style.opacity = '0';

right_arrow.onclick = () => {
    left += card_size;
    if (left >= total_card_size) left = total_card_size;
    moveCards(left);
    checkArrowVisibility(left);
};

function moveCards(left) {
    for (const card of cards) {
        card.style.left = -left + "%";
    }
}

function checkArrowVisibility(pos) {
    left_arrow.style.opacity = pos === 0 ? '0' : '1';
    right_arrow.style.opacity = pos >= total_card_size ? '0' : '1';
}

//Add to Cart Logic
// Initialize cart from localStorage or create an empty array
let cart = JSON.parse(localStorage.getItem('cart')) || [];

// Function to add item to cart
function addToCart(item) {
    // Check if item already exists
    const existingItem = cart.find(cartItem => cartItem.id === item.id);
    if (existingItem) {
        existingItem.quantity++;
    } else {
        cart.push({ ...item, quantity: 1 });
    }
    updateCart();
}

// Function to update cart (save to localStorage and update icon count)
function updateCart() {
    localStorage.setItem('cart', JSON.stringify(cart));
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    shopping_cart_icon.setAttribute('data-product-count', totalItems);
}

// Event listeners for "Add To Cart" buttons
for (const cart_btn of cart_btns) {
    cart_btn.onclick = (e) => {
        // --- Flying Animation ---
        shopping_cart_icon.classList.add('active');
        let target_parent = e.target.closest('.card');
        target_parent.style.zIndex = "100";
        let img = target_parent.querySelector('img');
        let flying_img = img.cloneNode();
        flying_img.classList.add('flying-img');
        target_parent.appendChild(flying_img);

        const flying_img_pos = flying_img.getBoundingClientRect();
        const shopping_cart_pos = shopping_cart_icon.getBoundingClientRect();

        let data = {
            left: shopping_cart_pos.left - (shopping_cart_pos.width / 2 + flying_img_pos.left + flying_img_pos.width / 2),
            top: shopping_cart_pos.bottom - flying_img_pos.bottom + 30
        };

        flying_img.style.cssText = `
            --left: ${data.left.toFixed(2)}px;
            --top: ${data.top.toFixed(2)}px;
        `;

        setTimeout(() => {
            target_parent.style.zIndex = "";
            target_parent.removeChild(flying_img);
            shopping_cart_icon.classList.remove('active');
        }, 1000);

        // --- Add item to cart logic ---
        const item = {
            id: target_parent.dataset.id,
            title: target_parent.dataset.title,
            price: parseFloat(target_parent.dataset.price),
            img: target_parent.dataset.img
        };
        addToCart(item);
    };
}
// Update cart on initial page load
updateCart();