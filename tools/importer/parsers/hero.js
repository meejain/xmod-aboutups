/* eslint-disable */
/* global WebImporter */

/**
 * Parser for hero block
 *
 * Source: https://about.ups.com/us/en/home.html
 * Base Block: hero
 *
 * Block Structure (from block library):
 * - Row 1: Background image (optional)
 * - Row 2: Content (eyebrow, heading, description, CTA)
 *
 * Source HTML Pattern:
 * <div class="upspr-heroimage">
 *   <picture>...<img src="..."></picture>
 *   <div class="upspr-heroimage_content">
 *     <div class="upspr-heroimage_msg">
 *       <a class="upspr-eyebrow-link"><span class="upspr-eyebrow-text">EYEBROW</span></a>
 *       <h4 class="upspr-heroimage_msg--title">Title</h4>
 *       <p>Description</p>
 *       <div class="upspr-read-the-story"><a class="btn btn-primary">CTA</a></div>
 *     </div>
 *   </div>
 * </div>
 *
 * Generated: 2026-03-05
 */
export default function parse(element, { document }) {
  // Extract background image
  // VALIDATED: Found <picture> with <img> as direct children of .upspr-heroimage
  const heroImg = element.querySelector('picture img') || element.querySelector('img');

  // Extract eyebrow text
  // VALIDATED: Found <span class="upspr-eyebrow-text"> inside .upspr-heroimage_msg
  const eyebrow = element.querySelector('.upspr-eyebrow-text');

  // Extract heading
  // VALIDATED: Found <h4 class="upspr-heroimage_msg--title">
  const heading = element.querySelector('.upspr-heroimage_msg--title')
    || element.querySelector('h4, h3, h2, h1');

  // Extract description
  // VALIDATED: Found <p> inside .upspr-heroimage_msg (direct text paragraph)
  const description = element.querySelector('.upspr-heroimage_msg > p')
    || element.querySelector('.upspr-heroimage_msg p');

  // Extract CTA link
  // VALIDATED: Found <a class="btn btn-primary"> inside .upspr-read-the-story
  const cta = element.querySelector('.upspr-read-the-story a')
    || element.querySelector('a.btn');

  // Build cells array matching Hero block structure
  const cells = [];

  // Row 1: Background image (optional)
  if (heroImg) {
    cells.push([heroImg]);
  }

  // Row 2: Content cell (eyebrow + heading + description + CTA)
  const contentCell = [];
  if (eyebrow) contentCell.push(eyebrow);
  if (heading) contentCell.push(heading);
  if (description) contentCell.push(description);
  if (cta) contentCell.push(cta);

  cells.push(contentCell);

  // Create block using WebImporter utility
  const block = WebImporter.Blocks.createBlock(document, { name: 'Hero', cells });

  // Replace original element with structured block table
  element.replaceWith(block);
}
