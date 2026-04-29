import sys

content = open('index.html', 'r', encoding='utf-8').read()

target = '''        <!-- Hero Slider Section -->
        <section class="hero-section">
            <div id="hero-slider" class="hero-slider"></div>
        </section>'''

content_norm = content.replace('\r\n', '\n')
target_norm = target.replace('\r\n', '\n')

new_content = '''        <!-- Promo Banners Section (Blinkit Style) -->
        <section class="promo-banners-section">
            <div class="promo-banners-container">
                <!-- Main Wide Banner -->
                <div class="promo-banner-main" style="background-image: linear-gradient(to right, rgba(230, 40, 70, 0.9), rgba(230, 40, 70, 0.5)), url('constants/promos/discount_promo_bg.png');">
                    <div class="promo-content-left">
                        <h2>Mega Print Festival!</h2>
                        <p>Get up to 50% OFF on all custom prints & corporate orders</p>
                        <button class="shop-now-btn">Shop Now</button>
                    </div>
                </div>
                
                <!-- Secondary Banners Grid -->
                <div class="promo-secondary-grid">
                    <div class="promo-banner-card womens-promo" style="background-image: linear-gradient(to right, rgba(255, 255, 255, 0.9) 30%, rgba(255, 255, 255, 0)), url('constants/promos/womens_fashion_bg.png');">
                        <div class="promo-content">
                            <h3>Women's Custom Wear</h3>
                            <p>Design your own unique style</p>
                            <button class="order-now-btn">Order Now</button>
                        </div>
                    </div>
                    <div class="promo-banner-card mens-promo" style="background-image: linear-gradient(to right, rgba(255, 255, 255, 0.9) 30%, rgba(255, 255, 255, 0)), url('constants/promos/mens_fashion_bg.png');">
                        <div class="promo-content">
                            <h3>Men's Urban Streetwear</h3>
                            <p>Premium customized hoodies & tees</p>
                            <button class="order-now-btn">Order Now</button>
                        </div>
                    </div>
                    <div class="promo-banner-card mothers-day-promo" style="background: linear-gradient(135deg, #FFEBF0 0%, #FFD1E0 100%);">
                        <div class="promo-content">
                            <h3 style="color: #D81B60;">Mother's Day Gifts</h3>
                            <p style="color: #ad1457; font-family: cursive;">Surprise her with memories...</p>
                            <button class="order-now-btn mothers-btn">Order Now</button>
                        </div>
                        <img src="constants/icons/heart.svg" class="floating-icon" alt="Heart" style="position: absolute; right: 20px; bottom: 20px; width: 60px; opacity: 0.2;">
                    </div>
                </div>
            </div>
        </section>'''

if target_norm in content_norm:
    final = content_norm.replace(target_norm, new_content)
    open('index.html', 'w', encoding='utf-8').write(final)
    print('Replaced successfully')
else:
    print('Target not found')
