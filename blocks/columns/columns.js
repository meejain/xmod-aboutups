/**
 * Parse stats/facts column: multiple <strong>value</strong> <br> label pairs.
 * Returns true if the pattern was detected and content restructured.
 * @param {Element} col The content column element
 */
function parseStatsColumn(col) {
  const p = col.querySelector(':scope > p');
  if (!p) return false;

  // Count <strong> elements without links — need 3+ for a stats pattern
  const strongs = [...p.querySelectorAll('strong')].filter((s) => !s.querySelector('a'));
  if (strongs.length < 3) return false;

  const html = p.innerHTML;
  const parts = html.split(/<br\s*\/?>/i).map((s) => s.trim()).filter(Boolean);

  const stats = [];
  let currentValue = '';
  let ctaHtml = '';

  parts.forEach((part) => {
    const tmp = document.createElement('div');
    tmp.innerHTML = part;
    const strong = tmp.querySelector('strong');
    const link = tmp.querySelector('a');

    if (strong && link) {
      ctaHtml = part;
    } else if (strong) {
      currentValue = strong.textContent.trim();
    } else {
      const text = tmp.textContent.trim();
      if (text && currentValue) {
        stats.push({ value: currentValue, label: text });
        currentValue = '';
      }
    }
  });

  if (!stats.length) return false;

  // Rebuild content as structured stat items
  col.innerHTML = '';

  const list = document.createElement('div');
  list.className = 'columns-stats';

  stats.forEach(({ value, label }) => {
    const item = document.createElement('div');
    item.className = 'columns-stat';

    const h4 = document.createElement('h4');
    h4.textContent = value;
    item.append(h4);

    const lbl = document.createElement('p');
    lbl.textContent = label;
    item.append(lbl);

    list.append(item);
  });

  col.append(list);

  if (ctaHtml) {
    const tmp = document.createElement('div');
    tmp.innerHTML = ctaHtml;
    const link = tmp.querySelector('a');
    if (link) {
      const ctaP = document.createElement('p');
      ctaP.className = 'columns-facts-cta';
      link.className = 'button primary';
      ctaP.append(link);
      col.append(ctaP);
    }
  }

  return true;
}

/**
 * Parse content column for eyebrow+heading pattern.
 * Detects: plain uppercase text <br> <strong>heading</strong> <br> desc <br> CTA
 * @param {Element} col The content column element
 */
function parseContentColumn(col) {
  const p = col.querySelector(':scope > p');
  if (!p) return;

  const html = p.innerHTML;
  const parts = html.split(/<br\s*\/?>/i).map((s) => s.trim()).filter(Boolean);
  if (parts.length < 3) return;

  const [firstPart, secondPart, ...restParts] = parts;

  // First part must be plain text (no HTML tags) and uppercase
  const temp = document.createElement('div');
  temp.innerHTML = firstPart;
  const firstText = temp.textContent.trim();
  if (!firstText || firstPart.trim() !== firstText) return;
  if (firstText !== firstText.toUpperCase()) return;

  // Second part must contain <strong> without a link (heading)
  const temp2 = document.createElement('div');
  temp2.innerHTML = secondPart;
  const strong = temp2.querySelector('strong');
  if (!strong || strong.querySelector('a')) return;

  // Confirmed eyebrow+heading pattern — restructure content
  const frag = document.createDocumentFragment();

  // Eyebrow
  const eyebrow = document.createElement('p');
  eyebrow.className = 'columns-eyebrow';
  eyebrow.textContent = firstText;
  frag.append(eyebrow);

  // Heading
  const heading = document.createElement('h2');
  heading.textContent = strong.textContent.trim();
  frag.append(heading);

  // Remaining parts: description and CTA
  restParts.forEach((partHtml) => {
    const tempPart = document.createElement('div');
    tempPart.innerHTML = partHtml;
    const emLink = tempPart.querySelector('em a');
    if (emLink) {
      const ctaP = document.createElement('p');
      ctaP.className = 'columns-cta';
      const em = document.createElement('em');
      em.append(emLink);
      ctaP.append(em);
      frag.append(ctaP);
    } else {
      const text = tempPart.textContent.trim();
      if (text) {
        const descP = document.createElement('p');
        descP.className = 'columns-description';
        descP.textContent = text;
        frag.append(descP);
      }
    }
  });

  p.replaceWith(frag);
}

export default function decorate(block) {
  const cols = [...block.firstElementChild.children];
  block.classList.add(`columns-${cols.length}-cols`);

  let isFacts = false;

  // setup image columns and parse content columns
  [...block.children].forEach((row) => {
    [...row.children].forEach((col) => {
      const pic = col.querySelector('picture');
      if (pic) {
        const picWrapper = pic.closest('div');
        if (picWrapper && picWrapper.children.length === 1) {
          picWrapper.classList.add('columns-img-col');
        }
      } else if (parseStatsColumn(col)) {
        isFacts = true;
      } else {
        parseContentColumn(col);
      }
    });
  });

  if (isFacts) {
    block.classList.add('columns-facts');
  }
}
