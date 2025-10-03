const products = [
    { id: 1, name: 'Wireless Headphones', category: 'electronics', price: 149.99, icon: '🎧', description: 'Premium wireless headphones with noise cancellation and 30-hour battery life.', badge: 'NEW' },
    { id: 2, name: 'Smart Watch', category: 'electronics', price: 299.99, icon: '⌚', description: 'Advanced fitness tracking, heart rate monitoring, and smartphone notifications.', badge: 'HOT' },
    { id: 3, name: 'Designer Sunglasses', category: 'fashion', price: 199.99, icon: '🕶️', description: 'Stylish UV protection sunglasses with polarized lenses and premium frame.', badge: 'SALE' },
    { id: 4, name: 'Leather Backpack', category: 'fashion', price: 129.99, icon: '🎒', description: 'Genuine leather backpack with laptop compartment and multiple pockets.', badge: 'NEW' },
    { id: 5, name: 'Coffee Maker', category: 'home', price: 89.99, icon: '☕', description: 'Programmable coffee maker with thermal carafe and auto-brew feature.', badge: '' },
    { id: 6, name: 'Yoga Mat Pro', category: 'sports', price: 49.99, icon: '🧘', description: 'Extra thick non-slip yoga mat with carrying strap and alignment marks.', badge: 'SALE' },
    { id: 7, name: 'Bluetooth Speaker', category: 'electronics', price: 79.99, icon: '🔊', description: 'Waterproof portable speaker with 360° sound and 12-hour playtime.', badge: 'HOT' },
    { id: 8, name: 'Running Shoes', category: 'sports', price: 159.99, icon: '👟', description: 'Lightweight running shoes with responsive cushioning and breathable mesh.', badge: 'NEW' },
    { id: 9, name: 'Table Lamp', category: 'home', price: 69.99, icon: '💡', description: 'Modern LED desk lamp with adjustable brightness and USB charging port.', badge: '' },
    { id: 10, name: 'Denim Jacket', category: 'fashion', price: 89.99, icon: '🧥', description: 'Classic denim jacket with modern fit and premium quality fabric.', badge: 'SALE' },
    { id: 11, name: 'Air Fryer', category: 'home', price: 119.99, icon: '🍳', description: 'Digital air fryer with 8 cooking presets and dishwasher-safe basket.', badge: 'HOT' },
    { id: 12, name: 'Tennis Racket', category: 'sports', price: 179.99, icon: '🎾', description: 'Professional tennis racket with carbon fiber frame and perfect balance.', badge: '' },
    { id: 13, name: 'Laptop Stand', category: 'electronics', price: 45.99, icon: '💻', description: 'Ergonomic aluminum laptop stand with adjustable height and angle.', badge: '' },
    { id: 14, name: 'Winter Coat', category: 'fashion', price: 249.99, icon: '🧥', description: 'Warm insulated winter coat with water-resistant outer shell.', badge: 'NEW' },
    { id: 15, name: 'Dumbbells Set', category: 'sports', price: 99.99, icon: '🏋️', description: 'Adjustable dumbbells set with quick-change weight system.', badge: 'HOT' }
];

let cart = [];
let currentFilter = 'all';
let currentSort = 'default';
let currentPriceRange = 'all';
let searchQuery = '';

function renderProducts() {
    const grid = document.getElementById('productsGrid');
    grid.innerHTML = '';

    let filteredProducts = products.filter(p => {
        const matchesCategory = currentFilter === 'all' || p.category === currentFilter;
        const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                             p.description.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesPrice = checkPriceRange(p.price, currentPriceRange);
        return matchesCategory && matchesSearch && matchesPrice;
    });

    if (currentSort === 'price-low') {
        filteredProducts.sort((a, b) => a.price - b.price);
    } else if (currentSort === 'price-high') {
        filteredProducts.sort((a, b) => b.price - a.price);
    } else if (currentSort === 'name') {
        filteredProducts.sort((a, b) => a.name.localeCompare(b.name));
    }

    document.getElementById('resultsInfo').textContent = 
        `Showing ${filteredProducts.length} of ${products.length} products`;

    filteredProducts.forEach((product, index) => {
        const card = document.createElement('div');
        card.className = 'product-card';
        card.style.animationDelay = `${index * 0.1}s`;
        card.onclick = () => openModal(product);
        
        card.innerHTML = `
            <div class="product-image">
                ${product.badge ? `<span class="product-badge">${product.badge}</span>` : ''}
                ${product.icon}
            </div>
            <div class="product-info">
                <div class="product-category">${product.category}</div>
                <div class="product-title">${product.name}</div>
                <div class="product-description">${product.description.substring(0, 60)}...</div>
                <div class="product-footer">
                    <div class="product-price">${product.price}</div>
                    <button class="add-to-cart" onclick="event.stopPropagation(); buyNow(${product.id})">Buy Now</button>
                </div>
            </div>
        `;
        
        grid.appendChild(card);
    });

    if (filteredProducts.length === 0) {
        grid.innerHTML = '<div style="grid-column: 1/-1; text-align: center; color: #fff; font-size: 1.5rem; padding: 3rem;">No products found 😔</div>';
    }
}

function checkPriceRange(price, range) {
    if (range === 'all') return true;
    if (range === '0-50') return price < 50;
    if (range === '50-100') return price >= 50 && price < 100;
    if (range === '100-200') return price >= 100 && price < 200;
    if (range === '200+') return price >= 200;
    return true;
}

