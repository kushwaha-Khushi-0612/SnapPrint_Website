(function () {
    const style = document.createElement('style');
    style.textContent = `
        .sp-footer { background:#0a0a0a; color:#ccc; font-family:'Inter',sans-serif; padding:64px 0 0; margin-top:80px; }
        .sp-footer-inner { max-width:1280px; margin:0 auto; padding:0 32px; }

        /* TOP */
        .sp-footer-top { display:flex; align-items:center; justify-content:space-between; gap:32px; padding-bottom:40px; border-bottom:1px solid rgba(255,255,255,0.07); flex-wrap:wrap; }
        .sp-footer-brand { display:flex; align-items:center; gap:14px; text-decoration:none; }
        .sp-footer-brand img { width:44px; height:44px; border-radius:10px; object-fit:cover; }
        .sp-footer-brand h2 { font-size:20px; font-weight:800; color:#fff; margin:0; letter-spacing:-0.5px; }
        .sp-footer-brand span { font-size:11px; color:#555; display:block; margin-top:2px; }
        .sp-footer-trust { display:flex; gap:20px; flex-wrap:wrap; }
        .sp-trust-item { display:flex; align-items:center; gap:7px; font-size:12px; color:#555; }
        .sp-trust-item svg { color:#4ade80; }
        .sp-footer-nl { display:flex; flex-direction:column; gap:8px; }
        .sp-footer-nl p { font-size:12px; color:#555; margin:0; }
        .sp-nl-form { display:flex; border-radius:10px; overflow:hidden; border:1px solid rgba(255,255,255,0.1); }
        .sp-nl-form input { background:rgba(255,255,255,0.04); border:none; outline:none; padding:10px 14px; color:#fff; font-size:13px; width:220px; font-family:inherit; }
        .sp-nl-form input::placeholder { color:#444; }
        .sp-nl-form button { background:#fff; color:#111; border:none; padding:10px 18px; font-size:12px; font-weight:700; cursor:pointer; transition:background 0.2s; font-family:inherit; white-space:nowrap; }
        .sp-nl-form button:hover { background:#e5e5e5; }

        /* GRID */
        .sp-footer-grid { display:grid; grid-template-columns:2fr 1fr 1fr 1fr 1fr; gap:40px; padding:44px 0; border-bottom:1px solid rgba(255,255,255,0.07); }
        .sp-footer-col-about p { font-size:13px; line-height:1.85; color:#555; margin:10px 0 18px; }
        .sp-footer-col h4 { font-size:11px; font-weight:700; text-transform:uppercase; letter-spacing:1.2px; color:#fff; margin:0 0 18px; }
        .sp-footer-col ul { list-style:none; padding:0; margin:0; display:flex; flex-direction:column; gap:8px; }

        /* Animated link */
        .sp-footer-col ul li a {
            font-size:13px; color:#555; text-decoration:none; display:inline-flex; align-items:center; gap:6px;
            position:relative; transition:color 0.25s; padding-bottom:1px;
        }
        .sp-footer-col ul li a::after {
            content:''; position:absolute; bottom:0; left:0; width:0; height:1px;
            background:currentColor; transition:width 0.3s ease;
        }
        .sp-footer-col ul li a:hover { color:#fff; }
        .sp-footer-col ul li a:hover::after { width:100%; }
        .sp-footer-col ul li a .sp-link-arrow { opacity:0; transform:translateX(-4px); transition:all 0.25s; font-size:10px; }
        .sp-footer-col ul li a:hover .sp-link-arrow { opacity:1; transform:translateX(0); }

        /* Ripple on link click */
        .sp-footer-col ul li a.sp-ripple { position:relative; overflow:hidden; }
        .sp-ripple-dot {
            position:absolute; border-radius:50%; background:rgba(255,255,255,0.15);
            transform:scale(0); animation:sp-ripple-anim 0.5s linear;
            pointer-events:none;
        }
        @keyframes sp-ripple-anim { to { transform:scale(4); opacity:0; } }

        /* Socials */
        .sp-footer-socials { display:flex; gap:10px; }
        .sp-footer-socials a {
            width:38px; height:38px; border-radius:10px; border:1px solid rgba(255,255,255,0.08);
            display:flex; align-items:center; justify-content:center; color:#666; text-decoration:none;
            transition:all 0.25s; position:relative; overflow:hidden;
        }
        .sp-footer-socials a::before {
            content:''; position:absolute; inset:0; opacity:0; transition:opacity 0.25s;
            border-radius:inherit;
        }
        .sp-footer-socials a.ig::before { background:linear-gradient(135deg,#f09433,#e6683c,#dc2743,#cc2366,#bc1888); }
        .sp-footer-socials a.fb::before { background:#1877f2; }
        .sp-footer-socials a.tw::before { background:#000; }
        .sp-footer-socials a.yt::before { background:#ff0000; }
        .sp-footer-socials a.wa::before { background:#25d366; }
        .sp-footer-socials a:hover::before { opacity:1; }
        .sp-footer-socials a:hover { border-color:transparent; color:#fff; transform:translateY(-3px); box-shadow:0 8px 20px rgba(0,0,0,0.4); }
        .sp-footer-socials a svg { position:relative; z-index:1; transition:transform 0.2s; }
        .sp-footer-socials a:hover svg { transform:scale(1.15); }

        /* BOTTOM */
        .sp-footer-bottom { display:flex; align-items:center; justify-content:space-between; padding:18px 0; gap:16px; flex-wrap:wrap; }
        .sp-footer-bottom p { font-size:12px; color:#333; margin:0; }
        .sp-footer-payments { display:flex; gap:7px; align-items:center; }
        .sp-pay-badge { background:rgba(255,255,255,0.04); border:1px solid rgba(255,255,255,0.08); border-radius:5px; padding:4px 9px; font-size:10px; font-weight:700; color:#444; letter-spacing:0.5px; transition:all 0.2s; cursor:default; }
        .sp-pay-badge:hover { border-color:rgba(255,255,255,0.2); color:#aaa; }

        /* ===== DESKTOP ===== */
        @media(max-width:1024px){
            .sp-footer-grid { grid-template-columns:1fr 1fr 1fr; }
            .sp-footer-col-about { grid-column:1/-1; }
        }

        /* ===== MOBILE — compact accordion ===== */
        @media(max-width:768px){
            .sp-footer { padding-top:36px; margin-top:36px; }
            .sp-footer-inner { padding:0 16px; }
            .sp-footer-top { flex-direction:column; align-items:flex-start; gap:20px; padding-bottom:24px; }
            .sp-footer-trust { display:none; }
            .sp-footer-nl { width:100%; }
            .sp-nl-form input { width:100%; flex:1; }

            /* Collapse grid into accordions */
            .sp-footer-grid { grid-template-columns:1fr; gap:0; padding:0; border-bottom:none; }
            .sp-footer-col-about { display:none; } /* hide about on mobile */
            .sp-footer-col { border-bottom:1px solid rgba(255,255,255,0.06); }
            .sp-footer-col h4 {
                display:flex; align-items:center; justify-content:space-between;
                cursor:pointer; padding:14px 0; margin:0; font-size:12px; user-select:none;
            }
            .sp-footer-col h4::after { content:'+'; font-size:16px; font-weight:300; color:#444; transition:transform 0.3s; }
            .sp-footer-col.sp-open h4::after { content:'−'; }
            .sp-footer-col ul { display:none; padding:0 0 14px; gap:10px; }
            .sp-footer-col.sp-open ul { display:flex; }

            /* Mobile social + copyright row */
            .sp-footer-bottom { flex-direction:column; align-items:center; text-align:center; gap:14px; padding:20px 0; }
            .sp-footer-payments { flex-wrap:wrap; justify-content:center; }

            /* Mobile social row — show compact under accordion */
            .sp-mobile-social { display:flex; gap:10px; justify-content:center; padding:16px 0; border-top:1px solid rgba(255,255,255,0.06); }
            .sp-mobile-social a {
                width:40px; height:40px; border-radius:10px; border:1px solid rgba(255,255,255,0.1);
                display:flex; align-items:center; justify-content:center; color:#555; text-decoration:none;
                transition:all 0.2s;
            }
            .sp-mobile-social a:active { transform:scale(0.9); }
        }
        @media(min-width:769px){ .sp-mobile-social { display:none; } }
    `;
    document.head.appendChild(style);

    // SVG icon helper
    const svg = (path, vb = '0 0 24 24', extra = '') =>
        `<svg width="17" height="17" viewBox="${vb}" fill="currentColor" xmlns="http://www.w3.org/2000/svg" ${extra}>${path}</svg>`;

    const icons = {
        ig: svg(`<path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/>`),
        fb: svg(`<path d="M24 12.073C24 5.405 18.627 0 12 0S0 5.405 0 12.073C0 18.1 4.388 23.094 10.125 24v-8.437H7.078v-3.49h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796V24C19.612 23.094 24 18.1 24 12.073z"/>`),
        tw: svg(`<path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.74l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>`),
        yt: svg(`<path d="M23.495 6.205a3.007 3.007 0 00-2.088-2.088c-1.87-.501-9.396-.501-9.396-.501s-7.507-.01-9.396.501A3.007 3.007 0 00.527 6.205a31.247 31.247 0 00-.522 5.805 31.247 31.247 0 00.522 5.783 3.007 3.007 0 002.088 2.088c1.868.502 9.396.502 9.396.502s7.506 0 9.396-.502a3.007 3.007 0 002.088-2.088 31.247 31.247 0 00.5-5.783 31.247 31.247 0 00-.5-5.805zM9.609 15.601V8.408l6.264 3.602z"/>`),
        wa: svg(`<path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 00-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>`)
    };

    // Animated link builder
    const link = (href, label) =>
        `<li><a href="${href}" class="sp-ripple">${label}<span class="sp-link-arrow">→</span></a></li>`;

    const socialLink = (cls, icon, label, href = '#') =>
        `<a href="${href}" class="sp-footer-socials-link ${cls}" title="${label}" aria-label="${label}">${icon}</a>`;

    const footerHTML = `
    <footer class="sp-footer" role="contentinfo">
      <div class="sp-footer-inner">

        <!-- TOP -->
        <div class="sp-footer-top">
          <a href="index.html" class="sp-footer-brand" aria-label="SnapPrint Home">
            <img src="constants/images/logo.jpeg" alt="SnapPrint Logo" loading="lazy">
            <div>
              <h2>SnapPrint</h2>
              <span>India's No.1 Custom Printing Brand</span>
            </div>
          </a>

          <div class="sp-footer-trust">
            <div class="sp-trust-item">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
              Secure Payments
            </div>
            <div class="sp-trust-item">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg>
              Fast Delivery
            </div>
            <div class="sp-trust-item">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg>
              Premium Quality
            </div>
          </div>

          <div class="sp-footer-nl">
            <p>Get exclusive deals &amp; new arrivals.</p>
            <div class="sp-nl-form">
              <input type="email" placeholder="Enter your email" aria-label="Newsletter email">
              <button type="button" onclick="alert('Newsletter coming soon!')">Subscribe</button>
            </div>
          </div>
        </div>

        <!-- MAIN GRID -->
        <div class="sp-footer-grid">
          <!-- About -->
          <div class="sp-footer-col sp-footer-col-about">
            <h4>About SnapPrint</h4>
            <p>India's leading custom printing platform. Design and order personalized t-shirts, mugs, phone cases, photo frames, keychains, and more — premium quality, fast delivery across India.</p>
            <div class="sp-footer-socials">
              <a href="#" class="ig" title="Instagram" aria-label="Instagram">${icons.ig}</a>
              <a href="#" class="fb" title="Facebook" aria-label="Facebook">${icons.fb}</a>
              <a href="#" class="tw" title="Twitter / X" aria-label="Twitter">${icons.tw}</a>
              <a href="#" class="yt" title="YouTube" aria-label="YouTube">${icons.yt}</a>
              <a href="#" class="wa" title="WhatsApp" aria-label="WhatsApp">${icons.wa}</a>
            </div>
          </div>

          <!-- Categories -->
          <div class="sp-footer-col">
            <h4>Categories</h4>
            <ul>
              ${link("productCategory.html?category=T-Shirts","T-Shirts")}
              ${link("productCategory.html?category=Hoodies","Hoodies")}
              ${link("productCategory.html?category=Mugs%20and%20Sippers","Mugs and Sippers")}
              ${link("productCategory.html?category=Phone%20Accessories","Phone Accessories")}
              ${link("productCategory.html?category=Photo%20Frames","Photo Frames")}
              ${link("productCategory.html?category=Key%20Chains","Key Chains")}
              ${link("productCategory.html?category=Tote%20Bags","Tote Bags")}
              ${link("productCategory.html?category=Decor","Decor")}
            </ul>
          </div>

          <!-- My Account -->
          <div class="sp-footer-col">
            <h4>My Account</h4>
            <ul>
              ${link("profile.html","My Profile")}
              ${link("wishlist.html","My Wishlist")}
              ${link("profile.html#orders","My Orders")}
              ${link("profile.html#addresses","Saved Addresses")}
              ${link("searchPage.html","Browse All")}
            </ul>
          </div>

          <!-- Quick Links -->
          <div class="sp-footer-col">
            <h4>Quick Links</h4>
            <ul>
              ${link("index.html","Home")}
              ${link("searchPage.html","Search Products")}
              ${link("searchPage.html?offer=mega-fest","Offers &amp; Deals")}
              ${link("productCategory.html?category=Men%27s%20Special","Men's Special")}
              ${link("productCategory.html?category=Women%27s%20Special","Women's Special")}
            </ul>
          </div>

          <!-- Help -->
          <div class="sp-footer-col">
            <h4>Help &amp; Policies</h4>
            <ul>
              ${link("#","Contact Us")}
              ${link("#","Track Order")}
              ${link("#","FAQs")}
              ${link("#","Return Policy")}
              ${link("#","Shipping Info")}
              ${link("#","Privacy Policy")}
              ${link("#","Terms &amp; Conditions")}
            </ul>
          </div>
        </div>

        <!-- Mobile Social (compact, always visible on mobile) -->
        <div class="sp-mobile-social">
          <a href="#" class="ig" title="Instagram">${icons.ig}</a>
          <a href="#" class="fb" title="Facebook">${icons.fb}</a>
          <a href="#" class="tw" title="Twitter">${icons.tw}</a>
          <a href="#" class="yt" title="YouTube">${icons.yt}</a>
          <a href="#" class="wa" title="WhatsApp">${icons.wa}</a>
        </div>

        <!-- BOTTOM BAR -->
        <div class="sp-footer-bottom">
          <p>&copy; 2026 SnapPrint. All rights reserved. Made with ❤️ in India.</p>
          <div class="sp-footer-payments">
            <span class="sp-pay-badge">UPI</span>
            <span class="sp-pay-badge">VISA</span>
            <span class="sp-pay-badge">MASTERCARD</span>
            <span class="sp-pay-badge">NETBANKING</span>
            <span class="sp-pay-badge">COD</span>
          </div>
        </div>

      </div>
    </footer>`;

    // Inject
    const target = document.getElementById('site-footer');
    if (target) {
        target.outerHTML = footerHTML;
    } else {
        const existing = document.querySelector('footer.footer');
        if (existing) existing.outerHTML = footerHTML;
    }

    // Mobile accordion
    document.querySelectorAll('.sp-footer-col h4').forEach(h4 => {
        h4.addEventListener('click', () => {
            const col = h4.closest('.sp-footer-col');
            if (window.innerWidth <= 768) col.classList.toggle('sp-open');
        });
    });

    // Ripple on links
    document.querySelectorAll('.sp-ripple').forEach(a => {
        a.addEventListener('click', function (e) {
            const rect = this.getBoundingClientRect();
            const dot = document.createElement('span');
            dot.className = 'sp-ripple-dot';
            const size = Math.max(rect.width, rect.height);
            dot.style.cssText = `width:${size}px;height:${size}px;left:${e.clientX-rect.left-size/2}px;top:${e.clientY-rect.top-size/2}px`;
            this.appendChild(dot);
            setTimeout(() => dot.remove(), 600);
        });
    });

    // Color mobile social icons same as desktop
    document.querySelectorAll('.sp-mobile-social a').forEach(a => {
        const cls = a.className.split(' ').find(c => ['ig','fb','tw','yt','wa'].includes(c));
        const map = { ig:'#e1306c', fb:'#1877f2', tw:'#fff', yt:'#ff0000', wa:'#25d366' };
        if (cls && map[cls]) {
            a.style.borderColor = map[cls] + '33';
            a.style.color = map[cls];
        }
    });
})();
