document.addEventListener('DOMContentLoaded', () => {
    const loader = document.getElementById('global-loader');
    
    if (loader) {
        // Prevent scrolling while loading
        document.body.style.overflow = 'hidden';
        document.body.style.touchAction = 'none';

        const preventScroll = (e) => {
            e.preventDefault();
            e.stopPropagation();
            return false;
        };

        window.addEventListener('wheel', preventScroll, { passive: false });
        window.addEventListener('touchmove', preventScroll, { passive: false });
        
        // Hide loader function
        const hideLoader = () => {
            loader.classList.add('hidden');
            document.body.style.overflow = '';
            document.body.style.touchAction = '';
            window.removeEventListener('wheel', preventScroll);
            window.removeEventListener('touchmove', preventScroll);
            
            // Remove from DOM after transition
            setTimeout(() => {
                if (loader.parentNode) {
                    loader.parentNode.removeChild(loader);
                }
            }, 600);
        };

        window.hideGlobalLoader = hideLoader;

        // When everything is fully loaded (images, stylesheets, scripts)
        window.addEventListener('load', hideLoader);

        // Fallback: hide loader after 5 seconds no matter what
        setTimeout(hideLoader, 5000);
    }
});