function setupFilters() {
    const filterBtns = document.querySelectorAll('.filter-btn');
    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            currentFilter = btn.dataset.filter;
            renderProducts();
        });
    });

    document.getElementById('sortSelect').addEventListener('change', (e) => {
        currentSort = e.target.value;
        renderProducts();
    });

    document.getElementById('priceFilter').addEventListener('change', (e) => {
        currentPriceRange = e.target.value;
        renderProducts();
    });

    const searchBar = document.getElementById('searchBar');
    const clearSearch = document.getElementById('clearSearch');

    searchBar.addEventListener('input', (e) => {
        searchQuery = e.target.value;
        clearSearch.style.display = searchQuery ? 'flex' : 'none';
        renderProducts();
    });

    clearSearch.addEventListener('click', () => {
        searchBar.value = '';
        searchQuery = '';
        clearSearch.style.display = 'none';
        renderProducts();
    });
}

function addToCart(id) {
    const product = products.find(p => p.id === id);
    const existingItem = cart.find(item => item.id === id);

    if (existingItem) {
        existingItem.quantity++;
    } else {
        cart.push({ ...product, quantity: 1 });
    }

    updateCart();
    showNotification(`✅ ${product.name} added to cart!`);
}

function updateCart() {
    const cartCount = document.getElementById('cartCount');
    const cartItems = document.getElementById('cartItems');
    const cartFooter = document.getElementById('cartFooter');
    const cartTotal = document.getElementById('cartTotal');

    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    cartCount.textContent = totalItems;

    if (cart.length === 0) {
        cartItems.innerHTML = `
            <div class="cart-empty">
                <div class="cart-empty-icon">🛒</div>
                <p>Your cart is empty</p>
            </div>
        `;
        cartFooter.style.display = 'none';
    } else {
        cartItems.innerHTML = cart.map(item => `
            <div class="cart-item">
                <div class="cart-item-icon">${item.icon}</div>
                <div class="cart-item-details">
                    <div class="cart-item-name">${item.name}</div>
                    <div class="cart-item-price">${item.price}</div>
                    <div class="cart-item-controls">
                        <button class="qty-btn" onclick="decreaseQty(${item.id})">-</button>
                        <span class="qty-display">${item.quantity}</span>
                        <button class="qty-btn" onclick="increaseQty(${item.id})">+</button>
                        <button class="remove-item" onclick="removeFromCart(${item.id})">Remove</button>
                    </div>
                </div>
            </div>
        `).join('');
        
        const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        cartTotal.textContent = `${total.toFixed(2)}`;
        cartFooter.style.display = 'block';
    }
}

function increaseQty(id) {
    const item = cart.find(i => i.id === id);
    if (item) {
        item.quantity++;
        updateCart();
    }
}

function decreaseQty(id) {
    const item = cart.find(i => i.id === id);
    if (item && item.quantity > 1) {
        item.quantity--;
        updateCart();
    }
}

function removeFromCart(id) {
    cart = cart.filter(item => item.id !== id);
    updateCart();
    showNotification('🗑️ Item removed from cart');
}

function toggleCart() {
    const sidebar = document.getElementById('cartSidebar');
    sidebar.classList.toggle('active');
}

function buyNow(id) {
    const product = products.find(p => p.id === id);
    if (!product) return;
    
    const confirmation = confirm(
        `🛍️ Buy ${product.name}?\n\n` +
        `Price: ${product.price}\n\n` +
        `Click OK to proceed to checkout`
    );
    
    if (confirmation) {
        showNotification(`✅ Processing order for ${product.name}...`);
        setTimeout(() => {
            alert(
                `🎉 Order Confirmed!\n\n` +
                `Product: ${product.name}\n` +
                `Price: ${product.price}\n` +
                `Total: ${product.price}\n\n` +
                `Thank you for your purchase!\n` +
                `Order confirmation sent to your email.`
            );
        }, 500);
    }
}

function checkout() {
    if (cart.length === 0) return;
    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const itemsList = cart.map(item => `${item.name} x${item.quantity} - ${(item.price * item.quantity).toFixed(2)}`).join('\n');
    
    alert(
        `🎉 Order Confirmed!\n\n` +
        `Items:\n${itemsList}\n\n` +
        `Total: ${total.toFixed(2)}\n\n` +
        `Thank you for your purchase!\n` +
        `Order confirmation sent to your email.`
    );
    cart = [];
    updateCart();
    toggleCart();
}

function openModal(product) {
    const modal = document.getElementById('productModal');
    document.getElementById('modalImage').innerHTML = product.icon;
    document.getElementById('modalCategory').textContent = product.category;
    document.getElementById('modalTitle').textContent = product.name;
    document.getElementById('modalDescription').textContent = product.description;
    document.getElementById('modalPrice').textContent = `${product.price}`;
    
    const addBtn = document.getElementById('modalAddToCart');
    const buyBtn = document.getElementById('modalBuyNow');
    
    addBtn.onclick = () => {
        addToCart(product.id);
        closeModal();
    };
    
    buyBtn.onclick = () => {
        closeModal();
        buyNow(product.id);
    };
    
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeModal() {
    const modal = document.getElementById('productModal');
    modal.classList.remove('active');
    document.body.style.overflow = 'auto';
}

function showNotification(message) {
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        background: rgba(255, 255, 255, 0.95);
        backdrop-filter: blur(10px);
        padding: 1rem 2rem;
        border-radius: 50px;
        box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
        z-index: 10000;
        font-weight: 600;
        color: #e73c7e;
        animation: slideInRight 0.3s ease;
    `;
    notification.textContent = message;
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.animation = 'slideInRight 0.3s ease reverse';
        setTimeout(() => notification.remove(), 300);
    }, 2000);
}

document.getElementById('productModal').addEventListener('click', (e) => {
    if (e.target.id === 'productModal') closeModal();
});

document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        closeModal();
        if (document.getElementById('cartSidebar').classList.contains('active')) {
            toggleCart();
        }
    }
});

renderProducts();
setupFilters();
updateCart();