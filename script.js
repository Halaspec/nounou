// Example product JSON array with categories
const products = [
    { id: 1, name: "Product 1", price: 29.99, imageUrl: "https://crazeeburger.vercel.app/images/ice-cream.png", description: "This is a brief description of Product 1.", category: "electronics" },
    { id: 2, name: "Product 2", price: 19.99, imageUrl: "https://crazeeburger.vercel.app/images/ice-cream.png", description: "This is a brief description of Product 2.", category: "clothing" },
    { id: 3, name: "Product 3", price: 39.99, imageUrl: "https://crazeeburger.vercel.app/images/ice-cream.png", description: "This is a brief description of Product 3.", category: "home" },
    { id: 4, name: "Product 4", price: 49.99, imageUrl: "https://crazeeburger.vercel.app/images/ice-cream.png", description: "This is a brief description of Product 4.", category: "electronics" },
    // Add more products as needed
];

// Variable to track the total cart value
let cartTotal = 0;

// Function to create and return product HTML
function createProductHtml(product) {
    return `
        <div class="product-item" data-id="${product.id}">
            <img src="${product.imageUrl}" alt="${product.name}">
            <div class="product-info">
                <h2 class="product-title">${product.name}</h2>
                <p class="product-description">${product.description}</p>
                <div class="product-price">$${product.price}</div>
                <button class="add-to-cart-btn">Add to Cart</button>
            </div>
        </div>
    `;
}

// Function to render products with optional category filter
function renderProducts(products, categoryFilter = 'all') {
    const productList = document.getElementById('product-list');
    productList.innerHTML = ''; // Clear previous products

    const filteredProducts = categoryFilter === 'all' ? products : products.filter(product => product.category === categoryFilter);

    filteredProducts.forEach(product => {
        productList.insertAdjacentHTML('beforeend', createProductHtml(product));
    });

    // Reattach event listeners for "Add to Cart" buttons
    attachAddToCartListeners();
}

// Function to update the total value of the cart
function updateCartTotal() {
    const totalElement = document.getElementById('cart-total');
    totalElement.textContent = `Total: $${cartTotal.toFixed(2)}`;
}

// Function to add or update a product in the cart
function addToCart(product) {
    const cartItems = document.getElementById('cart-items');

    // Check if the product is already in the cart
    const existingCartItem = document.querySelector(`.cart-item[data-id="${product.id}"]`);
    
    if (existingCartItem) {
        // Increase quantity by 1 if the product is already in the cart
        const quantityElem = existingCartItem.querySelector('.quantity');
        const newQuantity = parseInt(quantityElem.textContent) + 1;
        quantityElem.textContent = newQuantity;

        // Update total
        cartTotal += product.price;
    } else {
        // Create new cart item HTML
        const cartItemHtml = `
            <div class="cart-item" data-id="${product.id}">
                <p>${product.name}</p>
                <p>$${product.price}</p>
                <p class="cart-item-quantity">Quantity: <span class="quantity">1</span></p>
                <span class="remove-item">Remove</span>
            </div>
        `;
        cartItems.insertAdjacentHTML('beforeend', cartItemHtml);

        // Update total
        cartTotal += product.price;
    }

    // Update cart total display
    updateCartTotal();

    // Show the BottomSheet
    const cartBottomSheet = document.getElementById('cart-bottom-sheet');
    cartBottomSheet.style.bottom = '0';
}

// Function to remove a product from the cart or decrease quantity
function removeCartItem() {
    const cartItem = this.parentElement;
    const quantityElem = cartItem.querySelector('.quantity');
    const productPrice = parseFloat(cartItem.querySelector('p:nth-of-type(2)').textContent.substring(1));
    
    if (parseInt(quantityElem.textContent) > 1) {
        // Decrease quantity if more than one
        quantityElem.textContent = parseInt(quantityElem.textContent) - 1;
        // Update total
        cartTotal -= productPrice;
    } else {
        // Remove the item if quantity is one
        cartTotal -= productPrice;
        cartItem.style.transform = 'translateX(-100%)';
        setTimeout(() => cartItem.remove(), 300); // Remove after animation
    }

    // Update cart total display
    updateCartTotal();
}

// Function to attach event listeners for "Add to Cart" buttons
function attachAddToCartListeners() {
    // Remove any previously attached event listeners to avoid duplicates
    document.querySelectorAll('.add-to-cart-btn').forEach(button => {
        button.removeEventListener('click', handleAddToCartClick); // Prevent multiple attachments
        button.addEventListener('click', handleAddToCartClick);
    });
}

// Event handler for adding items to the cart
function handleAddToCartClick() {
    const productId = this.closest('.product-item').dataset.id;
    const product = products.find(p => p.id === parseInt(productId));
    addToCart(product);
}

// Function to attach event listeners for remove buttons in the cart
function attachRemoveListeners() {
    // Remove any previously attached event listeners to avoid duplicates
    document.querySelectorAll('.remove-item').forEach(button => {
        button.removeEventListener('click', removeCartItem); // Prevent multiple attachments
        button.addEventListener('click', removeCartItem);
    });
}

// Handle category selection
document.querySelectorAll('.segmented-btn').forEach(button => {
    button.addEventListener('click', function() {
        document.querySelectorAll('.segmented-btn').forEach(btn => btn.classList.remove('active'));
        this.classList.add('active');
        const category = this.dataset.category;
        renderProducts(products, category);
    });
});

// Toggle BottomSheet visibility manually when checkout button is clicked
document.getElementById('checkout-btn').addEventListener('click', function() {
    const cartBottomSheet = document.getElementById('cart-bottom-sheet');
    const isVisible = cartBottomSheet.style.bottom === '0px';
    cartBottomSheet.style.bottom = isVisible ? '-100%' : '0';
});

// Close BottomSheet when close button is clicked
document.getElementById('close-cart').addEventListener('click', function() {
    const cartBottomSheet = document.getElementById('cart-bottom-sheet');
    cartBottomSheet.style.bottom = '-100%';
});

// Initialize products on page load
renderProducts(products);

// Attach event listeners using event delegation
document.addEventListener('click', function(event) {
    if (event.target.classList.contains('add-to-cart-btn')) {
        handleAddToCartClick.call(event.target);
    }

    if (event.target.classList.contains('remove-item')) {
        removeCartItem.call(event.target);
    }
});
