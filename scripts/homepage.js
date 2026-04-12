/**
 * SnapPrint Homepage Script
 * Main initialization and data management
 */

// Sample data for demonstration
const heroSlides = [
    {
        image: 'https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=1400&h=450&fit=crop',
        alt: 'Custom T-Shirt Printing',
        title: 'Custom T-Shirt Printing',
        description: 'Design your own unique t-shirts with premium quality prints',
        buttonText: 'Explore Now',
        link: '#tshirts',
        aspectRatio: '16/5'
    },
    {
        image: 'https://images.unsplash.com/photo-1556306535-0f09a537f0a3?w=1800&h=500&fit=crop',
        alt: 'Personalized Mugs',
        title: 'Personalized Mugs & Cups',
        description: 'Start your day with a custom-printed mug',
        buttonText: 'Shop Mugs',
        link: '#mugs',
        aspectRatio: '18/5'
    },
    {
        image: 'https://images.unsplash.com/photo-1512499617640-c74ae3a79d37?w=1200&h=400&fit=crop',
        alt: 'Phone Cases',
        title: 'Designer Phone Cases',
        description: 'Protect your phone with style - custom printed cases',
        buttonText: 'Browse Cases',
        link: '#cases',
        aspectRatio: '3/1'
    },
    {
        image: 'https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?w=1600&h=450&fit=crop',
        alt: 'Custom Hoodies',
        title: 'Premium Custom Hoodies',
        description: 'Stay warm with personalized hoodies',
        buttonText: 'Shop Now',
        link: '#hoodies',
        aspectRatio: '16/5'
    },
    {
        image: 'https://images.unsplash.com/photo-1590874103328-eac38a683ce7?w=2000&h=500&fit=crop',
        alt: 'Eco Bags',
        title: 'Eco-Friendly Tote Bags',
        description: 'Sustainable bags with your custom design',
        buttonText: 'Explore',
        link: '#bags',
        aspectRatio: '4/1'
    }
];

const categories = [
    { name: 'T-Shirts', icon: 'constants/icons/tshirt.svg', count: 150, link: 'productCategory.html?category=tshirts' },
    { name: 'Hoodies', icon: 'constants/icons/hoodie.svg', count: 80, link: 'productCategory.html?category=hoodies' },
    { name: 'Mugs & Cups', icon: 'constants/icons/mug.svg', count: 120, link: 'productCategory.html?category=cups' },
    { name: 'Phone Cases', icon: 'constants/icons/phone-case.svg', count: 200, link: 'productCategory.html?category=2DMobileCover' },
    { name: 'Photo Frames', icon: 'constants/icons/frame.svg', count: 90, link: 'productCategory.html?category=woodenFrame' },
    { name: 'Key Chains', icon: 'constants/icons/keychain.svg', count: 65, link: 'productCategory.html?category=keyChain' },
    { name: 'Face Masks', icon: 'constants/icons/facemask.svg', count: 45, link: 'productCategory.html?category=facemask' },
    { name: 'Tote Bags', icon: 'constants/icons/tote-bag.svg', count: 75, link: 'productCategory.html?category=toteBags' },
    { name: 'Pendants', icon: 'constants/icons/pendant.svg', count: 55, link: 'productCategory.html?category=pendant' },
    { name: 'Slippers', icon: 'constants/icons/slipper.svg', count: 40, link: 'productCategory.html?category=slipperPrint' }
];

const featuredProducts = [
    {
        title: 'Custom Photo T-Shirt',
        description: 'Premium cotton with high-quality photo print',
        image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&h=400&fit=crop',
        price: 499,
        originalPrice: 999,
        rating: 4.5,
        reviewCount: 234,
        badge: 'BESTSELLER',
        link: '#product-1',
        productId: 'prod-001'
    },
    {
        title: 'Personalized Coffee Mug',
        description: 'Ceramic mug with your favorite photo',
        image: 'https://images.unsplash.com/photo-1514228742587-6b1558fcca3d?w=400&h=400&fit=crop',
        price: 299,
        originalPrice: 499,
        rating: 4.8,
        reviewCount: 456,
        badge: 'POPULAR',
        link: '#product-2',
        productId: 'prod-002'
    },
    {
        title: 'Designer Phone Case',
        description: 'Durable case with custom artwork',
        image: 'https://images.unsplash.com/photo-1601784551446-20c9e07cdbdb?w=400&h=400&fit=crop',
        price: 349,
        originalPrice: 699,
        rating: 4.6,
        reviewCount: 189,
        link: '#product-3',
        productId: 'prod-003'
    },
    {
        title: 'Photo Frame - Wooden',
        description: 'Elegant wooden frame with custom print',
        image: 'https://images.unsplash.com/photo-1513519245088-0e12902e35ca?w=400&h=400&fit=crop',
        price: 599,
        originalPrice: 1199,
        rating: 4.7,
        reviewCount: 145,
        badge: 'NEW',
        link: '#product-4',
        productId: 'prod-004'
    },
    {
        title: 'Custom Hoodie',
        description: 'Warm and cozy with your design',
        image: 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=400&h=400&fit=crop',
        price: 899,
        originalPrice: 1599,
        rating: 4.9,
        reviewCount: 312,
        badge: 'SALE',
        link: '#product-5',
        productId: 'prod-005'
    },
    {
        title: 'Personalized Keychain',
        description: 'Metal keychain with photo engraving',
        image: 'https://images.unsplash.com/photo-1582639590011-f5a8416d1101?w=400&h=400&fit=crop',
        price: 199,
        originalPrice: 399,
        rating: 4.4,
        reviewCount: 98,
        link: '#product-6',
        productId: 'prod-006'
    }
];

