/**
 * ============================================================================
 * SCRIPT.JS — RESTAURANT MENU ENGINE
 * ============================================================================
 * CHANGE 1: All styles use flat CSS variables (no JS needed).
 * CHANGE 2: Home page (index.html) is info-only. Category pages are the menu.
 * CHANGE 3: Low-bandwidth detection:
 *   a) Network Information API (auto, where supported)
 *   b) Image-load timeout probe (auto, runs once per page load)
 *   c) Manual ⚡ Éco toggle (always visible, overrides auto decision)
 * ============================================================================
 */

(function () {
  'use strict';

  document.addEventListener('DOMContentLoaded', function () {
    if (typeof restaurant === 'undefined' || typeof categories === 'undefined') {
      console.error('menu-data.js must be loaded before script.js');
      return;
    }

    // sheet-config.js must also be present for the async loader
    if (typeof loadMenuData !== 'function') {
      console.error('sheet-config.js must be loaded before script.js');
    }

    /* -----------------------------------------------------------------------
       CONSTANTS
    ----------------------------------------------------------------------- */
    var IMAGE_TIMEOUT_MS   = 4000;   // ms before an image is considered "slow"
    var TIMEOUT_THRESHOLD  = 2;      // how many timed-out images trigger auto eco
    var TOAST_DURATION_MS  = 4500;   // how long the toast stays visible

    /* -----------------------------------------------------------------------
       STATE
    ----------------------------------------------------------------------- */
    var urlParams = new URLSearchParams(window.location.search);
    var currentLang =
      urlParams.get('lang') === 'ar'
        ? 'ar'
        : sessionStorage.getItem('menu_lang') === 'ar'
        ? 'ar'
        : 'fr';

    // Initial data-saver state — Network API first, then manual sessionStorage
    var dataSaverOn = false;
    var networkApiSupported = false;
    (function initDataSaver() {
      var conn = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
      if (conn) {
        networkApiSupported = true;
        dataSaverOn = conn.effectiveType === 'slow-2g' || conn.effectiveType === '2g';
        sessionStorage.setItem('data_saver', dataSaverOn ? '1' : '0');
      } else {
        // Restore manual choice from previous interaction
        dataSaverOn = sessionStorage.getItem('data_saver') === '1';
      }
    })();

    var pageCategory = urlParams.get('cat') || document.body.dataset.category || 'home';
    var isMenuPage   = pageCategory !== 'home';

    // Image timeout probe runs once; flag prevents repeating
    var probeRan = false;

    /* -----------------------------------------------------------------------
       HELPERS
    ----------------------------------------------------------------------- */
    function getText(obj) {
      if (!obj) return '';
      if (typeof obj === 'string') return obj;
      return obj[currentLang] || obj['fr'] || '';
    }

    function langUrl(base) {
      if (currentLang !== 'ar') return base;
      return base.indexOf('?') !== -1 ? base + '&lang=ar' : base + '?lang=ar';
    }

    /* -----------------------------------------------------------------------
       DOM REFS
    ----------------------------------------------------------------------- */
    var htmlEl           = document.documentElement;
    var langToggleBtn    = document.getElementById('lang-toggle-btn');
    var langToggleText   = document.getElementById('lang-toggle-text');
    var headerName       = document.getElementById('header-name');
    var headerBadge      = document.getElementById('header-badge');
    var backLink         = document.getElementById('back-link');
    var footerName       = document.getElementById('footer-restaurant-name');
    var footerSub        = document.getElementById('footer-sub');
    var footerCopyright  = document.getElementById('footer-copyright');

    // Home-only
    var heroSubheading   = document.getElementById('hero-subheading');
    var heroTitle        = document.getElementById('hero-title');
    var heroTagline      = document.getElementById('hero-tagline');
    var seeMenuText      = document.getElementById('see-menu-text');
    var seeMenuBtn       = document.getElementById('see-menu-btn');
    var infoHoursTitle   = document.getElementById('info-hours-title');
    var infoHours        = document.getElementById('info-hours');
    var infoAddressTitle = document.getElementById('info-address-title');
    var infoAddress      = document.getElementById('info-address');
    var infoPhoneTitle   = document.getElementById('info-phone-title');
    var infoPhone        = document.getElementById('info-phone');
    var socialLinksTitle = document.getElementById('social-links-title');

    // Menu-page-only
    var categoryNavTabs   = document.getElementById('category-tabs');
    var categoryTitle     = document.getElementById('category-title');
    var categoryDesc      = document.getElementById('category-desc');
    var categoryItemsGrid = document.getElementById('category-items-grid');
    var dataSaverBtn      = document.getElementById('data-saver-btn');
    var dataSaverText     = document.getElementById('data-saver-text');
    // Nav carousel arrows (static in HTML, wired here)
    var navArrowLeft  = document.getElementById('nav-arrow-left');
    var navArrowRight = document.getElementById('nav-arrow-right');

    // Nav carousel arrows (injected dynamically)
    // (kept for reference — actual els now come from static HTML)


    /* -----------------------------------------------------------------------
       TOAST NOTIFICATION (eco mode auto-activated)
    ----------------------------------------------------------------------- */
    function showEcoToast() {
      // Create toast element once
      var existing = document.getElementById('eco-toast');
      if (existing) existing.parentNode.removeChild(existing);

      var toast = document.createElement('div');
      toast.id = 'eco-toast';
      toast.textContent = currentLang === 'ar'
        ? 'تم تفعيل الوضع الاقتصادي — تم اكتشاف اتصال بطيء'
        : 'Mode économique activé — connexion lente détectée';
      document.body.appendChild(toast);

      // Fade in on next frame
      requestAnimationFrame(function () {
        requestAnimationFrame(function () {
          toast.classList.add('visible');
        });
      });

      // Fade out + remove
      setTimeout(function () {
        toast.classList.remove('visible');
        setTimeout(function () {
          if (toast.parentNode) toast.parentNode.removeChild(toast);
        }, 350);
      }, TOAST_DURATION_MS);
    }

    /* -----------------------------------------------------------------------
       ACTIVATE ECO MODE PROGRAMMATICALLY (auto or manual)
    ----------------------------------------------------------------------- */
    function activateEcoMode(showToast) {
      dataSaverOn = true;
      sessionStorage.setItem('data_saver', '1');
      updateDataSaverBtn();
      renderCategoryPage();
      if (showToast) showEcoToast();
    }

    function deactivateEcoMode() {
      dataSaverOn = false;
      sessionStorage.setItem('data_saver', '0');
      updateDataSaverBtn();
      renderCategoryPage();
    }

    /* -----------------------------------------------------------------------
       IMAGE TIMEOUT PROBE
       Runs once after cards are rendered in normal (image) mode.
       Probes each item image with a hidden <img> — if enough time out,
       auto-activates eco mode and shows a toast.
    ----------------------------------------------------------------------- */
    function runImageTimeoutProbe(imageUrls) {
      if (probeRan || dataSaverOn || imageUrls.length === 0) return;
      probeRan = true;

      var total       = imageUrls.length;
      var timedOut    = 0;
      var settled     = 0;
      var autoTriggered = false;

      function onSettled(wasTimeout) {
        if (autoTriggered) return; // already switched, stop counting
        if (wasTimeout) timedOut++;
        settled++;

        // Trigger if threshold met
        if (timedOut >= TIMEOUT_THRESHOLD) {
          autoTriggered = true;
          activateEcoMode(true); // true = show toast
          return;
        }

        // All probes done and threshold not reached — leave normal mode
      }

      imageUrls.forEach(function (url) {
        var img    = new Image();
        var tid    = null;
        var done   = false;

        function finish(timedout) {
          if (done) return;
          done = true;
          if (tid) clearTimeout(tid);
          img.onload = img.onerror = null;
          img.src = ''; // stop any pending request
          onSettled(timedout);
        }

        tid = setTimeout(function () { finish(true);  }, IMAGE_TIMEOUT_MS);
        img.onload  = function () { finish(false); };
        img.onerror = function () { finish(false); }; // broken URLs don't count as slow
        img.src = url;
      });
    }

    /* -----------------------------------------------------------------------
       DATA SAVER BUTTON — MANUAL TOGGLE
    ----------------------------------------------------------------------- */
    function updateDataSaverBtn() {
      if (!dataSaverBtn || !dataSaverText) return;
      var isAr  = currentLang === 'ar';
      var label = isAr ? 'اقتصادي' : 'Éco';
      dataSaverText.textContent = label;
      if (dataSaverOn) {
        dataSaverBtn.classList.add('active');
        dataSaverBtn.title = isAr ? 'وضع توفير البيانات مفعّل — انقر للإلغاء' : 'Mode économique actif — cliquer pour désactiver';
      } else {
        dataSaverBtn.classList.remove('active');
        dataSaverBtn.title = isAr ? 'وضع توفير البيانات' : 'Mode économique de données';
      }
    }

    if (dataSaverBtn) {
      dataSaverBtn.addEventListener('click', function () {
        if (dataSaverOn) {
          // Manual OFF → reload images
          deactivateEcoMode();
        } else {
          // Manual ON → skip images immediately, no toast (user chose it)
          activateEcoMode(false);
        }
      });
    }

    /* -----------------------------------------------------------------------
       LANGUAGE APPLY
    ----------------------------------------------------------------------- */
    function applyLanguage(lang) {
      currentLang = lang;
      sessionStorage.setItem('menu_lang', currentLang);

      var isAr = currentLang === 'ar';
      htmlEl.setAttribute('dir', isAr ? 'rtl' : 'ltr');
      htmlEl.setAttribute('lang', currentLang);

      var newUrl = new URL(window.location);
      if (isAr) newUrl.searchParams.set('lang', 'ar');
      else       newUrl.searchParams.delete('lang');
      window.history.replaceState({}, '', newUrl);

      if (langToggleText) langToggleText.textContent = isAr ? 'FR' : 'عربي';
      if (backLink)       backLink.href = langUrl('index.html');

      renderShared();

      if (pageCategory === 'home') {
        renderHome();
      } else {
        renderCategoryTabs();
        renderCategoryPage();
        updateDataSaverBtn();
      }

      if (currentOpenItem) {
        openItemModal(currentOpenItem);
      }

      updateAllHtmlLinks();
    }

    function updateAllHtmlLinks() {
      document.querySelectorAll('a[href$=".html"]').forEach(function (a) {
        var base = a.getAttribute('href').split('?')[0];
        a.href = langUrl(base);
      });
    }

    if (langToggleBtn) {
      langToggleBtn.addEventListener('click', function () {
        applyLanguage(currentLang === 'fr' ? 'ar' : 'fr');
      });
    }

    /* -----------------------------------------------------------------------
       SHARED HEADER / FOOTER TEXT
    ----------------------------------------------------------------------- */
    function renderShared() {
      var isAr = currentLang === 'ar';
      if (headerName)     headerName.textContent     = getText(restaurant.name);
      if (headerBadge)    headerBadge.textContent     = isAr ? 'قائمة رقمية' : 'Digital Menu';
      if (footerName)     footerName.textContent      = getText(restaurant.name);
      if (footerSub)      footerSub.textContent       = isAr ? 'امسح واستمتع • قائمة رقمية' : 'Scannez & Profitez • Menu Numérique';
      if (footerCopyright) {
        var yr = new Date().getFullYear();
        footerCopyright.innerHTML = isAr
          ? '&copy; ' + yr + ' ' + getText(restaurant.name) + '. جميع الحقوق محفوظة.'
          : '&copy; ' + yr + ' ' + getText(restaurant.name) + '. Tous droits réservés.';
      }
    }

    /* -----------------------------------------------------------------------
       HOME PAGE
    ----------------------------------------------------------------------- */
    function renderHome() {
      var isAr = currentLang === 'ar';
      if (heroSubheading)   heroSubheading.textContent   = isAr ? 'مرحباً بكم في'     : 'Bienvenue à';
      if (heroTitle)        heroTitle.textContent         = getText(restaurant.name);
      if (heroTagline)      heroTagline.textContent       = getText(restaurant.tagline);
      if (seeMenuText)      seeMenuText.textContent       = isAr ? 'عرض القائمة'       : 'Voir le Menu';
      if (seeMenuBtn)       seeMenuBtn.href               = langUrl('plat-du-jour.html');
      if (infoHoursTitle)   infoHoursTitle.textContent    = isAr ? 'ساعات العمل'       : "Horaires d'Ouverture";
      if (infoHours)        infoHours.textContent          = getText(restaurant.hours);
      if (infoAddressTitle) infoAddressTitle.textContent   = isAr ? 'عنواننا'           : 'Notre Adresse';
      if (infoAddress)      infoAddress.textContent        = getText(restaurant.address);
      if (infoPhoneTitle)   infoPhoneTitle.textContent     = isAr ? 'الاتصال المباشر'   : 'Contact Téléphonique';
      if (infoPhone && restaurant.phone) {
        infoPhone.textContent = restaurant.phone;
        infoPhone.href = 'tel:' + restaurant.phone.replace(/\s+/g, '');
      }
      if (socialLinksTitle) socialLinksTitle.textContent   = isAr ? 'التواصل الاجتماعي' : 'Réseaux Sociaux';
    }

    /* -----------------------------------------------------------------------
       CATEGORY NAV TABS + CAROUSEL ARROWS
    ----------------------------------------------------------------------- */
    function renderCategoryTabs() {
      if (!categoryNavTabs) return;
      var cats = window.categories || categories;
      var html = '';
      cats.forEach(function (cat) {
        var active = pageCategory === cat.id ? 'active' : '';
        html += '<a href="' + langUrl(cat.pageUrl) + '" class="tab-btn ' + active + '">' + getText(cat.name) + '</a>';
      });
      categoryNavTabs.innerHTML = html;

      // Scroll active tab into full view and update arrow states
      var activeTab = categoryNavTabs.querySelector('.tab-btn.active');
      if (activeTab) {
        setTimeout(function () {
          activeTab.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
          updateNavArrows();
        }, 60);
      } else {
        updateNavArrows();
      }
    }

    /* -----------------------------------------------------------------------
       CAROUSEL — ARROW LOGIC
    ----------------------------------------------------------------------- */
    var SCROLL_STEP = 180; // px per arrow click

    function updateNavArrows() {
      if (!categoryNavTabs || !navArrowLeft || !navArrowRight) return;
      var el    = categoryNavTabs;
      var isRtl = document.documentElement.getAttribute('dir') === 'rtl';

      // scrollLeft can be negative in RTL in some browsers
      var scrollLeft = Math.abs(el.scrollLeft);
      var maxScroll  = el.scrollWidth - el.clientWidth;

      var atStart = scrollLeft <= 2;
      var atEnd   = maxScroll <= 0 || scrollLeft >= maxScroll - 2;

      // In RTL the visual "left" arrow scrolls toward the end
      if (isRtl) {
        navArrowLeft.disabled  = atEnd;
        navArrowRight.disabled = atStart;
        navArrowLeft.setAttribute('aria-disabled',  atEnd   ? 'true' : 'false');
        navArrowRight.setAttribute('aria-disabled', atStart ? 'true' : 'false');
      } else {
        navArrowLeft.disabled  = atStart;
        navArrowRight.disabled = atEnd;
        navArrowLeft.setAttribute('aria-disabled',  atStart ? 'true' : 'false');
        navArrowRight.setAttribute('aria-disabled', atEnd   ? 'true' : 'false');
      }
    }

    function initNavCarousel() {
      if (!categoryNavTabs || !navArrowLeft || !navArrowRight) return;

      navArrowLeft.addEventListener('click', function () {
        var isRtl = document.documentElement.getAttribute('dir') === 'rtl';
        categoryNavTabs.scrollBy({ left: isRtl ? SCROLL_STEP : -SCROLL_STEP, behavior: 'smooth' });
      });

      navArrowRight.addEventListener('click', function () {
        var isRtl = document.documentElement.getAttribute('dir') === 'rtl';
        categoryNavTabs.scrollBy({ left: isRtl ? -SCROLL_STEP : SCROLL_STEP, behavior: 'smooth' });
      });

      categoryNavTabs.addEventListener('scroll', updateNavArrows, { passive: true });

      // Set initial state
      updateNavArrows();
    }

    /* -----------------------------------------------------------------------
       ITEM DETAIL MODAL WINDOW (POPUP)
    ----------------------------------------------------------------------- */
    var currentOpenItem = null;

    function ensureItemModal() {
      var modal = document.getElementById('item-detail-modal');
      if (modal) return modal;

      modal = document.createElement('div');
      modal.id = 'item-detail-modal';
      modal.className = 'item-modal-backdrop';
      modal.setAttribute('role', 'dialog');
      modal.setAttribute('aria-modal', 'true');
      modal.setAttribute('aria-hidden', 'true');

      modal.innerHTML =
        '<div class="item-modal-dialog" id="item-modal-dialog">' +
          '<button class="modal-close-btn" id="modal-close-btn" type="button" aria-label="Fermer">' +
            '<span>✕</span>' +
          '</button>' +
          '<div class="modal-media" id="modal-media-wrapper">' +
            '<img id="modal-img" class="modal-img" src="" alt="">' +
          '</div>' +
          '<div class="modal-body">' +
            '<div class="modal-header-row">' +
              '<h2 class="modal-title" id="modal-title"></h2>' +
              '<span class="modal-price" id="modal-price"></span>' +
            '</div>' +
            '<div class="modal-tags" id="modal-tags"></div>' +
            '<p class="modal-desc" id="modal-desc"></p>' +
          '</div>' +
        '</div>';

      document.body.appendChild(modal);

      var closeBtn = document.getElementById('modal-close-btn');
      if (closeBtn) {
        closeBtn.addEventListener('click', closeItemModal);
      }

      modal.addEventListener('click', function (e) {
        if (e.target === modal) {
          closeItemModal();
        }
      });

      return modal;
    }

    function openItemModal(item) {
      if (!item) return;
      var modal = ensureItemModal();
      currentOpenItem = item;

      var titleEl      = document.getElementById('modal-title');
      var priceEl      = document.getElementById('modal-price');
      var descEl       = document.getElementById('modal-desc');
      var mediaWrapper = document.getElementById('modal-media-wrapper');
      var imgEl        = document.getElementById('modal-img');
      var tagsEl       = document.getElementById('modal-tags');
      var closeBtn     = document.getElementById('modal-close-btn');

      var isAr = currentLang === 'ar';
      if (closeBtn) {
        closeBtn.setAttribute('aria-label', isAr ? 'إغلاق' : 'Fermer');
      }

      var name  = getText(item.name);
      var desc  = getText(item.description);
      var price = item.price || '';

      if (titleEl) titleEl.textContent = name;
      if (priceEl) priceEl.textContent = price;
      if (descEl)  descEl.textContent  = desc;

      if (item.image && typeof item.image === 'string') {
        imgEl.src = item.image;
        imgEl.alt = name;
        mediaWrapper.style.display = 'block';
      } else {
        mediaWrapper.style.display = 'none';
      }

      if (tagsEl) {
        var tagsHtml = '';
        if (item.subcategory) {
          tagsHtml += '<span class="modal-tag-badge">' + item.subcategory + '</span>';
        }
        if (Array.isArray(item.tags)) {
          item.tags.forEach(function (tag) {
            if (tag) tagsHtml += '<span class="modal-tag-badge">' + tag + '</span>';
          });
        }
        tagsEl.innerHTML = tagsHtml;
      }

      modal.classList.add('active');
      modal.setAttribute('aria-hidden', 'false');
      document.body.classList.add('modal-open');
    }

    function closeItemModal() {
      var modal = document.getElementById('item-detail-modal');
      if (!modal) return;

      modal.classList.remove('active');
      modal.setAttribute('aria-hidden', 'true');
      document.body.classList.remove('modal-open');
      currentOpenItem = null;
    }

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' || e.key === 'Esc') {
        closeItemModal();
      }
    });

    /* -----------------------------------------------------------------------
       CATEGORY PAGE — ITEM CARDS
    ----------------------------------------------------------------------- */
    function renderCategoryPage() {
      var cats = window.categories || categories;
      var cat = cats.find(function (c) { return c.id === pageCategory; });
      if (!cat) return;

      if (categoryTitle) categoryTitle.textContent = getText(cat.name);
      if (categoryDesc)  categoryDesc.textContent  = getText(cat.description);
      if (!categoryItemsGrid) return;

      var html       = '';
      var imageUrls  = [];
      var itemsList  = cat.items || [];

      itemsList.forEach(function (item) {
        html += buildItemCard(item);
        // Collect image URLs to probe (only in normal mode, only valid strings)
        if (!dataSaverOn && item.image && typeof item.image === 'string') {
          imageUrls.push(item.image);
        }
      });

      categoryItemsGrid.innerHTML = html;

      // Wire card click events to open item detail popup window
      var cardEls = categoryItemsGrid.querySelectorAll('.menu-item-card');
      cardEls.forEach(function (cardEl, idx) {
        var item = itemsList[idx];
        if (item) {
          cardEl.addEventListener('click', function () {
            openItemModal(item);
          });
        }
      });

      // Run the timeout probe once after first normal render
      if (!dataSaverOn && imageUrls.length > 0) {
        runImageTimeoutProbe(imageUrls);
      }
    }

    /* -----------------------------------------------------------------------
       ITEM CARD HTML
    ----------------------------------------------------------------------- */
    function buildItemCard(item) {
      var name  = getText(item.name);
      var desc  = getText(item.description);
      var price = item.price || '';

      if (dataSaverOn) {
        // Text-only — no image slot, content expands cleanly
        return (
          '<article class="menu-item-card text-only">' +
            '<div class="item-content">' +
              '<h3 class="item-name">' + name + '</h3>' +
              '<p class="item-desc">' + desc + '</p>' +
              '<div class="item-footer-row">' +
                '<span class="item-price">' + price + '</span>' +
                '<span class="item-badge" aria-hidden="true">&#8250;</span>' +
              '</div>' +
            '</div>' +
          '</article>'
        );
      }

      // Normal mode: image on top
      var imgHtml = item.image
        ? '<div class="item-media"><img src="' + item.image + '" alt="' + name + '" class="item-img" loading="lazy"></div>'
        : '';

      return (
        '<article class="menu-item-card">' +
          imgHtml +
          '<div class="item-content">' +
            '<h3 class="item-name">' + name + '</h3>' +
            '<p class="item-desc">' + desc + '</p>' +
            '<div class="item-footer-row">' +
              '<span class="item-price">' + price + '</span>' +
              '<span class="item-badge" aria-hidden="true">&#8250;</span>' +
            '</div>' +
          '</div>' +
        '</article>'
      );
    }

    /* -----------------------------------------------------------------------
       LOADING STATE HELPERS
    ----------------------------------------------------------------------- */
    function showLoadingState() {
      if (!categoryItemsGrid) return;
      var isAr = currentLang === 'ar';
      var msg  = isAr ? 'جاري تحميل القائمة...' : 'Chargement du menu...';
      categoryItemsGrid.innerHTML =
        '<div class="menu-loading-state" id="menu-loading-state" aria-live="polite">' +
          '<span class="menu-loading-spinner" aria-hidden="true"></span>' +
          '<span>' + msg + '</span>' +
        '</div>';
    }

    function hideLoadingState() {
      var el = document.getElementById('menu-loading-state');
      if (el && el.parentNode) el.parentNode.removeChild(el);
    }

    /* -----------------------------------------------------------------------
       INIT
    ----------------------------------------------------------------------- */
    if (isMenuPage && typeof loadMenuData === 'function') {
      // Apply language first (tabs, header, footer) but show loading in grid
      applyLanguage(currentLang);
      initNavCarousel();   // wire arrows once DOM is ready
      showLoadingState();

      loadMenuData().then(function () {
        hideLoadingState();
        renderCategoryTabs();   // re-render tabs with live sheet categories
        renderCategoryPage();   // render items from live sheet data
      });
    } else {
      // Home page or no sheet-config.js — render synchronously as before
      applyLanguage(currentLang);
    }
  });
})();
