// Perfume Store JavaScript

// Product Data
const products = [
    {
        id: 1,
        name: "عطر الورد الدمشقي",
        price: 299,
        description: "عطر فاخر مستوحى من الورد الدمشقي الأصيل، يجمع بين الأناقة والعراقة في تركيبة مميزة تدوم طوال اليوم.",
        image: "fas fa-rose",
        category: "نسائي"
    },
    {
        id: 2,
        name: "عود ملكي فاخر",
        price: 599,
        description: "عطر العود الملكي الفاخر، تركيبة استثنائية من أجود أنواع العود الطبيعي مع لمسات من العنبر والمسك.",
        image: "fas fa-crown",
        category: "رجالي"
    },
    {
        id: 3,
        name: "ياسمين الليل",
        price: 249,
        description: "عطر رومانسي يأسر القلوب برائحة الياسمين المنعشة مع نفحات من الفانيليا والصندل الأبيض.",
        image: "fas fa-moon",
        category: "نسائي"
    },
    {
        id: 4,
        name: "صندل هندي أصيل",
        price: 449,
        description: "عطر الصندل الهندي الأصيل، رائحة دافئة وهادئة تناسب جميع المناسبات وتترك انطباعاً لا يُنسى.",
        image: "fas fa-tree",
        category: "للجنسين"
    },
    {
        id: 5,
        name: "عنبر ذهبي",
        price: 379,
        description: "تركيبة فريدة من العنبر الذهبي النقي مع لمسات من الزعفران والورد، عطر يليق بالملوك والأمراء.",
        image: "fas fa-gem",
        category: "رجالي"
    },
    {
        id: 6,
        name: "زهر البرتقال",
        price: 199,
        description: "عطر منعش وحيوي مستوحى من زهر البرتقال الطبيعي، مثالي للاستخدام اليومي ويمنح إحساساً بالنشاط.",
        image: "fas fa-sun",
        category: "للجنسين"
    }
];

// Cart Management
let cart = JSON.parse(localStorage.getItem('perfumeCart')) || [];

// DOM Elements - Initialize after DOM loads
let productsGrid, cartSidebar, cartItems, cartTotal, cartCount, productModal, checkoutModal;

// Initialize the application
document.addEventListener('DOMContentLoaded', function () {
    console.log('DOM Content Loaded - Initializing app...');

    // Initialize DOM elements
    productsGrid = document.getElementById('productsGrid');
    cartSidebar = document.getElementById('cartSidebar');
    cartItems = document.getElementById('cartItems');
    cartTotal = document.getElementById('cartTotal');
    cartCount = document.querySelector('.cart-count');
    productModal = document.getElementById('productModal');
    checkoutModal = document.getElementById('checkoutModal');

    // Check if elements exist
    if (!productsGrid) {
        console.error('Products grid element not found!');
        return;
    }

    console.log('Loading products...');
    loadProducts();
    updateCartUI();
    setupNavigation();
    setupAnimations();

    console.log('App initialized successfully');
});

// Load and display products
function loadProducts() {
    if (!productsGrid) {
        console.error('Products grid not available');
        return;
    }

    console.log('Loading', products.length, 'products');
    productsGrid.innerHTML = '';

    products.forEach((product, index) => {
        console.log('Creating card for product:', product.name);
        const productCard = createProductCard(product);
        productsGrid.appendChild(productCard);

        // Add staggered animation delay
        setTimeout(() => {
            productCard.classList.add('fade-in');
        }, index * 100);
    });

    console.log('Products loaded successfully');
}

// Create product card element
function createProductCard(product) {
    const card = document.createElement('div');
    card.className = 'product-card';
    card.onclick = () => showProductDetails(product);

    card.innerHTML = `
        <div class="product-image">
            <i class="${product.image}"></i>
        </div>
        <div class="product-info">
            <h3>${product.name}</h3>
            <p>${product.description.substring(0, 80)}...</p>
            <div class="product-price">${product.price} ريال</div>
            <button class="add-to-cart-btn" onclick="event.stopPropagation(); addToCart(${product.id})">
                <i class="fas fa-cart-plus"></i> إضافة للسلة
            </button>
        </div>
    `;

    return card;
}

// Show product details in modal
function showProductDetails(product) {
    if (!productModal) return;

    const modalBody = document.getElementById('modalBody');

    modalBody.innerHTML = `
        <div class="product-detail">
            <div class="product-detail-image">
                <i class="${product.image}"></i>
            </div>
            <div class="product-detail-info">
                <h2>${product.name}</h2>
                <div class="price">${product.price} ريال</div>
                <p>${product.description}</p>
                <div style="margin-bottom: 1rem;">
                    <strong>الفئة:</strong> ${product.category}
                </div>
                <button class="add-to-cart-btn" onclick="addToCart(${product.id}); closeModal();">
                    <i class="fas fa-cart-plus"></i> إضافة للسلة
                </button>
            </div>
        </div>
    `;

    productModal.style.display = 'block';
}

