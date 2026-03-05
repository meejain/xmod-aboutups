/**
 * loads and decorates the hero block
 * @param {Element} block The hero block element
 */
export default function decorate(block) {
  const contentCell = block.querySelector(':scope > div:last-child > div');
  if (!contentCell) return;

  // Split content on <br> into eyebrow, title, description, CTA
  const html = contentCell.innerHTML;
  const parts = html.split(/<br\s*\/?>/i).map((p) => p.trim()).filter(Boolean);

  let eyebrowText = '';
  let titleText = '';
  let descText = '';
  let ctaHref = '';
  let ctaText = '';

  parts.forEach((part) => {
    const temp = document.createElement('div');
    temp.innerHTML = part;

    const strong = temp.querySelector('strong');
    const link = temp.querySelector('a');

    if (strong && link) {
      // Bold link = CTA button
      ctaHref = link.href;
      ctaText = link.textContent.trim();
    } else if (strong) {
      // Bold text = title
      titleText = strong.textContent.trim();
    } else if (link) {
      // Plain link = CTA
      ctaHref = link.href;
      ctaText = link.textContent.trim();
    } else {
      const text = temp.textContent.trim();
      if (!text) return;
      if (!titleText && !eyebrowText) {
        // First text = eyebrow
        eyebrowText = text;
      } else if (titleText) {
        // Text after title = description
        descText = text;
      }
    }
  });

  // Rebuild structured content
  contentCell.innerHTML = '';

  if (eyebrowText) {
    const eyebrow = document.createElement('p');
    eyebrow.className = 'hero-eyebrow';
    eyebrow.textContent = eyebrowText;
    contentCell.append(eyebrow);
  }

  if (titleText) {
    const title = document.createElement('h4');
    title.textContent = titleText;
    contentCell.append(title);
  }

  if (descText) {
    const desc = document.createElement('p');
    desc.className = 'hero-description';
    desc.textContent = descText;
    contentCell.append(desc);
  }

  if (ctaHref) {
    const wrapper = document.createElement('p');
    wrapper.className = 'hero-cta';
    const btn = document.createElement('a');
    btn.href = ctaHref;
    btn.className = 'button primary';
    btn.textContent = ctaText;
    wrapper.append(btn);
    contentCell.append(wrapper);
  }
}
