/**
 * ============================================================================
 * RESTAURANT & MENU DATA CONFIGURATION
 * ============================================================================
 * Contains text in both French (fr) and Arabic (ar) for all categories, items,
 * and restaurant details.
 * ============================================================================
 */

const restaurant = {
  name: { 
    fr: "L'Arôme Gourmet", 
    ar: "مطعم العاروم غورميه" 
  },
  tagline: { 
    fr: "Saveurs authentiques & cuisine artisanale au feu de bois", 
    ar: "أذواق أصيلة ومأكولات طازجة على الفحم" 
  },
  about: {
    fr: "Bienvenue chez L'Arôme Gourmet, votre destination culinaire raffinée. Nous sublimons chaque ingrédient avec une cuisson authentique au feu de bois et une passion pour la haute gastronomie.",
    ar: "مرحباً بكم في مطعم العاروم غورميه، وجهتكم الفاخرة في قلب الجزائر العاصمة. نقدم لكم أجود المكونات الطازجة مع طهي أصيل على الفحم."
  },
  logo: "images/logo.jpg",
  heroImage: "images/hero_bg.jpg",

  phone: "+213 550 12 34 56",
  address: { 
    fr: "12 Rue des Délices, Hydra, Alger", 
    ar: "12 شارع اللذائذ، حيدرة، الجزائر العاصمة" 
  },
  hours: { 
    fr: "Tous les jours: 11h30 - 23h30", 
    ar: "يومياً: 11:30 صباحاً - 11:30 مساءً" 
  },

  socialLinks: {
    instagram: "https://instagram.com",
    facebook: "https://facebook.com",
    whatsapp: "https://wa.me/213550123456"
  },

  googleMapsEmbed: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3196.8839062369235!2d3.0456123!3d36.7525123!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x128fb2f36c535787%3A0xc48c0879f9765373!2sHydra%2C%20Algeria!5e0!3m2!1sen!2sdz!4v1700000000000!5m2!1sen!2sdz"
};

const categories = [
  {
    id: "plat-du-jour",
    pageUrl: "plat-du-jour.html",
    name: { fr: "Plat du Jour", ar: "طبق اليوم" },
    description: { 
      fr: "Notre spécialité maison mijotée fraîchement chaque matin par notre chef", 
      ar: "طبقنا الخاص المحضر طازجاً كل صباح من قبل الشيف" 
    },
    items: []
  },
  {
    id: "salades",
    pageUrl: "salades.html",
    name: { fr: "Nos Salades", ar: "السلطات" },
    description: { 
      fr: "Salades fraîches, croquantes et assaisonnées avec des ingrédients bio", 
      ar: "سلطات طازجة ومقرمشة متبلة بأفضل المكونات الطبيعية" 
    },
    items: []
  },
  {
    id: "plats",
    pageUrl: "plats.html",
    name: { fr: "Nos Plats", ar: "الأطباق" },
    description: { 
      fr: "Plats chauds généreux préparés à la commande par nos chefs", 
      ar: "أطباق ساخنة وغنية تحضر فور الطلب بأعلى جودة" 
    },
    items: []
  },
  {
    id: "pizzas",
    pageUrl: "pizzas.html",
    name: { fr: "Nos Pizzas", ar: "البيتزا" },
    description: { 
      fr: "Pizzas artisanales cuites au feu de bois avec pâte fermentée 48h", 
      ar: "بيتزا حرفية مخبوزة على الحطب بعجينة متخمرة 48 ساعة" 
    },
    items: []
  },
  {
    id: "grillades",
    pageUrl: "grillades.html",
    name: { fr: "Nos Grillades", ar: "المشويات" },
    description: { 
      fr: "Grillades au feu de bois tendres et juteuses préparées à la minute", 
      ar: "مشويات على الفحم طرية ولذيذة تحضر فور الطلب" 
    },
    items: []
  },
  {
    id: "pattes",
    pageUrl: "pattes.html",
    name: { fr: "Nos Pâtes", ar: "المعكرونة" },
    description: { 
      fr: "Recettes de pâtes italiennes traditionnelles et sauces maison", 
      ar: "وصفات معكرونة إيطالية تقليدية بصلصات طازجة" 
    },
    items: []
  },
  {
    id: "tacos",
    pageUrl: "tacos.html",
    name: { fr: "Nos Tacos", ar: "الطاكوس" },
    description: { 
      fr: "Tacos français gouteux garnis de frites et sauce fromagère spéciale", 
      ar: "طاكوس فرنسي شهي محشو بالبطاطس المقلية وصلصة الجبن الخاصة" 
    },
    items: []
  },
  {
    id: "boissons",
    pageUrl: "boissons.html",
    name: { fr: "Nos Boissons", ar: "المشروبات" },
    description: { 
      fr: "Rafraîchissements, jus frais pressés et thés parfumés", 
      ar: "عصائر طازجة، مشروبات باردة وشاي معطر" 
    },
    items: []
  },
  {
    id: "desserts",
    pageUrl: "desserts.html",
    name: { fr: "Nos Desserts", ar: "الحلويات" },
    description: { 
      fr: "Gourmandises sucrées faites maison pour bien terminer le repas", 
      ar: "حلويات منزلية شهية لختام وجبة مثالي" 
    },
    items: []
  }
];
