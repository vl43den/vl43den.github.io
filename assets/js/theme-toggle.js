/**
 * Theme Toggle - Dark/Light mode with localStorage persistence
 */
(function () {
    const STORAGE_KEY = 'theme-preference';

    function getPreferredTheme() {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored) return stored;
        return window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark';
    }

    function setTheme(theme) {
        document.documentElement.classList.toggle('light-theme', theme === 'light');
        localStorage.setItem(STORAGE_KEY, theme);
        updateToggleIcon(theme);
    }

    function updateToggleIcon(theme) {
        const toggle = document.querySelector('.theme-toggle');
        if (toggle) {
            const icon = toggle.querySelector('.icon');
            if (icon) {
                icon.textContent = theme === 'light' ? '🌙' : '☀️';
            }
        }
    }

    function init() {
        const theme = getPreferredTheme();
        setTheme(theme);

        const toggle = document.querySelector('.theme-toggle');
        if (toggle) {
            toggle.addEventListener('click', () => {
                const current = document.documentElement.classList.contains('light-theme') ? 'light' : 'dark';
                setTheme(current === 'light' ? 'dark' : 'light');
            });
        }

        // Listen for system preference changes
        window.matchMedia('(prefers-color-scheme: light)').addEventListener('change', (e) => {
            if (!localStorage.getItem(STORAGE_KEY)) {
                setTheme(e.matches ? 'light' : 'dark');
            }
        });
    }

    // Initialize on DOM ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
