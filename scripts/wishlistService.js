/**
 * SnapPrint Wishlist Service v2
 * - Keyed per user ID in localStorage (guest: 'guest')
 * - Persists to /api/wishlist.php (server JSON) when user is logged in
 * - Fires custom DOM events so any component can react reactively
 */

const wishlistService = (function () {

    function _userId() {
        const user = window.authService?.getCurrentUser();
        return user?.id ? String(user.id) : 'guest';
    }

    function _storageKey() {
        return `snapprint_wishlist_${_userId()}`;
    }

    function getAll() {
        try { return JSON.parse(localStorage.getItem(_storageKey()) || '[]'); }
        catch { return []; }
    }

    function getIds() {
        return getAll().map(p => String(p.productId || p.id));
    }

    function has(productId) {
        return getIds().includes(String(productId));
    }

    function _save(items) {
        localStorage.setItem(_storageKey(), JSON.stringify(items));

        // Persist to server JSON file if logged in
        const user = window.authService?.getCurrentUser();
        if (user?.id) {
            _syncToServer(user.id, items);
        }
    }

    async function _syncToServer(userId, items) {
        try {
            await fetch('api/wishlist.php', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ userId, items })
            });
        } catch (e) {
            // Silently fail — localStorage is the source of truth
            console.warn('[Wishlist] Server sync skipped (offline or API unavailable):', e.message);
        }
    }

    function _dispatch(name, detail) {
        window.dispatchEvent(new CustomEvent(name, { detail }));
    }

    function add(productId, itemType = 'product') {
        const user = window.authService?.getCurrentUser();
        if (!user) {
            _dispatch('wishlist:require-login', {});
            return false;
        }

        const items = getAll();
        const id = String(productId);
        if (items.find(p => String(p.productId || p.id) === id)) return true;

        items.push({ productId: id, itemType, savedAt: Date.now() });
        _save(items);
        _dispatch('wishlist:updated', { action: 'add', productId: id, itemType });
        return true;
    }

    function remove(productId) {
        const id = String(productId);
        const items = getAll().filter(p => String(p.productId || p.id) !== id);
        _save(items);
        _dispatch('wishlist:updated', { action: 'remove', productId: id });
    }

    function toggle(productId, itemType = 'product') {
        const id = String(productId);
        if (has(id)) { remove(id); return false; }
        else { return add(id, itemType); }
    }

    function clear() {
        _save([]);
        _dispatch('wishlist:updated', { action: 'clear' });
    }

    // Load from server into localStorage on login
    async function loadFromServer() {
        const user = window.authService?.getCurrentUser();
        if (!user?.id) return;
        try {
            const res = await fetch(`api/wishlist.php?userId=${user.id}`);
            if (!res.ok) return;
            const data = await res.json();
            if (Array.isArray(data.items) && data.items.length > 0) {
                localStorage.setItem(_storageKey(), JSON.stringify(data.items));
                _dispatch('wishlist:updated', { action: 'loaded' });
            }
        } catch (e) {
            console.warn('[Wishlist] Could not load from server:', e.message);
        }
    }

    return { getAll, getIds, has, add, remove, toggle, clear, loadFromServer };
})();

window.wishlistService = wishlistService;

// Auto-load from server when user logs in
window.addEventListener('auth:login-success', () => wishlistService.loadFromServer());

// Sync on page load if already logged in (important for cross-device or after clearing local storage)
if (window.authService && window.authService.getCurrentUser()) {
    wishlistService.loadFromServer();
}
