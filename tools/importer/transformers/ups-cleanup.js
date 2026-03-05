/* eslint-disable */
/* global WebImporter */

/**
 * Transformer for UPS About website cleanup
 * Purpose: Remove non-content elements (header, footer, modals, overlays, tracking)
 * Applies to: about.ups.com (all templates)
 * Tested: /us/en/home.html
 * Generated: 2026-03-05
 *
 * SELECTORS EXTRACTED FROM:
 * - Captured DOM during migration workflow (cleaned.html)
 */

const TransformHook = {
  beforeTransform: 'beforeTransform',
  afterTransform: 'afterTransform',
};

export default function transform(hookName, element, payload) {
  if (hookName === TransformHook.beforeTransform) {
    // Remove header experience fragment
    // EXTRACTED: Found <div class="cmp-experiencefragment cmp-experiencefragment--upspr-header-fragment">
    WebImporter.DOMUtils.remove(element, [
      '.cmp-experiencefragment--upspr-header-fragment',
    ]);

    // Remove footer experience fragment
    // EXTRACTED: Found <div class="cmp-experiencefragment cmp-experiencefragment--upspr-footer-fragment">
    WebImporter.DOMUtils.remove(element, [
      '.cmp-experiencefragment--upspr-footer-fragment',
    ]);

    // Remove language selector modal
    // EXTRACTED: Found <div class="modal fade upspr-lang-select" id="upspr-language-selector-modal">
    WebImporter.DOMUtils.remove(element, [
      '#upspr-language-selector-modal',
    ]);

    // Remove overlay
    // EXTRACTED: Found <div class="upspr-overlay">
    WebImporter.DOMUtils.remove(element, [
      '.upspr-overlay',
      '.upspr-overlay-global',
    ]);

    // Remove search header elements
    // EXTRACTED: Found <div class="upspr-search-header">
    WebImporter.DOMUtils.remove(element, [
      '.upspr-search-header',
    ]);

    // Remove hidden inputs used by AEM authoring
    // EXTRACTED: Found multiple <input> elements for state management
    WebImporter.DOMUtils.remove(element, [
      '#authorModeState',
      '#threeColumnTeaserResource',
      '#searchResultsPagePathId',
      '#noSearchResultsPageId',
      '#upsStoriesPathId',
      '#site-name',
    ]);
  }

  if (hookName === TransformHook.afterTransform) {
    // Remove remaining non-content elements
    WebImporter.DOMUtils.remove(element, [
      'iframe',
      'link',
      'noscript',
      'source',
    ]);

    // Clean up tracking attributes
    const allElements = element.querySelectorAll('*');
    allElements.forEach((el) => {
      el.removeAttribute('onclick');
      el.removeAttribute('data-track');
    });
  }
}
