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
    items: [
      {
        id: 101,
        name: { fr: "Couscous Royal à l'Agneau", ar: "كسكسي ملكي باللحم" },
        description: { 
          fr: "Couscous traditionnel roulé à la main, légumes de saison, pois chiches et viande d'agneau tendre", 
          ar: "كسكسي تقليدي مصنوع يدوياً، خضار الموسم، حمص وقطع لحم خروف طري" 
        },
        price: "1 400 DA",
        image: "https://images.unsplash.com/photo-1541518763669-27fef04b14e8?w=600&auto=format&fit=crop&q=80"
      },
      {
        id: 102,
        name: { fr: "Tajine Poulet Olives & Citron Confit", ar: "طاجين دجاج بالزيتون والليمون" },
        description: { 
          fr: "Cuisses de poulet mijotées aux épices orientales, olives vertes et citron confit", 
          ar: "أفخاذ دجاج مسبكة بالبهارات الشرقية، الزيتون الأخضر والليمون المخلل" 
        },
        price: "1 200 DA",
        image: "https://images.unsplash.com/photo-1544025162-d76694265947?w=600&auto=format&fit=crop&q=80"
      }
    ]
  },
  {
    id: "salades",
    pageUrl: "salades.html",
    name: { fr: "Nos Salades", ar: "السلطات" },
    description: { 
      fr: "Salades fraîches, croquantes et assaisonnées avec des ingrédients bio", 
      ar: "سلطات طازجة ومقرمشة متبلة بأفضل المكونات الطبيعية" 
    },
    items: [
      {
        id: 201,
        name: { fr: "Salade César au Poulet Grillé", ar: "سلطة قيصر بالدجاج المشوي" },
        description: { 
          fr: "Roquette, blanc de poulet grillé, croûtons dorés, parmesan affiné et sauce césar maison", 
          ar: "جرجير، صدر دجاج مشوي، خبز محمص، جبن بارميزان وصلصة قيصر بيضاء" 
        },
        price: "900 DA",
        image: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=600&auto=format&fit=crop&q=80"
      },
      {
        id: 202,
        name: { fr: "Salade Burrata & Tomates Cerises", ar: "سلطة بوراتا والطماطم الكرزية" },
        description: { 
          fr: "Burrata fraîche italienne, tomates cerises mûres, pesto au basilic et huile d'olive vierge", 
          ar: "جبن بوراتا إيطالي طازج، طماطم كرزية، بيستو الريحان وزيت زيتون بكر" 
        },
        price: "1 200 DA",
        image: "images/dish_burrata.jpg"
      },
      {
        id: 203,
        name: { fr: "Salade Niçoise au Thon", ar: "سلطة نيسواز بالتونة" },
        description: { 
          fr: "Thon, œuf dur, haricots verts, olives noires, pommes de terre et vinaigrette", 
          ar: "تونة، بيض مسلوق، فاصولياء خضراء، زيتون أسود، بطاطس وصلصة فينيغريت" 
        },
        price: "850 DA",
        image: "https://images.unsplash.com/photo-1540420773420-3366772f4999?w=600&auto=format&fit=crop&q=80"
      }
    ]
  },
  {
    id: "plats",
    pageUrl: "plats.html",
    name: { fr: "Nos Plats", ar: "الأطباق" },
    description: { 
      fr: "Plats chauds généreux préparés à la commande par nos chefs", 
      ar: "أطباق ساخنة وغنية تحضر فور الطلب بأعلى جودة" 
    },
    items: [
      {
        id: 301,
        name: { fr: "Entrecôte Grillée (250g)", ar: "أنتركوت بقر مشوي (250غ)" },
        description: { 
          fr: "Pièce de bœuf tendre cuite au choix avec sauce au poivre ou champignons, servie avec frites", 
          ar: "قطعة لحم بقر ممتازة مشوية مع صلصة الفلفل أو المشروم وتقدم مع بطاطس مقلية" 
        },
        price: "1 800 DA",
        image: "images/dish_steak.jpg"
      },
      {
        id: 302,
        name: { fr: "Escalope Panée à la Crème", ar: "إسكالوب مقرمش بالكريمة" },
        description: { 
          fr: "Escalope de dinde dorée croustillante, sauce crème fraîche et champignons sauvages", 
          ar: "إسكالوب رومي مقرمش مع صلصة الكريمة والفطر البري" 
        },
        price: "1 100 DA",
        image: "https://images.unsplash.com/photo-1532550907401-a500c9a57435?w=600&auto=format&fit=crop&q=80"
      },
      {
        id: 303,
        name: { fr: "Filet de Poisson du Jour", ar: "فيلي سمك اليوم" },
        description: { 
          fr: "Filet de poisson frais poêlé avec légumes sautés et riz basmati au safran", 
          ar: "شريحة سمك طازجة محمرة مع خضار سوتيه وأرز بسمتي بالزعفران" 
        },
        price: "1 500 DA",
        image: "https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?w=600&auto=format&fit=crop&q=80"
      }
    ]
  },
  {
    id: "pizzas",
    pageUrl: "pizzas.html",
    name: { fr: "Nos Pizzas", ar: "البيتزا" },
    description: { 
      fr: "Pizzas artisanales cuites au feu de bois avec pâte fermentée 48h", 
      ar: "بيتزا حرفية مخبوزة على الحطب بعجينة متخمرة 48 ساعة" 
    },
    items: [
      {
        id: 401,
        name: { fr: "Pizza Margherita", ar: "بيتزا مارغريتا" },
        description: { 
          fr: "Sauce tomate italienne, mozzarella fondante et basilic frais bio", 
          ar: "صلصة طماطم إيطالية، موزاريلا ذائبة وريحان طازج" 
        },
        price: "750 DA",
        image: "https://images.unsplash.com/photo-1604382354936-07c5d9983bd3?w=600&auto=format&fit=crop&q=80"
      },
      {
        id: 402,
        name: { fr: "Pizza Quatre Fromages", ar: "بيتزا الأربعة أجبان" },
        description: { 
          fr: "Mozzarella, emmental, gorgonzola et fromage de chèvre", 
          ar: "موزاريلا، إيمنتال، جورجونزولا وجبن ماعز" 
        },
        price: "1 000 DA",
        image: "https://images.unsplash.com/photo-1573821663912-569905455b1c?w=600&auto=format&fit=crop&q=80"
      },
      {
        id: 403,
        name: { fr: "Pizza Viande Hachée", ar: "بيتزا اللحم المفروم" },
        description: { 
          fr: "Sauce tomate, mozzarella, bœuf haché épicé, oignons et poivrons grillés", 
          ar: "صلصة طماطم، موزاريلا، لحم بقر مفروم متبل، بصل وفلفل مشوي" 
        },
        price: "1 100 DA",
        image: "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=600&auto=format&fit=crop&q=80"
      },
      {
        id: 404,
        name: { fr: "Pizza Poulet Boisée", ar: "بيتزا دجاج بالفطر" },
        description: { 
          fr: "Crème fraîche, mozzarella, poulet mariné grillé et champignons de paris", 
          ar: "كريمة طازجة، موزاريلا، دجاج متبل مشوي وفطر طازج" 
        },
        price: "1 050 DA",
        image: "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=600&auto=format&fit=crop&q=80"
      }
    ]
  },
  {
    id: "grillades",
    pageUrl: "grillades.html",
    name: { fr: "Nos Grillades", ar: "المشويات" },
    description: { 
      fr: "Grillades au feu de bois tendres et juteuses préparées à la minute", 
      ar: "مشويات على الفحم طرية ولذيذة تحضر فور الطلب" 
    },
    items: [
      {
        id: 501,
        name: { fr: "Mix Grill (1 Personne)", ar: "مشاوي مشكلة شخص واحد" },
        description: { 
          fr: "Brochette d'agneau, brochette de poulet, merguez artisanale et frites maison", 
          ar: "شيش غنم، شيش دجاج، مرقاز بلدي مع بطاطس مقلية طازجة" 
        },
        price: "1 600 DA",
        image: "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=600&auto=format&fit=crop&q=80"
      },
      {
        id: 502,
        name: { fr: "Côtelettes d'Agneau Grillées", ar: "أضلع خروف مشوية" },
        description: { 
          fr: "4 pièces d'agneau fraîches assaisonnées aux herbes de Provence et ail rôti", 
          ar: "4 قطع أضلع خروف طازجة متبلة بالأعشاب والثوم المشوي" 
        },
        price: "2 000 DA",
        image: "https://images.unsplash.com/photo-1544025162-d76694265947?w=600&auto=format&fit=crop&q=80"
      },
      {
        id: 503,
        name: { fr: "Brochettes de Poulet Tandoori", ar: "شيش طاووق تندوري" },
        description: { 
          fr: "Poulet mariné aux épices indiennes grillé sur broche avec frites", 
          ar: "قطع دجاج متبلة بالبهارات الهندية مشوية مع بطاطس مقلية" 
        },
        price: "950 DA",
        image: "https://images.unsplash.com/photo-1529193591184-b1d58069ecdd?w=600&auto=format&fit=crop&q=80"
      },
      {
        id: 504,
        name: { fr: "Merguez Artisanales (5 pièces)", ar: "مرقاز بلدي (5 قطع)" },
        description: { 
          fr: "Merguez pur bœuf et agneau épicées préparées maison", 
          ar: "مرقاز بلدي طازج متبل بالبهارات الجزائرية الأصيلة" 
        },
        price: "900 DA",
        image: "https://images.unsplash.com/photo-1544025162-d76694265947?w=600&auto=format&fit=crop&q=80"
      }
    ]
  },
  {
    id: "pattes",
    pageUrl: "pattes.html",
    name: { fr: "Nos Pâtes", ar: "المعكرونة" },
    description: { 
      fr: "Recettes de pâtes italiennes traditionnelles et sauces maison", 
      ar: "وصفات معكرونة إيطالية تقليدية بصلصات طازجة" 
    },
    items: [
      {
        id: 601,
        name: { fr: "Spaghetti Bolognese", ar: "سباغيتي بولونيز" },
        description: { 
          fr: "Sauce tomate maison mijotée au bœuf haché, persil et basilic", 
          ar: "صلصة طماطم مسبكة مع لحم بقر مفروم وبقدونس" 
        },
        price: "1 000 DA",
        image: "https://images.unsplash.com/photo-1621996346565-e3d5d6281288?w=600&auto=format&fit=crop&q=80"
      },
      {
        id: 602,
        name: { fr: "Tagliatelles au Saumon Fumé", ar: "تالياتيلي بالسلمون المدخن" },
        description: { 
          fr: "Pâtes fraîches enrobées d'une crème légère au saumon fumé et ciboulette", 
          ar: "معكرونة طازجة مع كريمة خفيفة وسالمون مدخن" 
        },
        price: "1 400 DA",
        image: "https://images.unsplash.com/photo-1551183053-bf91a1d81141?w=600&auto=format&fit=crop&q=80"
      },
      {
        id: 603,
        name: { fr: "Penne Carbonara", ar: "بيني كربونات" },
        description: { 
          fr: "Crème fraîche, lardons de dinde, jaune d'œuf et parmesan gratiné", 
          ar: "كريمة طازجة، شرائح رومي، صفار البيض وجبن البارميزان" 
        },
        price: "1 100 DA",
        image: "https://images.unsplash.com/photo-1608897013039-887f21d8c804?w=600&auto=format&fit=crop&q=80"
      }
    ]
  },
  {
    id: "tacos",
    pageUrl: "tacos.html",
    name: { fr: "Nos Tacos", ar: "الطاكوس" },
    description: { 
      fr: "Tacos français gouteux garnis de frites et sauce fromagère spéciale", 
      ar: "طاكوس فرنسي شهي محشو بالبطاطس المقلية وصلصة الجبن الخاصة" 
    },
    items: [
      {
        id: 701,
        name: { fr: "Tacos Poulet Pané", ar: "طاكوس دجاج مقرمش" },
        description: { 
          fr: "Poulet croustillant, sauce fromagère maison, frites et salade", 
          ar: "دجاج مقرمش، صلصة الجبن البيضاء، بطاطس وسلطة" 
        },
        price: "700 DA",
        image: "https://images.unsplash.com/photo-1565299585323-38d6b0865b47?w=600&auto=format&fit=crop&q=80"
      },
      {
        id: 702,
        name: { fr: "Tacos Viande Hachée", ar: "طاكوس لحم مفروم" },
        description: { 
          fr: "Viande de bœuf hachée épicée, sauce fromagère onctueuse et frites", 
          ar: "لحم بقر مفروم متبل، صلصة الجبن وبطاطس مقلية" 
        },
        price: "750 DA",
        image: "https://images.unsplash.com/photo-1551504734-5ee1c4a1479b?w=600&auto=format&fit=crop&q=80"
      },
      {
        id: 703,
        name: { fr: "Tacos Mixte (Poulet + Bœuf)", ar: "طاكوس مشكل (دجاج + لحم)" },
        description: { 
          fr: "Double viande poulet & bœuf haché, sauce fromagère et frites", 
          ar: "دجاج ولحم مفروم مع صلصة الجبن الغنية وبطاطس مقلية" 
        },
        price: "850 DA",
        image: "https://images.unsplash.com/photo-1615870216519-2f9fa575fa5c?w=600&auto=format&fit=crop&q=80"
      }
    ]
  },
  {
    id: "boissons",
    pageUrl: "boissons.html",
    name: { fr: "Nos Boissons", ar: "المشروبات" },
    description: { 
      fr: "Rafraîchissements, jus frais pressés et thés parfumés", 
      ar: "عصائر طازجة، مشروبات باردة وشاي معطر" 
    },
    items: [
      {
        id: 801,
        name: { fr: "Mojito Citron & Menthe", ar: "موهيتو بالليمون والنعناع" },
        description: { 
          fr: "Citron vert pilonné, menthe fraîche, eau gazeuse et glace pilée", 
          ar: "ليمون أخضر مفروم، نعناع طازج، صودا وجليد مجروش" 
        },
        price: "400 DA",
        image: "images/dish_cocktail.jpg"
      },
      {
        id: 802,
        name: { fr: "Jus d'Orange Frais Pressé", ar: "عصير برتقال طبيعي طازج" },
        description: { 
          fr: "100% oranges naturelles pressées à la commande", 
          ar: "برتقال طبيعي 100% معصور فور الطلب" 
        },
        price: "350 DA",
        image: "https://images.unsplash.com/photo-1613478223719-2ab802602423?w=600&auto=format&fit=crop&q=80"
      },
      {
        id: 803,
        name: { fr: "Soda Canette (33cl)", ar: "مشروب غازي (33سل)" },
        description: { 
          fr: "Coca-Cola, Fanta, Sprite ou Selecto au choix", 
          ar: "كوكاكولا، فانتا، سبرايت أو سيليكتو من اختيارك" 
        },
        price: "150 DA",
        image: "https://images.unsplash.com/photo-1622483767028-3f66f32aef97?w=600&auto=format&fit=crop&q=80"
      },
      {
        id: 804,
        name: { fr: "Eau Minérale (1.5L)", ar: "ماء معدني (1.5ل)" },
        description: { 
          fr: "Bouteille d'eau minérale fraîche", 
          ar: "قارورة ماء معدني باردة" 
        },
        price: "100 DA",
        image: "https://images.unsplash.com/photo-1548839140-29a749e1bc4e?w=600&auto=format&fit=crop&q=80"
      }
    ]
  },
  {
    id: "desserts",
    pageUrl: "desserts.html",
    name: { fr: "Nos Desserts", ar: "الحلويات" },
    description: { 
      fr: "Gourmandises sucrées faites maison pour bien terminer le repas", 
      ar: "حلويات منزلية شهية لختام وجبة مثالي" 
    },
    items: [
      {
        id: 901,
        name: { fr: "Fondant au Chocolat", ar: "فوندان الشوكولاتة" },
        description: { 
          fr: "Cœur coulant au chocolat noir tiède servi avec une boule de glace vanille", 
          ar: "كيك شوكولاتة دافئة مع مركز ذائب يقدم مع كرة أيس كريم فانيليا" 
        },
        price: "650 DA",
        image: "images/dish_dessert.jpg"
      },
      {
        id: 902,
        name: { fr: "Tiramisu Maison", ar: "تيراميسو المنزل" },
        description: { 
          fr: "Recette traditionnelle italienne au café espresso et crème mascarpone", 
          ar: "وصفة تيراميسو كلاسيكية بالإسبريسو وكريمة الماسكاربون" 
        },
        price: "550 DA",
        image: "https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?w=600&auto=format&fit=crop&q=80"
      },
      {
        id: 903,
        name: { fr: "Salade de Fruits Frais", ar: "سلطة فواكه طازجة" },
        description: { 
          fr: "Fruits de saison découpés avec sirop d'orange et menthe", 
          ar: "تشكيلة فواكه الموسم الطازجة مع قطر ماء الزهر" 
        },
        price: "450 DA",
        image: "https://images.unsplash.com/photo-1490474418585-ba9bad8fd0ea?w=600&auto=format&fit=crop&q=80"
      }
    ]
  }
];
