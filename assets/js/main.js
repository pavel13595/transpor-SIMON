/**
 * Main JavaScript functionality for SIMON STOCKAGE GLOBAL website
 */

// DOM elements
const header = document.getElementById('header');
const burger = document.getElementById('burger');
const nav = document.getElementById('nav');
const navLinks = document.querySelectorAll('.nav__link');

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    initializeHeader();
    initializeNavigation();
    initializeSmoothScrolling();
    initializeScrollAnimations();
    initializeParallax();
    initializeImageLoading();
    initializeKeyboardNavigation();
});

/**
 * Initialize keyboard navigation
 */
function initializeKeyboardNavigation() {
    // Close mobile menu on Escape key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && nav.classList.contains('active')) {
            closeMobileMenu();
        }
    });
    
    // Prevent tab navigation outside of open mobile menu
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Tab' && nav.classList.contains('active') && window.innerWidth <= 768) {
            const focusableElements = nav.querySelectorAll('a, button, [tabindex]:not([tabindex="-1"])');
            const firstElement = focusableElements[0];
            const lastElement = focusableElements[focusableElements.length - 1];
            
            if (e.shiftKey && document.activeElement === firstElement) {
                e.preventDefault();
                lastElement.focus();
            } else if (!e.shiftKey && document.activeElement === lastElement) {
                e.preventDefault();
                firstElement.focus();
            }
        }
    });
}

/**
 * Header functionality
 */
function initializeHeader() {
    let lastScrollY = window.scrollY;
    let ticking = false;

    function updateHeader() {
        const scrollY = window.scrollY;
        
        // Add scrolled class for styling
        if (scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }

        lastScrollY = scrollY;
        ticking = false;
    }

    function onScroll() {
        if (!ticking) {
            requestAnimationFrame(updateHeader);
            ticking = true;
        }
    }

    window.addEventListener('scroll', onScroll, { passive: true });
}

/**
 * Mobile navigation functionality
 */
function initializeNavigation() {
    // Burger menu toggle
    burger.addEventListener('click', function(e) {
        e.preventDefault();
        e.stopPropagation();
        toggleMobileMenu();
    });

    // Close mobile menu when clicking on nav links
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            if (window.innerWidth <= 768) {
                closeMobileMenu();
            }
        });
    });

    // Close mobile menu when clicking outside
    document.addEventListener('click', function(e) {
        if (window.innerWidth <= 768 && 
            !nav.contains(e.target) && 
            !burger.contains(e.target) && 
            nav.classList.contains('active')) {
            closeMobileMenu();
        }
    });

    // Close mobile menu on window resize
    window.addEventListener('resize', function() {
        if (window.innerWidth > 768) {
            closeMobileMenu();
        }
    });

    // Update active nav link based on scroll position
    updateActiveNavLink();
    window.addEventListener('scroll', debounce(updateActiveNavLink, 100), { passive: true });
}

/**
 * Toggle mobile menu
 */
function toggleMobileMenu() {
    const isActive = burger.classList.contains('active');
    
    if (isActive) {
        closeMobileMenu();
    } else {
        openMobileMenu();
    }
}

/**
 * Open mobile menu
 */
function openMobileMenu() {
    burger.classList.add('active');
    nav.classList.add('active');
    document.body.classList.add('nav-open');
    
    // Add aria attributes for accessibility
    burger.setAttribute('aria-expanded', 'true');
    nav.setAttribute('aria-hidden', 'false');
}

/**
 * Close mobile menu
 */
function closeMobileMenu() {
    burger.classList.remove('active');
    nav.classList.remove('active');
    document.body.classList.remove('nav-open');
    
    // Update aria attributes for accessibility
    burger.setAttribute('aria-expanded', 'false');
    nav.setAttribute('aria-hidden', 'true');
}

/**
 * Update active navigation link based on current section
 */
function updateActiveNavLink() {
    const sections = document.querySelectorAll('section[id]');
    const scrollPos = window.scrollY + 100;

    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.offsetHeight;
        const sectionId = section.getAttribute('id');
        const navLink = document.querySelector(`.nav__link[href="#${sectionId}"]`);

        if (navLink && scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
            navLinks.forEach(link => link.classList.remove('active'));
            navLink.classList.add('active');
        }
    });
}

/**
 * Smooth scrolling for anchor links
 */
function initializeSmoothScrolling() {
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                const offsetTop = targetSection.offsetTop - 80; // Account for fixed header
                
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    });

    // Smooth scroll for CTA button
    const ctaButton = document.querySelector('.hero__cta');
    if (ctaButton) {
        ctaButton.addEventListener('click', function(e) {
            e.preventDefault();
            const contactSection = document.getElementById('contact');
            if (contactSection) {
                const offsetTop = contactSection.offsetTop - 80;
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    }
}

/**
 * Scroll animations for elements
 */
function initializeScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
                
                // Add staggered animation for grid items
                const gridItems = entry.target.querySelectorAll('.service, .advantage, .stat');
                gridItems.forEach((item, index) => {
                    setTimeout(() => {
                        item.classList.add('animate-in');
                    }, index * 100);
                });
            }
        });
    }, observerOptions);

    // Observe sections for animation
    const animatedSections = document.querySelectorAll('.about, .services, .advantages, .contact');
    animatedSections.forEach(section => {
        observer.observe(section);
    });

    // Observe individual elements
    const animatedElements = document.querySelectorAll('.service, .advantage, .stat, .contact__item');
    animatedElements.forEach(element => {
        observer.observe(element);
    });
}

