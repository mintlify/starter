/**
 * Script to restructure the product dropdown into two independent columns
 * and inject "Product docs" and "Integrations" headers.
 */

(function () {
  'use strict';

  function createHeader(text) {
    const header = document.createElement('div');
    const slug = getSlug(text);
    header.className = `product-dropdown-header product-dropdown-header-${slug}`;
    header.textContent = text;
    header.setAttribute('data-header', text);
    return header;
  }

  function getSlug(text) {
    return text.trim().toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]/g, '');
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

    // Define categories based on slugs (generated from text content)
    // "Home", "Get Started", "Guides", "Reference", "Support center"
    const leftCategories = [
      'home',
      'get-started',
      'guides',
      'reference',
      'support-center'
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
    let hasIntegrations = false;

    // Group items for the Right Column to insert headers correctly
    const rightItems = [];

    allLinks.forEach(link => {
      // Extract title text only (not the description)
      // Try the title class first, then fall back to first paragraph, then link text
      const titleEl = link.querySelector('.nav-dropdown-products-selector-item-title') ||
        link.querySelector('.flex.flex-col > p:first-child') ||
        link.querySelector('p:first-child');
      const text = titleEl ? titleEl.textContent : (link.textContent || '');
      const slug = getSlug(text);

      // Add unique class
      if (slug) {
        link.classList.add(`product-link-${slug}`);
      }

      // Categorize based on slug
      if (leftCategories.includes(slug)) {
        leftCol.appendChild(link);
      } else {
        rightItems.push({ link, slug });
      }
    });

    // Populate Right Column with Headers
    if (rightItems.length > 0) {
      rightCol.appendChild(productDocsHeader);

      rightItems.forEach(item => {
        const { link, slug } = item;
        const href = link.getAttribute('href') || '';

        // Inject Integrations header before clickpipes or if slug suggests it
        // Keeping href check for 'clickpipes' as a fallback or if text is different,
        // but let's try to rely on slug if possible. 
        // Assuming "ClickPipes" -> "clickpipes"
        if ((slug === 'clickpipes') && !hasIntegrations) {
          rightCol.appendChild(integrationsHeader);
          hasIntegrations = true;
        }

        rightCol.appendChild(link);
      });
    }

    // Clear the original container and append new columns
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