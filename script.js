// متغيرات عامة
let cart = [];
let cartCount = 0;

// تهيئة المنتجات
const products = {
    'all': document.querySelectorAll('.product-card'),
    'كاميرات-خارجية': document.querySelectorAll('.product-card[data-category="outdoor"]'),
    'كاميرات-داخلية': document.querySelectorAll('.product-card[data-category="indoor"]'),
    'أنظمة-التسجيل': document.querySelectorAll('.product-card[data-category="nvr"]')
};

document.addEventListener('DOMContentLoaded', () => {
    // تفعيل تصفية المنتجات
    const categoryButtons = document.querySelectorAll('.category-btn');
    categoryButtons.forEach(button => {
        button.addEventListener('click', () => {
            // إزالة الكلاس النشط من جميع الأزرار
            categoryButtons.forEach(btn => btn.classList.remove('active'));
            // إضافة الكلاس النشط للزر المحدد
            button.classList.add('active');
            
            // تصفية المنتجات
            const category = button.textContent.trim().replace(' ', '-');
            filterProducts(category);
        });
    });

    // تأثيرات التمرير
    window.addEventListener('scroll', () => {
        // إظهار العناصر عند التمرير
        const elements = document.querySelectorAll('.solution-card, .product-card, .service-card');
        elements.forEach(element => {
            if (isElementInViewport(element)) {
                element.classList.add('fade-in');
            }
        });

        // تغيير شريط التنقل
        const navbar = document.querySelector('.main-nav');
        if (window.scrollY > 100) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    // تنعيم التمرير للروابط
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

    // تفعيل سلة التسوق
    initializeCart();

    // إضافة وظيفة القائمة المتنقلة
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const navLinks = document.querySelector('.nav-links');
    
    if (mobileMenuBtn) {
        mobileMenuBtn.addEventListener('click', () => {
            navLinks.classList.toggle('active');
            mobileMenuBtn.querySelector('i').classList.toggle('fa-bars');
            mobileMenuBtn.querySelector('i').classList.toggle('fa-times');
        });
    }

    // إغلاق القائمة عند النقر على أي رابط
    document.querySelectorAll('.nav-links a').forEach(link => {
        link.addEventListener('click', () => {
            if (window.innerWidth <= 991) {
                navLinks.classList.remove('active');
                mobileMenuBtn.querySelector('i').classList.add('fa-bars');
                mobileMenuBtn.querySelector('i').classList.remove('fa-times');
            }
        });
    });

    // تحسين أداء التمرير على الموبايل
    let lastScrollTop = 0;
    window.addEventListener('scroll', () => {
        const currentScroll = window.pageYOffset || document.documentElement.scrollTop;
        const navbar = document.querySelector('.navbar');
        
        if (currentScroll > lastScrollTop && currentScroll > 100) {
            // التمرير للأسفل - إخفاء القائمة
            navbar.style.top = '-100px';
        } else {
            // التمرير للأعلى - إظهار القائمة
            navbar.style.top = '0';
        }
        lastScrollTop = currentScroll;
    }, { passive: true });

    // معالجة تغيير حجم النافذة
    window.addEventListener('resize', () => {
        if (window.innerWidth > 991) {
            navLinks.classList.remove('active');
            if (mobileMenuBtn) {
                mobileMenuBtn.querySelector('i').classList.add('fa-bars');
                mobileMenuBtn.querySelector('i').classList.remove('fa-times');
            }
        }
    });

    // تحسين تحميل الصور
    const images = document.querySelectorAll('img');
    images.forEach(img => {
        img.loading = 'lazy';
        
        // إضافة تأثير ظهور تدريجي عند اكتمال تحميل الصورة
        if (img.complete) {
            img.classList.add('loaded');
        } else {
            img.addEventListener('load', () => {
                img.classList.add('loaded');
            });
        }
        
        // معالجة الأخطاء في تحميل الصور
        img.addEventListener('error', () => {
            img.src = 'fallback-image.jpg'; // صورة بديلة في حالة الخطأ
            img.classList.add('loaded');
        });
    });
});

// تصفية المنتجات حسب الفئة
function filterProducts(category) {
    const allProducts = document.querySelectorAll('.product-card');
    allProducts.forEach(product => {
        if (category === 'الكل' || product.dataset.category === category) {
            product.style.display = 'block';
            setTimeout(() => product.classList.add('fade-in'), 100);
        } else {
            product.style.display = 'none';
            product.classList.remove('fade-in');
        }
    });
}

// التحقق من ظهور العنصر في نطاق الرؤية
function isElementInViewport(el) {
    const rect = el.getBoundingClientRect();
    return (
        rect.top >= 0 &&
        rect.left >= 0 &&
        rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
        rect.right <= (window.innerWidth || document.documentElement.clientWidth)
    );
}

// تهيئة سلة التسوق
function initializeCart() {
    const cartIcon = document.querySelector('.cart-icon');
    updateCartCount();

    // إضافة منتج للسلة
    document.querySelectorAll('.add-to-cart').forEach(button => {
        button.addEventListener('click', (e) => {
            const card = e.target.closest('.product-card');
            const name = card.querySelector('h3').textContent;
            const price = card.querySelector('.price').textContent;
            addToCart(name, price);
            
            // تأثير الإضافة للسلة
            button.classList.add('added');
            setTimeout(() => button.classList.remove('added'), 1000);
        });
    });

    // عرض محتوى السلة
    cartIcon.addEventListener('click', showCart);
}

// إضافة منتج للسلة
function addToCart(name, price) {
    cart.push({ name, price });
    cartCount++;
    updateCartCount();
    showNotification(`تم إضافة ${name} إلى السلة`);
}

// تحديث عدد العناصر في السلة
function updateCartCount() {
    const cartCountElement = document.querySelector('.cart-count');
    if (cartCountElement) {
        cartCountElement.textContent = cartCount;
        cartCountElement.classList.add('pulse');
        setTimeout(() => cartCountElement.classList.remove('pulse'), 300);
    }
}

// عرض إشعار
function showNotification(message) {
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.textContent = message;
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.classList.add('show');
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => notification.remove(), 300);
        }, 2000);
    }, 100);
}

// عرض السلة
function showCart() {
    if (cart.length === 0) {
        showNotification('السلة فارغة');
        return;
    }
    
    let total = 0;
    let message = 'محتويات السلة:\n\n';
    
    cart.forEach(item => {
        message += `${item.name} - ${item.price}\n`;
        total += parseInt(item.price);
    });
    
    message += `\nالمجموع: ${total} ريال`;
    alert(message);
}