/**
 * Parallax effect for hero section
 */
function initializeParallax() {
    const hero = document.querySelector('.hero');
    const heroBackground = document.querySelector('.hero__background');
    
    if (!hero || !heroBackground) return;

    let ticking = false;

    function updateParallax() {
        const scrolled = window.scrollY;
        const rate = scrolled * -0.5;
        
        heroBackground.style.transform = `translateY(${rate}px)`;
        ticking = false;
    }

    function onScroll() {
        if (!ticking) {
            requestAnimationFrame(updateParallax);
            ticking = true;
        }
    }

    window.addEventListener('scroll', onScroll, { passive: true });
}

/**
 * Statistics counter animation
 */
function animateCounters() {
    const counters = document.querySelectorAll('.stat__number');
    
    counters.forEach(counter => {
        // Не анимировать, если значение не только число (например, 24/7)
        const original = counter.textContent.trim();
        if (/^\d+[K+]*$/.test(original)) {
            const target = parseInt(original.replace(/[^\d]/g, ''));
            const suffix = original.replace(/[\d]/g, '');
            let current = 0;
            const increment = target / 100;
            const timer = setInterval(() => {
                current += increment;
                if (current >= target) {
                    current = target;
                    clearInterval(timer);
                }
                counter.textContent = Math.floor(current) + suffix;
            }, 20);
        } else {
            counter.textContent = original;
        }
    });
}

// Initialize counter animation when stats section comes into view
const statsObserver = new IntersectionObserver(function(entries) {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            animateCounters();
            statsObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.5 });

const statsSection = document.querySelector('.about__stats');
if (statsSection) {
    statsObserver.observe(statsSection);
}

/**
 * Utility functions
 */

// Debounce function to limit function calls
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Throttle function for scroll events
function throttle(func, limit) {
    let inThrottle;
    return function() {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
            func.apply(context, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

/**
 * Initialize smooth image loading
 */
function initializeImageLoading() {
    const images = document.querySelectorAll('img');
    
    images.forEach(img => {
        if (img.complete) {
            img.classList.add('loaded');
        } else {
            img.addEventListener('load', function() {
                this.classList.add('loaded');
            });
            
            img.addEventListener('error', function() {
                // Fallback for broken images
                this.style.display = 'none';
                console.warn('Failed to load image:', this.src);
            });
        }
    });
}

// Add loading class removal when page is fully loaded
window.addEventListener('load', function() {
    document.body.classList.add('loaded');
    
    // Trigger any lazy-loaded images
    const lazyImages = document.querySelectorAll('img[loading="lazy"]');
    lazyImages.forEach(img => {
        if (img.complete) {
            img.classList.add('loaded');
        }
    });
});

// Add CSS classes for animations
const style = document.createElement('style');
style.textContent = `
    .animate-in {
        animation: fadeInUp 0.8s ease-out forwards;
    }
    
    .service, .advantage, .stat, .contact__item {
        opacity: 0;
        transform: translateY(30px);
        transition: all 0.8s ease-out;
    }
    
    .service.animate-in, .advantage.animate-in, .stat.animate-in, .contact__item.animate-in {
        opacity: 1;
        transform: translateY(0);
    }
    
    body:not(.loaded) {
        overflow: hidden;
    }
    
    body.nav-open {
        overflow: hidden;
    }
    
    /* Mobile navigation styles */
    @media (max-width: 768px) {
        .header__burger {
            display: flex !important;
        }
        
        .header__nav {
            position: fixed !important;
            top: 100% !important;
            left: 0 !important;
            width: 100% !important;
            background-color: var(--background-white) !important;
            border-top: 1px solid var(--border-color) !important;
            box-shadow: var(--shadow-lg) !important;
            transition: all var(--transition-base) !important;
            z-index: 999 !important;
            transform: translateY(0) !important;
            opacity: 0 !important;
            visibility: hidden !important;
        }
        
        .header__nav.active {
            opacity: 1 !important;
            visibility: visible !important;
        }
        
        .nav__list {
            flex-direction: column !important;
            padding: 2rem 1rem !important;
            gap: 0 !important;
        }
        
        .nav__link {
            display: block !important;
            padding: 1rem !important;
            text-align: center !important;
            border-bottom: 1px solid var(--border-color) !important;
            width: 100% !important;
        }
        
        .nav__link:last-child {
            border-bottom: none !important;
        }
    }
`;

document.head.appendChild(style);
