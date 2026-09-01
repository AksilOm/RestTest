/**
 * ============================================================================
 * RESTAURANT & MENU DATA CONFIGURATION
 * ============================================================================
 * Edit this single file to customize the entire restaurant website.
 * No need to touch index.html, style.css, or script.js when onboarding a new client!
 * ============================================================================
 */

const restaurant = {
  name: "L'Arôme Gourmet",
  tagline: "Authentic Culinary Delights & Modern Gastronomy",
  logo: "images/logo.jpg",
  heroImage: "images/hero_bg.jpg",
  
  // Theme Color Palette (Automatically injected into CSS variables)
  colors: {
    primary: "#141416",      // Main dark color (headers, primary accents, luxury dark background)
    secondary: "#f9f7f2",    // Light background & card container color
    accent: "#d4af37",       // Gold / Highlight theme color
    accentHover: "#b59226",  // Hover state for gold accent
    text: "#1f1e1c",         // Main text color
    textMuted: "#6e6b66",    // Secondary/muted text color
    bgLight: "#f4f0e8",      // Warm subtle body background
    cardBg: "#ffffff"        // Menu card background
  },

  phone: "+213 550 12 34 56",
  address: "12 Rue des Délices, Hydra, Algiers",
  hours: "Mon - Sun: 11:30 AM - 11:00 PM",

  socialLinks: {
    instagram: "https://instagram.com",
    facebook: "https://facebook.com",
    whatsapp: "https://wa.me/213550123456"
  },

  // Responsive Google Maps Iframe Embed URL
  googleMapsEmbed: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3196.8839062369235!2d3.0456123!3d36.7525123!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x128fb2f36c535787%3A0xc48c0879f9765373!2sHydra%2C%20Algeria!5e0!3m2!1sen!2sdz!4v1700000000000!5m2!1sen!2sdz"
};

const menu = [
  {
    id: "starters",
    category: "Starters & Appetizers",
    icon: "🥗",
    items: [
      {
        id: 1,
        name: "Truffle Burrata Salad",
        description: "Fresh Italian burrata with heirloom tomatoes, wild rocket, pine nuts, basil pesto, and aged balsamic reduction.",
        price: "1,400 DA",
        image: "images/dish_burrata.jpg",
        badges: ["Vegetarian", "Chef Special"],
        calories: "420 kcal"
      },
      {
        id: 2,
        name: "Crispy Calamari Fritti",
        description: "Tender Atlantic squid rings in seasoned golden batter, served with spicy garlic aioli and fresh lemon wedges.",
        price: "1,200 DA",
        image: "",
        badges: ["Seafood", "Spicy"],
        calories: "380 kcal"
      },
      {
        id: 3,
        name: "Artisanal Tomato Bruschetta",
        description: "Toasted sourdough slices topped with vine-ripened tomatoes, garlic, fresh basil, and extra virgin olive oil.",
        price: "850 DA",
        image: "",
        badges: ["Vegan"],
        calories: "290 kcal"
      }
    ]
  },
  {
    id: "mains",
    category: "Main Dishes",
    icon: "🥩",
    items: [
      {
        id: 4,
        name: "Charbroiled Wagyu Ribeye",
        description: "250g Prime Wagyu beef ribeye served with truffle potato puree, grilled asparagus, and red wine jus reduction.",
        price: "3,800 DA",
        image: "images/dish_steak.jpg",
        badges: ["Chef Special", "Gluten Free"],
        calories: "780 kcal"
      },
      {
        id: 5,
        name: "Wild Mushroom Tagliatelle",
        description: "Handcrafted egg pasta tossed in a rich truffle cream sauce with porcini, chanterelles, and aged Parmigiano Reggiano.",
        price: "2,200 DA",
        image: "",
        badges: ["Vegetarian"],
        calories: "610 kcal"
      },
      {
        id: 6,
        name: "Pan-Seared Sea Bass",
        description: "Fresh Mediterranean sea bass fillet over saffron risotto, braised fennel, and citrus beurre blanc.",
        price: "2,900 DA",
        image: "",
        badges: ["Gluten Free", "Seafood"],
        calories: "520 kcal"
      }
    ]
  },
  {
    id: "desserts",
    category: "Desserts & Sweets",
    icon: "🍰",
    items: [
      {
        id: 7,
        name: "Molten Chocolate Fondant",
        description: "Warm Belgian dark chocolate cake with a lava molten center, served with house-made pistachio ice cream.",
        price: "950 DA",
        image: "images/dish_dessert.jpg",
        badges: ["Chef Special", "Popular"],
        calories: "510 kcal"
      },
      {
        id: 8,
        name: "Classic Italian Tiramisu",
        description: "Traditional ladyfingers soaked in espresso and dark rum, layered with whipped mascarpone cream and Valrhona cocoa.",
        price: "850 DA",
        image: "",
        badges: ["Vegetarian"],
        calories: "440 kcal"
      }
    ]
  },
  {
    id: "beverages",
    category: "Craft Drinks & Cocktails",
    icon: "🍹",
    items: [
      {
        id: 9,
        name: "Smoked Citrus Old Fashioned",
        description: "Craft mocktail with charred orange, aromatic botanical bitters, maple infusion, and crystal ice sphere.",
        price: "750 DA",
        image: "images/dish_cocktail.jpg",
        badges: ["Signature"],
        calories: "160 kcal"
      },
      {
        id: 10,
        name: "Hibiscus Berry Mint Cooler",
        description: "Refreshing cold brew hibiscus tea with fresh raspberries, crushed mint, lime juice, and sparkling soda.",
        price: "550 DA",
        image: "",
        badges: ["Vegan", "Popular"],
        calories: "90 kcal"
      },
      {
        id: 11,
        name: "Artisanal Espresso Single Origin",
        description: "Double shot of freshly roasted Ethiopian Yirgacheffe coffee beans with subtle jasmine notes.",
        price: "350 DA",
        image: "",
        badges: ["Hot"],
        calories: "5 kcal"
      }
    ]
  }
];
