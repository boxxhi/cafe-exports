// Product data
const products = [
    {
        id: 1,
        name: "BALAM FIREBAT GESHA NATURAL - 340G",
        description: "Café de origen único con notas florales y cítricas. Procesado de forma natural para resaltar su dulzura natural.",
        price: 22.00,
        image: "BALAM-Firebat-Gesha-Natural-300x300.jpg",
        category: "granos"
    },
    {
        id: 2,
        name: "BALAM FIREBAT PACAMARA HONEY – 340G",
        description: "Café procesado con miel que aporta dulzura y cuerpo. Notas de caramelo y frutas tropicales.",
        price: 18.00,
        image: "BALAM-Firebat-Pacamara-Honey-300x300.jpg",
        category: "granos"
    },
    {
        id: 3,
        name: "CAFÉ CATÉ ESPRESSO - 340G",
        description: "Mezcla perfecta para espresso con notas de chocolate y caramelo. Ideal para preparaciones intensas.",
        price: 10.00,
        image: "Cafe-Cate-Espresso-300x300.jpg",
        category: "granos"
    },
    {
        id: 4,
        name: "ES-COFFEE BOURBON GOURMET - 340G",
        description: "Variedad Bourbon de alta calidad con notas de chocolate negro y frutos secos.",
        price: 9.00,
        image: "ES-CAFE-GOURMET-POSTAL-300x300.jpg",
        category: "granos"
    },
    {
        id: 5,
        name: "ES-COFFEE PACAMARA - 340G",
        description: "Café Pacamara con cuerpo sedoso y notas de chocolate, especias y un toque de vainilla.",
        price: 12.00,
        image: "ES-CAFE-PACAMARA-340-G-POSTAL-300x300.jpg",
        category: "granos"
    },
    {
        id: 6,
        name: "IMÁN PEQUEÑO DE CANASTA",
        description: "Iman decorativo con diseño de canasta tejida. Perfecto para decorar tu refrigerador o cualquier superficie metálica.",
        price: 2.50,
        image: "Montaje-refrigerador-300x300.jpg",
        category: "accesorios"
    }
];

// Shopping cart
let cart = [];

// DOM elements
const productsGrid = document.getElementById('products-grid');
const cartBtn = document.getElementById('cart-btn');
const cartModal = document.getElementById('cart-modal');
const closeCart = document.getElementById('close-cart');
const cartItems = document.getElementById('cart-items');
const cartCount = document.getElementById('cart-count');
const cartTotal = document.getElementById('cart-total');
const checkoutBtn = document.getElementById('checkout-btn');
const checkoutModal = document.getElementById('checkout-modal');
const closeCheckout = document.getElementById('close-checkout');
const checkoutForm = document.getElementById('checkout-form');
const successModal = document.getElementById('success-modal');
const closeSuccess = document.getElementById('close-success');

// Initialize the page
document.addEventListener('DOMContentLoaded', function() {
    loadProducts();
    setupEventListeners();
    updateCartDisplay();
});

// Load products into the grid
function loadProducts() {
    productsGrid.innerHTML = '';
    
    products.forEach(product => {
        const productCard = document.createElement('div');
        productCard.className = 'product-card';
        productCard.innerHTML = `
            <div class="product-image">
                <img src="${product.image}" alt="${product.name}" onerror="this.style.display='none'; this.nextElementSibling.style.display='flex';">
                <div class="product-image-fallback" style="display: none;">
                    <i class="fas fa-coffee"></i>
                </div>
            </div>
            <div class="product-info">
                <h3 class="product-title">${product.name}</h3>
                <p class="product-description">${product.description}</p>
                <div class="product-price">$${product.price.toFixed(2)}</div>
                <button class="add-to-cart-btn" onclick="addToCart(${product.id})">
                    ${product.category === 'accesorios' ? 'Añadir al carrito' : 'Seleccionar opciones'}
                </button>
            </div>
        `;
        productsGrid.appendChild(productCard);
    });
}

// Setup event listeners
function setupEventListeners() {
    // Cart modal
    cartBtn.addEventListener('click', () => {
        cartModal.style.display = 'block';
    });
    
    closeCart.addEventListener('click', () => {
        cartModal.style.display = 'none';
    });
    
    // Close cart modal when clicking outside
    cartModal.addEventListener('click', (e) => {
        if (e.target === cartModal) {
            cartModal.style.display = 'none';
        }
    });
    
    // Checkout modal
    checkoutBtn.addEventListener('click', () => {
        cartModal.style.display = 'none';
        checkoutModal.style.display = 'block';
    });
    
    closeCheckout.addEventListener('click', () => {
        checkoutModal.style.display = 'none';
    });
    
    // Close checkout modal when clicking outside
    checkoutModal.addEventListener('click', (e) => {
        if (e.target === checkoutModal) {
            checkoutModal.style.display = 'none';
        }
    });
    
    // Checkout form submission
    checkoutForm.addEventListener('submit', handleCheckout);
    
    // Success modal
    closeSuccess.addEventListener('click', () => {
        successModal.style.display = 'none';
        // Reset cart after successful purchase
        cart = [];
        updateCartDisplay();
    });
    
    // Close success modal when clicking outside
    successModal.addEventListener('click', (e) => {
        if (e.target === successModal) {
            successModal.style.display = 'none';
        }
    });
    
    // Smooth scrolling for navigation links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
    
    // Contact form submission
    const contactForm = document.querySelector('.contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', handleContactForm);
    }
}