const specialOffers = [
    {
        title: 'T-Shirt Combo',
        subtitle: 'LIMITED OFFER',
        image: 'https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?w=400&h=300&fit=crop',
        link: '#combo-1',
        ctaText: 'Buy Now',
        bgColor: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
    },
    {
        title: 'Mug Collection',
        subtitle: 'SPECIAL DEAL',
        image: 'https://images.unsplash.com/photo-1517256673644-36ad11246d21?w=400&h=300&fit=crop',
        link: '#combo-2',
        ctaText: 'Shop Now',
        bgColor: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)'
    },
    {
        title: 'Phone Cases',
        subtitle: 'BUY 2 GET 1',
        image: 'https://images.unsplash.com/photo-1556656793-08538906a9f8?w=400&h=300&fit=crop',
        link: '#combo-3',
        ctaText: 'Grab Deal',
        bgColor: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)'
    }
];

const trendingProducts = [
    {
        title: 'Vintage Logo T-Shirt',
        description: 'Retro style custom logo print',
        image: 'https://images.unsplash.com/photo-1562157873-818bc0726f68?w=400&h=400&fit=crop',
        price: 549,
        originalPrice: 999,
        rating: 4.6,
        reviewCount: 178,
        link: '#trending-1',
        productId: 'prod-007'
    },
    {
        title: 'Gradient Face Mask',
        description: 'Stylish and comfortable fabric mask',
        image: 'https://images.unsplash.com/photo-1584036561566-baf8f5f1b144?w=400&h=400&fit=crop',
        price: 149,
        originalPrice: 299,
        rating: 4.3,
        reviewCount: 89,
        link: '#trending-2',
        productId: 'prod-008'
    },
    {
        title: 'Tote Bag - Canvas',
        description: 'Eco-friendly bag with custom print',
        image: 'https://images.unsplash.com/photo-1590874103328-eac38a683ce7?w=400&h=400&fit=crop',
        price: 399,
        originalPrice: 699,
        rating: 4.7,
        reviewCount: 267,
        badge: 'ECO',
        link: '#trending-3',
        productId: 'prod-009'
    },
    {
        title: 'Stone Pendant',
        description: 'Beautiful pendant with photo inlay',
        image: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=400&h=400&fit=crop',
        price: 799,
        originalPrice: 1499,
        rating: 4.8,
        reviewCount: 134,
        link: '#trending-4',
        productId: 'prod-010'
    },
    {
        title: 'Custom Slippers',
        description: 'Comfortable slippers with your design',
        image: 'https://images.unsplash.com/photo-1603487742131-4160ec999306?w=400&h=400&fit=crop',
        price: 449,
        originalPrice: 799,
        rating: 4.5,
        reviewCount: 92,
        link: '#trending-5',
        productId: 'prod-011'
    },
    {
        title: 'Child Costume',
        description: 'Fun costume with custom character print',
        image: 'https://images.unsplash.com/photo-1596464716127-f2a82984de30?w=400&h=400&fit=crop',
        price: 699,
        originalPrice: 1299,
        rating: 4.9,
        reviewCount: 201,
        badge: 'HOT',
        link: '#trending-6',
        productId: 'prod-012'
    }
];

const mostLovedProducts = [
    {
        title: 'Classic White T-Shirt',
        description: 'Best selling plain tee for custom prints',
        image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&h=400&fit=crop',
        price: 399,
        originalPrice: 699,
        rating: 4.9,
        reviewCount: 567,
        badge: 'LOVED',
        link: '#loved-1',
        productId: 'prod-013'
    },
    {
        title: 'Premium Ceramic Mug',
        description: 'Most ordered mug design',
        image: 'https://images.unsplash.com/photo-1608667508764-33cf0726b13a?w=400&h=400&fit=crop',
        price: 349,
        originalPrice: 599,
        rating: 4.8,
        reviewCount: 892,
        link: '#loved-2',
        productId: 'prod-014'
    },
    {
        title: 'Leather Keychain',
        description: 'Premium leather with engraving',
        image: 'https://images.unsplash.com/photo-1556306535-38febf6782e7?w=400&h=400&fit=crop',
        price: 249,
        originalPrice: 499,
        rating: 4.7,
        reviewCount: 423,
        link: '#loved-3',
        productId: 'prod-015'
    },
    {
        title: 'Glass Photo Frame',
        description: 'Elegant glass frame - customer favorite',
        image: 'https://images.unsplash.com/photo-1582139329536-e7284fece509?w=400&h=400&fit=crop',
        price: 699,
        originalPrice: 1299,
        rating: 4.9,
        reviewCount: 678,
        badge: 'PREMIUM',
        link: '#loved-4',
        productId: 'prod-016'
    },
    {
        title: 'Black Hoodie',
        description: 'Most popular hoodie choice',
        image: 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=400&h=400&fit=crop',
        price: 999,
        originalPrice: 1799,
        rating: 5.0,
        reviewCount: 1234,
        link: '#loved-5',
        productId: 'prod-017'
    },
    {
        title: 'Canvas Tote',
        description: 'Eco-friendly and stylish',
        image: 'https://images.unsplash.com/photo-1591561954555-607968d502c0?w=400&h=400&fit=crop',
        price: 449,
        originalPrice: 799,
        rating: 4.8,
        reviewCount: 534,
        link: '#loved-6',
        productId: 'prod-018'
    }
];

