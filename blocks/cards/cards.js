import { createOptimizedPicture } from '../../scripts/aem.js';

/**
 * Parse card body content into structured elements.
 * Content pattern: <strong><a>Title</a></strong> <br> Category <br> Description
 * Rendered order: eyebrow (category), title, description
 * @param {Element} body The card body element
 */
function parseCardBody(body) {
  const html = body.innerHTML;
  const parts = html.split(/<br\s*\/?>/i).map((p) => p.trim()).filter(Boolean);

  let titleHtml = '';
  let eyebrowText = '';
  let descText = '';

  parts.forEach((part) => {
    const temp = document.createElement('div');
    temp.innerHTML = part;
    const strongLink = temp.querySelector('strong a');
    if (strongLink) {
      titleHtml = part;
    } else {
      const text = temp.textContent.trim();
      if (!text) return;
      if (!eyebrowText) {
        eyebrowText = text;
      } else if (!descText) {
        descText = text;
      }
    }
  });

  body.innerHTML = '';

  if (eyebrowText) {
    const eyebrow = document.createElement('p');
    eyebrow.className = 'cards-eyebrow';
    eyebrow.textContent = eyebrowText;
    body.append(eyebrow);
  }

  if (titleHtml) {
    const temp = document.createElement('div');
    temp.innerHTML = titleHtml;
    const link = temp.querySelector('a');
    if (link) {
      const h3 = document.createElement('h3');
      h3.append(link);
      body.append(h3);
    }
  }

  if (descText) {
    const desc = document.createElement('p');
    desc.className = 'cards-description';
    desc.textContent = descText;
    body.append(desc);
  }
}

export default function decorate(block) {
  const ul = document.createElement('ul');
  [...block.children].forEach((row) => {
    const li = document.createElement('li');
    while (row.firstElementChild) li.append(row.firstElementChild);
    [...li.children].forEach((div) => {
      if (div.children.length === 1 && div.querySelector('picture')) {
        div.className = 'cards-card-image';
      } else {
        div.className = 'cards-card-body';
        parseCardBody(div);
      }
    });
    ul.append(li);
  });
  ul.querySelectorAll('picture > img').forEach((img) => {
    img.closest('picture').replaceWith(
      createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }]),
    );
  });
  block.replaceChildren(ul);
}
