/**
 * Client-side Search - Filter write-ups and projects
 */
(function () {
    function init() {
        const searchInput = document.querySelector('.search-input');
        if (!searchInput) return;

        const searchableItems = document.querySelectorAll('[data-searchable]');

        searchInput.addEventListener('input', (e) => {
            const query = e.target.value.toLowerCase().trim();

            searchableItems.forEach(item => {
                const text = item.textContent.toLowerCase();
                const matches = !query || text.includes(query);
                item.style.display = matches ? '' : 'none';
            });

            // Show "no results" message if needed
            document.querySelectorAll('.search-section').forEach(section => {
                const visibleItems = section.querySelectorAll('[data-searchable]:not([style*="display: none"])');
                const noResults = section.querySelector('.no-results');
                if (noResults) {
                    noResults.style.display = visibleItems.length === 0 && query ? '' : 'none';
                }
            });
        });
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