const newArrivals = [
    {
        title: 'Neon Print T-Shirt',
        description: 'Vibrant neon designs',
        image: 'https://images.unsplash.com/photo-1562157873-818bc0726f68?w=400&h=400&fit=crop',
        price: 599,
        originalPrice: 999,
        rating: 4.6,
        reviewCount: 89,
        badge: 'NEW',
        link: '#new-1',
        productId: 'prod-019'
    },
    {
        title: 'Designer Cushion Cover',
        description: 'Premium fabric with custom print',
        image: 'https://images.unsplash.com/photo-1584100936595-c0654b55a2e2?w=400&h=400&fit=crop',
        price: 299,
        originalPrice: 599,
        rating: 4.5,
        reviewCount: 67,
        badge: 'NEW',
        link: '#new-2',
        productId: 'prod-020'
    },
    {
        title: 'Metal Water Bottle',
        description: 'Insulated with custom engraving',
        image: 'https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=400&h=400&fit=crop',
        price: 799,
        originalPrice: 1299,
        rating: 4.7,
        reviewCount: 156,
        link: '#new-3',
        productId: 'prod-021'
    },
    {
        title: 'Laptop Sleeve',
        description: 'Padded protection with custom design',
        image: 'https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=400&h=400&fit=crop',
        price: 549,
        originalPrice: 999,
        rating: 4.8,
        reviewCount: 234,
        badge: 'HOT',
        link: '#new-4',
        productId: 'prod-022'
    },
    {
        title: 'Yoga Mat Custom',
        description: 'Non-slip with motivational prints',
        image: 'https://images.unsplash.com/photo-1601925260368-ae2f83cf8b7f?w=400&h=400&fit=crop',
        price: 899,
        originalPrice: 1599,
        rating: 4.9,
        reviewCount: 178,
        link: '#new-5',
        productId: 'prod-023'
    },
    {
        title: 'Calendar 2026',
        description: 'Personalized wall calendar',
        image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=400&fit=crop',
        price: 249,
        originalPrice: 499,
        rating: 4.6,
        reviewCount: 92,
        link: '#new-6',
        productId: 'prod-024'
    }
];

const bestSellers = [
    {
        title: 'Photo Collage Frame',
        description: 'Multiple photos in one frame',
        image: 'https://images.unsplash.com/photo-1513519245088-0e12902e35ca?w=400&h=400&fit=crop',
        price: 899,
        originalPrice: 1599,
        rating: 5.0,
        reviewCount: 892,
        badge: 'BESTSELLER',
        link: '#best-1',
        productId: 'prod-025'
    },
    {
        title: 'Custom Apron',
        description: 'Kitchen apron with funny quotes',
        image: 'https://images.unsplash.com/photo-1556909212-d5b604d0c90d?w=400&h=400&fit=crop',
        price: 399,
        originalPrice: 799,
        rating: 4.7,
        reviewCount: 567,
        link: '#best-2',
        productId: 'prod-026'
    },
    {
        title: 'Pop Socket Grip',
        description: 'Phone grip with custom photo',
        image: 'https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=400&h=400&fit=crop',
        price: 149,
        originalPrice: 299,
        rating: 4.8,
        reviewCount: 1234,
        link: '#best-3',
        productId: 'prod-027'
    },
    {
        title: 'Notebook Custom',
        description: 'Personalized journal/diary',
        image: 'https://images.unsplash.com/photo-1517842264405-16ad5f7a5940?w=400&h=400&fit=crop',
        price: 299,
        originalPrice: 599,
        rating: 4.9,
        reviewCount: 678,
        badge: 'POPULAR',
        link: '#best-4',
        productId: 'prod-028'
    },
    {
        title: 'Mouse Pad XL',
        description: 'Large gaming mousepad with art',
        image: 'https://images.unsplash.com/photo-1527814050087-3793815479db?w=400&h=400&fit=crop',
        price: 399,
        originalPrice: 799,
        rating: 4.6,
        reviewCount: 445,
        link: '#best-5',
        productId: 'prod-029'
    },
    {
        title: 'Wall Clock',
        description: 'Custom photo wall clock',
        image: 'https://images.unsplash.com/photo-1563861826100-9cb868fdbe1c?w=400&h=400&fit=crop',
        price: 699,
        originalPrice: 1299,
        rating: 4.8,
        reviewCount: 334,
        link: '#best-6',
        productId: 'prod-030'
    }
];

const specialOccasions = [
    {
        title: 'Birthday Bundle',
        description: 'Perfect birthday gift set with custom prints',
        image: 'https://images.unsplash.com/photo-1558636508-e0db3814bd1d?w=400&h=400&fit=crop',
        price: 1499,
        originalPrice: 2999,
        rating: 4.9,
        reviewCount: 445,
        badge: '🎂 BIRTHDAY',
        link: '#occasion-1',
        productId: 'occ-001',
        cardColor: '#FFE5E5'
    },
    {
        title: 'Anniversary Couple Set',
        description: 'Matching couple items with photo prints',
        image: 'https://images.unsplash.com/photo-1518199266791-5375a83190b7?w=400&h=400&fit=crop',
        price: 1799,
        originalPrice: 3499,
        rating: 5.0,
        reviewCount: 678,
        badge: '💑 ANNIVERSARY',
        link: '#occasion-2',
        productId: 'occ-002',
        cardColor: '#FFE5F0'
    },
    {
        title: 'Wedding Collection',
        description: 'Custom wedding favors and gifts',
        image: 'https://images.unsplash.com/photo-1519741497674-611481863552?w=400&h=400&fit=crop',
        price: 2499,
        originalPrice: 4999,
        rating: 4.8,
        reviewCount: 892,
        badge: '💍 WEDDING',
        link: '#occasion-3',
        productId: 'occ-003',
        cardColor: '#FFF5E5'
    },
    {
        title: 'Baby Shower Kit',
        description: 'Adorable baby-themed custom prints',
        image: 'https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?w=400&h=400&fit=crop',
        price: 1299,
        originalPrice: 2499,
        rating: 4.7,
        reviewCount: 334,
        badge: '👶 BABY',
        link: '#occasion-4',
        productId: 'occ-004',
        cardColor: '#E5F5FF'
    },
    {
        title: 'Graduation Special',
        description: 'Celebrate achievements with custom gifts',
        image: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=400&h=400&fit=crop',
        price: 999,
        originalPrice: 1999,
        rating: 4.6,
        reviewCount: 267,
        badge: '🎓 GRADUATION',
        link: '#occasion-5',
        productId: 'occ-005',
        cardColor: '#E5FFE5'
    },
    {
        title: 'Valentine\'s Day',
        description: 'Romantic gifts for your loved one',
        image: 'https://images.unsplash.com/photo-1518199266791-5375a83190b7?w=400&h=400&fit=crop',
        price: 899,
        originalPrice: 1799,
        rating: 4.9,
        reviewCount: 1023,
        badge: '❤️ VALENTINE',
        link: '#occasion-6',
        productId: 'occ-006',
        cardColor: '#FFE5F5'
    }
];

