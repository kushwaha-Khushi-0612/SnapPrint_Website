/**
 * SnapPrint SEO & Structured Data Service
 * Dynamically injects Meta Tags, OpenGraph, and JSON-LD Rich Snippets for products and categories.
 */

const seoService = {
    // Default site-wide data
    defaults: {
        title: "SnapPrint | Custom T-Shirts & Personalized Gifts in Kanpur",
        description: "SnapPrint offers premium custom t-shirts, personalized mugs, photo frames, canvases, and unique gifts in Kanpur. Order online for high-quality custom printing.",
        keywords: "Kanpur Tshirt customisation, Tshirt customisation, custom tshirts kanpur, personalized gifts, custom printing, SnapPrint",
        image: "https://snapprint.in/assets/images/og-image.jpg",
        url: "https://snapprint.in",
        siteName: "SnapPrint"
    },

    init: function () {
        this.injectLocalBusinessSchema();
    },

    /**
     * Updates common HTML meta tags (Title, Description, OpenGraph)
     */
    updateMetaTags: function (title, description, image, url) {
        document.title = title || this.defaults.title;
        
        const setMeta = (name, content, isProperty = false) => {
            if (!content) return;
            const attr = isProperty ? 'property' : 'name';
            let tag = document.querySelector(`meta[${attr}="${name}"]`);
            if (!tag) {
                tag = document.createElement('meta');
                tag.setAttribute(attr, name);
                document.head.appendChild(tag);
            }
            tag.setAttribute('content', content);
        };

        // Standard
        setMeta('description', description || this.defaults.description);
        setMeta('keywords', this.defaults.keywords);

        // OpenGraph (Facebook/LinkedIn)
        setMeta('og:title', title || this.defaults.title, true);
        setMeta('og:description', description || this.defaults.description, true);
        setMeta('og:image', image || this.defaults.image, true);
        setMeta('og:url', url || this.defaults.url, true);
        setMeta('og:site_name', this.defaults.siteName, true);
        setMeta('og:type', 'website', true);

        // Twitter
        setMeta('twitter:card', 'summary_large_image');
        setMeta('twitter:title', title || this.defaults.title);
        setMeta('twitter:description', description || this.defaults.description);
        setMeta('twitter:image', image || this.defaults.image);
    },

    /**
     * Injects a JSON-LD script block into the head
     */
    injectJSONLD: function (schemaObject, id) {
        let script = document.getElementById(id);
        if (script) {
            script.remove();
        }
        script = document.createElement('script');
        script.type = 'application/ld+json';
        script.id = id;
        script.text = JSON.stringify(schemaObject);
        document.head.appendChild(script);
    },

    /**
     * Sets Local Business Schema targeting Kanpur
     */
    injectLocalBusinessSchema: function () {
        const schema = {
            "@context": "https://schema.org",
            "@type": "LocalBusiness",
            "name": "SnapPrint",
            "image": this.defaults.image,
            "url": this.defaults.url,
            "telephone": "+91-9999999999", // Placeholder
            "email": "contact@snapprint.in",
            "address": {
                "@type": "PostalAddress",
                "streetAddress": "Civil Lines",
                "addressLocality": "Kanpur",
                "addressRegion": "UP",
                "postalCode": "208001",
                "addressCountry": "IN"
            },
            "description": this.defaults.description,
            "priceRange": "₹₹",
            "areaServed": "Kanpur, India"
        };
        this.injectJSONLD(schema, 'schema-localbusiness');
    },

    /**
     * Call this when navigating to a product details page
     */
    updateProduct: function (product) {
        if (!product) return;

        const url = `${this.defaults.url}/productDetails.html?id=${product.id}`;
        const title = `${product.name} | SnapPrint Customisation Kanpur`;
        const description = `Customize the ${product.name} at SnapPrint. Perfect customized gift available in Kanpur. Price: ₹${product.price}.`;
        const image = product.image.startsWith('http') ? product.image : `${this.defaults.url}/${product.image}`;

        this.updateMetaTags(title, description, image, url);

        // Product Schema
        const schema = {
            "@context": "https://schema.org/",
            "@type": "Product",
            "name": product.name,
            "image": image,
            "description": description,
            "sku": product.id,
            "brand": {
                "@type": "Brand",
                "name": "SnapPrint"
            },
            "offers": {
                "@type": "Offer",
                "url": url,
                "priceCurrency": "INR",
                "price": product.price,
                "availability": "https://schema.org/InStock",
                "itemCondition": "https://schema.org/NewCondition"
            }
        };

        if (product.rating) {
            schema.aggregateRating = {
                "@type": "AggregateRating",
                "ratingValue": product.rating.toString(),
                "reviewCount": product.reviews ? product.reviews.length.toString() : "50"
            };
        }

        this.injectJSONLD(schema, 'schema-product');
    },

    /**
     * Call this when navigating to a category page
     */
    updateCategory: function (categoryName, productCount) {
        if (!categoryName) return;

        const url = `${this.defaults.url}/productCategory.html?category=${encodeURIComponent(categoryName)}`;
        const title = `Custom ${categoryName} in Kanpur | SnapPrint`;
        const description = `Shop from over ${productCount || 100} customized ${categoryName} in Kanpur at SnapPrint. High quality custom printing online.`;

        this.updateMetaTags(title, description, this.defaults.image, url);

        // Breadcrumb Schema
        const schema = {
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            "itemListElement": [{
                "@type": "ListItem",
                "position": 1,
                "name": "Home",
                "item": this.defaults.url
            },{
                "@type": "ListItem",
                "position": 2,
                "name": categoryName,
                "item": url
            }]
        };

        this.injectJSONLD(schema, 'schema-breadcrumb');
    }
};

window.seoService = seoService;
