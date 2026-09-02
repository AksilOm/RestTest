/**
 * ============================================================================
 * SHEET-CONFIG.JS — GOOGLE SHEETS CSV MENU LOADER
 * ============================================================================
 * HOW TO USE:
 *   1. In Google Sheets → File → Share → Publish to web
 *   2. Choose the sheet tab that contains your menu, format: CSV
 *   3. Click "Publish" and copy the URL
 *   4. Paste it below as the value of SHEET_CSV_URL
 *
 * COLUMN ORDER (case-insensitive, first row = headers):
 *   category | subcategory | name_fr | name_ar | description_fr |
 *   description_ar | price | tags | image_url
 *
 * FALLBACK: If the fetch fails or the CSV is empty/malformed, the site
 * silently falls back to the categories array already defined in
 * menu-data.js — no visible error to the end user.
 *
 * SWAP PER CLIENT: To disable Google Sheets for a client and use only
 * the static file, set SHEET_CSV_URL to "" (empty string).
 * ============================================================================
 */

/* ------------------------------------------------------------------ */
/* ① CONFIGURATION                                                     */
/* ------------------------------------------------------------------ */

/**
 * Paste your published Google Sheet CSV URL here.
 * Leave as "PASTE_PUBLISHED_CSV_URL_HERE" (or "") to always use static data.
 *
 * @example
 * var SHEET_CSV_URL =
 *   "https://docs.google.com/spreadsheets/d/e/XXXX/pub?output=csv";
 */
var SHEET_CSV_URL = "https://docs.google.com/spreadsheets/d/e/2PACX-1vSEYxL54N4nZIJWVXjJkCqVavy0BR4OCk3kCO5NxOP8HZyM5CCbbvgfdE_i75nQiXn3urrep7yKqngc/pub?gid=0&single=true&output=csv";

/** Milliseconds to wait for the fetch before giving up and using fallback. */
var SHEET_FETCH_TIMEOUT_MS = 5000;

/* ------------------------------------------------------------------ */
/* ② CSV PARSER                                                        */
/* ------------------------------------------------------------------ */

/**
 * Minimal RFC-4180-compliant CSV parser.
 * Correctly handles:
 *   - Quoted fields that contain commas, newlines, and escaped quotes ("")
 *   - Unquoted fields with leading/trailing whitespace stripped
 *
 * @param {string} text  Raw CSV string
 * @returns {string[][]} 2-D array of rows x cells
 */
function parseCSV(text) {
  var rows = [];
  var row = [];
  var i = 0;
  var len = text.length;

  while (i < len) {
    /* Quoted field */
    if (text[i] === '"') {
      i++; // skip opening quote
      var cell = '';
      while (i < len) {
        if (text[i] === '"') {
          if (i + 1 < len && text[i + 1] === '"') {
            // Escaped quote -> literal "
            cell += '"';
            i += 2;
          } else {
            // Closing quote
            i++;
            break;
          }
        } else {
          cell += text[i];
          i++;
        }
      }
      row.push(cell);
    } else {
      /* Unquoted field */
      var start = i;
      while (i < len && text[i] !== ',' && text[i] !== '\n' && text[i] !== '\r') {
        i++;
      }
      row.push(text.slice(start, i).trim());
    }

    /* Field separator or row terminator */
    if (i < len && text[i] === ',') {
      i++; // next field in same row
    } else if (i < len && (text[i] === '\n' || text[i] === '\r')) {
      rows.push(row);
      row = [];
      if (text[i] === '\r' && i + 1 < len && text[i + 1] === '\n') i++; // CRLF
      i++;
    }
  }

  // Push the last row if it has content
  if (row.length > 0 && !(row.length === 1 && row[0] === '')) {
    rows.push(row);
  }

  return rows;
}

/* ------------------------------------------------------------------ */
/* ③ CSV -> categories CONVERTER                                       */
/* ------------------------------------------------------------------ */

/**
 * Converts a parsed 2-D CSV array into the same nested structure that
 * menu-data.js uses, so that the existing rendering logic in script.js
 * requires zero changes.
 *
 * Expected headers (case-insensitive):
 *   category, subcategory, name_fr, name_ar, description_fr,
 *   description_ar, price, tags, image_url
 *
 * The "tags" field may use commas OR semicolons as separators:
 *   e.g. "vegetarian;chefSpecial" or "vegetarian,chefSpecial"
 *
 * @param {string[][]} rows  Output of parseCSV()
 * @returns {Array|null}  categories-compatible array, or null if invalid
 */
