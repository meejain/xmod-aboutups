import { getMetadata } from '../../scripts/aem.js';
import { loadFragment } from '../fragment/fragment.js';

// media query match that indicates mobile/tablet width
const isDesktop = window.matchMedia('(min-width: 900px)');

const LANGUAGE_REGIONS = [
  {
    name: 'ASIA, OCEANIA & PACIFIC',
    languages: [
      { label: 'English', href: '/sg/en/home.html' },
      { label: '繁體中文（台灣）', href: '/tw/zh/home.html' },
      { label: '繁體中文（香港）', href: '/hk/zh/home.html' },
      { label: '简体中文', href: '/cn/zh/home.html' },
      { label: '日本語', href: '/jp/ja/home.html' },
      { label: '한국어', href: '/kr/ko/home.html' },
      { label: 'ภาษาไทย', href: '/th/th/home.html' },
      { label: 'Tiếng Việt', href: '/vn/vi/home.html' },
    ],
  },
  {
    name: 'CANADA',
    languages: [
      { label: 'English', href: '/ca/en/home.html' },
      { label: 'Français', href: '/ca/fr/home.html' },
    ],
  },
  {
    name: 'CARIBBEAN, CENTRAL & SOUTH AMERICA',
    languages: [
      { label: 'English', href: '/mx/en/home.html' },
      { label: 'Español', href: '/mx/es/home.html' },
      { label: 'Português do Brasil', href: '/br/pt/home.html' },
    ],
  },
  {
    name: 'EUROPE',
    languages: [
      { label: 'English', href: '/gb/en/home.html' },
      { label: 'čeština', href: '/cz/cs/home.html' },
      { label: 'Français', href: '/fr/fr/home.html' },
      { label: 'Deutsch', href: '/de/de/home.html' },
      { label: 'Polski', href: '/pl/pl/home.html' },
      { label: 'Nederlands', href: '/nl/nl/home.html' },
      { label: 'Español', href: '/es/es/home.html' },
      { label: 'Italiano', href: '/it/it/home.html' },
      { label: 'Português', href: '/pt/pt/home.html' },
      { label: 'Svenska', href: '/se/sv/home.html' },
      { label: 'Türkçe', href: '/tr/tr/home.html' },
    ],
  },
  {
    name: 'INDIAN SUB-CONTINENT, MIDDLE EAST & AFRICA',
    languages: [
      { label: 'English', href: '/ae/en/home.html' },
      { label: 'العربية', href: '/sa/ar/home.html' },
    ],
  },
  {
    name: 'UNITED STATES',
    languages: [
      { label: 'English', href: '/us/en/home.html' },
      { label: 'Español', href: '/us/es/home.html' },
    ],
  },
];

/* SVG icons used in the header tools area */
const ICON_EXTERNAL = `<svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24"
  fill="none" stroke="#426da9" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
  <path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6"/>
  <polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/>
</svg>`;

const ICON_GLOBE = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24"
  fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
  <circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/>
  <path d="M12 2a15.3 15.3 0 014 10 15.3 15.3 0 01-4 10 15.3 15.3 0 01-4-10 15.3 15.3 0 014-10z"/>
</svg>`;

const ICON_CLOSE = `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24"
  fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
  <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
</svg>`;

const ICON_SEARCH = `<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24"
  fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
  <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
