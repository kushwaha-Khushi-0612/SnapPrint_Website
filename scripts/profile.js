/**
 * Profile Page Logic
 * Handles checking auth session, loading user data, and updating profile info.
 */

document.addEventListener('DOMContentLoaded', () => {
    // 1. Check Auth state
    const user = window.authService.getCurrentUser();
    if (!user) {
        // Not logged in, bounds back to homepage
        window.location.href = 'index.html';
        return;
    }

    // 2. Load basic info
    const greeting = document.getElementById('profile-greeting');
    const phoneView = document.getElementById('profile-phone');
    const inputName = document.getElementById('profile-name');
    const inputEmail = document.getElementById('profile-email');
    const inputPhone = document.getElementById('profile-phone-input');
    const inputAddress = document.getElementById('profile-address');
    const inputPincode = document.getElementById('profile-pincode');

    const updateView = (u) => {
        greeting.textContent = u.name ? `Welcome back, ${u.name.split(' ')[0]}!` : 'Welcome back!';
        phoneView.textContent = u.phone ? `+91 ${u.phone.substring(0,2)}******${u.phone.substring(8)}` : '';
        inputName.value = u.name || '';
        inputEmail.value = u.email || '';
        inputPhone.value = u.phone || '';
        inputAddress.value = u.address || '';
        inputPincode.value = u.pincode || '';
    }

    updateView(user);

    // 3. Sidebar Navigation Logic
    const navItems = document.querySelectorAll('.nav-item');
    const contentViews = document.querySelectorAll('.content-view');

    navItems.forEach(item => {
        item.addEventListener('click', () => {
            const targetViewId = `view-${item.dataset.view}`;
            
            // Update active sidebar item
            navItems.forEach(i => i.classList.remove('active'));
            item.classList.add('active');

            // Toggle views
            contentViews.forEach(view => {
                if (view.id === targetViewId) {
                    view.classList.add('active');
                } else {
                    view.classList.remove('active');
                }
            });

            // Smooth scroll to top on mobile
            if (window.innerWidth <= 900) {
                window.scrollTo({ top: 0, behavior: 'smooth' });
            }
        });
    });

    // 4. Setup Edit Toggle
    const editBtn = document.getElementById('edit-profile-btn');
    const cancelBtn = document.getElementById('cancel-edit-btn');
    const formActions = document.querySelector('.form-actions');
    const profileForm = document.getElementById('profile-form');
    const inputsToEdit = [inputName, inputEmail, inputAddress, inputPincode]; // We won't allow phone edit in this mock

    editBtn.addEventListener('click', (e) => {
        e.preventDefault();
        inputsToEdit.forEach(i => i.disabled = false);
        formActions.style.display = 'flex';
        editBtn.style.display = 'none';
        inputName.focus();
    });

    cancelBtn.addEventListener('click', (e) => {
        e.preventDefault();
        inputsToEdit.forEach(i => i.disabled = true);
        formActions.style.display = 'none';
        editBtn.style.display = 'block';
        updateView(window.authService.getCurrentUser()); // Reset logic
    });

    // 5. Save form
    profileForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const saveBtn = document.getElementById('save-profile-btn');
        const ogText = saveBtn.textContent;
        saveBtn.textContent = 'Saving...';
        saveBtn.disabled = true;

        try {
            const updatedUser = await window.authService.updateProfile({
                name: inputName.value.trim(),
                email: inputEmail.value.trim(),
                address: inputAddress.value.trim(),
                pincode: inputPincode.value.trim()
            });

            updateView(updatedUser);
            inputsToEdit.forEach(i => i.disabled = true);
            formActions.style.display = 'none';
            editBtn.style.display = 'block';
            
            // Dispatch event so Header might update immediately if it showed name
            window.dispatchEvent(new CustomEvent('auth:profile-updated'));

        } catch (error) {
            console.error(error);
            alert('Failed to save profile!');
        } finally {
            saveBtn.textContent = ogText;
            saveBtn.disabled = false;
        }
    });

    // 6. Setup Logout
    const logoutBtn = document.getElementById('logout-btn');
    logoutBtn.addEventListener('click', () => {
        window.authService.logout();
        window.dispatchEvent(new CustomEvent('auth:logout'));
        window.location.href = 'index.html';
    });

    // 7. Render Mini Wishlist
    const renderMiniWishlist = async () => {
        const view = document.getElementById('view-wishlist');
        if (!view) return;

        const savedItems = window.wishlistService?.getAll() || [];
        if (savedItems.length === 0) {
            view.innerHTML = `
                <div class="profile-card placeholder-card">
                    <img src="constants/icons/heart.svg" alt="" class="placeholder-icon">
                    <h3>My Wishlist</h3>
                    <p>Your wishlist is currently empty.</p>
                    <a href="index.html" class="btn-primary" style="text-decoration: none; display: inline-block; margin-top: 16px;">Browse Products</a>
                </div>
            `;
            return;
        }

        view.innerHTML = `<div class="profile-card"><div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:16px;"><h3>Saved Items (${savedItems.length})</h3><a href="wishlist.html" style="color:#ff4d6d; text-decoration:none; font-weight:600; font-size:14px;">View All</a></div><div id="profile-wl-grid" style="display:grid; grid-template-columns:repeat(auto-fill, minmax(240px, 1fr)); gap:12px;"></div></div>`;
        const grid = document.getElementById('profile-wl-grid');
        
        const db = window.dataService?.productsDB || await window.dataService?.init();
        const allProducts = await window.dataService?.getAllProductsFlattened() || [];
        let allSubcategories = [];
        if (db?.categories) {
            db.categories.forEach(cat => {
                if (cat.sections) cat.sections.forEach(sec => allSubcategories.push(...sec.subcategories));
                if (cat.subcategories) allSubcategories.push(...cat.subcategories);
            });
        }

        // Show max 4 recent items
        const recent = savedItems.sort((a,b) => b.savedAt - a.savedAt).slice(0, 4);

        recent.forEach(saved => {
            let itemData = saved.itemType === 'subcategory' ? allSubcategories.find(s => String(s.id) === String(saved.productId)) : allProducts.find(p => String(p.id) === String(saved.productId));
            itemData = itemData || saved;

            const isSub = saved.itemType === 'subcategory';
            const link = isSub ? `searchPage.html?subcategory=${saved.productId}` : `productDetails.html?id=${saved.productId}`;

            grid.innerHTML += `
                <a href="${link}" style="text-decoration:none; color:inherit; display:flex; gap:12px; align-items:center; background:#f9fafb; padding:10px; border-radius:10px; border:1px solid #eaeaea; transition:all 0.2s;">
                    <img src="${itemData.image || 'constants/products/placeholder.jpg'}" style="width:64px; height:64px; object-fit:cover; border-radius:6px; flex-shrink:0;">
                    <div style="flex:1; min-width:0;">
                        <div style="font-size:10px; font-weight:600; text-transform:uppercase; letter-spacing:0.5px; color:#888;">${isSub ? 'Collection' : 'Product'}</div>
                        <div style="font-weight:600; font-size:14px; margin-top:2px; white-space:nowrap; overflow:hidden; text-overflow:ellipsis; color:#111;">${itemData.name || itemData.title || 'Unknown'}</div>
                    </div>
                </a>
            `;
        });
    };

    renderMiniWishlist();
    window.addEventListener('wishlist:updated', renderMiniWishlist);

    function showToast(message, type = 'success') {
        const toastId = 'toast-container-notification';
        let container = document.getElementById(toastId);
        if (!container) {
            container = document.createElement('div');
            container.id = toastId;
            container.style.cssText = 'position: fixed; bottom: 24px; left: 50%; transform: translateX(-50%); z-index: 999999; display: flex; flex-direction: column; gap: 12px; pointer-events: none; width: 90%; max-width: 400px;';
            document.body.appendChild(container);
        }
        
        const toast = document.createElement('div');
        const bgColor = type === 'success' ? 'linear-gradient(135deg, #10b981, #059669)' : 
                        type === 'error' ? 'linear-gradient(135deg, #ef4444, #dc2626)' : 
                        'linear-gradient(135deg, #3b82f6, #2563eb)';
        
        toast.style.cssText = `background: ${bgColor}; color: white; padding: 14px 20px; border-radius: 12px; font-family: Inter, sans-serif; font-size: 14px; font-weight: 500; box-shadow: 0 10px 30px -5px rgba(0,0,0,0.3); opacity: 0; transform: translateY(30px) scale(0.95); transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275); display: flex; align-items: center; gap: 12px; backdrop-filter: blur(10px);`;
        
        const icon = document.createElement('span');
        icon.innerHTML = type === 'success' ? '✓' : type === 'error' ? '✕' : 'ℹ';
        icon.style.cssText = `background: rgba(255,255,255,0.25); width: 26px; height: 26px; display: inline-flex; align-items: center; justify-content: center; border-radius: 50%; font-weight: bold; font-size: 14px; flex-shrink: 0;`;
        
        toast.appendChild(icon);
        toast.appendChild(document.createTextNode(message));
        container.appendChild(toast);
        
        requestAnimationFrame(() => {
            toast.style.opacity = '1';
            toast.style.transform = 'translateY(0) scale(1)';
        });
        
        setTimeout(() => {
            toast.style.opacity = '0';
            toast.style.transform = 'translateY(20px) scale(0.95)';
            setTimeout(() => toast.remove(), 400);
        }, 3500);
    }

    function showConfirmModal(title, message, onConfirm) {
        const overlay = document.createElement('div');
        overlay.style.cssText = `position: fixed; inset: 0; background: rgba(0,0,0,0.4); backdrop-filter: blur(8px); z-index: 999999; display: flex; align-items: center; justify-content: center; padding: 20px; opacity: 0; transition: opacity 0.3s ease;`;
        
        const modal = document.createElement('div');
        modal.style.cssText = `background: white; width: 100%; max-width: 380px; border-radius: 20px; padding: 24px; box-shadow: 0 25px 50px -12px rgba(0,0,0,0.25); transform: translateY(20px) scale(0.95); transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275); font-family: Inter, sans-serif;`;
        
        modal.innerHTML = `
            <div style="display:flex; justify-content:center; margin-bottom:16px;">
                <div style="width: 56px; height: 56px; border-radius: 50%; background: #fee2e2; color: #ef4444; display:flex; align-items:center; justify-content:center;">
                    <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/><line x1="10" x2="10" y1="11" y2="17"/><line x1="14" x2="14" y1="11" y2="17"/></svg>
                </div>
            </div>
            <h3 style="margin: 0 0 8px 0; text-align: center; font-size: 18px; color: #111;">${title}</h3>
            <p style="margin: 0 0 24px 0; text-align: center; font-size: 14px; color: #666; line-height: 1.5;">${message}</p>
            <div style="display: flex; gap: 12px;">
                <button id="confirm-cancel" style="flex:1; padding: 12px; border-radius: 10px; border: 1px solid #e5e7eb; background: #fff; color: #374151; font-weight: 600; font-size: 14px; cursor: pointer; transition: background 0.2s;">Cancel</button>
                <button id="confirm-ok" style="flex:1; padding: 12px; border-radius: 10px; border: none; background: linear-gradient(135deg, #ef4444, #dc2626); color: #fff; font-weight: 600; font-size: 14px; cursor: pointer; transition: opacity 0.2s; box-shadow: 0 4px 12px rgba(239, 68, 68, 0.3);">Delete</button>
            </div>
        `;
        
        overlay.appendChild(modal);
        document.body.appendChild(overlay);
        
        requestAnimationFrame(() => {
            overlay.style.opacity = '1';
            modal.style.transform = 'translateY(0) scale(1)';
        });
        
        const close = () => {
            overlay.style.opacity = '0';
            modal.style.transform = 'translateY(20px) scale(0.95)';
            setTimeout(() => overlay.remove(), 300);
        };
        
        modal.querySelector('#confirm-cancel').addEventListener('click', close);
        modal.querySelector('#confirm-ok').addEventListener('click', () => {
            close();
            onConfirm();
        });
    }

    // 8. Render My Designs
    const renderMyDesigns = () => {
        const view = document.getElementById('view-designs');
        if (!view) return;

        let savedDesigns = [];
        try {
            savedDesigns = JSON.parse(localStorage.getItem('my_custom_designs') || '[]');
            const now = Date.now();
            // Filter out expired ones
            const validDesigns = savedDesigns.filter(d => d.expiry > now);
            if (validDesigns.length !== savedDesigns.length) {
                savedDesigns = validDesigns;
                localStorage.setItem('my_custom_designs', JSON.stringify(savedDesigns));
            }
        } catch (e) { }

        if (savedDesigns.length === 0) {
            view.innerHTML = `
                <div class="profile-card placeholder-card">
                    <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1" stroke-linecap="round" stroke-linejoin="round" class="placeholder-icon" style="color: #8b5cf6;"><path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"/><path d="m15 5 4 4"/></svg>
                    <h3>My Custom Designs</h3>
                    <p>Start creating your first design today!</p>
                </div>
            `;
            return;
        }

        let html = `<div class="profile-card"><div style="margin-bottom:16px;"><h3>My Custom Designs</h3><p style="color:#666; font-size:13px; margin-top:4px;">Designs are saved for 3 days.</p></div><div style="display:grid; grid-template-columns:repeat(auto-fill, minmax(200px, 1fr)); gap:16px;">`;

        savedDesigns.forEach(design => {
            html += `
                <div class="design-card" style="border:1px solid #eaeaea; border-radius:12px; overflow:hidden; background:#fff; transition: transform 0.2s; cursor:pointer;" onmouseover="this.style.transform='translateY(-2px)'" onmouseout="this.style.transform='none'">
                    <div style="position:relative; width:100%; padding-top:100%; background:#f9fafb;">
                        <img src="${design.preview}" alt="Design Preview" style="position:absolute; top:0; left:0; width:100%; height:100%; object-fit:contain; padding:12px;">
                    </div>
                    <div style="padding:12px;">
                        <h4 style="margin:0; font-size:14px; color:#111;">${design.title || 'Custom Product'}</h4>
                        <div style="margin-top:12px; display:flex; gap:8px;">
                            <a href="productDetails.html?id=${design.productId}&resume=${design.id}" class="btn-primary" style="flex:1; padding:8px; font-size:12px; text-decoration:none; text-align:center; border-radius:6px;">Edit Design</a>
                            <button class="btn-delete-design" data-id="${design.id}" style="padding:8px 12px; background:#fee2e2; color:#ef4444; border:none; border-radius:6px; cursor:pointer; display:flex; align-items:center; justify-content:center;" title="Delete Design">
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/><line x1="10" x2="10" y1="11" y2="17"/><line x1="14" x2="14" y1="11" y2="17"/></svg>
                            </button>
                        </div>
                    </div>
                </div>
            `;
        });

        html += `</div></div>`;
        view.innerHTML = html;

        const deleteBtns = view.querySelectorAll('.btn-delete-design');
        deleteBtns.forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                const idToRemove = btn.dataset.id;
                showConfirmModal(
                    "Delete Design?", 
                    "This action cannot be undone. Are you sure you want to permanently delete this custom design?",
                    () => {
                        let stored = JSON.parse(localStorage.getItem('my_custom_designs') || '[]');
                        stored = stored.filter(d => d.id !== idToRemove);
                        localStorage.setItem('my_custom_designs', JSON.stringify(stored));
                        renderMyDesigns(); // Re-render instantly
                        showToast("Design deleted successfully!", "success");
                    }
                );
            });
        });
    };

    renderMyDesigns();
});
