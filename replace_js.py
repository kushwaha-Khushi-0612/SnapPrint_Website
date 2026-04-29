import sys
content = open('scripts/homepage.js', 'r', encoding='utf-8').read()

target = '''        // Secondary banners
        let secondaryHtml = '<div class="promo-secondary-grid">';
        data.secondaryPromos.forEach(promo => {
            const bgStyle = promo.image 
                ? `background-image: ${promo.gradient}, url('${promo.image}');` 
                : `background: ${promo.gradient};`;
                
            const titleStyle = promo.textColorTitle ? `color: ${promo.textColorTitle};` : '';
            const subStyle = promo.textColorSubtitle ? `color: ${promo.textColorSubtitle}; font-family: cursive;` : '';
            const btnStyle = (promo.buttonColor || promo.buttonTextColor) 
                ? `style="background: ${promo.buttonColor || '#000'}; color: ${promo.buttonTextColor || '#fff'};"` 
                : '';
                
            const floatingIcon = promo.floatingIcon 
                ? `<img src="${promo.floatingIcon}" class="floating-icon" alt="Icon" style="position: absolute; right: 20px; bottom: 20px; width: 60px; opacity: 0.2; pointer-events: none;">` 
                : '';

            secondaryHtml += `
                <div class="promo-banner-card" style="${bgStyle} cursor: pointer;" onclick="window.location.href='${promo.link}'">
                    <div class="promo-content">
                        <h3 style="${titleStyle}">${promo.title}</h3>
                        <p style="${subStyle}">${promo.subtitle}</p>
                        <button class="order-now-btn" ${btnStyle} onclick="event.stopPropagation(); window.location.href='${promo.link}'">${promo.buttonText}</button>
                    </div>
                    ${floatingIcon}
                </div>
            `;
        });
        secondaryHtml += '</div>';'''

new_content = '''        // Secondary banners grouped into rows
        let secondaryHtml = '<div class="promo-secondary-grid">';
        
        // Chunk array into groups of 3
        const chunkSize = 3;
        for (let i = 0; i < data.secondaryPromos.length; i += chunkSize) {
            const chunk = data.secondaryPromos.slice(i, i + chunkSize);
            secondaryHtml += '<div class="promo-row">';
            
            chunk.forEach(promo => {
                const bgStyle = promo.image 
                    ? `background-image: ${promo.gradient}, url('${promo.image}');` 
                    : `background: ${promo.gradient};`;
                    
                const titleStyle = promo.textColorTitle ? `color: ${promo.textColorTitle};` : '';
                const subStyle = promo.textColorSubtitle ? `color: ${promo.textColorSubtitle}; font-family: cursive;` : '';
                const btnStyle = (promo.buttonColor || promo.buttonTextColor) 
                    ? `style="background: ${promo.buttonColor || '#000'}; color: ${promo.buttonTextColor || '#fff'};"` 
                    : '';
                    
                const floatingIcon = promo.floatingIcon 
                    ? `<img src="${promo.floatingIcon}" class="floating-icon" alt="Icon" style="position: absolute; right: 20px; bottom: 20px; width: 60px; opacity: 0.2; pointer-events: none;">` 
                    : '';

                secondaryHtml += `
                    <div class="promo-banner-card" style="${bgStyle} cursor: pointer;" onclick="window.location.href='${promo.link}'">
                        <div class="promo-content">
                            <h3 style="${titleStyle}">${promo.title}</h3>
                            <p style="${subStyle}">${promo.subtitle}</p>
                            <button class="order-now-btn" ${btnStyle} onclick="event.stopPropagation(); window.location.href='${promo.link}'">${promo.buttonText}</button>
                        </div>
                        ${floatingIcon}
                    </div>
                `;
            });
            secondaryHtml += '</div>'; // End promo-row
        }
        secondaryHtml += '</div>'; // End promo-secondary-grid'''

content_norm = content.replace('\r\n', '\n')
target_norm = target.replace('\r\n', '\n')

if target_norm in content_norm:
    final = content_norm.replace(target_norm, new_content)
    open('scripts/homepage.js', 'w', encoding='utf-8').write(final)
    print('Replaced JS successfully')
else:
    print('Target not found in JS')
