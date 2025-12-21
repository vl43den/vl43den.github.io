/**
 * Loading Screen - Fade out when page is ready
 */
(function () {
    function hideLoader() {
        const loader = document.querySelector('.loading-screen');
        if (loader) {
            loader.classList.add('hidden');
            // Remove from DOM after animation
            setTimeout(() => {
                loader.remove();
            }, 500);
        }
    }

    // Hide loader when everything is loaded
    window.addEventListener('load', hideLoader);

    // Fallback: hide after 3 seconds max
    setTimeout(hideLoader, 3000);
})();
