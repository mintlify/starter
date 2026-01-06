/**
 * Script to inject "Product docs" and "Integrations" headers into the product dropdown
 */

(function() {
  'use strict';

  function createHeader(text) {
    const header = document.createElement('div');
    header.className = 'product-dropdown-header';
    header.textContent = text;
    header.setAttribute('data-header', text);
    return header;
  }

  function injectHeaders() {
    const menu = document.querySelector('[data-radix-menu-content]');
    if (!menu) return;

    let grid = menu.querySelector('[role="radiogroup"]');
    if (!grid) grid = menu.querySelector('.product-selector-radio-group');
    if (!grid) grid = menu.querySelector('[class*="product-selector"]');
    if (!grid) grid = menu;

    if (!grid) return;

    // Don't inject if already done
    if (grid.querySelector('.product-dropdown-header')) return;

    // Find Cloud and ClickPipes links
    const cloudLink = grid.querySelector('a[href*="/cloud"]');
    const clickPipesLink = grid.querySelector('a[href*="/clickpipes"]');

    // Insert "Product docs" header before Cloud
    if (cloudLink) {
      const productDocsHeader = createHeader('Product docs');
      grid.insertBefore(productDocsHeader, cloudLink);
    }

    // Insert "Integrations" header before ClickPipes
    if (clickPipesLink) {
      const integrationsHeader = createHeader('Integrations');
      grid.insertBefore(integrationsHeader, clickPipesLink);
    }
  }

  // Watch for menu to appear
  const observer = new MutationObserver(() => {
    injectHeaders();
  });

  observer.observe(document.body, {
    childList: true,
    subtree: true
  });

  injectHeaders();
})();