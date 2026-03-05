/* eslint-disable */
/* global WebImporter */

/**
 * Parser for columns block
 *
 * Source: https://about.ups.com/us/en/home.html
 * Base Block: columns
 *
 * Block Structure (from block library):
 * - Row N: Column 1 content | Column 2 content (2 columns)
 *
 * Source HTML Patterns:
 *
 * Pattern 1 - Facts/Stats (vertical-hero):
 * <div class="upspr-heroimage vertical-hero">
 *   <picture>...<img src="..."></picture>
 *   <div class="upspr-facts_vertical">
 *     <ul class="upspr-facts">
 *       <li><h4>~460K</h4><p>Employees</p></li>
 *       ...
 *     </ul>
 *     <a class="btn btn-primary">CTA</a>
 *   </div>
 * </div>
 *
 * Pattern 2 - Section Card (upspr-xd-card):
 * <div class="upspr-xd-card left">
 *   <div class="row">
 *     <div class="col-lg-6"><picture>...<img></picture></div>
 *     <div class="col-lg-6 upspr-xd-card_container">
 *       <div class="upspr-xd-card_eyebrow">EYEBROW</div>
 *       <h2>Heading</h2>
 *       <p>Description</p>
 *       <a class="btn">CTA</a>
 *     </div>
 *   </div>
 * </div>
 *
 * Generated: 2026-03-05
 */
export default function parse(element, { document }) {
  const cells = [];

  // Detect which pattern we're dealing with
  // VALIDATED: vertical-hero class found on facts section
  const isFactsPattern = element.classList.contains('vertical-hero')
    || element.querySelector('.upspr-facts');

  // VALIDATED: upspr-xd-card class found on section card
  const isSectionCard = element.classList.contains('upspr-xd-card')
    || element.querySelector('.upspr-xd-card_content');

  if (isFactsPattern) {
    // Pattern 1: Facts/Stats with image + stats list
    const img = element.querySelector('picture img') || element.querySelector('img');

    // Build stats content cell
    const statsCell = document.createElement('div');

    // VALIDATED: Found <ul class="upspr-facts"> with <li class="upspr-facts__content">
    const factItems = element.querySelectorAll('.upspr-facts__content');
    factItems.forEach((item, idx) => {
      const value = item.querySelector('.upspr-facts__content--fact');
      const label = item.querySelector('.upspr-facts__content--label');
      if (value) {
        const strong = document.createElement('strong');
        strong.textContent = value.textContent.trim();
        statsCell.appendChild(strong);
      }
      if (label) {
        const br = document.createElement('br');
        statsCell.appendChild(br);
        const labelText = document.createTextNode(label.textContent.trim());
        statsCell.appendChild(labelText);
      }
      if (idx < factItems.length - 1) {
        statsCell.appendChild(document.createElement('br'));
        statsCell.appendChild(document.createElement('br'));
      }
    });

    // Extract CTA
    // VALIDATED: Found <a class="btn btn-primary"> inside .upspr-read-the-story
    const cta = element.querySelector('.upspr-read-the-story a')
      || element.querySelector('a.btn');
    if (cta) {
      statsCell.appendChild(document.createElement('br'));
      statsCell.appendChild(document.createElement('br'));
      statsCell.appendChild(cta.cloneNode(true));
    }

    if (img) {
      cells.push([img, statsCell]);
    }
  } else if (isSectionCard) {
    // Pattern 2: Section card with image + text content
    // VALIDATED: Found <picture> in first .col-lg-6
    const img = element.querySelector('picture img') || element.querySelector('img');

    // Build text content cell
    const textCell = document.createElement('div');

    // VALIDATED: Found <div class="upspr-xd-card_eyebrow">
    const eyebrow = element.querySelector('.upspr-xd-card_eyebrow');
    if (eyebrow) {
      const eyebrowText = document.createTextNode(eyebrow.textContent.trim());
      textCell.appendChild(eyebrowText);
      textCell.appendChild(document.createElement('br'));
    }

    // VALIDATED: Found <h2> inside .upspr-xd-card_content
    const heading = element.querySelector('.upspr-xd-card_content h2')
      || element.querySelector('h2, h3');
    if (heading) {
      const strong = document.createElement('strong');
      strong.textContent = heading.textContent.trim();
      textCell.appendChild(strong);
      textCell.appendChild(document.createElement('br'));
    }

    // VALIDATED: Found <p> inside .upspr-xd-card_content
    const desc = element.querySelector('.upspr-xd-card_content p');
    if (desc) {
      const descText = document.createTextNode(desc.textContent.trim());
      textCell.appendChild(descText);
      textCell.appendChild(document.createElement('br'));
    }

    // VALIDATED: Found <a class="btn btn-secondary"> as CTA
    const cta = element.querySelector('.upspr-xd-card_content a.btn')
      || element.querySelector('a.btn');
    if (cta) {
      textCell.appendChild(cta.cloneNode(true));
    }

    if (img) {
      cells.push([img, textCell]);
    }
  } else {
    // Fallback: Generic two-column layout
    const children = element.querySelectorAll(':scope > div');
    if (children.length >= 2) {
      cells.push([children[0], children[1]]);
    }
  }

  // Create block using WebImporter utility
  const block = WebImporter.Blocks.createBlock(document, { name: 'Columns', cells });

  // Replace original element with structured block table
  element.replaceWith(block);
}