// Close product modal
function closeModal() {
    if (productModal) {
        productModal.style.display = 'none';
    }
}

// Add product to cart
function addToCart(productId) {
    console.log('Adding product to cart:', productId);
    const product = products.find(p => p.id === productId);
    if (!product) {
        console.error('Product not found:', productId);
        return;
    }

    const existingItem = cart.find(item => item.id === productId);

    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({
            ...product,
            quantity: 1
        });
    }

    updateCartUI();
    saveCart();
    showAddToCartAnimation();
    console.log('Product added to cart. Cart now has', cart.length, 'items');
}

// Remove item from cart
function removeFromCart(productId) {
    cart = cart.filter(item => item.id !== productId);
    updateCartUI();
    saveCart();
}

// Update item quantity
function updateQuantity(productId, change) {
    const item = cart.find(item => item.id === productId);
    if (item) {
        item.quantity += change;
        if (item.quantity <= 0) {
            removeFromCart(productId);
        } else {
            updateCartUI();
            saveCart();
        }
    }
}

// Update cart UI
function updateCartUI() {
    if (!cartCount || !cartItems || !cartTotal) return;

    // Update cart count
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    cartCount.textContent = totalItems;

    // Update cart items
    if (cart.length === 0) {
        cartItems.innerHTML = `
            <div class="empty-cart">
                <i class="fas fa-shopping-cart"></i>
                <p>السلة فارغة</p>
            </div>
        `;
    } else {
        cartItems.innerHTML = cart.map(item => `
            <div class="cart-item">
                <div class="cart-item-image">
                    <i class="${item.image}"></i>
                </div>
                <div class="cart-item-info">
                    <h4>${item.name}</h4>
                    <div>${item.price} ريال</div>
                </div>
                <div class="cart-item-controls">
                    <button class="quantity-btn" onclick="updateQuantity(${item.id}, -1)">-</button>
                    <span>${item.quantity}</span>
                    <button class="quantity-btn" onclick="updateQuantity(${item.id}, 1)">+</button>
                    <button class="remove-item" onclick="removeFromCart(${item.id})">حذف</button>
                </div>
            </div>
        `).join('');
    }

    // Update total
    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    cartTotal.textContent = total;

    const orderTotalElement = document.getElementById('orderTotal');
    if (orderTotalElement) {
        orderTotalElement.textContent = total;
    }
}

// Toggle cart sidebar
function toggleCart() {
    if (cartSidebar) {
        cartSidebar.classList.toggle('open');
    }
}

// Show checkout modal
function showCheckout() {
    if (cart.length === 0) {
        alert('السلة فارغة! يرجى إضافة منتجات أولاً.');
        return;
    }

    updateOrderSummary();
    if (checkoutModal) {
        checkoutModal.style.display = 'block';
    }
    toggleCart();
}

// Close checkout modal
function closeCheckoutModal() {
    if (checkoutModal) {
        checkoutModal.style.display = 'none';
    }
}

// Update order summary
function updateOrderSummary() {
    const orderSummary = document.getElementById('orderSummary');
    if (!orderSummary) return;

    orderSummary.innerHTML = cart.map(item => `
        <div class="summary-item">
            <span>${item.name} × ${item.quantity}</span>
            <span>${item.price * item.quantity} ريال</span>
        </div>
    `).join('');
}

// Submit order
function submitOrder(event) {
    event.preventDefault();

    const formData = new FormData(event.target);
    const orderData = {
        customer: {
            name: formData.get('name') || event.target.querySelector('input[type="text"]').value,
            phone: formData.get('phone') || event.target.querySelector('input[type="tel"]').value,
            address: formData.get('address') || event.target.querySelector('textarea').value,
            paymentMethod: formData.get('payment') || event.target.querySelector('select').value
        },
        items: cart,
        total: cart.reduce((sum, item) => sum + (item.price * item.quantity), 0),
        orderDate: new Date().toISOString()
    };

    // Simulate order processing
    const submitBtn = event.target.querySelector('.submit-order-btn');
    const originalText = submitBtn.innerHTML;
    submitBtn.innerHTML = '<span class="loading"></span> جاري المعالجة...';
    submitBtn.disabled = true;

    setTimeout(() => {
        // Clear cart
        cart = [];
        updateCartUI();
        saveCart();

        // Show success message
        closeCheckoutModal();
        showSuccessMessage('تم تأكيد طلبك بنجاح! سنتواصل معك قريباً.');

        // Reset form
        event.target.reset();
        submitBtn.innerHTML = originalText;
        submitBtn.disabled = false;
    }, 2000);
}

// Show success message
function showSuccessMessage(message) {
    const successDiv = document.createElement('div');
    successDiv.className = 'success-message fade-in';
    successDiv.innerHTML = `
        <i class="fas fa-check-circle"></i>
        <p>${message}</p>
    `;

    document.body.appendChild(successDiv);

    setTimeout(() => {
        successDiv.remove();
    }, 5000);
}

