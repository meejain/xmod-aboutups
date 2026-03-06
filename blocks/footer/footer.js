import { getMetadata } from '../../scripts/aem.js';
import { loadFragment } from '../fragment/fragment.js';

const SOCIAL_ICONS = {
  facebook: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 40 40" fill="none"><circle cx="20" cy="20" r="19" stroke="currentColor" stroke-width="1.5"/><path d="M22.5 13h2V9.5h-2.7c-2.5 0-4.3 1.9-4.3 4.4v2.1H15v3.5h2.5V28h3.5v-8.5h2.8l.7-3.5h-3.5v-1.6c0-.8.3-1.4 1.5-1.4z" fill="currentColor"/></svg>',
  x: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 40 40" fill="none"><circle cx="20" cy="20" r="19" stroke="currentColor" stroke-width="1.5"/><path d="M24.3 12h2.7l-5.9 6.7L28 28h-5.4l-4.3-5.6L13.5 28H10.8l6.3-7.2L10.5 12h5.5l3.9 5.1L24.3 12zm-1 14.4h1.5L15.3 13.5h-1.6l9.6 12.9z" fill="currentColor"/></svg>',
  instagram: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 40 40" fill="none"><circle cx="20" cy="20" r="19" stroke="currentColor" stroke-width="1.5"/><rect x="12" y="12" width="16" height="16" rx="4.5" stroke="currentColor" stroke-width="1.5" fill="none"/><circle cx="20" cy="20" r="4" stroke="currentColor" stroke-width="1.5" fill="none"/><circle cx="25.5" cy="14.5" r="1.2" fill="currentColor"/></svg>',
  linkedin: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 40 40" fill="none"><circle cx="20" cy="20" r="19" stroke="currentColor" stroke-width="1.5"/><path d="M15.5 16.5h-2.5v10h2.5v-10zM14.25 11.5a1.5 1.5 0 100 3 1.5 1.5 0 000-3zM22 16.5c-1.5 0-2.3.8-2.5 1.2v-1.2h-2.5v10h2.5v-5.5c0-1.5.7-2.2 1.8-2.2 1 0 1.7.7 1.7 2v5.7h2.5v-6.2c0-2.5-1.5-3.8-3.5-3.8z" fill="currentColor"/></svg>',
  youtube: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 40 40" fill="none"><circle cx="20" cy="20" r="19" stroke="currentColor" stroke-width="1.5"/><path d="M28.5 15.3a2.3 2.3 0 00-1.6-1.6C25.4 13.2 20 13.2 20 13.2s-5.4 0-6.9.5a2.3 2.3 0 00-1.6 1.6c-.5 1.5-.5 4.7-.5 4.7s0 3.2.5 4.7a2.3 2.3 0 001.6 1.6c1.5.5 6.9.5 6.9.5s5.4 0 6.9-.5a2.3 2.3 0 001.6-1.6c.5-1.5.5-4.7.5-4.7s0-3.2-.5-4.7z" fill="currentColor"/><path d="M18 23.2l4.5-3.2L18 16.8v6.4z" fill="#351c15"/></svg>',
};

function decorateSocialIcons(footer) {
  const sections = footer.querySelectorAll('.section');
  if (sections.length < 4) return;

  const connectSection = sections[3];
  const links = connectSection.querySelectorAll('ul a');

  links.forEach((link) => {
    const href = link.href.toLowerCase();
    let platform = '';
    if (href.includes('facebook')) platform = 'facebook';
    else if (href.includes('x.com') || href.includes('twitter')) platform = 'x';
    else if (href.includes('instagram')) platform = 'instagram';
    else if (href.includes('linkedin')) platform = 'linkedin';
    else if (href.includes('youtube')) platform = 'youtube';

    if (platform && SOCIAL_ICONS[platform]) {
      link.innerHTML = SOCIAL_ICONS[platform];
      link.setAttribute('aria-label', platform.charAt(0).toUpperCase() + platform.slice(1));
      link.classList.add('footer-social-icon');
    }
  });
}

/**
 * loads and decorates the footer
 * @param {Element} block The footer block element
 */
export default async function decorate(block) {
  // load footer as fragment (default: /footer)
  const footerMeta = getMetadata('footer');
  const footerPath = footerMeta ? new URL(footerMeta, window.location).pathname : '/footer';
  const fragment = await loadFragment(footerPath);

  if (!fragment || !fragment.firstElementChild) {
    block.textContent = '';
    return;
  }

  // decorate footer DOM
  block.textContent = '';
  const footer = document.createElement('div');
  while (fragment.firstElementChild) footer.append(fragment.firstElementChild);

  decorateSocialIcons(footer);
  block.append(footer);
}
