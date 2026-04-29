import sys
content = open('styles/homepage.css', 'r', encoding='utf-8').read()

target = '''/* Secondary Banners (Grid for smooth column expansion) */
.promo-secondary-grid {
    display: grid;
    grid-template-columns: 1fr 1fr 1fr;
    gap: 16px;
    transition: grid-template-columns 0.6s cubic-bezier(0.25, 1, 0.5, 1);
}

.promo-banner-card {
    position: relative;
    border-radius: 16px;
    height: 180px;
    background-size: cover;
    background-position: center;
    padding: 24px;
    display: flex;
    align-items: center;
    overflow: hidden;
    box-shadow: 0 4px 10px rgba(0,0,0,0.04);
    
    /* Animation base */
    width: 100%;
    transition: transform 0.4s cubic-bezier(0.25, 1, 0.5, 1), box-shadow 0.4s ease;
}

/* Hover expansion animation (Desktop only) */
@media (min-width: 1025px) {
    .promo-secondary-grid:has(.promo-banner-card:nth-child(3n+1):hover) {
        grid-template-columns: 2fr 1fr 1fr;
    }
    .promo-secondary-grid:has(.promo-banner-card:nth-child(3n+2):hover) {
        grid-template-columns: 1fr 2fr 1fr;
    }
    .promo-secondary-grid:has(.promo-banner-card:nth-child(3n+3):hover) {
        grid-template-columns: 1fr 1fr 2fr;
    }

    .promo-secondary-grid .promo-banner-card:hover {
        transform: translateY(-4px);
        box-shadow: 0 12px 30px rgba(0,0,0,0.12);
        z-index: 10;
    }
}'''

new_content = '''/* Secondary Banners Row Layout */
.promo-secondary-grid {
    display: flex;
    flex-direction: column;
    gap: 16px;
}

.promo-row {
    display: grid;
    grid-template-columns: 1fr 1fr 1fr;
    gap: 16px;
    transition: grid-template-columns 0.6s cubic-bezier(0.25, 1, 0.5, 1);
}

.promo-banner-card {
    position: relative;
    border-radius: 16px;
    height: 180px;
    background-size: cover;
    background-position: center;
    padding: 24px;
    display: flex;
    align-items: center;
    overflow: hidden;
    box-shadow: 0 4px 10px rgba(0,0,0,0.04);
    
    /* Animation base */
    width: 100%;
    transition: transform 0.4s cubic-bezier(0.25, 1, 0.5, 1), box-shadow 0.4s ease;
}

/* Hover expansion animation (Desktop only) */
@media (min-width: 1025px) {
    .promo-row:has(.promo-banner-card:nth-child(3n+1):hover) {
        grid-template-columns: 2fr 1fr 1fr;
    }
    .promo-row:has(.promo-banner-card:nth-child(3n+2):hover) {
        grid-template-columns: 1fr 2fr 1fr;
    }
    .promo-row:has(.promo-banner-card:nth-child(3n+3):hover) {
        grid-template-columns: 1fr 1fr 2fr;
    }

    .promo-row .promo-banner-card:hover {
        transform: translateY(-4px);
        box-shadow: 0 12px 30px rgba(0,0,0,0.12);
        z-index: 10;
    }
}'''

content_norm = content.replace('\r\n', '\n')
target_norm = target.replace('\r\n', '\n')

if target_norm in content_norm:
    final = content_norm.replace(target_norm, new_content)
    open('styles/homepage.css', 'w', encoding='utf-8').write(final)
    print('Replaced CSS Desktop successfully')
else:
    print('Target Desktop not found in CSS')
