/**
 * ============================================================================
 * SCRIPT.JS - DYNAMIC RESTAURANT MENU RENDERER & INTERACTION ENGINE
 * ============================================================================
 * Reads data directly from menu-data.js (restaurant & menu objects)
 * Pure Vanilla JavaScript - No external libraries or build tools required.
 * ============================================================================
 */

document.addEventListener('DOMContentLoaded', () => {
  // Validate that menu-data.js loaded properly
  if (typeof restaurant === 'undefined' || typeof menu === 'undefined') {
    console.error("Error: 'restaurant' or 'menu' data object not found. Ensure menu-data.js is loaded before script.js.");
    return;
  }

  // Application State
  let currentCategory = 'all';
  let currentTag = 'all';
  let searchQuery = '';

  // DOM Elements
  const headerLogo = document.getElementById('header-logo');
  const headerName = document.getElementById('header-name');
  const headerCallBtn = document.getElementById('header-call-btn');

  const heroBackdrop = document.getElementById('hero-backdrop');
  const heroTitle = document.getElementById('hero-title');
  const heroTagline = document.getElementById('hero-tagline');

  const searchInput = document.getElementById('search-input');
  const clearSearchBtn = document.getElementById('clear-search-btn');
  const tagFiltersContainer = document.getElementById('tag-filters');
  const categoryTabsContainer = document.getElementById('category-tabs');
  const menuContainer = document.getElementById('menu-container');
  const noResults = document.getElementById('no-results');
  const resetFilterBtn = document.getElementById('reset-filter-btn');

  const infoHours = document.getElementById('info-hours');
  const infoAddress = document.getElementById('info-address');
  const infoPhone = document.getElementById('info-phone');
  const infoCallAction = document.getElementById('info-call-action');
  const googleMapIframe = document.getElementById('google-map-iframe');

  const footerName = document.getElementById('footer-restaurant-name');
  const footerCopyName = document.getElementById('footer-copy-name');
  const socialLinksContainer = document.getElementById('social-links');
  const copyrightYear = document.getElementById('copyright-year');

  const itemModal = document.getElementById('item-modal');
  const modalBackdrop = document.getElementById('modal-backdrop');
  const modalClose = document.getElementById('modal-close');
  const modalBody = document.getElementById('modal-body');

  /* ==========================================================================
     1. DYNAMIC THEME INJECTION (Sync CSS variables with menu-data.js)
     ========================================================================== */
  function applyDynamicTheme(colors) {
    if (!colors) return;
    const rootStyle = document.documentElement.style;

    if (colors.primary) rootStyle.setProperty('--color-primary', colors.primary);
    if (colors.secondary) rootStyle.setProperty('--color-secondary', colors.secondary);
    if (colors.accent) rootStyle.setProperty('--color-accent', colors.accent);
    if (colors.accentHover) rootStyle.setProperty('--color-accent-hover', colors.accentHover);
    if (colors.text) rootStyle.setProperty('--color-text', colors.text);
    if (colors.textMuted) rootStyle.setProperty('--color-text-muted', colors.textMuted);
    if (colors.bgLight) rootStyle.setProperty('--color-bg-light', colors.bgLight);
    if (colors.cardBg) rootStyle.setProperty('--color-card-bg', colors.cardBg);
  }

  /* ==========================================================================
     2. RENDER HEADER, HERO, & INFO SECTIONS
     ========================================================================== */
  function renderRestaurantDetails() {
    // Header
    if (headerName) headerName.textContent = restaurant.name || "Restaurant";
    if (headerLogo) {
      headerLogo.src = restaurant.logo || "";
      headerLogo.onerror = () => { headerLogo.style.display = 'none'; };
    }
    if (headerCallBtn && restaurant.phone) {
      headerCallBtn.href = `tel:${restaurant.phone.replace(/\s+/g, '')}`;
    }

    // Hero
    if (heroTitle) heroTitle.textContent = restaurant.name || "Restaurant Menu";
    if (heroTagline) heroTagline.textContent = restaurant.tagline || "Freshly Prepared Delights";
    if (heroBackdrop && restaurant.heroImage) {
      heroBackdrop.style.backgroundImage = `url('${restaurant.heroImage}')`;
    }

    // Info Section
    if (infoHours) infoHours.textContent = restaurant.hours || "Open Daily";
    if (infoAddress) infoAddress.textContent = restaurant.address || "Main Street";
    if (infoPhone && restaurant.phone) {
      infoPhone.textContent = restaurant.phone;
      infoPhone.href = `tel:${restaurant.phone.replace(/\s+/g, '')}`;
    }
    if (infoCallAction && restaurant.phone) {
      infoCallAction.href = `tel:${restaurant.phone.replace(/\s+/g, '')}`;
    }
    if (googleMapIframe && restaurant.googleMapsEmbed) {
      googleMapIframe.src = restaurant.googleMapsEmbed;
    }

    // Footer
    if (footerName) footerName.textContent = restaurant.name;
    if (footerCopyName) footerCopyName.textContent = restaurant.name;
    if (copyrightYear) copyrightYear.textContent = new Date().getFullYear();

    // Social Links
    if (socialLinksContainer && restaurant.socialLinks) {
      const links = restaurant.socialLinks;
      let html = '';

      if (links.instagram) {
        html += `<a href="${links.instagram}" target="_blank" rel="noopener" class="social-icon" aria-label="Instagram">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect width="20" height="20" x="2" y="2" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/></svg>
        </a>`;
      }
      if (links.facebook) {
        html += `<a href="${links.facebook}" target="_blank" rel="noopener" class="social-icon" aria-label="Facebook">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg>
        </a>`;
      }
      if (links.whatsapp) {
        html += `<a href="${links.whatsapp}" target="_blank" rel="noopener" class="social-icon" aria-label="WhatsApp">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 21l1.65-3.8a9 9 0 1 1 3.4 2.9L3 21"/><path d="M9 10a.5.5 0 0 0 1 0V9a.5.5 0 0 0-1 0v1a5 5 0 0 0 5 5h1a.5.5 0 0 0 0-1h-1a.5.5 0 0 0 0 1"/></svg>
        </a>`;
      }
      socialLinksContainer.innerHTML = html;
    }
  }

  /* ==========================================================================
     3. RENDER CATEGORY TABS
     ========================================================================== */
  function renderCategoryTabs() {
    if (!categoryTabsContainer) return;

    let tabsHtml = `<button class="tab-btn active" data-category="all">
      <span>🍽️</span> All Items
    </button>`;

    menu.forEach(group => {
      tabsHtml += `<button class="tab-btn" data-category="${group.id}">
        <span>${group.icon || '📌'}</span> ${group.category}
      </button>`;
    });

    categoryTabsContainer.innerHTML = tabsHtml;

    // Attach click listeners to tabs
    const tabButtons = categoryTabsContainer.querySelectorAll('.tab-btn');
    tabButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        const catId = btn.getAttribute('data-category');
        setActiveCategoryTab(catId);

        if (catId === 'all') {
          window.scrollTo({ top: document.getElementById('menu').offsetTop - 110, behavior: 'smooth' });
        } else {
          const targetElem = document.getElementById(`cat-${catId}`);
          if (targetElem) {
            targetElem.scrollIntoView({ behavior: 'smooth' });
          }
        }
      });
    });
  }

  function setActiveCategoryTab(catId) {
    currentCategory = catId;
    const tabButtons = categoryTabsContainer.querySelectorAll('.tab-btn');
    tabButtons.forEach(btn => {
      if (btn.getAttribute('data-category') === catId) {
        btn.classList.add('active');
        btn.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
      } else {
        btn.classList.remove('active');
      }
    });
  }

  /* ==========================================================================
     4. RENDER MENU ITEMS GRID
     ========================================================================== */
  function renderMenuItems() {
    if (!menuContainer) return;

    let totalVisibleItems = 0;
    let menuHtml = '';

    menu.forEach(group => {
      // Filter items in this category based on search query and tag selection
      const filteredItems = group.items.filter(item => {
        // Tag filter check
        let matchesTag = true;
        if (currentTag !== 'all') {
          matchesTag = item.badges && item.badges.includes(currentTag);
        }

        // Search query check
        let matchesSearch = true;
        if (searchQuery.trim() !== '') {
          const query = searchQuery.toLowerCase();
          const nameMatch = item.name.toLowerCase().includes(query);
          const descMatch = item.description && item.description.toLowerCase().includes(query);
          matchesSearch = nameMatch || descMatch;
        }

        return matchesTag && matchesSearch;
      });

      if (filteredItems.length > 0) {
        totalVisibleItems += filteredItems.length;

        menuHtml += `
          <div class="category-group" id="cat-${group.id}">
            <div class="category-header">
              <span class="category-icon">${group.icon || '🍽️'}</span>
              <h2 class="category-title">${group.category}</h2>
            </div>
            <div class="items-grid">
        `;

        filteredItems.forEach(item => {
          menuHtml += createItemCardHtml(item);
        });

        menuHtml += `
            </div>
          </div>
        `;
      }
    });

    if (totalVisibleItems === 0) {
      menuContainer.innerHTML = '';
      if (noResults) noResults.hidden = false;
    } else {
      if (noResults) noResults.hidden = true;
      menuContainer.innerHTML = menuHtml;
      attachCardClickEvents();
    }
  }

  function createItemCardHtml(item) {
    // Generate badges HTML
    let badgesHtml = '';
    if (item.badges && item.badges.length > 0) {
      badgesHtml = '<div class="badges-list">';
      item.badges.forEach(b => {
        let badgeClass = 'badge';
        if (b.includes('Chef')) badgeClass += ' badge-chef';
        else if (b.includes('Veg')) badgeClass += ' badge-veg';
        else if (b.includes('Vegan')) badgeClass += ' badge-vegan';
        else if (b.includes('Gluten')) badgeClass += ' badge-gf';
        else if (b.includes('Spicy')) badgeClass += ' badge-spicy';
        badgesHtml += `<span class="${badgeClass}">${b}</span>`;
      });
      badgesHtml += '</div>';
    }

    // Media HTML (if image exists or placeholder)
    let mediaHtml = '';
    if (item.image) {
      mediaHtml = `
        <div class="card-media">
          <img src="${item.image}" alt="${item.name}" class="card-img" loading="lazy">
        </div>
      `;
    } else {
      mediaHtml = `
        <div class="card-media" style="display:flex;align-items:center;justify-content:center;font-size:1.8rem;color:var(--color-accent);">
          <span>🍲</span>
        </div>
      `;
    }

    return `
      <article class="menu-card" data-item-id="${item.id}" role="button" tabindex="0">
        ${mediaHtml}
        <div class="card-body">
          <div>
            <div class="card-header-row">
              <h3 class="item-title">${item.name}</h3>
              <span class="item-price">${item.price}</span>
            </div>
            <p class="item-desc">${item.description || ''}</p>
          </div>
          <div class="card-footer-row">
            ${badgesHtml}
            ${item.calories ? `<span class="item-calories">${item.calories}</span>` : ''}
          </div>
        </div>
      </article>
    `;
  }

  /* ==========================================================================
     5. INTERACTIVE MODAL (Quick Dish View)
     ========================================================================== */
  function attachCardClickEvents() {
    const cards = menuContainer.querySelectorAll('.menu-card');
    cards.forEach(card => {
      card.addEventListener('click', () => {
        const itemId = parseInt(card.getAttribute('data-item-id'), 10);
        openItemModal(itemId);
      });

      card.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          const itemId = parseInt(card.getAttribute('data-item-id'), 10);
          openItemModal(itemId);
        }
      });
    });
  }

  function openItemModal(itemId) {
    let foundItem = null;
    for (const group of menu) {
      const match = group.items.find(i => i.id === itemId);
      if (match) {
        foundItem = match;
        break;
      }
    }

    if (!foundItem || !itemModal) return;

    let badgesHtml = '';
    if (foundItem.badges && foundItem.badges.length > 0) {
      badgesHtml = '<div class="badges-list" style="margin-bottom:1rem;">';
      foundItem.badges.forEach(b => {
        badgesHtml += `<span class="badge badge-chef">${b}</span>`;
      });
      badgesHtml += '</div>';
    }

    let imgHtml = '';
    if (foundItem.image) {
      imgHtml = `<img src="${foundItem.image}" alt="${foundItem.name}" class="modal-body-img">`;
    }

    modalBody.innerHTML = `
      ${imgHtml}
      <div class="modal-body-content">
        <div class="modal-title-row">
          <h2 class="modal-item-title">${foundItem.name}</h2>
          <span class="modal-item-price">${foundItem.price}</span>
        </div>
        ${badgesHtml}
        <p class="modal-item-desc">${foundItem.description || 'Prepared fresh with premium hand-selected ingredients.'}</p>
        ${foundItem.calories ? `<p style="font-size:0.85rem;color:var(--color-text-muted);"><strong>Nutrition:</strong> ${foundItem.calories}</p>` : ''}
      </div>
    `;

    itemModal.classList.add('open');
    itemModal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  }

  function closeModal() {
    if (!itemModal) return;
    itemModal.classList.remove('open');
    itemModal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  if (modalClose) modalClose.addEventListener('click', closeModal);
  if (modalBackdrop) modalBackdrop.addEventListener('click', closeModal);
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && itemModal && itemModal.classList.contains('open')) {
      closeModal();
    }
  });

  /* ==========================================================================
     6. SEARCH & TAG FILTER EVENT LISTENERS
     ========================================================================== */
  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      searchQuery = e.target.value;
      if (clearSearchBtn) {
        clearSearchBtn.hidden = searchQuery.trim() === '';
      }
      renderMenuItems();
    });
  }

  if (clearSearchBtn) {
    clearSearchBtn.addEventListener('click', () => {
      searchInput.value = '';
      searchQuery = '';
      clearSearchBtn.hidden = true;
      renderMenuItems();
      searchInput.focus();
    });
  }

  if (tagFiltersContainer) {
    const tagPills = tagFiltersContainer.querySelectorAll('.tag-pill');
    tagPills.forEach(pill => {
      pill.addEventListener('click', () => {
        tagPills.forEach(p => p.classList.remove('active'));
        pill.classList.add('active');
        currentTag = pill.getAttribute('data-tag');
        renderMenuItems();
      });
    });
  }

  if (resetFilterBtn) {
    resetFilterBtn.addEventListener('click', () => {
      if (searchInput) searchInput.value = '';
      searchQuery = '';
      currentTag = 'all';
      if (clearSearchBtn) clearSearchBtn.hidden = true;
      if (tagFiltersContainer) {
        const tagPills = tagFiltersContainer.querySelectorAll('.tag-pill');
        tagPills.forEach(p => p.classList.remove('active'));
        if (tagPills[0]) tagPills[0].classList.add('active');
      }
      renderMenuItems();
    });
  }

  /* ==========================================================================
     7. SCROLL INTERSECTION OBSERVER (Auto Active Tab Update)
     ========================================================================== */
  function setupScrollObserver() {
    const categoryGroups = document.querySelectorAll('.category-group');
    if (!categoryGroups.length) return;

    const observerOptions = {
      root: null,
      rootMargin: '-20% 0px -60% 0px',
      threshold: 0
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const groupTarget = entry.target;
          const catId = groupTarget.id.replace('cat-', '');
          setActiveCategoryTab(catId);
        }
      });
    }, observerOptions);

    categoryGroups.forEach(group => observer.observe(group));
  }

  /* ==========================================================================
     8. INITIALIZATION
     ========================================================================== */
  function init() {
    applyDynamicTheme(restaurant.colors);
    renderRestaurantDetails();
    renderCategoryTabs();
    renderMenuItems();
    setupScrollObserver();

    // Check for deep link hash (e.g. index.html#menu or index.html#starters)
    if (window.location.hash) {
      setTimeout(() => {
        const hash = window.location.hash.substring(1);
        const targetElement = document.getElementById(hash) || document.getElementById(`cat-${hash}`);
        if (targetElement) {
          targetElement.scrollIntoView({ behavior: 'smooth' });
        }
      }, 300);
    }
  }

  // Fire App Initialization
  init();
});
