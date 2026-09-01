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

    var pageCategory = document.body.dataset.category || 'home';
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
      return currentLang === 'ar' ? base + '?lang=ar' : base;
    }

    /* -----------------------------------------------------------------------
       DOM REFS
    ----------------------------------------------------------------------- */
    var htmlEl           = document.documentElement;
    var langToggleBtn    = document.getElementById('lang-toggle-btn');
    var langToggleText   = document.getElementById('lang-toggle-text');
    var headerName       = document.getElementById('header-name');
    var headerBadge      = document.getElementById('header-badge');
    var headerCallText   = document.getElementById('header-call-text');
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
      if (headerCallText) headerCallText.textContent  = isAr ? 'اتصل' : 'Appeler';
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
       CATEGORY NAV TABS
    ----------------------------------------------------------------------- */
    function renderCategoryTabs() {
      if (!categoryNavTabs) return;
      var html = '';
      categories.forEach(function (cat) {
        var active = pageCategory === cat.id ? 'active' : '';
        html += '<a href="' + langUrl(cat.pageUrl) + '" class="tab-btn ' + active + '">' + getText(cat.name) + '</a>';
      });
      categoryNavTabs.innerHTML = html;

      var activeTab = categoryNavTabs.querySelector('.tab-btn.active');
      if (activeTab) activeTab.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
    }

    /* -----------------------------------------------------------------------
       CATEGORY PAGE — ITEM CARDS
    ----------------------------------------------------------------------- */
    function renderCategoryPage() {
      var cat = categories.find(function (c) { return c.id === pageCategory; });
      if (!cat) return;

      if (categoryTitle) categoryTitle.textContent = getText(cat.name);
      if (categoryDesc)  categoryDesc.textContent  = getText(cat.description);
      if (!categoryItemsGrid) return;

      var html       = '';
      var imageUrls  = [];

      (cat.items || []).forEach(function (item) {
        html += buildItemCard(item);
        // Collect image URLs to probe (only in normal mode, only valid strings)
        if (!dataSaverOn && item.image && typeof item.image === 'string') {
          imageUrls.push(item.image);
        }
      });

      categoryItemsGrid.innerHTML = html;

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
       INIT
    ----------------------------------------------------------------------- */
    applyLanguage(currentLang);
  });
})();
