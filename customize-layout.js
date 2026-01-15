(function () {
    'use strict';

    // Track if we've moved the element to avoid unnecessary operations
    let hasMoved = false;
    let hasGroupedNavigation = false;

    // Add CSS to hide Mintlify's ::before and ::after pseudo-elements for titles
    const style = document.createElement('style');
    style.textContent = `
        /* Hide Mintlify's pseudo-element titles in navigation groups */
        .nav-user-intents::before,
        .nav-products::before,
        .nav-integrations::before,
        .nav-resources::before {
            display: none !important;
            content: none !important;
        }

        .nav-dropdown-products-selector-content {
            max-width: 700px !important;
            width: 700px !important;
        }
    `;
    document.head.appendChild(style);

    // Function to move the localization select to topbar right container
    function moveLocalizationSelect() {
        const localizationSelect = document.getElementById('localization-select-trigger');
        const topbarRightContainer = document.querySelector('.topbar-right-container');

        if (localizationSelect && topbarRightContainer) {
            // Check if already in the right place
            if (topbarRightContainer.contains(localizationSelect)) {
                hasMoved = true;
                return true;
            }

            // Move the element to the topbar right container
            topbarRightContainer.appendChild(localizationSelect);
            hasMoved = true;
            console.log('Localization select moved to topbar right container');
            return true;
        }
        return false;
    }

    // Function to group navigation items
    function groupNavigationItems() {
        // Find the product selector container
        const productSelector = document.querySelector('.nav-dropdown-products-selector-content, [role="menu"].nav-dropdown-products-selector-content');

        if (!productSelector) {
            return false;
        }

        // Check if already grouped by looking for our custom divs
        const alreadyGrouped = productSelector.querySelector('.nav-user-intents, .nav-products, .nav-integrations, .nav-resources');
        if (alreadyGrouped) {
            return false;
        }

        // Remove any existing titles/headings that Mintlify might have added
        const existingTitles = productSelector.querySelectorAll(':scope > h3, :scope > h4, :scope > h5, :scope > div:not(.link):not(a)');
        existingTitles.forEach(title => {
            // Remove any title elements (they don't contain link elements as direct children)
            const hasLinkChild = title.querySelector('a.link');
            if (!hasLinkChild) {
                console.log('Removing existing title:', title.textContent);
                title.remove();
            }
        });

        // Get all direct child anchor links
        const allLinks = Array.from(productSelector.querySelectorAll(':scope > a.link'));

        if (allLinks.length === 0) {
            return false;
        }

        // Define groupings based on product names or hrefs
        const groups = {
            'nav-user-intents': {
                title: 'ClickHouse docs',
                items: ['Home', 'Get started', 'Guides', 'Reference']
            },
            'nav-products': {
                title: 'Products',
                items: ['Cloud', 'ClickStack', 'chDB']
            },
            'nav-integrations': {
                title: 'Integrations',
                items: ['Language clients', 'Connectors', 'ClickPipes']
            },
            'nav-resources': {
                title: 'Resources',
                items: ['Support center', 'Development & contributing', 'Releases']
            }
        };

        // Function to check if a link matches a group item
        function matchesGroupItem(link, itemName) {
            const text = link.textContent.trim();
            const href = link.getAttribute('href') || '';

            // Normalize for comparison
            const normalizedText = text.toLowerCase();
            const normalizedItem = itemName.toLowerCase();

            // Only use exact text matches to avoid false positives
            if (normalizedText === normalizedItem) {
                return true;
            }

            // For href matching, only match if it's the primary path segment (first segment after domain)
            // This prevents "Releases" from matching "Cloud" when href is /releases/changelogs/cloud/
            const pathSegments = href.toLowerCase().split('/').filter(Boolean);
            const itemSlug = normalizedItem.replace(/\s+/g, '-');

            // Check if the item slug matches the first path segment exactly
            if (pathSegments.length > 0 && pathSegments[0] === itemSlug) {
                return true;
            }

            return false;
        }

        // Create group containers and organize links
        const createdGroups = {};
        const processedLinks = new Set();

        // First pass: create groups and identify which links belong where
        Object.keys(groups).forEach(groupClass => {
            const groupConfig = groups[groupClass];
            const groupItems = groupConfig.items;
            const matchingLinks = [];

            allLinks.forEach(link => {
                groupItems.forEach(itemName => {
                    if (matchesGroupItem(link, itemName) && !processedLinks.has(link)) {
                        matchingLinks.push(link);
                        processedLinks.add(link);
                    }
                });
            });

            if (matchingLinks.length > 0) {
                // Create group container
                const groupDiv = document.createElement('div');
                groupDiv.className = groupClass;

                createdGroups[groupClass] = {
                    div: groupDiv,
                    links: matchingLinks,
                    title: groupConfig.title
                };
            }
        });

        // Second pass: move links into their groups
        Object.keys(createdGroups).forEach(groupClass => {
            const group = createdGroups[groupClass];

            // Add title at the beginning if specified
            if (group.title) {
                const titleDiv = document.createElement('div');
                titleDiv.className = 'nav-group-title font-semibold text-xs uppercase mb-2 text-gray-500 dark:text-gray-400 px-3 py-2 tracking-wider';
                titleDiv.textContent = group.title;
                titleDiv.setAttribute('data-custom-title', 'true');
                group.div.appendChild(titleDiv);
                console.log('Added custom title:', group.title);
            }

            group.links.forEach(link => {
                group.div.appendChild(link);
            });
        });

        // Third pass: style each group as a column and append to product selector
        // Add column styling to each group
        const columnClasses = 'flex-1 md:flex-none md:w-1/4 md:px-2';

        ['nav-user-intents', 'nav-products', 'nav-integrations', 'nav-resources'].forEach(groupClass => {
            if (createdGroups[groupClass]) {
                createdGroups[groupClass].div.classList.add(...columnClasses.split(' '));
                productSelector.appendChild(createdGroups[groupClass].div);
            }
        });

        // Add flex layout to product selector (desktop only)
        productSelector.classList.add('md:flex', 'md:flex-row', 'md:gap-0');

        hasGroupedNavigation = true;
        console.log('Navigation items grouped successfully');
        return true;
    }

    // Function to add Beta tag to sidebar titles
    // Configure which titles should get the Beta tag
    const betaTitles = ['MongoDB'];

    function addBetaTagsToSidebarTitles() {
        // Find all h5 elements with id="sidebar-title" (querySelector gets all)
        const sidebarTitles = document.querySelectorAll('h5#sidebar-title');

        if (sidebarTitles.length === 0) {
            console.log('No sidebar title elements found');
            return false;
        }

        let addedCount = 0;

        sidebarTitles.forEach(sidebarTitle => {
            // Get just the text content without any child elements
            let titleText = '';
            for (let node of sidebarTitle.childNodes) {
                if (node.nodeType === Node.TEXT_NODE) {
                    titleText += node.textContent;
                }
            }
            titleText = titleText.trim();

            // Check if this title should have a Beta tag
            if (!betaTitles.includes(titleText)) {
                return; // Skip this one
            }

            // Check if tag already exists
            if (sidebarTitle.querySelector('.nav-tag-pill')) {
                return; // Skip, already has tag
            }

            // Create the Beta tag pill
            const tagPillSpan = document.createElement('span');
            tagPillSpan.className = 'nav-tag-pill flex items-center w-fit';

            const tagTextSpan = document.createElement('span');
            tagTextSpan.className = 'nav-tag-pill-text px-1 py-0.5 rounded-md text-[0.65rem] leading-tight font-bold text-primary dark:text-primary-light bg-primary/10';
            tagTextSpan.setAttribute('data-nav-tag', 'Beta');
            tagTextSpan.textContent = 'Beta';

            tagPillSpan.appendChild(tagTextSpan);

            // Add a space before the tag
            sidebarTitle.appendChild(document.createTextNode(' '));
            sidebarTitle.appendChild(tagPillSpan);

            console.log('Beta tag added to sidebar title:', titleText);
            addedCount++;
        });

        return addedCount > 0;
    }

    // Try to move elements immediately
    moveLocalizationSelect();
    groupNavigationItems();
    addBetaTagsToSidebarTitles();

    // Try again on DOMContentLoaded
    document.addEventListener('DOMContentLoaded', function() {
        moveLocalizationSelect();
        groupNavigationItems();
        addBetaTagsToSidebarTitles();
    });

    // Try again on window load (after all resources are loaded)
    window.addEventListener('load', function() {
        moveLocalizationSelect();
        groupNavigationItems();
        addBetaTagsToSidebarTitles();
    });

    // Keep watching for changes indefinitely - don't disconnect
    const observer = new MutationObserver(function(mutations) {
        const localizationSelect = document.getElementById('localization-select-trigger');
        const topbarRightContainer = document.querySelector('.topbar-right-container');

        // If element exists but is not in the right container, move it
        if (localizationSelect && topbarRightContainer && !topbarRightContainer.contains(localizationSelect)) {
            moveLocalizationSelect();
        }

        // Always try to group navigation items (function checks if already grouped)
        groupNavigationItems();

        // Always try to add beta tags to sidebar titles
        addBetaTagsToSidebarTitles();
    });

    // Start observing the document for changes
    observer.observe(document.documentElement, {
        childList: true,
        subtree: true
    });

})();