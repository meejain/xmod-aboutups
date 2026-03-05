/* eslint-disable */
/* global WebImporter */

/**
 * Parser for cards block
 *
 * Source: https://about.ups.com/us/en/home.html
 * Base Block: cards
 *
 * Block Structure (from block library):
 * - Row N: Image | Title + Description + Link (2 columns per card)
 *
 * Source HTML Pattern:
 * <div class="upspr-homepage-latest-stories upspr-three-column-teaser">
 *   <div class="upspr-stories-list__item">
 *     <div class="upspr-content-tile upspr-card">
 *       <div class="upspr-card_content">
 *         <a class="upspr-content-tile__link"><div class="upspr-content-tile__image"><img ...></div></a>
 *         <div class="upspr-content-tile__details">
 *           <span class="upspr-eyebrow-text">Category</span>
 *           <a class="upspr-content-tile__link"><h3>Title</h3><span class="upspr-description">Desc</span></a>
 *         </div>
 *       </div>
 *     </div>
 *   </div>
 * </div>
 *
 * Generated: 2026-03-05
 */
export default function parse(element, { document }) {
  // Find all card items
  // VALIDATED: Found <div class="upspr-content-tile upspr-card"> as individual card containers
  const cardElements = element.querySelectorAll('.upspr-content-tile');

  const cells = [];

  cardElements.forEach((card) => {
    // Extract card image
    // VALIDATED: Found <img class="upspr-tile-image"> inside .upspr-content-tile__image
    const img = card.querySelector('.upspr-tile-image')
      || card.querySelector('.upspr-content-tile__image img')
      || card.querySelector('img');

    // Extract card title and link
    // VALIDATED: Found <h3> inside <a class="upspr-content-tile__link">
    const titleLink = card.querySelector('.upspr-content-tile__details a.upspr-content-tile__link');
    const titleEl = card.querySelector('.upspr-content-tile__details h3')
      || card.querySelector('h3, h4');

    // Extract category eyebrow
    // VALIDATED: Found <span class="upspr-eyebrow-text"> inside .upspr-content-tile__topic
    const eyebrow = card.querySelector('.upspr-eyebrow-text');

    // Extract description
    // VALIDATED: Found <span class="upspr-description">
    const description = card.querySelector('.upspr-description');

    // Build the text content cell
    const textCell = document.createElement('div');

    if (titleLink && titleEl) {
      // Create linked title
      const link = document.createElement('a');
      link.href = titleLink.href;
      const strong = document.createElement('strong');
      strong.textContent = titleEl.textContent.trim();
      link.appendChild(strong);
      textCell.appendChild(link);
    } else if (titleEl) {
      const strong = document.createElement('strong');
      strong.textContent = titleEl.textContent.trim();
      textCell.appendChild(strong);
    }

    if (eyebrow) {
      const br1 = document.createElement('br');
      textCell.appendChild(br1);
      const eyebrowText = document.createTextNode(eyebrow.textContent.trim());
      textCell.appendChild(eyebrowText);
    }

    if (description) {
      const br2 = document.createElement('br');
      textCell.appendChild(br2);
      const descText = document.createTextNode(description.textContent.trim());
      textCell.appendChild(descText);
    }

    // Cards block: 2-column rows [image | text content]
    if (img) {
      cells.push([img, textCell]);
    }
  });

  // Create block using WebImporter utility
  const block = WebImporter.Blocks.createBlock(document, { name: 'Cards', cells });

  // Replace original element with structured block table
  element.replaceWith(block);
}