function csvToCategories(rows) {
  if (!rows || rows.length < 2) return null;

  // Normalise header names -> column index map
  var headers = rows[0].map(function (h) { return h.toLowerCase().trim(); });

  function col(name) { return headers.indexOf(name); }

  var iCat    = col('category');
  var iSub    = col('subcategory');
  var iNameFr = col('name_fr');
  var iNameAr = col('name_ar');
  var iDescFr = col('description_fr');
  var iDescAr = col('description_ar');
  var iPrice  = col('price');
  var iTags   = col('tags');
  var iImg    = col('image_url');

  // Must have at minimum: category, name_fr, price
  if (iCat < 0 || iNameFr < 0 || iPrice < 0) {
    console.warn(
      '[sheet-config] CSV is missing required columns (category, name_fr, price). ' +
      'Falling back to static data.'
    );
    return null;
  }

  function cell(row, idx) { return idx >= 0 ? (row[idx] || '').trim() : ''; }

  // Build an ordered map: categoryId -> category object
  var categoryMap = {};
  var categoryOrder = [];
  var autoId = 1;

  rows.slice(1).forEach(function (row) {
    // Skip blank rows
    if (row.every(function (c) { return c === ''; })) return;

    var catRaw = cell(row, iCat);
    if (!catRaw) return; // row must have a category

    // Derive a slug-style ID from the category name
    var catId = catRaw.toLowerCase()
      .replace(/\s+/g, '-')
      .replace(/[^a-z0-9\-]/g, '');

    if (!categoryMap[catId]) {
      // Try to match existing category by ID or by name (fr/ar)
      var staticCat = (typeof categories !== 'undefined')
        ? categories.find(function (c) {
            if (c.id === catId) return true;
            if (c.name) {
              if (c.name.fr && c.name.fr.toLowerCase().trim() === catRaw.toLowerCase().trim()) return true;
              if (c.name.ar && c.name.ar.toLowerCase().trim() === catRaw.toLowerCase().trim()) return true;
            }
            return false;
          })
        : null;

      categoryMap[catId] = {
        id:          catId,
        pageUrl:     staticCat ? staticCat.pageUrl : 'pizzas.html?cat=' + catId,
        name:        staticCat ? staticCat.name : { fr: catRaw, ar: catRaw },
        description: staticCat ? staticCat.description : { fr: '', ar: '' },
        items:       []
      };
      categoryOrder.push(catId);
    }

    // Parse tags — accept ";" or "," as delimiter
    var tagsRaw = cell(row, iTags);
    var tagsArr = tagsRaw
      ? tagsRaw.split(/[;,]/).map(function (t) { return t.trim(); }).filter(Boolean)
      : [];

    // Convert Google Drive share links into direct image URLs if necessary
    var rawImg = cell(row, iImg);
    var formattedImg = rawImg;
    if (rawImg) {
      var driveMatch = rawImg.match(/\/file\/d\/([^\/\?]+)/) || rawImg.match(/[?&]id=([^&]+)/);
      if (driveMatch && driveMatch[1]) {
        formattedImg = 'https://lh3.googleusercontent.com/d/' + driveMatch[1];
      }
    }

    var item = {
      id:          autoId++,
      name:        { fr: cell(row, iNameFr), ar: cell(row, iNameAr) || cell(row, iNameFr) },
      description: { fr: cell(row, iDescFr), ar: cell(row, iDescAr) || cell(row, iDescFr) },
      price:       cell(row, iPrice),
      image:       formattedImg || null,
      tags:        tagsArr
    };

    // Attach subcategory if present (informational, stored on the item)
    var sub = cell(row, iSub);
    if (sub) item.subcategory = sub;

    categoryMap[catId].items.push(item);
  });

  if (categoryOrder.length === 0) return null;

  return categoryOrder.map(function (id) { return categoryMap[id]; });
}

/* ------------------------------------------------------------------ */
/* ④ MAIN LOADER                                                       */
/* ------------------------------------------------------------------ */

/**
 * loadMenuData()
 *
 * Fetches the published Google Sheet CSV, parses it, and overwrites the
 * global `categories` array so the rest of script.js renders from live
 * sheet data.
 *
 * Resolution behaviour:
 *   - Always resolves (never rejects) — fallback is handled internally.
 *   - Resolves with "sheet"  if CSV was fetched and parsed successfully.
 *   - Resolves with "static" if fetch failed or CSV was invalid — the
 *     static categories from menu-data.js are used unchanged.
 *
 * Memory cache:
 *   Result is cached on window.__menuDataCache so subsequent tab switches
 *   and category re-renders don't re-fetch.
 *
 * @returns {Promise<"sheet"|"static">}
 */
function loadMenuData() {
  // Already cached this session
  if (window.__menuDataCache) {
    return Promise.resolve(window.__menuDataCache.source);
  }

  // No URL configured — use static data
  var url = (typeof SHEET_CSV_URL === 'string') ? SHEET_CSV_URL.trim() : '';
  if (!url || url === 'PASTE_PUBLISHED_CSV_URL_HERE') {
    window.__menuDataCache = { source: 'static' };
    return Promise.resolve('static');
  }

  // Fetch with timeout race
  var timeoutId;

  var fetchPromise = fetch(url).then(function (response) {
    if (!response.ok) {
      throw new Error('HTTP ' + response.status);
    }
    return response.text();
  });

  var timeoutPromise = new Promise(function (_, reject) {
    timeoutId = setTimeout(function () {
      reject(new Error('Fetch timed out after ' + SHEET_FETCH_TIMEOUT_MS + 'ms'));
    }, SHEET_FETCH_TIMEOUT_MS);
  });

  return Promise.race([fetchPromise, timeoutPromise])
    .then(function (csvText) {
      clearTimeout(timeoutId);

      if (!csvText || !csvText.trim()) {
        throw new Error('CSV response was empty');
      }

      var rows = parseCSV(csvText);
      var parsed = csvToCategories(rows);

      if (!parsed) {
        throw new Error('CSV could not be converted to menu structure');
      }

      // Overwrite the global categories with live sheet data
      window.categories = parsed;

      window.__menuDataCache = { source: 'sheet' };
      console.info(
        '[sheet-config] Menu loaded from Google Sheet (' +
        parsed.length + ' categories).'
      );
      return 'sheet';
    })
    .catch(function (err) {
      clearTimeout(timeoutId);
      console.warn(
        '[sheet-config] Could not load menu from Google Sheet — ' +
        'falling back to static data. Reason:', err.message || err
      );
      // Leave global `categories` unchanged (static data from menu-data.js)
      window.__menuDataCache = { source: 'static' };
      return 'static';
    });
}
