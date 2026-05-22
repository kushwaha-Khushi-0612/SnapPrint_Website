/**
 * SnapPrint Scroll Reveal Utility
 * Uses IntersectionObserver to trigger premium reveal animations on scroll.
 */

const ScrollReveal = {
    observer: null,

    /**
     * Initialize the Intersection Observer
     */
    init: function () {
        const options = {
            root: null,
            rootMargin: '0px 0px -100px 0px', // Trigger a bit before the element enters the viewport
            threshold: 0.1
        };

        this.observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    this.reveal(entry.target);
                    this.observer.unobserve(entry.target);
                }
            });
        }, options);

        // Initial scan
        this.refresh();

        console.log('✨ ScrollReveal Initialized');
    },

    /**
     * Reveal an element
     * @param {HTMLElement} element 
     */
    reveal: function (element) {
        element.classList.add('revealed');

        // If it's a grid, reveal its children (CSS will handle the staggered delays on the compositor thread!)
        if (element.classList.contains('product-grid') ||
            element.classList.contains('subcategory-grid') ||
            element.classList.contains('category-grid')) {
            const children = element.children;
            for (let i = 0; i < children.length; i++) {
                children[i].classList.add('revealed');
            }
        }
    },

    /**
     * Refresh the observer to find new elements
     */
    refresh: function () {
        // Find all revealable elements
        const elements = document.querySelectorAll('.reveal, .product-grid, .subcategory-grid, .category-grid, .section-header, .banner-section, .products-section');
        elements.forEach(el => {
            if (!el.classList.contains('revealed')) {
                this.observer.observe(el);
            }
        });
    },

    /**
     * Manually observe specific elements
     * @param {NodeList|HTMLElement} elements 
     */
    observe: function (elements) {
        if (!this.observer) this.init();

        if (elements instanceof HTMLElement) {
            this.observer.observe(elements);
        } else {
            elements.forEach(el => this.observer.observe(el));
        }
    }
};

// Auto-init on DOM content loaded
document.addEventListener('DOMContentLoaded', () => {
    ScrollReveal.init();
});

// Export to window
window.ScrollReveal = ScrollReveal;