// Add product to cart
function addToCart(productId) {
    const product = products.find(p => p.id === productId);
    if (!product) return;
    
    const existingItem = cart.find(item => item.id === productId);
    
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({
            ...product,
            quantity: 1
        });
    }
    
    updateCartDisplay();
    showNotification(`${product.name} agregado al carrito`);
}

// Remove product from cart
function removeFromCart(productId) {
    cart = cart.filter(item => item.id !== productId);
    updateCartDisplay();
}

// Update product quantity in cart
function updateQuantity(productId, change) {
    const item = cart.find(item => item.id === productId);
    if (item) {
        item.quantity += change;
        if (item.quantity <= 0) {
            removeFromCart(productId);
        } else {
            updateCartDisplay();
        }
    }
}

// Update cart display
function updateCartDisplay() {
    // Update cart count
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    cartCount.textContent = totalItems;
    
    // Update cart items
    cartItems.innerHTML = '';
    
    if (cart.length === 0) {
        cartItems.innerHTML = '<p style="text-align: center; color: #666;">Tu carrito está vacío</p>';
        cartTotal.textContent = '$0.00';
        return;
    }
    
    cart.forEach(item => {
        const cartItem = document.createElement('div');
        cartItem.className = 'cart-item';
        cartItem.innerHTML = `
            <div class="cart-item-info">
                <h4>${item.name}</h4>
                <span class="cart-item-price">$${item.price.toFixed(2)}</span>
            </div>
            <div class="cart-item-quantity">
                <button class="quantity-btn" onclick="updateQuantity(${item.id}, -1)">-</button>
                <span>${item.quantity}</span>
                <button class="quantity-btn" onclick="updateQuantity(${item.id}, 1)">+</button>
            </div>
            <button class="quantity-btn" onclick="removeFromCart(${item.id})" style="background: #ff6b6b; color: white;">×</button>
        `;
        cartItems.appendChild(cartItem);
    });
    
    // Update total
    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    cartTotal.textContent = `$${total.toFixed(2)}`;
}

// Handle checkout form submission
function handleCheckout(e) {
    e.preventDefault();
    
    // Simulate payment processing
    const submitBtn = e.target.querySelector('.submit-checkout-btn');
    const originalText = submitBtn.textContent;
    submitBtn.textContent = 'Procesando...';
    submitBtn.disabled = true;
    
    setTimeout(() => {
        checkoutModal.style.display = 'none';
        successModal.style.display = 'block';
        submitBtn.textContent = originalText;
        submitBtn.disabled = false;
        
        // Reset checkout form
        checkoutForm.reset();
    }, 2000);
}

// Handle contact form submission
function handleContactForm(e) {
    e.preventDefault();
    
    const submitBtn = e.target.querySelector('.submit-btn');
    const originalText = submitBtn.textContent;
    submitBtn.textContent = 'Enviando...';
    submitBtn.disabled = true;
    
    setTimeout(() => {
        submitBtn.textContent = 'Mensaje Enviado!';
        submitBtn.style.background = '#28a745';
        
        setTimeout(() => {
            submitBtn.textContent = originalText;
            submitBtn.disabled = false;
            submitBtn.style.background = '#D2691E';
            e.target.reset();
        }, 2000);
    }, 1500);
}

// Show notification
function showNotification(message) {
    // Create notification element
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        background: #D2691E;
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 8px;
        box-shadow: 0 4px 15px rgba(0,0,0,0.2);
        z-index: 3000;
        transform: translateX(400px);
        transition: transform 0.3s ease;
        max-width: 300px;
        font-weight: 500;
    `;
    notification.textContent = message;
    
    document.body.appendChild(notification);
    
    // Animate in
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);
    
    // Remove after 3 seconds
    setTimeout(() => {
        notification.style.transform = 'translateX(400px)';
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, 3000);
}

// Add some interactive effects
document.addEventListener('DOMContentLoaded', function() {
    // Add scroll effect to header
    window.addEventListener('scroll', function() {
        const header = document.querySelector('.header');
        if (window.scrollY > 100) {
            header.style.background = 'rgba(255, 255, 255, 0.98)';
        } else {
            header.style.background = 'rgba(255, 255, 255, 0.95)';
        }
    });
    
    // Add animation to product cards on scroll
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);
    
    // Observe all product cards
    document.querySelectorAll('.product-card').forEach(card => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(30px)';
        card.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(card);
    });
});

// Add keyboard navigation support
document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
        if (cartModal.style.display === 'block') {
            cartModal.style.display = 'none';
        }
        if (checkoutModal.style.display === 'block') {
            checkoutModal.style.display = 'none';
        }
        if (successModal.style.display === 'block') {
            successModal.style.display = 'none';
        }
    }
});

// Add loading animation for better UX
function showLoading() {
    const loading = document.createElement('div');
    loading.id = 'loading';
    loading.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(255, 255, 255, 0.9);
        display: flex;
        justify-content: center;
        align-items: center;
        z-index: 5000;
    `;
    loading.innerHTML = `
        <div style="text-align: center;">
            <div style="width: 50px; height: 50px; border: 4px solid #f3f3f3; border-top: 4px solid #D2691E; border-radius: 50%; animation: spin 1s linear infinite; margin: 0 auto 1rem;"></div>
            <p style="color: #D2691E; font-weight: 600;">Cargando...</p>
        </div>
    `;
    
    const style = document.createElement('style');
    style.textContent = `
        @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
        }
    `;
    
    document.head.appendChild(style);
    document.body.appendChild(loading);
    
    setTimeout(() => {
        if (loading.parentNode) {
            loading.parentNode.removeChild(loading);
        }
    }, 1000);
}

// Show loading on page load
window.addEventListener('load', showLoading);