const recentlyViewed = [
    {
        title: 'Black Hoodie Premium',
        description: 'Last viewed 2 hours ago',
        image: 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=400&h=400&fit=crop',
        price: 999,
        originalPrice: 1799,
        rating: 4.8,
        reviewCount: 456,
        link: '#recent-1',
        productId: 'prod-017',
        cardColor: '#F0F0F0'
    },
    {
        title: 'Photo Mug Set',
        description: 'Viewed yesterday',
        image: 'https://images.unsplash.com/photo-1514228742587-6b1558fcca3d?w=400&h=400&fit=crop',
        price: 799,
        originalPrice: 1499,
        rating: 4.7,
        reviewCount: 234,
        link: '#recent-2',
        productId: 'prod-031',
        cardColor: '#FFF5E5'
    },
    {
        title: 'Custom Tote Bag',
        description: 'Viewed 3 days ago',
        image: 'https://images.unsplash.com/photo-1590874103328-eac38a683ce7?w=400&h=400&fit=crop',
        price: 449,
        originalPrice: 799,
        rating: 4.6,
        reviewCount: 189,
        link: '#recent-3',
        productId: 'prod-009',
        cardColor: '#E5FFE5'
    },
    {
        title: 'Phone Case Designer',
        description: 'Viewed last week',
        image: 'https://images.unsplash.com/photo-1601784551446-20c9e07cdbdb?w=400&h=400&fit=crop',
        price: 349,
        originalPrice: 699,
        rating: 4.5,
        reviewCount: 145,
        link: '#recent-4',
        productId: 'prod-003',
        cardColor: '#E5F5FF'
    }
];

const flashSales = [
    {
        title: 'Premium Hard Cover',
        description: 'Custom hard case for iPhone 14',
        image: 'https://images.unsplash.com/photo-1601784551446-20c9e07cdbdb?w=400&h=400&fit=crop',
        price: 199,
        originalPrice: 499,
        rating: 4.8,
        reviewCount: 156,
        badge: '⚡ 60% OFF',
        link: '#flash-1',
        productId: 'flash-001',
        cardColor: '#FFE5E5'
    },
    {
        title: 'Color Changing Mug',
        description: 'Magic mug with custom photo',
        image: 'https://images.unsplash.com/photo-1514228742587-6b1558fcca3d?w=400&h=400&fit=crop',
        price: 249,
        originalPrice: 599,
        rating: 4.6,
        reviewCount: 342,
        badge: '⚡ FLASH',
        link: '#flash-2',
        productId: 'flash-002',
        cardColor: '#FFF5E5'
    },
    {
        title: 'Cotton T-Shirt Bulk',
        description: 'Pack of 3 custom tees',
        image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&h=400&fit=crop',
        price: 899,
        originalPrice: 1999,
        rating: 4.9,
        reviewCount: 892,
        badge: '⚡ FLASH',
        link: '#flash-3',
        productId: 'flash-003',
        cardColor: '#E5FFE5'
    },
    {
        title: 'Custom Photo Collage',
        description: 'A3 size framed collage',
        image: 'https://images.unsplash.com/photo-1513519245088-0e12902e35ca?w=400&h=400&fit=crop',
        price: 499,
        originalPrice: 999,
        rating: 4.7,
        reviewCount: 231,
        badge: '⚡ 50% OFF',
        link: '#flash-4',
        productId: 'flash-004',
        cardColor: '#E5F5FF'
    }
];

const curatedCollections = [
    {
        title: 'Home Office Set',
        description: 'Mousepad, Mug & Planner',
        image: 'https://images.unsplash.com/photo-1517842264405-16ad5f7a5940?w=400&h=400&fit=crop',
        price: 899,
        originalPrice: 1499,
        rating: 4.8,
        reviewCount: 442,
        badge: 'BUNDLE',
        link: '#bundle-1',
        productId: 'bundle-001',
        cardColor: '#F5E5FF'
    },
    {
        title: 'Travel Kit Bundle',
        description: 'Tote, Water Bottle & Tag',
        image: 'https://images.unsplash.com/photo-1590874103328-eac38a683ce7?w=400&h=400&fit=crop',
        price: 1299,
        originalPrice: 1999,
        rating: 4.9,
        reviewCount: 512,
        badge: 'BUNDLE',
        link: '#bundle-2',
        productId: 'bundle-002',
        cardColor: '#E5FFFA'
    },
    {
        title: 'Couple Goals Kit',
        description: '2 Tees & 2 Mugs',
        image: 'https://images.unsplash.com/photo-1518199266791-5375a83190b7?w=400&h=400&fit=crop',
        price: 1499,
        originalPrice: 2499,
        rating: 5.0,
        reviewCount: 899,
        badge: 'BUNDLE',
        link: '#bundle-3',
        productId: 'bundle-003',
        cardColor: '#FFE5E5'
    },
    {
        title: 'Gamer Set',
        description: 'XL Mousepad & Grip',
        image: 'https://images.unsplash.com/photo-1527814050087-3793815479db?w=400&h=400&fit=crop',
        price: 599,
        originalPrice: 999,
        rating: 4.7,
        reviewCount: 334,
        badge: 'BUNDLE',
        link: '#bundle-4',
        productId: 'bundle-004',
        cardColor: '#E5E5FF'
    }
];

