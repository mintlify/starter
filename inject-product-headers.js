/**
 * Script to restructure the product dropdown into two independent columns
 * and inject "Product docs" and "Integrations" headers.
 */

(function () {
  'use strict';

  function createHeader(text) {
    const header = document.createElement('div');
    header.className = 'product-dropdown-header';
    header.textContent = text;
    header.setAttribute('data-header', text);
    return header;
  }

  function restructureMenu() {
    // Find the main menu container
    const menu = document.querySelector('[data-radix-menu-content]');
    if (!menu) return;

    // Find the grid/list container
    let container = menu.querySelector('[role="radiogroup"]');
    if (!container) container = menu.querySelector('.product-selector-radio-group');
    if (!container) container = menu.querySelector('[class*="product-selector"]');
    if (!container) container = menu;

    if (!container) return;

    // Prevent double execution
    if (container.querySelector('.product-col-left')) return;

    // Identify all items we want to organize
    const allLinks = Array.from(container.querySelectorAll('a'));
    if (allLinks.length === 0) return;

    // Define categories based on href
    // Note: We use specific paths to avoid partial matches on things like "/cloud/home"
    const leftColHrefs = [
      '/docs/common_pages/home', // Specific home link
      '/get-started',
      '/guides',
      '/reference',
      '/support'
    ];

    // Create column containers
    const leftCol = document.createElement('div');
    leftCol.className = 'product-col-left';

    const rightCol = document.createElement('div');
    rightCol.className = 'product-col-right';

    // Headers
    const productDocsHeader = createHeader('Product docs');
    const integrationsHeader = createHeader('Integrations');

    // Categorize and append items
    let hasProductDocs = false;
    let hasIntegrations = false;

    // Helper to find partial matches for flexibility
    const isLeft = (href) => leftColHrefs.some(path => href.includes(path));

    // We need to preserve event listeners, so we append the existing elements
    // But we need to group them.
    // Since we are moving elements, we need a stable list first.

    // Group items for the Right Column to insert headers correctly
    const rightItems = [];

    allLinks.forEach(link => {
      const href = link.getAttribute('href') || '';

      if (isLeft(href)) {
        leftCol.appendChild(link);
      } else {
        rightItems.push(link);
      }
    });

    // Populate Right Column with Headers
    if (rightItems.length > 0) {
      rightCol.appendChild(productDocsHeader);

      rightItems.forEach(link => {
        const href = link.getAttribute('href') || '';

        // Inject Integrations header before clickpipes
        if (href.includes('/clickpipes') && !hasIntegrations) {
          rightCol.appendChild(integrationsHeader);
          hasIntegrations = true;
        }

        rightCol.appendChild(link);
      });
    }

    // Clear the original container and append new columns
    // We strictly only want our two columns in there now
    // NOTE: This might be destructive if there are other elements like decorative pseudo-elements
    // managed by the framework, but usually safe for inner content of a radio group.

    // Move any non-link children that are NOT the ones we just moved?
    // The Mintlify structure usually just has the links. 
    // Let's be safe: we are replacing the CONTENT of the container.
    while (container.firstChild) {
      container.removeChild(container.firstChild);
    }

    container.appendChild(leftCol);
    container.appendChild(rightCol);

    // Add a class to container to signal it's been handled and for styling
    container.classList.add('product-selector-restructured');
  }

  // Watch for menu to appear
  const observer = new MutationObserver(() => {
    restructureMenu();
  });

  observer.observe(document.body, {
    childList: true,
    subtree: true
  });

  // Initial attempt
  restructureMenu();
})();