</svg>`;

function buildLanguageModal() {
  const overlay = document.createElement('div');
  overlay.className = 'lang-modal-overlay';

  const dialog = document.createElement('div');
  dialog.className = 'lang-modal';
  dialog.setAttribute('role', 'dialog');
  dialog.setAttribute('aria-label', 'Language Selector');

  // Header
  const header = document.createElement('div');
  header.className = 'lang-modal-header';
  const title = document.createElement('h4');
  title.textContent = 'Language Selector';
  const closeBtn = document.createElement('button');
  closeBtn.className = 'lang-modal-close';
  closeBtn.setAttribute('aria-label', 'Close');
  closeBtn.innerHTML = ICON_CLOSE;
  header.append(title, closeBtn);

  // Body
  const body = document.createElement('div');
  body.className = 'lang-modal-body';

  LANGUAGE_REGIONS.forEach((region) => {
    const container = document.createElement('div');
    container.className = 'lang-region';
    const heading = document.createElement('h3');
    heading.textContent = region.name;
    container.appendChild(heading);
    const ul = document.createElement('ul');
    region.languages.forEach((lang) => {
      const li = document.createElement('li');
      const a = document.createElement('a');
      a.href = lang.href;
      a.textContent = lang.label;
      li.appendChild(a);
      ul.appendChild(li);
    });
    container.appendChild(ul);
    body.appendChild(container);
  });

  dialog.append(header, body);
  overlay.appendChild(dialog);

  // Close handlers
  closeBtn.addEventListener('click', () => overlay.classList.remove('visible'));
  overlay.addEventListener('click', (e) => {
    if (e.target === overlay) overlay.classList.remove('visible');
  });
  window.addEventListener('keydown', (e) => {
    if (e.code === 'Escape' && overlay.classList.contains('visible')) {
      overlay.classList.remove('visible');
    }
  });

  return overlay;
}

function closeOnEscape(e) {
  if (e.code === 'Escape') {
    const nav = document.getElementById('nav');
    const navSections = nav.querySelector('.nav-sections');
    if (!navSections) return;
    const navSectionExpanded = navSections.querySelector('[aria-expanded="true"]');
    if (navSectionExpanded && isDesktop.matches) {
      // eslint-disable-next-line no-use-before-define
      toggleAllNavSections(navSections);
      navSectionExpanded.focus();
    } else if (!isDesktop.matches) {
      // eslint-disable-next-line no-use-before-define
      toggleMenu(nav, navSections);
      nav.querySelector('button').focus();
    }
  }
}

function closeOnFocusLost(e) {
  const nav = e.currentTarget;
  if (!nav.contains(e.relatedTarget)) {
    const navSections = nav.querySelector('.nav-sections');
    if (!navSections) return;
    const navSectionExpanded = navSections.querySelector('[aria-expanded="true"]');
    if (navSectionExpanded && isDesktop.matches) {
      // eslint-disable-next-line no-use-before-define
      toggleAllNavSections(navSections, false);
    } else if (!isDesktop.matches) {
      // eslint-disable-next-line no-use-before-define
      toggleMenu(nav, navSections, false);
    }
  }
}

function openOnKeydown(e) {
  const focused = document.activeElement;
  const isNavDrop = focused.className === 'nav-drop';
  if (isNavDrop && (e.code === 'Enter' || e.code === 'Space')) {
    const dropExpanded = focused.getAttribute('aria-expanded') === 'true';
    // eslint-disable-next-line no-use-before-define
    toggleAllNavSections(focused.closest('.nav-sections'));
    focused.setAttribute('aria-expanded', dropExpanded ? 'false' : 'true');
  }
}

function focusNavSection() {
  document.activeElement.addEventListener('keydown', openOnKeydown);
}

/**
 * Toggles all nav sections
 * @param {Element} sections The container element
 * @param {Boolean} expanded Whether the element should be expanded or collapsed
 */
function toggleAllNavSections(sections, expanded = false) {
  if (!sections) return;
  sections.querySelectorAll('.nav-sections .default-content-wrapper > ul > li').forEach((section) => {
    section.setAttribute('aria-expanded', expanded);
  });
}

/**
 * Toggles the entire nav
 * @param {Element} nav The container element
 * @param {Element} navSections The nav sections within the container element
 * @param {*} forceExpanded Optional param to force nav expand behavior when not null
 */
function toggleMenu(nav, navSections, forceExpanded = null) {
  const expanded = forceExpanded !== null ? !forceExpanded : nav.getAttribute('aria-expanded') === 'true';
  const button = nav.querySelector('.nav-hamburger button');
  document.body.style.overflowY = (expanded || isDesktop.matches) ? '' : 'hidden';
  nav.setAttribute('aria-expanded', expanded ? 'false' : 'true');
  toggleAllNavSections(navSections, expanded || isDesktop.matches ? 'false' : 'true');
  button.setAttribute('aria-label', expanded ? 'Open navigation' : 'Close navigation');
  // enable nav dropdown keyboard accessibility
  if (navSections) {
    const navDrops = navSections.querySelectorAll('.nav-drop');
    if (isDesktop.matches) {
      navDrops.forEach((drop) => {
        if (!drop.hasAttribute('tabindex')) {
          drop.setAttribute('tabindex', 0);
          drop.addEventListener('focus', focusNavSection);
        }
      });
    } else {
      navDrops.forEach((drop) => {
        drop.removeAttribute('tabindex');
        drop.removeEventListener('focus', focusNavSection);
      });
    }
  }

  // enable menu collapse on escape keypress
  if (!expanded || isDesktop.matches) {
    // collapse menu on escape press
    window.addEventListener('keydown', closeOnEscape);
    // collapse menu on focus lost
    nav.addEventListener('focusout', closeOnFocusLost);
  } else {
    window.removeEventListener('keydown', closeOnEscape);
    nav.removeEventListener('focusout', closeOnFocusLost);
  }
}

/**
 * loads and decorates the header, mainly the nav
 * @param {Element} block The header block element
 */
export default async function decorate(block) {
  // load nav as fragment (default: /nav)
  const navMeta = getMetadata('nav');
  const navPath = navMeta ? new URL(navMeta, window.location).pathname : '/nav';
  const fragment = await loadFragment(navPath);

  if (!fragment || !fragment.firstElementChild) {
    block.textContent = '';
    return;
  }

  // decorate nav DOM
  block.textContent = '';
  const nav = document.createElement('nav');
  nav.id = 'nav';
  while (fragment.firstElementChild) nav.append(fragment.firstElementChild);

  const classes = ['brand', 'sections', 'tools'];
  classes.forEach((c, i) => {
    const section = nav.children[i];
    if (section) section.classList.add(`nav-${c}`);
  });

  const navBrand = nav.querySelector('.nav-brand');
  const brandLink = navBrand.querySelector('.button');
  if (brandLink) {
    brandLink.className = '';
    brandLink.closest('.button-container').className = '';
  }

  // Enhance tools section — external link icon, language selector
  const navTools = nav.querySelector('.nav-tools');
  if (navTools) {
    // Clear button styles from tools links
    navTools.querySelectorAll('.button').forEach((btn) => {
      btn.className = '';
      const container = btn.closest('.button-container');
      if (container) container.className = '';
    });

    // ups.com — add external link icon and open in new window
    navTools.querySelectorAll('a').forEach((link) => {
      if (link.textContent.trim() === 'ups.com') {
        link.setAttribute('target', '_blank');
        link.setAttribute('rel', 'noopener noreferrer');
        const extIcon = document.createElement('span');
        extIcon.className = 'icon-external';
        extIcon.innerHTML = ICON_EXTERNAL;
        link.appendChild(extIcon);
      }
    });

    // Language selector button
    const langBtn = document.createElement('button');
    langBtn.className = 'nav-lang-btn';
    langBtn.setAttribute('aria-label', 'language selector');
    langBtn.innerHTML = `${ICON_GLOBE} English`;

    const toolsP = navTools.querySelector('p');
    if (toolsP) {
      toolsP.appendChild(langBtn);
    } else {
      navTools.appendChild(langBtn);
    }

    // Build and append language modal
    const langModal = buildLanguageModal();
    document.body.appendChild(langModal);

    langBtn.addEventListener('click', () => {
      langModal.classList.toggle('visible');
    });

    // Search button
    const searchBtn = document.createElement('button');
    searchBtn.className = 'nav-search-btn';
    searchBtn.setAttribute('aria-label', 'search');
    searchBtn.innerHTML = ICON_SEARCH;

    if (toolsP) {
      toolsP.appendChild(searchBtn);
    } else {
      navTools.appendChild(searchBtn);
    }
  }

  const navSections = nav.querySelector('.nav-sections');
  if (navSections) {
    navSections.querySelectorAll(':scope .default-content-wrapper > ul > li').forEach((navSection) => {
      const subUl = navSection.querySelector('ul');
      if (subUl) {
        navSection.classList.add('nav-drop');

        // Build megamenu panel with title and column-wrapped items
        const panel = document.createElement('div');
        panel.className = 'megamenu-panel';
        const title = document.createElement('p');
        title.className = 'megamenu-title';
        title.textContent = navSection.querySelector('a').textContent.trim();
        panel.appendChild(title);
        panel.appendChild(subUl);
        navSection.appendChild(panel);

        // Prevent link navigation on desktop — open dropdown instead
        const navLink = navSection.querySelector(':scope > a');
        if (navLink) {
          navLink.addEventListener('click', (e) => {
            if (isDesktop.matches) e.preventDefault();
          });
        }
      }
      navSection.addEventListener('click', () => {
        if (isDesktop.matches) {
          const expanded = navSection.getAttribute('aria-expanded') === 'true';
          toggleAllNavSections(navSections);
          navSection.setAttribute('aria-expanded', expanded ? 'false' : 'true');
        }
      });

      // Desktop hover: open/close megamenu on mouseenter/mouseleave
      navSection.addEventListener('mouseenter', () => {
        if (isDesktop.matches) {
          toggleAllNavSections(navSections);
          navSection.setAttribute('aria-expanded', 'true');
        }
      });
      navSection.addEventListener('mouseleave', () => {
        if (isDesktop.matches) {
          navSection.setAttribute('aria-expanded', 'false');
        }
      });
    });
  }

  // hamburger for mobile
  const hamburger = document.createElement('div');
  hamburger.classList.add('nav-hamburger');
  hamburger.innerHTML = `<button type="button" aria-controls="nav" aria-label="Open navigation">
      <span class="nav-hamburger-icon"></span>
    </button>`;
  hamburger.addEventListener('click', () => toggleMenu(nav, navSections));
  nav.prepend(hamburger);
  nav.setAttribute('aria-expanded', 'false');
  // prevent mobile nav behavior on window resize
  toggleMenu(nav, navSections, isDesktop.matches);
  isDesktop.addEventListener('change', () => toggleMenu(nav, navSections, isDesktop.matches));

  const navWrapper = document.createElement('div');
  navWrapper.className = 'nav-wrapper';
  navWrapper.append(nav);
  block.append(navWrapper);
}