const youMightLike = [
    // Row 1 - T-Shirts & Apparel
    {
        title: 'Vintage Band T-Shirt',
        description: 'Retro music band prints',
        image: 'https://images.unsplash.com/photo-1562157873-818bc0726f68?w=400&h=400&fit=crop',
        price: 549,
        originalPrice: 999,
        rating: 4.7,
        reviewCount: 234,
        link: '#ml-1',
        productId: 'ml-001',
        cardColor: '#FFE5E5'
    },
    {
        title: 'Graphic Print Hoodie',
        description: 'Bold artistic designs',
        image: 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=400&h=400&fit=crop',
        price: 1099,
        originalPrice: 1999,
        rating: 4.8,
        reviewCount: 456,
        badge: 'HOT',
        link: '#ml-2',
        productId: 'ml-002',
        cardColor: '#E5E5FF'
    },
    {
        title: 'Polo Shirt Custom',
        description: 'Professional polo with logo',
        image: 'https://images.unsplash.com/photo-1586790170083-2f9ceadc732d?w=400&h=400&fit=crop',
        price: 699,
        originalPrice: 1299,
        rating: 4.6,
        reviewCount: 189,
        link: '#ml-3',
        productId: 'ml-003',
        cardColor: '#E5FFE5'
    },
    {
        title: 'Tank Top Summer',
        description: 'Lightweight custom tank top',
        image: 'https://images.unsplash.com/photo-1622445275463-afa2ab738c34?w=400&h=400&fit=crop',
        price: 399,
        originalPrice: 799,
        rating: 4.5,
        reviewCount: 145,
        link: '#ml-4',
        productId: 'ml-004',
        cardColor: '#FFFFE5'
    },
    {
        title: 'Crop Top Fashion',
        description: 'Trendy crop top with prints',
        image: 'https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=400&h=400&fit=crop',
        price: 449,
        originalPrice: 899,
        rating: 4.7,
        reviewCount: 267,
        link: '#ml-5',
        productId: 'ml-005',
        cardColor: '#FFE5F0'
    },
    {
        title: 'Long Sleeve Tee',
        description: 'Full sleeve custom print',
        image: 'https://images.unsplash.com/photo-1618354691373-d851c5c3a990?w=400&h=400&fit=crop',
        price: 599,
        originalPrice: 1099,
        rating: 4.6,
        reviewCount: 198,
        link: '#ml-6',
        productId: 'ml-006',
        cardColor: '#F0E5FF'
    },

    // Row 2 - Drinkware
    {
        title: 'Travel Mug Insulated',
        description: 'Keep drinks hot/cold for hours',
        image: 'https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=400&h=400&fit=crop',
        price: 599,
        originalPrice: 1199,
        rating: 4.8,
        reviewCount: 345,
        link: '#ml-7',
        productId: 'ml-007',
        cardColor: '#E5FFF5'
    },
    {
        title: 'Beer Mug Custom',
        description: 'Perfect for beer lovers',
        image: 'https://images.unsplash.com/photo-1535958636474-b021ee887b13?w=400&h=400&fit=crop',
        price: 449,
        originalPrice: 899,
        rating: 4.7,
        reviewCount: 234,
        link: '#ml-8',
        productId: 'ml-008',
        cardColor: '#FFF5E5'
    },
    {
        title: 'Color Changing Mug',
        description: 'Magic mug reveals photo when hot',
        image: 'https://images.unsplash.com/photo-1517256673644-36ad11246d21?w=400&h=400&fit=crop',
        price: 499,
        originalPrice: 999,
        rating: 4.9,
        reviewCount: 567,
        badge: 'MAGIC',
        link: '#ml-9',
        productId: 'ml-009',
        cardColor: '#FFE5E5'
    },
    {
        title: 'Couple Mugs Set',
        description: 'Matching his & hers mugs',
        image: 'https://images.unsplash.com/photo-1608667508764-33cf0726b13a?w=400&h=400&fit=crop',
        price: 699,
        originalPrice: 1399,
        rating: 4.8,
        reviewCount: 423,
        link: '#ml-10',
        productId: 'ml-010',
        cardColor: '#FFE5F5'
    },
    {
        title: 'Water Bottle Sports',
        description: 'BPA-free with custom design',
        image: 'https://images.unsplash.com/photo-1523362628745-0c100150b504?w=400&h=400&fit=crop',
        price: 549,
        originalPrice: 999,
        rating: 4.6,
        reviewCount: 289,
        link: '#ml-11',
        productId: 'ml-011',
        cardColor: '#E5F5FF'
    },
    {
        title: 'Shot Glass Set',
        description: 'Mini shot glasses with photo',
        image: 'https://images.unsplash.com/photo-1569493880627-e04a4b97db91?w=400&h=400&fit=crop',
        price: 399,
        originalPrice: 799,
        rating: 4.5,
        reviewCount: 178,
        link: '#ml-12',
        productId: 'ml-012',
        cardColor: '#E5FFE5'
    },

    // Row 3 - Tech Accessories
    {
        title: 'Laptop Skin Custom',
        description: 'Protective vinyl skin with art',
        image: 'https://images.unsplash.com/photo-1593642632823-8f785ba67e45?w=400&h=400&fit=crop',
        price: 399,
        originalPrice: 799,
        rating: 4.7,
        reviewCount: 234,
        link: '#ml-13',
        productId: 'ml-013',
        cardColor: '#FFFFE5'
    },
    {
        title: 'Phone Stand Wooden',
        description: 'Elegant wood stand with engraving',
        image: 'https://images.unsplash.com/photo-1601784551446-20c9e07cdbdb?w=400&h=400&fit=crop',
        price: 449,
        originalPrice: 899,
        rating: 4.6,
        reviewCount: 198,
        link: '#ml-14',
        productId: 'ml-014',
        cardColor: '#F0E5FF'
    },
    {
        title: 'Wireless Charger Pad',
        description: 'Custom print wireless charging',
        image: 'https://images.unsplash.com/photo-1591290619762-c588f7bc7ede?w=400&h=400&fit=crop',
        price: 899,
        originalPrice: 1599,
        rating: 4.8,
        reviewCount: 345,
        badge: 'TECH',
        link: '#ml-15',
        productId: 'ml-015',
        cardColor: '#E5E5FF'
    },
    {
        title: 'Cable Organizer',
        description: 'Custom printed cable management',
        image: 'https://images.unsplash.com/photo-1625948515291-69613efd103f?w=400&h=400&fit=crop',
        price: 249,
        originalPrice: 499,
        rating: 4.5,
        reviewCount: 156,
        link: '#ml-16',
        productId: 'ml-016',
        cardColor: '#E5FFF5'
    },
    {
        title: 'Tablet Case Premium',
        description: 'Leather case with custom art',
        image: 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=400&h=400&fit=crop',
        price: 799,
        originalPrice: 1499,
        rating: 4.7,
        reviewCount: 267,
        link: '#ml-17',
        productId: 'ml-017',
        cardColor: '#FFE5E5'
    },
    {
        title: 'Earphone Case',
        description: 'Protect your earbuds with style',
        image: 'https://images.unsplash.com/photo-1606841837239-c5a1a4a07af7?w=400&h=400&fit=crop',
        price: 199,
        originalPrice: 399,
        rating: 4.6,
        reviewCount: 189,
        link: '#ml-18',
        productId: 'ml-018',
        cardColor: '#E5FFE5'
    },

    // Row 4 - Home Decor
    {
        title: 'Canvas Wall Art',
        description: 'Museum quality canvas print',
        image: 'https://images.unsplash.com/photo-1513519245088-0e12902e35ca?w=400&h=400&fit=crop',
        price: 1299,
        originalPrice: 2499,
        rating: 4.9,
        reviewCount: 567,
        badge: 'PREMIUM',
        link: '#ml-19',
        productId: 'ml-019',
        cardColor: '#FFE5F0'
    },
    {
        title: 'Throw Pillow Cover',
        description: 'Soft pillow cover with photo',
        image: 'https://images.unsplash.com/photo-1584100936595-c0654b55a2e2?w=400&h=400&fit=crop',
        price: 399,
        originalPrice: 799,
        rating: 4.6,
        reviewCount: 234,
        link: '#ml-20',
        productId: 'ml-020',
        cardColor: '#FFF5E5'
    },
    {
        title: 'Door Mat Custom',
        description: 'Welcome mat with custom text',
        image: 'https://images.unsplash.com/photo-1595428773955-d7a3a3a3e8b7?w=400&h=400&fit=crop',
        price: 549,
        originalPrice: 1099,
        rating: 4.7,
        reviewCount: 198,
        link: '#ml-21',
        productId: 'ml-021',
        cardColor: '#E5F5FF'
    },
    {
        title: 'Blanket Photo Print',
        description: 'Cozy fleece blanket with memories',
        image: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=400&h=400&fit=crop',
        price: 1499,
        originalPrice: 2999,
        rating: 4.8,
        reviewCount: 423,
        link: '#ml-22',
        productId: 'ml-022',
        cardColor: '#FFE5E5'
    },
    {
        title: 'Shower Curtain',
        description: 'Waterproof with vibrant print',
        image: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=400&h=400&fit=crop',
        price: 699,
        originalPrice: 1299,
        rating: 4.5,
        reviewCount: 167,
        link: '#ml-23',
        productId: 'ml-023',
        cardColor: '#E5FFE5'
    },
    {
        title: 'Table Runner',
        description: 'Elegant table decor with design',
        image: 'https://images.unsplash.com/photo-1615486511484-92e172cc4fe0?w=400&h=400&fit=crop',
        price: 599,
        originalPrice: 1199,
        rating: 4.6,
        reviewCount: 189,
        link: '#ml-24',
        productId: 'ml-024',
        cardColor: '#F0E5FF'
    },

    // Row 5 - Accessories
    {
        title: 'Umbrella Custom Print',
        description: 'Stay dry with style',
        image: 'https://images.unsplash.com/photo-1527766833261-b09c3163a791?w=400&h=400&fit=crop',
        price: 799,
        originalPrice: 1499,
        rating: 4.7,
        reviewCount: 267,
        link: '#ml-25',
        productId: 'ml-025',
        cardColor: '#E5FFF5'
    },
    {
        title: 'Baseball Cap',
        description: 'Custom embroidered cap',
        image: 'https://images.unsplash.com/photo-1588850561407-ed78c282e89b?w=400&h=400&fit=crop',
        price: 449,
        originalPrice: 899,
        rating: 4.6,
        reviewCount: 234,
        link: '#ml-26',
        productId: 'ml-026',
        cardColor: '#FFFFE5'
    },
    {
        title: 'Beanie Hat Winter',
        description: 'Warm beanie with custom patch',
        image: 'https://images.unsplash.com/photo-1576871337622-98d48d1cf531?w=400&h=400&fit=crop',
        price: 399,
        originalPrice: 799,
        rating: 4.8,
        reviewCount: 345,
        link: '#ml-27',
        productId: 'ml-027',
        cardColor: '#E5E5FF'
    },
    {
        title: 'Backpack Custom',
        description: 'Durable backpack with print',
        image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400&h=400&fit=crop',
        price: 1299,
        originalPrice: 2499,
        rating: 4.9,
        reviewCount: 567,
        badge: 'POPULAR',
        link: '#ml-28',
        productId: 'ml-028',
        cardColor: '#FFE5F0'
    },
    {
        title: 'Socks Custom Pair',
        description: 'Fun socks with photo faces',
        image: 'https://images.unsplash.com/photo-1586350977771-b3b0abd50c82?w=400&h=400&fit=crop',
        price: 299,
        originalPrice: 599,
        rating: 4.5,
        reviewCount: 178,
        link: '#ml-29',
        productId: 'ml-029',
        cardColor: '#FFF5E5'
    },
    {
        title: 'Bandana Custom',
        description: 'Stylish bandana with design',
        image: 'https://images.unsplash.com/photo-1581655353564-df123a1eb820?w=400&h=400&fit=crop',
        price: 249,
        originalPrice: 499,
        rating: 4.6,
        reviewCount: 145,
        link: '#ml-30',
        productId: 'ml-030',
        cardColor: '#E5FFF5'
    },

    // Row 6 - Stationery
    {
        title: 'Sticky Notes Custom',
        description: 'Personalized sticky note pads',
        image: 'https://images.unsplash.com/photo-1517842264405-16ad5f7a5940?w=400&h=400&fit=crop',
        price: 199,
        originalPrice: 399,
        rating: 4.5,
        reviewCount: 123,
        link: '#ml-31',
        productId: 'ml-031',
        cardColor: '#FFFFE5'
    },
    {
        title: 'Planner 2026',
        description: 'Yearly planner with custom cover',
        image: 'https://images.unsplash.com/photo-1484480974693-6ca0a78fb36b?w=400&h=400&fit=crop',
        price: 599,
        originalPrice: 1199,
        rating: 4.8,
        reviewCount: 456,
        link: '#ml-32',
        productId: 'ml-032',
        cardColor: '#F0E5FF'
    },
    {
        title: 'Bookmark Set',
        description: 'Beautiful photo bookmarks',
        image: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=400&h=400&fit=crop',
        price: 149,
        originalPrice: 299,
        rating: 4.6,
        reviewCount: 189,
        link: '#ml-33',
        productId: 'ml-033',
        cardColor: '#E5FFE5'
    },
    {
        title: 'Desk Calendar 2026',
        description: 'Monthly desk calendar',
        image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=400&fit=crop',
        price: 349,
        originalPrice: 699,
        rating: 4.7,
        reviewCount: 234,
        link: '#ml-34',
        productId: 'ml-034',
        cardColor: '#E5F5FF'
    },
    {
        title: 'Business Cards',
        description: 'Professional custom cards',
        image: 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=400&h=400&fit=crop',
        price: 499,
        originalPrice: 999,
        rating: 4.9,
        reviewCount: 678,
        badge: 'BUSINESS',
        link: '#ml-35',
        productId: 'ml-035',
        cardColor: '#FFE5E5'
    },
    {
        title: 'Greeting Cards Pack',
        description: 'Custom photo greeting cards',
        image: 'https://images.unsplash.com/photo-1515169067868-5387ec356754?w=400&h=400&fit=crop',
        price: 299,
        originalPrice: 599,
        rating: 4.6,
        reviewCount: 267,
        link: '#ml-36',
        productId: 'ml-036',
        cardColor: '#FFE5F0'
    },

    // Row 7 - Jewelry & Fashion
    {
        title: 'Photo Locket Necklace',
        description: 'Heart locket with photo inside',
        image: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=400&h=400&fit=crop',
        price: 899,
        originalPrice: 1799,
        rating: 4.9,
        reviewCount: 534,
        link: '#ml-37',
        productId: 'ml-037',
        cardColor: '#FFF5E5'
    },
    {
        title: 'Bracelet Engraved',
        description: 'Metal bracelet with custom text',
        image: 'https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=400&h=400&fit=crop',
        price: 699,
        originalPrice: 1399,
        rating: 4.7,
        reviewCount: 345,
        link: '#ml-38',
        productId: 'ml-038',
        cardColor: '#E5FFF5'
    },
    {
        title: 'Ring Custom Photo',
        description: 'Photo embedded in ring',
        image: 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=400&h=400&fit=crop',
        price: 1199,
        originalPrice: 2399,
        rating: 4.8,
        reviewCount: 423,
        badge: 'LUXURY',
        link: '#ml-39',
        productId: 'ml-039',
        cardColor: '#FFFFE5'
    },
    {
        title: 'Earrings Custom',
        description: 'Photo print earrings',
        image: 'https://images.unsplash.com/photo-1535632787350-4e68ef0ac584?w=400&h=400&fit=crop',
        price: 599,
        originalPrice: 1199,
        rating: 4.6,
        reviewCount: 234,
        link: '#ml-40',
        productId: 'ml-040',
        cardColor: '#F0E5FF'
    },
    {
        title: 'Badge Pin Custom',
        description: 'Custom design button badges',
        image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=400&fit=crop',
        price: 99,
        originalPrice: 199,
        rating: 4.5,
        reviewCount: 167,
        link: '#ml-41',
        productId: 'ml-041',
        cardColor: '#E5E5FF'
    },
    {
        title: 'Scarf Silk Custom',
        description: 'Luxury silk scarf with print',
        image: 'https://images.unsplash.com/photo-1601924994987-69e26d50dc26?w=400&h=400&fit=crop',
        price: 1499,
        originalPrice: 2999,
        rating: 4.9,
        reviewCount: 456,
        link: '#ml-42',
        productId: 'ml-042',
        cardColor: '#FFE5F5'
    },

    // Row 8 - Kids & Toys
    {
        title: 'Puzzle Custom Photo',
        description: 'Turn photos into jigsaw puzzles',
        image: 'https://images.unsplash.com/photo-1587241321921-91a834d82ffc?w=400&h=400&fit=crop',
        price: 449,
        originalPrice: 899,
        rating: 4.8,
        reviewCount: 567,
        link: '#ml-43',
        productId: 'ml-043',
        cardColor: '#E5FFE5'
    },
    {
        title: 'Stuffed Toy Custom',
        description: 'Plush toy with custom print',
        image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=400&fit=crop',
        price: 799,
        originalPrice: 1599,
        rating: 4.7,
        reviewCount: 345,
        link: '#ml-44',
        productId: 'ml-044',
        cardColor: '#E5F5FF'
    },
    {
        title: 'Kids Backpack',
        description: 'School bag with photo print',
        image: 'https://images.unsplash.com/photo-1577733966973-d680bffd2e80?w=400&h=400&fit=crop',
        price: 699,
        originalPrice: 1399,
        rating: 4.6,
        reviewCount: 234,
        link: '#ml-45',
        productId: 'ml-045',
        cardColor: '#FFE5E5'
    },
    {
        title: 'Lunch Box Custom',
        description: 'Insulated lunch box with design',
        image: 'https://images.unsplash.com/photo-1591299007252-d1b8d5b0fc4d?w=400&h=400&fit=crop',
        price: 549,
        originalPrice: 1099,
        rating: 4.9,
        reviewCount: 678,
        badge: 'KIDS',
        link: '#ml-46',
        productId: 'ml-046',
        cardColor: '#FFFFE5'
    },
    {
        title: 'Coloring Book Custom',
        description: 'Personalized coloring pages',
        image: 'https://images.unsplash.com/photo-1513519245088-0e12902e35ca?w=400&h=400&fit=crop',
        price: 299,
        originalPrice: 599,
        rating: 4.5,
        reviewCount: 189,
        link: '#ml-47',
        productId: 'ml-047',
        cardColor: '#F0E5FF'
    },
    {
        title: 'Growth Chart',
        description: 'Track height with custom design',
        image: 'https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?w=400&h=400&fit=crop',
        price: 599,
        originalPrice: 1199,
        rating: 4.8,
        reviewCount: 423,
        link: '#ml-48',
        productId: 'ml-048',
        cardColor: '#E5FFF5'
    }
];

