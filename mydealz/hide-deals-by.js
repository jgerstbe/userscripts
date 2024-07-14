// ==UserScript==
// @name         MyDealz: Hide Deals By
// @version      2024-07-14
// @author       jgerstbe
// @description  Hide deals from specific brand from the deal list
// @match        https://www.mydealz.de/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=mydealz.de
// @grant        none
// @downloadURL  https://raw.githubusercontent.com/jgerstbe/userscripts/main/mydealz/hide-deals-by.js
// @updateURL    https://raw.githubusercontent.com/jgerstbe/userscripts/main/mydealz/hide-deals-by.js
// ==/UserScript==

(function() {
    'use strict';

    function log(text) {
        console.log(`[HideDealzBy] ${text}`);
    }

    function removeBrands() {
        const brandLinks = document.querySelectorAll('.text--color-brandPrimary.link');
        log(`Found ${brandLinks.length} brandLinks`);
        const blacklist = ['Voyage Privé'];

        for (const link of brandLinks) {
            const brand = link.text.trim();
            if (blacklist.includes(brand)) {
                log(`Deleting Deal for ${brand}`);
                link.closest('article').remove();
            }
        }
    }

    function observe(parent, target, callback) {
        // Get the target element
        const targetElement = document.querySelector(parent);

        // Define the observer options
        const observerOptions = {
            childList: true, // Observe changes to the child nodes of the target element
            subtree: true // Observe changes to the entire subtree, including descendants
        };

        // Create the observer
        const observer = new MutationObserver(function(mutations) {
            mutations.forEach(function(mutation) {
                // Check if new child elements of type 'article' have been added
                if (mutation.type === 'childList') {
                    const newElements = Array.from(mutation.target.querySelectorAll(target));
                    if (newElements.length > 0) {
                        callback(newElements);
                    }
                }
            });
        });

        // Start observing the target element
        observer.observe(targetElement, observerOptions);

    }

    // Articles are nested in '.listLayout-main', but 'body' seems to work more reliable
    observe('body', 'article', function(newArticles) {
        console.log('New article elements added:', newArticles.length);
        // You can perform additional actions here, such as updating the UI or triggering an event
        removeBrands();
    });

    removeBrands();
})();