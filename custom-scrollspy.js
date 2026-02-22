// Maple-style scrollspy indicator for Mint theme
(function() {
  function init() {
    const tocContainer = document.getElementById('table-of-contents-content');

    if (!tocContainer) {
      setTimeout(init, 100);
      return;
    }

    // Create indicator element (like Maple does)
    const indicator = document.createElement('div');
    indicator.id = 'custom-scrollspy-indicator';
    indicator.style.cssText = `
      position: absolute;
      left: 7px;
      width: 2px;
      background: #B6E343;
      border-radius: 1px;
      transition: top 0.3s ease, height 0.3s ease;
      z-index: 2;
      pointer-events: none;
    `;
    tocContainer.appendChild(indicator);

    function updateIndicator() {
      // Find which TOC item Mintlify has made active (green text)
      const tocItems = document.querySelectorAll('.toc-item');
      let activeItem = null;

      tocItems.forEach(item => {
        const link = item.querySelector('a');
        if (link) {
          const color = window.getComputedStyle(link).color;
          // Check if it's the brand green
          if (color.includes('182, 227, 67') || color.includes('#B6E343')) {
            activeItem = item;
          }
        }
      });

      if (activeItem) {
        const rect = activeItem.getBoundingClientRect();
        const containerRect = tocContainer.getBoundingClientRect();
        const top = rect.top - containerRect.top + tocContainer.scrollTop;
        const height = rect.height;

        indicator.style.top = `${top + 6}px`;
        indicator.style.height = `${height - 12}px`;
        indicator.style.opacity = '1';
      } else {
        indicator.style.opacity = '0';
      }
    }

    // Update on scroll
    let ticking = false;
    window.addEventListener('scroll', () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          updateIndicator();
          ticking = false;
        });
        ticking = true;
      }
    }, { passive: true });

    // Initial update
    setTimeout(updateIndicator, 100);

    // Also check periodically for Mintlify's updates
    setInterval(updateIndicator, 200);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