// Initialize homepage
document.addEventListener('DOMContentLoaded', () => {
    console.log('🚀 SnapPrint Homepage Loading...');

    // Initialize hamburger menu FIRST to ensure it always works
    initHamburgerMenu();

    // Initialize hero slider
    initHeroSlider();

    // Render categories
    renderCategories(categories, 'category-grid');

    // Render product sections
    renderProducts(featuredProducts, 'featured-products', { variant: 'default' });
    renderProducts(specialOccasions, 'special-occasions', { variant: 'colored', enableCardColors: true });
    renderProducts(flashSales, 'flash-sales', { variant: 'curved-all' });
    renderProducts(trendingProducts, 'trending-products', { variant: 'curved-bottom' });
    renderProducts(newArrivals, 'new-arrivals', { variant: 'default' });
    renderProducts(recentlyViewed, 'recently-viewed', { variant: 'colored', enableCardColors: true });
    renderProducts(curatedCollections, 'curated-collections', { variant: 'curved-bottom' });
    renderProducts(bestSellers, 'best-sellers', { variant: 'curved-all' });
    renderProducts(mostLovedProducts, 'most-loved', { variant: 'curved-bottom' });
    renderProducts(youMightLike, 'you-might-like', { variant: 'colored', enableCardColors: true, gridCols: 6 });

    // Render special offers carousel (function not yet implemented)
    // renderSpecialCarousel(specialOffers, 'special-offers', { enableDrag: true });

    // Initialize wishlist states
    setTimeout(() => {
        if (typeof initializeWishlistStates === 'function') {
            initializeWishlistStates();
        }
    }, 100);

    // Add scroll animations
    addScrollAnimations();

    // Add smooth scroll to anchor links
    addSmoothScroll();

    console.log('✅ SnapPrint Homepage Ready!');
});