// Show add to cart animation
function showAddToCartAnimation() {
    const cartIcon = document.querySelector('.cart-icon');
    if (cartIcon) {
        cartIcon.style.transform = 'scale(1.2)';
        cartIcon.style.background = '#28a745';

        setTimeout(() => {
            cartIcon.style.transform = 'scale(1)';
            cartIcon.style.background = '#764ba2';
        }, 300);
    }
}

// Save cart to localStorage
function saveCart() {
    localStorage.setItem('perfumeCart', JSON.stringify(cart));
}

// Scroll to products section
function scrollToProducts() {
    const productsSection = document.getElementById('products');
    if (productsSection) {
        productsSection.scrollIntoView({
            behavior: 'smooth'
        });
    }
}

// Setup navigation
function setupNavigation() {
    const navLinks = document.querySelectorAll('.nav-link');

    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();

            // Remove active class from all links
            navLinks.forEach(l => l.classList.remove('active'));

            // Add active class to clicked link
            link.classList.add('active');

            // Scroll to section
            const targetId = link.getAttribute('href').substring(1);
            const targetSection = document.getElementById(targetId);

            if (targetSection) {
                targetSection.scrollIntoView({
                    behavior: 'smooth'
                });
            }
        });
    });

    // Update active nav on scroll
    window.addEventListener('scroll', () => {
        const sections = document.querySelectorAll('section[id]');
        const scrollPos = window.scrollY + 100;

        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            const sectionId = section.getAttribute('id');

            if (scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${sectionId}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    });
}

// Setup animations
function setupAnimations() {
    // Intersection Observer for scroll animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('slide-up');
            }
        });
    }, observerOptions);

    // Observe elements for animation
    document.querySelectorAll('.product-card, .about-content, .contact-content').forEach(el => {
        observer.observe(el);
    });
}

// Submit contact form
function submitContactForm(event) {
    event.preventDefault();

    const submitBtn = event.target.querySelector('button[type="submit"]');
    const originalText = submitBtn.innerHTML;

    submitBtn.innerHTML = '<span class="loading"></span> جاري الإرسال...';
    submitBtn.disabled = true;

    setTimeout(() => {
        showSuccessMessage('تم إرسال رسالتك بنجاح! سنرد عليك قريباً.');
        event.target.reset();
        submitBtn.innerHTML = originalText;
        submitBtn.disabled = false;
    }, 1500);
}

// Close modals when clicking outside
window.addEventListener('click', (event) => {
    if (event.target === productModal) {
        closeModal();
    }
    if (event.target === checkoutModal) {
        closeCheckoutModal();
    }
});

// Close cart when clicking outside
document.addEventListener('click', (event) => {
    if (cartSidebar && !cartSidebar.contains(event.target) && !event.target.closest('.cart-icon')) {
        cartSidebar.classList.remove('open');
    }
});

// Keyboard navigation
document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') {
        closeModal();
        closeCheckoutModal();
        if (cartSidebar) {
            cartSidebar.classList.remove('open');
        }
    }
});

// Search functionality (bonus feature)
function searchProducts(query) {
    const filteredProducts = products.filter(product =>
        product.name.toLowerCase().includes(query.toLowerCase()) ||
        product.description.toLowerCase().includes(query.toLowerCase()) ||
        product.category.toLowerCase().includes(query.toLowerCase())
    );

    if (!productsGrid) return;

    productsGrid.innerHTML = '';

    if (filteredProducts.length === 0) {
        productsGrid.innerHTML = `
            <div style="grid-column: 1 / -1; text-align: center; padding: 2rem;">
                <i class="fas fa-search" style="font-size: 3rem; color: #ccc; margin-bottom: 1rem;"></i>
                <p>لم يتم العثور على منتجات مطابقة للبحث</p>
            </div>
        `;
    } else {
        filteredProducts.forEach(product => {
            const productCard = createProductCard(product);
            productsGrid.appendChild(productCard);
        });
    }
}

// Initialize smooth scrolling for all anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth'
            });
        }
    });
});

// Add loading states and error handling
function handleError(error) {
    console.error('خطأ في التطبيق:', error);
    showSuccessMessage('حدث خطأ، يرجى المحاولة مرة أخرى.');
}

// Performance optimization - lazy loading for images
function lazyLoadImages() {
    const images = document.querySelectorAll('img[data-src]');
    const imageObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.classList.remove('lazy');
                imageObserver.unobserve(img);
            }
        });
    });

    images.forEach(img => imageObserver.observe(img));
}

// Force reload products if they don't load initially
setTimeout(() => {
    if (productsGrid && productsGrid.children.length === 0) {
        console.log('Products not loaded, forcing reload...');
        loadProducts();
    }
}, 1000);

// Export functions for testing (if needed)
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        addToCart,
        removeFromCart,
        updateQuantity,
        searchProducts,
        products,
        cart
    };
}