/**
 * Initialize hero slider
 */
function initHeroSlider() {
    if (typeof SlideshowWidget !== 'undefined') {
        new SlideshowWidget({
            containerId: 'hero-slider',
            slides: heroSlides,
            autoPlay: true,
            interval: 5000,
            showDots: true,
            showArrows: true,
            adaptiveWidth: true
        });
    }
}

/**
 * Add scroll animations for elements
 */
function addScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.animation = 'fadeInUp 0.6s ease-out both';
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Observe sections
    document.querySelectorAll('.products-section, .banner-section').forEach(section => {
        observer.observe(section);
    });
}

/**
 * Add smooth scroll behavior to anchor links
 */
function addSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const href = this.getAttribute('href');
            if (href === '#' || href === '#!') return;

            const target = document.querySelector(href);
            if (target) {
                e.preventDefault();
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

/**
 * Initialize hamburger menu for mobile
 */
function initHamburgerMenu() {
    const hamburger = document.querySelector('.hamburger-menu');
    const headerActions = document.querySelector('.header-actions');

    console.log('Hamburger found:', hamburger);
    console.log('Header actions found:', headerActions);

    if (hamburger && headerActions) {
        hamburger.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            console.log('Hamburger clicked!');
            hamburger.classList.toggle('active');
            headerActions.classList.toggle('active');
        });

        // Close menu when clicking outside
        document.addEventListener('click', (e) => {
            if (!hamburger.contains(e.target) && !headerActions.contains(e.target)) {
                hamburger.classList.remove('active');
                headerActions.classList.remove('active');
            }
        });
    } else {
        console.error('Hamburger menu elements not found!');
    }
}

/**
 * Utility: Format currency
 */
function formatCurrency(amount) {
    return `₹${amount.toLocaleString('en-IN')}`;
}

/**
 * Utility: Get random items from array
 */
function getRandomItems(array, count) {
    const shuffled = [...array].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, count);
}

// Export for use in other scripts
if (typeof window !== 'undefined') {
    window.SnapPrint = {
        formatCurrency,
        getRandomItems,
        categories,
        featuredProducts,
        trendingProducts,
        mostLovedProducts,
        newArrivals,
        bestSellers,
        specialOccasions,
        recentlyViewed,
        youMightLike
    };
}