/**
 * Central multilingual content for the Yakkachinar website.
 *
 * Every visible string lives here in Tajik (tj), Russian (ru) and English (en).
 * - The `Translation` interface turns a missing key into a compile error.
 * - `npm run i18n:check` additionally audits empty strings, shape mismatches and
 *   accidental language mixing (e.g. Russian-only letters inside Tajik copy).
 *
 * Conventions:
 * - `titleLines` are art-directed headline line breaks; each language may use its own count.
 * - `{placeholders}` are filled at render time with `format()` from `src/i18n/format.ts`.
 * - Brand names that stay in Latin script everywhere: Yakkachinar wordmark, Google, Instagram, Plus Code.
 *
 * This file must stay free of runtime imports so the Node audit script can load it directly.
 */

export type Language = 'tj' | 'ru' | 'en';

export interface LanguageMeta {
  code: Language;
  /** Short code shown in the switcher. */
  short: string;
  /** Native language name, used for accessible labels. */
  native: string;
  /** BCP 47 tag for `<html lang>` — Tajik is `tg`. */
  htmlLang: string;
  /** Locale for number formatting (decimal comma and space grouping in Tajik and Russian). */
  numberLocale: string;
}

export const LANGUAGES: readonly LanguageMeta[] = [
  { code: 'tj', short: 'TJ', native: 'Тоҷикӣ', htmlLang: 'tg', numberLocale: 'ru-RU' },
  { code: 'ru', short: 'RU', native: 'Русский', htmlLang: 'ru', numberLocale: 'ru-RU' },
  { code: 'en', short: 'EN', native: 'English', htmlLang: 'en', numberLocale: 'en-US' },
];

export type NavKey = 'overview' | 'experience' | 'menu' | 'gallery' | 'events' | 'reviews' | 'location';
export type PillarKey = 'cuisine' | 'music' | 'interior' | 'celebrations';
export type DishId =
  | 'cheesePlate'
  | 'khachapuri'
  | 'cheeseSticks'
  | 'chickenSteak'
  | 'olivier'
  | 'meatPlatter'
  | 'pickles'
  | 'greenBorscht'
  | 'shashlik';
export type DishCategory = 'coldStarters' | 'hotStarters' | 'salads' | 'soups' | 'grill' | 'mains' | 'bakery';
export type GalleryFilter = 'all' | 'food' | 'atmosphere' | 'moments';
export type OccasionKey = 'weddings' | 'celebrations' | 'private' | 'special' | 'gatherings';
/** Non-dish photography slots. Dish photos are keyed by DishId and described by the dish name. */
export type PhotoKey =
  | 'hero'
  | 'experienceMain'
  | 'experienceDetail'
  | 'entertainment'
  | 'stage'
  | 'weddings'
  | 'celebrations'
  | 'privateEvents'
  | 'specialOccasions'
  | 'gatherings'
  | 'reservation'
  | 'lounge'
  | 'chandelier'
  | 'toast'
  | 'dinner'
  | 'banquet'
  | 'tableDetail';
export type ImageId = PhotoKey | DishId;

type Lines = readonly string[];
interface TitleText {
  title: string;
  text: string;
}

export interface Translation {
  meta: { title: string; description: string };
  a11y: {
    skipToContent: string;
    mainNavigation: string;
    languageSwitcher: string;
    openMenu: string;
    closeMenu: string;
    close: string;
    previousImage: string;
    nextImage: string;
    newTab: string;
    imageCounter: string;
    ratingStars: string;
    backToTop: string;
    homeLink: string;
    galleryDialog: string;
    openPhoto: string;
    openDish: string;
    copyPlusCode: string;
    mapTitle: string;
    instagramImage: string;
    logoAlt: string;
  };
  cursor: { view: string; explore: string };
  nav: Record<NavKey, string>;
  actions: {
    reserve: string;
    reserveShort: string;
    call: string;
    callShort: string;
    directions: string;
    visitInstagram: string;
    readReviews: string;
    copy: string;
    copied: string;
  };
  hero: {
    eyebrow: string;
    titleLines: Lines;
    lead: string;
    secondaryCta: string;
    facts: {
      ratingLabel: string;
      reviewsCount: string;
      openLabel: string;
      openValue: string;
      entertainmentLabel: string;
      entertainmentValue: string;
      priceLabel: string;
      priceValue: string;
    };
  };
  experience: {
    eyebrow: string;
    titleLines: Lines;
    lead: string;
    body: string;
    caption: string;
    pillars: Record<PillarKey, TitleText>;
  };
  menu: {
    eyebrow: string;
    titleLines: Lines;
    lead: string;
    note: string;
    categories: Record<DishCategory, string>;
    dishes: Record<DishId, { name: string; description: string }>;
  };
  gallery: {
    eyebrow: string;
    titleLines: Lines;
    lead: string;
    filterLabel: string;
    filters: Record<GalleryFilter, string>;
  };
  entertainment: {
    eyebrow: string;
    titleLines: Lines;
    lead: string;
    body: string;
    note: string;
    cta: string;
    marquee: Lines;
  };
  events: {
    eyebrow: string;
    titleLines: Lines;
    lead: string;
    cta: string;
    ctaNote: string;
    occasions: Record<OccasionKey, TitleText>;
  };
  reviews: {
    eyebrow: string;
    titleLines: Lines;
    lead: string;
    ratingLabel: string;
    outOf: string;
    reviewsLabel: string;
    quotesTitle: string;
    source: string;
  };
  instagram: {
    eyebrow: string;
    titleLines: Lines;
    lead: string;
    followersLabel: string;
  };
  location: {
    eyebrow: string;
    titleLines: Lines;
    city: string;
    country: string;
    plusCodeLabel: string;
    plusCodeHint: string;
    phoneLabel: string;
    hoursLabel: string;
    hoursValue: string;
    hoursNote: string;
  };
  reservation: {
    eyebrow: string;
    titleLines: Lines;
    lead: string;
  };
  reservationDialog: {
    title: string;
    text: string;
    phoneCaption: string;
    planTitle: string;
  };
  footer: {
    tagline: string;
    navTitle: string;
    contactTitle: string;
    followTitle: string;
    languageTitle: string;
    rights: string;
  };
  /** Alternative text for photography. Describe what is visible; update when real photos replace placeholders. */
  photos: Record<PhotoKey, string>;
}

/* ------------------------------------------------------------------ */
/* Тоҷикӣ                                                              */
/* ------------------------------------------------------------------ */

const tj: Translation = {
  meta: {
    title: 'Яккачинар — тарабхона ва мусиқии зинда дар Душанбе',
    description:
      'Яккачинар дар Душанбе: фазои нафис, таомҳои байналмилалӣ, мусиқии зинда ва ҷашнҳо. Ҳамарӯза кушода аст. Фармоиши миз: +992 00 060 0400.',
  },
  a11y: {
    skipToContent: 'Гузаштан ба мундариҷа',
    mainNavigation: 'Бахшҳои сомона',
    languageSwitcher: 'Интихоби забон',
    openMenu: 'Кушодани феҳрист',
    closeMenu: 'Пӯшидани феҳрист',
    close: 'Пӯшидан',
    previousImage: 'Сурати қаблӣ',
    nextImage: 'Сурати навбатӣ',
    newTab: 'дар варақаи нав кушода мешавад',
    imageCounter: 'Сурати {current} аз {total}',
    ratingStars: 'Баҳо: {rating} аз 5',
    backToTop: 'Ба боло',
    homeLink: 'Яккачинар — ба ибтидои саҳифа',
    galleryDialog: 'Намоиши суратҳо',
    openPhoto: 'Кушодани сурат: {title}',
    openDish: 'Тафсилот: {title}',
    copyPlusCode: 'Нусха гирифтани Plus Code',
    mapTitle: 'Харита: Яккачинар дар Душанбе',
    instagramImage: 'Кушодани Яккачинар дар Instagram',
    logoAlt: 'Нишони Яккачинар',
  },
  cursor: { view: 'Дидан', explore: 'Кушодан' },
  nav: {
    overview: 'Асосӣ',
    experience: 'Фазо',
    menu: 'Таомнома',
    gallery: 'Суратҳо',
    events: 'Чорабиниҳо',
    reviews: 'Назарҳо',
    location: 'Тамос',
  },
  actions: {
    reserve: 'Мизро фармоиш диҳед',
    reserveShort: 'Фармоиш диҳед',
    call: 'Ба Яккачинар занг занед',
    callShort: 'Занг занед',
    directions: 'Масирро бинед',
    visitInstagram: 'Ба Instagram гузаред',
    readReviews: 'Назарҳоро дар Google хонед',
    copy: 'Нусха гиред',
    copied: 'Нусха гирифта шуд',
  },
  hero: {
    eyebrow: 'Душанбе · Тоҷикистон',
    titleLines: ['Шоме,', 'ки дар хотир мемонад.'],
    lead: 'Маконе барои шомҳои бошукӯҳ, таомҳои нотакрор ва мусиқии зинда.',
    secondaryCta: 'Бо мо шинос шавед',
    facts: {
      ratingLabel: 'Баҳо дар Google',
      reviewsCount: '{count} назар',
      openLabel: 'Реҷаи корӣ',
      openValue: 'Ҳамарӯза',
      entertainmentLabel: 'Фароғат',
      entertainmentValue: 'Мусиқии зинда',
      priceLabel: 'Барои як нафар',
      priceValue: '100–250 сомонӣ',
    },
  },
  experience: {
    eyebrow: 'Фазо',
    titleLines: ['Олами', 'Яккачинар'],
    lead: 'Яккачинар маконест, ки шом дар он оҳиста ва бо ҳаловат мегузарад: фазои нафис, дастурхони фаровон ва мусиқии зинда, ки ба шаб оҳанг мебахшад.',
    body: 'Ҳар ташриф аз ҷузъиёт ташаккул меёбад: мизҳои бо завқ оросташуда, фазое барои суҳбатҳои самимӣ ва барномаҳои фароғатӣ, ки зиёфатро ба рӯйдоди хотирмон табдил медиҳанд.',
    caption: 'Шомҳо дар Яккачинар',
    pillars: {
      cuisine: {
        title: 'Таомҳо',
        text: 'Таомҳои байналмилалӣ барои шомҳои тӯлонӣ дар ҳалқаи дӯстон.',
      },
      music: {
        title: 'Мусиқии зинда',
        text: 'Мусиқии зинда ва барномаҳои фароғатӣ ба ҳар шом рӯҳияи хос мебахшанд.',
      },
      interior: {
        title: 'Ороиш',
        text: 'Ороиши нафис, ки дар он нури гарм ва ҷузъиёти андешида фазоро месозанд.',
      },
      celebrations: {
        title: 'Ҷашнҳо',
        text: 'Тӯйҳо, ҷашнҳо ва маҳфилҳои хусусӣ бо таваҷҷуҳ ба ҳар ҷузъ.',
      },
    },
  },
  menu: {
    eyebrow: 'Аз дастурхони мо',
    titleLines: ['Таомҳои', 'баргузида'],
    lead: 'Шиносоӣ бо таомҳои Яккачинар — аз газакҳои хунук то кабобҳо.',
    note: 'Мавҷудияти таомҳо метавонад тағйир ёбад — таомномаи ҷориро аз пешхизмат пурсед.',
    categories: {
      coldStarters: 'Газакҳои хунук',
      hotStarters: 'Газакҳои гарм',
      salads: 'Салатҳо',
      soups: 'Шӯрбоҳо',
      grill: 'Кабобҳо',
      mains: 'Таомҳои гарм',
      bakery: 'Пухтаниҳо',
    },
    dishes: {
      cheesePlate: {
        name: 'Табақи панир',
        description: 'Оғози анъанавии шоми тӯлонӣ.',
      },
      khachapuri: {
        name: 'Хачапурии аҷарӣ',
        description: 'Таоми машҳури гурҷӣ дар шакли қаиқ, ки бо наздикон тақсим кардан хуш аст.',
      },
      cheeseSticks: {
        name: 'Чӯбчаҳои панирӣ',
        description: 'Тиллоранг ва хушхӯр — барои ҳамроҳони сари дастурхон.',
      },
      chickenSteak: {
        name: 'Стейки мурғ',
        description: 'Таоми гарми серғизо барои дӯстдорони таъми анъанавӣ.',
      },
      olivier: {
        name: 'Салати «Оливйе»',
        description: 'Салати маҳбуби идона, ки бе он ягон ҷашн намегузарад.',
      },
      meatPlatter: {
        name: 'Табақи гӯштӣ',
        description: 'Табақи фаровон барои ҷамъи дӯстон.',
      },
      pickles: {
        name: 'Туршӣ',
        description: 'Туршии анъанавӣ — ҳамроҳи беҳтарин барои кабобҳо.',
      },
      greenBorscht: {
        name: 'Борши сабз',
        description: 'Шӯрбои анъанавии гарм бо таъми тоза ва дилкаш.',
      },
      shashlik: {
        name: 'Кабобҳои гуногун',
        description: 'Сихкабобҳо аз болои оташ — барои тамоми аҳли дастурхон.',
      },
    },
  },
  gallery: {
    eyebrow: 'Суратҳо',
    titleLines: ['Нигоҳе', 'аз дарун'],
    lead: 'Таомҳо, фазо ва лаҳзаҳои миёни онҳо.',
    filterLabel: 'Интихоби суратҳо',
    filters: {
      all: 'Ҳама',
      food: 'Таомҳо',
      atmosphere: 'Фазо',
      moments: 'Лаҳзаҳо',
    },
  },
  entertainment: {
    eyebrow: 'Барномаи фароғатӣ',
    titleLines: ['Бештар', 'аз таоми шом.'],
    lead: 'Мусиқии зинда, ҳунарнамоиҳо ва фазое, ки барои шомҳои хотирмон офарида шудааст.',
    body: 'Бо фарорасии шом толор оҳанги худро пайдо мекунад — мусиқӣ, нур ва суҳбат дар як ҷашни ором бо ҳам мепайванданд.',
    note: 'Дар бораи барномаи ҷории фароғатӣ тавассути телефон маълумот гиред.',
    cta: 'Фазоро эҳсос кунед',
    marquee: ['Мусиқии зинда', 'Ҳунарнамоӣ', 'Фазо', 'Ҷашн'],
  },
  events: {
    eyebrow: 'Чорабиниҳо ва ҷашнҳо',
    titleLines: ['Бигзор', 'ин шом', 'фаромӯш нашавад.'],
    lead: 'Аз тӯйҳо то маҳфилҳои хурди оилавӣ — Яккачинар барои муҳимтарин рӯйдодҳои ҳаёти шумо фазои шоиста фароҳам меорад.',
    cta: 'Дар бораи чорабинӣ пурсед',
    ctaNote: 'Барои муҳокимаи сана ва хоҳишҳоятон ба мо занг занед.',
    occasions: {
      weddings: { title: 'Тӯйҳо', text: 'Ҷашни ду хонавода дар фазои шоҳона.' },
      celebrations: { title: 'Ҷашнҳо', text: 'Санаҳои шодиомез, ки бо завқ таҷлил мешаванд.' },
      private: { title: 'Чорабиниҳои хусусӣ', text: 'Шомҳои махсус барои меҳмонони шумо.' },
      special: { title: 'Рӯйдодҳои махсус', text: 'Лаҳзаҳое, ки сазовори таҷлили хосанд.' },
      gatherings: { title: 'Маҳфилҳо', text: 'Зиёфатҳои оилавӣ ва шомҳо бо дӯстон гирди як дастурхон.' },
    },
  },
  reviews: {
    eyebrow: 'Назари меҳмонон',
    titleLines: ['Баҳои', 'меҳмонони мо'],
    lead: 'Меҳмонон дар Google беш аз 840 назар гузоштаанд ва баҳои миёнаи онҳо {rating} аз 5 аст.',
    ratingLabel: 'Баҳо дар Google',
    outOf: 'аз 5',
    reviewsLabel: 'назар дар Google',
    quotesTitle: 'Меҳмонон чӣ мегӯянд',
    source: 'Манбаъ: Харитаҳои Google',
  },
  instagram: {
    eyebrow: 'Instagram',
    titleLines: ['Бо мо', 'ҳамроҳ бошед'],
    lead: 'Шомҳо, таомҳо ва лаҳзаҳои Яккачинар — барои беш аз 145 ҳазор обуначӣ.',
    followersLabel: 'обуначӣ',
  },
  location: {
    eyebrow: 'Тамос',
    titleLines: ['Роҳ ба', 'Яккачинар'],
    city: 'Душанбе',
    country: 'Тоҷикистон',
    plusCodeLabel: 'Plus Code',
    plusCodeHint: 'Барои ёфтани мо ин рамзро дар Харитаҳои Google ворид кунед.',
    phoneLabel: 'Рақами тамос',
    hoursLabel: 'Реҷаи корӣ',
    hoursValue: 'Ҳамарӯза',
    hoursNote: 'Соатҳои кориро тавассути телефон пурсед.',
  },
  reservation: {
    eyebrow: 'Фармоиш',
    titleLines: ['Шоми шумо', 'аз ин ҷо оғоз мешавад.'],
    lead: 'Мизро тавассути телефон фармоиш диҳед — мо аз дидори шумо шод мешавем.',
  },
  reservationDialog: {
    title: 'Фармоиши миз',
    text: 'Барои фармоиши миз ба Яккачинар занг занед.',
    phoneCaption: 'Фармоиш ва маълумот',
    planTitle: 'Ташрифи худро ба нақша гиред',
  },
  footer: {
    tagline: 'Шоме, ки дар хотир мемонад.',
    navTitle: 'Бахшҳо',
    contactTitle: 'Тамос',
    followTitle: 'Шабакаҳои иҷтимоӣ',
    languageTitle: 'Забон',
    rights: '© {year} Яккачинар. Ҳамаи ҳуқуқҳо ҳифз шудаанд.',
  },
  photos: {
    hero: 'Толори нимторик бо мизҳои ороста ва чароғҳои овезони гарм',
    experienceMain: 'Мизе дар нури чароғи гарм дар назди девори нақшин',
    experienceDetail: 'Шамъҳо ва гулҳо дар болои мизи ороста',
    entertainment: 'Раққоса дар саҳна дар нури гарми нурафкан',
    stage: 'Навозандаи саксофон дар нури саҳна',
    weddings: 'Толори зиёфат, ки барои ҷашн омода шудааст',
    celebrations: 'Ду қадаҳ дар заминаи мушакбозӣ',
    privateEvents: 'Мизи толори хусусӣ бо зарфҳои тиллоранг',
    specialOccasions: 'Шамъҳои баланд дар шамъдонҳои тиллоранг',
    gatherings: 'Газакҳо ва нӯшокиҳо дар мизе бо нури гарм',
    reservation: 'Мизҳо дар нури шамъ дар толори хилвату нимторик',
    lounge: 'Мизи дароз дар толори торик ва нафис',
    chandelier: 'Қандил бо шамъҳо дар нури гарм',
    toast: 'Қадаҳҳо дар заминаи чароғҳои шом',
    dinner: 'Дӯстон дар нури шамъ таоми шом мехӯранд',
    banquet: 'Толори бузург зери қандили боҳашамат',
    tableDetail: 'Ороиши тиллоранги миз ва шамъҳо',
  },
};

/* ------------------------------------------------------------------ */
/* Русский                                                             */
/* ------------------------------------------------------------------ */

const ru: Translation = {
  meta: {
    title: 'Яккачинар — ресторан и живая музыка в Душанбе',
    description:
      '«Яккачинар» в Душанбе: изысканный интерьер, блюда международной кухни, живая музыка и торжества. Без выходных. Бронирование столиков: +992 00 060 0400.',
  },
  a11y: {
    skipToContent: 'Перейти к содержанию',
    mainNavigation: 'Основная навигация',
    languageSwitcher: 'Выбор языка',
    openMenu: 'Открыть меню',
    closeMenu: 'Закрыть меню',
    close: 'Закрыть',
    previousImage: 'Предыдущее фото',
    nextImage: 'Следующее фото',
    newTab: 'откроется в новой вкладке',
    imageCounter: 'Фото {current} из {total}',
    ratingStars: 'Оценка {rating} из 5',
    backToTop: 'Наверх',
    homeLink: '«Яккачинар» — в начало страницы',
    galleryDialog: 'Просмотр фотографий',
    openPhoto: 'Открыть фото: {title}',
    openDish: 'Подробнее: {title}',
    copyPlusCode: 'Скопировать Plus Code',
    mapTitle: 'Карта: «Яккачинар» в Душанбе',
    instagramImage: 'Открыть «Яккачинар» в Instagram',
    logoAlt: 'Логотип «Яккачинар»',
  },
  cursor: { view: 'Смотреть', explore: 'Открыть' },
  nav: {
    overview: 'Главная',
    experience: 'Атмосфера',
    menu: 'Меню',
    gallery: 'Галерея',
    events: 'Мероприятия',
    reviews: 'Отзывы',
    location: 'Контакты',
  },
  actions: {
    reserve: 'Забронировать столик',
    reserveShort: 'Забронировать',
    call: 'Позвонить в «Яккачинар»',
    callShort: 'Позвонить',
    directions: 'Проложить маршрут',
    visitInstagram: 'Перейти в Instagram',
    readReviews: 'Читать отзывы в Google',
    copy: 'Копировать',
    copied: 'Скопировано',
  },
  hero: {
    eyebrow: 'Душанбе · Таджикистан',
    titleLines: ['Вечер,', 'который запомнится.'],
    lead: 'Место для особенных вечеров, изысканной кухни и живой музыки.',
    secondaryCta: 'Познакомиться ближе',
    facts: {
      ratingLabel: 'Рейтинг Google',
      reviewsCount: '{count} отзывов',
      openLabel: 'Режим работы',
      openValue: 'Без выходных',
      entertainmentLabel: 'Развлечения',
      entertainmentValue: 'Живая музыка',
      priceLabel: 'Средний чек',
      priceValue: '100–250 сомони',
    },
  },
  experience: {
    eyebrow: 'Атмосфера',
    titleLines: ['Добро пожаловать', 'в «Яккачинар»'],
    lead: '«Яккачинар» — место, где вечер никуда не спешит: изысканный интерьер, щедрый стол и живая музыка, задающая ему ритм.',
    body: 'Каждый визит складывается из деталей: тщательно сервированные столы, пространство для душевных разговоров и развлекательные программы, превращающие ужин в событие.',
    caption: 'Вечера в «Яккачинаре»',
    pillars: {
      cuisine: {
        title: 'Кухня',
        text: 'Блюда международной кухни для долгих вечеров в хорошей компании.',
      },
      music: {
        title: 'Живая музыка',
        text: 'Живая музыка и развлекательные программы создают особое настроение каждого вечера.',
      },
      interior: {
        title: 'Интерьер',
        text: 'Изысканный интерьер, в котором тёплый свет и продуманные детали задают тон.',
      },
      celebrations: {
        title: 'Торжества',
        text: 'Свадьбы, праздники и частные встречи с вниманием к каждой детали.',
      },
    },
  },
  menu: {
    eyebrow: 'С нашего стола',
    titleLines: ['Избранные', 'блюда'],
    lead: 'Знакомство с кухней ресторана «Яккачинар» — от холодных закусок до блюд с мангала.',
    note: 'Наличие блюд может меняться — актуальное меню уточняйте у официанта.',
    categories: {
      coldStarters: 'Холодные закуски',
      hotStarters: 'Горячие закуски',
      salads: 'Салаты',
      soups: 'Супы',
      grill: 'С мангала',
      mains: 'Горячие блюда',
      bakery: 'Выпечка',
    },
    dishes: {
      cheesePlate: {
        name: 'Сырная тарелка',
        description: 'Классика, с которой приятно начать долгий вечер.',
      },
      khachapuri: {
        name: 'Хачапури по-аджарски',
        description: 'Знаменитая грузинская «лодочка», которую хочется разделить с близкими.',
      },
      cheeseSticks: {
        name: 'Сырные палочки',
        description: 'Золотистые и хрустящие — чтобы разделить со всеми за столом.',
      },
      chickenSteak: {
        name: 'Стейк из курицы',
        description: 'Сытное горячее блюдо для ценителей классики.',
      },
      olivier: {
        name: 'Салат «Оливье»',
        description: 'Любимый праздничный салат, без которого не обходится ни одно торжество.',
      },
      meatPlatter: {
        name: 'Мясное ассорти',
        description: 'Щедрая подача для большой компании.',
      },
      pickles: {
        name: 'Соленья',
        description: 'Традиционные соленья — лучшие спутники блюд с мангала.',
      },
      greenBorscht: {
        name: 'Зелёный борщ',
        description: 'Уютная классика со свежим, ярким вкусом.',
      },
      shashlik: {
        name: 'Ассорти шашлыков',
        description: 'Шашлыки с мангала — на весь стол.',
      },
    },
  },
  gallery: {
    eyebrow: 'Галерея',
    titleLines: ['Взгляд', 'изнутри'],
    lead: 'Кухня, атмосфера и мгновения между ними.',
    filterLabel: 'Фильтр фотографий',
    filters: {
      all: 'Все',
      food: 'Кухня',
      atmosphere: 'Атмосфера',
      moments: 'Моменты',
    },
  },
  entertainment: {
    eyebrow: 'Развлекательная программа',
    titleLines: ['Больше,', 'чем ужин.'],
    lead: 'Живая музыка, выступления и атмосфера, созданная для вечеров, которые остаются в памяти.',
    body: 'С наступлением вечера зал обретает свой ритм — музыка, свет и разговоры сливаются в неспешный праздник.',
    note: 'О текущей развлекательной программе можно узнать по телефону.',
    cta: 'Почувствовать атмосферу',
    marquee: ['Живая музыка', 'Выступления', 'Атмосфера', 'Праздник'],
  },
  events: {
    eyebrow: 'Мероприятия и торжества',
    titleLines: ['Сделайте', 'этот вечер', 'незабываемым.'],
    lead: 'От свадеб до камерных встреч — «Яккачинар» создаёт обстановку для самых важных событий в жизни.',
    cta: 'Обсудить мероприятие',
    ctaNote: 'Позвоните нам, чтобы обсудить дату и пожелания.',
    occasions: {
      weddings: { title: 'Свадьбы', text: 'Праздник двух семей в элегантной обстановке.' },
      celebrations: { title: 'Праздники', text: 'Радостные даты, отмеченные со вкусом.' },
      private: { title: 'Частные мероприятия', text: 'Закрытые вечера для ваших гостей.' },
      special: { title: 'Особые случаи', text: 'Поводы, которые стоит отметить по-особенному.' },
      gatherings: { title: 'Встречи', text: 'Семейные ужины и вечера с друзьями за одним столом.' },
    },
  },
  reviews: {
    eyebrow: 'Отзывы гостей',
    titleLines: ['Оценка', 'наших гостей'],
    lead: 'Гости оставили в Google более 840 отзывов со средней оценкой {rating} из 5.',
    ratingLabel: 'Рейтинг в Google',
    outOf: 'из 5',
    reviewsLabel: 'отзывов в Google',
    quotesTitle: 'Что говорят гости',
    source: 'Источник: Google Карты',
  },
  instagram: {
    eyebrow: 'Instagram',
    titleLines: ['Следите', 'за атмосферой'],
    lead: 'Вечера, блюда и яркие моменты ресторана «Яккачинар» — в профиле, на который подписаны более 145 тысяч человек.',
    followersLabel: 'подписчиков',
  },
  location: {
    eyebrow: 'Контакты',
    titleLines: ['Как нас', 'найти'],
    city: 'Душанбе',
    country: 'Таджикистан',
    plusCodeLabel: 'Plus Code',
    plusCodeHint: 'Введите этот код в Google Картах, чтобы найти нас.',
    phoneLabel: 'Телефон',
    hoursLabel: 'Режим работы',
    hoursValue: 'Без выходных',
    hoursNote: 'Часы работы уточняйте по телефону.',
  },
  reservation: {
    eyebrow: 'Бронирование',
    titleLines: ['Ваш вечер', 'начинается здесь.'],
    lead: 'Забронируйте столик по телефону — мы будем рады вас встретить.',
  },
  reservationDialog: {
    title: 'Бронирование столика',
    text: 'Чтобы забронировать столик, позвоните в «Яккачинар».',
    phoneCaption: 'Бронирование и вопросы',
    planTitle: 'Спланируйте визит',
  },
  footer: {
    tagline: 'Вечер, который запомнится.',
    navTitle: 'Разделы',
    contactTitle: 'Контакты',
    followTitle: 'Мы в соцсетях',
    languageTitle: 'Язык',
    rights: '© {year} «Яккачинар». Все права защищены.',
  },
  photos: {
    hero: 'Полутёмный обеденный зал с сервированными столами и тёплыми подвесными светильниками',
    experienceMain: 'Столик в свете тёплой лампы на фоне рельефной стены',
    experienceDetail: 'Свечи и цветы на сервированном столе',
    entertainment: 'Танцовщица на сцене в тёплом свете прожектора',
    stage: 'Саксофонист в свете сцены',
    weddings: 'Банкетный зал, подготовленный к торжеству',
    celebrations: 'Два бокала на фоне праздничного салюта',
    privateEvents: 'Стол в приватном зале с позолоченной посудой',
    specialOccasions: 'Высокие свечи в золотых подсвечниках',
    gatherings: 'Закуски и напитки на столе в тёплом свете',
    reservation: 'Столики при свечах в камерном полутёмном зале',
    lounge: 'Длинный стол в тёмном элегантном зале',
    chandelier: 'Люстра со свечами в тёплом свете',
    toast: 'Бокалы на фоне вечерних огней',
    dinner: 'Друзья ужинают при свечах',
    banquet: 'Большой зал под роскошной люстрой',
    tableDetail: 'Золотой декор стола и свечи',
  },
};

/* ------------------------------------------------------------------ */
/* English                                                             */
/* ------------------------------------------------------------------ */

const en: Translation = {
  meta: {
    title: 'Yakkachinar — Restaurant & Live Entertainment in Dushanbe',
    description:
      'Yakkachinar in Dushanbe: a sophisticated interior, international-style cuisine, live music and celebrations. Open every day. Reservations: +992 00 060 0400.',
  },
  a11y: {
    skipToContent: 'Skip to content',
    mainNavigation: 'Main navigation',
    languageSwitcher: 'Choose language',
    openMenu: 'Open menu',
    closeMenu: 'Close menu',
    close: 'Close',
    previousImage: 'Previous image',
    nextImage: 'Next image',
    newTab: 'opens in a new tab',
    imageCounter: 'Image {current} of {total}',
    ratingStars: 'Rated {rating} out of 5',
    backToTop: 'Back to top',
    homeLink: 'Yakkachinar — back to the top',
    galleryDialog: 'Photo viewer',
    openPhoto: 'Open photo: {title}',
    openDish: 'View details: {title}',
    copyPlusCode: 'Copy Plus Code',
    mapTitle: 'Map: Yakkachinar in Dushanbe',
    instagramImage: 'Open Yakkachinar on Instagram',
    logoAlt: 'Yakkachinar logo',
  },
  cursor: { view: 'View', explore: 'Explore' },
  nav: {
    overview: 'Overview',
    experience: 'Experience',
    menu: 'Menu',
    gallery: 'Gallery',
    events: 'Events',
    reviews: 'Reviews',
    location: 'Location',
  },
  actions: {
    reserve: 'Reserve a Table',
    reserveShort: 'Reserve',
    call: 'Call Yakkachinar',
    callShort: 'Call',
    directions: 'Get Directions',
    visitInstagram: 'Visit Instagram',
    readReviews: 'Read Reviews on Google',
    copy: 'Copy',
    copied: 'Copied',
  },
  hero: {
    eyebrow: 'Dushanbe · Tajikistan',
    titleLines: ['An evening', 'worth remembering.'],
    lead: 'A destination for exceptional evenings, distinctive cuisine and live entertainment.',
    secondaryCta: 'Explore Yakkachinar',
    facts: {
      ratingLabel: 'Google rating',
      reviewsCount: '{count} reviews',
      openLabel: 'Open',
      openValue: 'Every day',
      entertainmentLabel: 'Entertainment',
      entertainmentValue: 'Live music',
      priceLabel: 'Per person',
      priceValue: '100–250 TJS',
    },
  },
  experience: {
    eyebrow: 'The Experience',
    titleLines: ['The', 'Yakkachinar', 'Experience'],
    lead: 'Yakkachinar is a place for evenings that unfold slowly — a sophisticated interior, a generous table and live music that sets the rhythm of the night.',
    body: 'Every visit is shaped by the details: tables set with care, a room made for conversation and entertainment programmes that turn dinner into an occasion.',
    caption: 'Evenings at Yakkachinar',
    pillars: {
      cuisine: {
        title: 'Cuisine',
        text: 'International-style dishes for long evenings in good company.',
      },
      music: {
        title: 'Live music',
        text: 'Live music and entertainment programmes that give every evening its own mood.',
      },
      interior: {
        title: 'Interior',
        text: 'A sophisticated interior where warm light and considered details set the tone.',
      },
      celebrations: {
        title: 'Celebrations',
        text: 'Weddings, celebrations and private gatherings, hosted with attention to detail.',
      },
    },
  },
  menu: {
    eyebrow: 'From the Table',
    titleLines: ['Signature', 'Selection'],
    lead: 'A first taste of Yakkachinar — from cold starters to the grill.',
    note: 'Availability may vary — please ask your server for the current menu.',
    categories: {
      coldStarters: 'Cold starters',
      hotStarters: 'Hot starters',
      salads: 'Salads',
      soups: 'Soups',
      grill: 'From the grill',
      mains: 'Hot dishes',
      bakery: 'From the oven',
    },
    dishes: {
      cheesePlate: {
        name: 'Cheese Plate',
        description: 'A classic way to open a long evening.',
      },
      khachapuri: {
        name: 'Adjarian Khachapuri',
        description: 'The boat-shaped Georgian classic, made for sharing.',
      },
      cheeseSticks: {
        name: 'Cheese Sticks',
        description: 'Golden and crisp — made to share around the table.',
      },
      chickenSteak: {
        name: 'Chicken Steak',
        description: 'A hearty main course for classic tastes.',
      },
      olivier: {
        name: 'Olivier Salad',
        description: 'The beloved festive salad no celebration is complete without.',
      },
      meatPlatter: {
        name: 'Meat Assortment',
        description: 'A generous platter for good company.',
      },
      pickles: {
        name: 'Pickles',
        description: 'Traditional pickles — a natural companion to the grill.',
      },
      greenBorscht: {
        name: 'Green Borscht',
        description: 'A comforting classic with a fresh, bright character.',
      },
      shashlik: {
        name: 'Shashlik Assortment',
        description: 'Skewers from the grill, served for the whole table.',
      },
    },
  },
  gallery: {
    eyebrow: 'Gallery',
    titleLines: ['A look', 'inside'],
    lead: 'Food, atmosphere and the moments in between.',
    filterLabel: 'Filter photos',
    filters: {
      all: 'All',
      food: 'Food',
      atmosphere: 'Atmosphere',
      moments: 'Moments',
    },
  },
  entertainment: {
    eyebrow: 'Live Entertainment',
    titleLines: ['More', 'than dinner.'],
    lead: 'Live music, performances and an atmosphere designed for evenings that stay with you.',
    body: 'As the night unfolds, the room finds its rhythm — music, light and conversation coming together in one unhurried celebration.',
    note: 'Please call to ask about the current entertainment programme.',
    cta: 'Discover the Atmosphere',
    marquee: ['Live music', 'Performances', 'Atmosphere', 'Celebration'],
  },
  events: {
    eyebrow: 'Events & Celebrations',
    titleLines: ['Make it', 'a night', 'to remember.'],
    lead: 'From weddings to intimate gatherings, Yakkachinar sets the stage for the occasions that matter most.',
    cta: 'Ask About Your Event',
    ctaNote: 'Call us to discuss your date and wishes.',
    occasions: {
      weddings: { title: 'Weddings', text: 'A celebration of two families, hosted with elegance.' },
      celebrations: { title: 'Celebrations', text: 'Joyful milestones, marked in style.' },
      private: { title: 'Private events', text: 'Exclusive evenings, arranged for your guests.' },
      special: { title: 'Special occasions', text: 'Moments worth marking in a special way.' },
      gatherings: { title: 'Gatherings', text: 'Family dinners and evenings with friends around one table.' },
    },
  },
  reviews: {
    eyebrow: 'Guest Reviews',
    titleLines: ['Rated', 'by our guests'],
    lead: 'Guests have left more than 840 reviews on Google, with an average rating of {rating} out of 5.',
    ratingLabel: 'Google rating',
    outOf: 'out of 5',
    reviewsLabel: 'reviews on Google',
    quotesTitle: 'What guests say',
    source: 'Source: Google Maps',
  },
  instagram: {
    eyebrow: 'Instagram',
    titleLines: ['Follow', 'the experience'],
    lead: 'Evenings, dishes and moments from Yakkachinar, shared with a community of more than 145,000 followers.',
    followersLabel: 'followers',
  },
  location: {
    eyebrow: 'Location',
    titleLines: ['Find', 'Yakkachinar'],
    city: 'Dushanbe',
    country: 'Tajikistan',
    plusCodeLabel: 'Plus Code',
    plusCodeHint: 'Enter this code in Google Maps to find us.',
    phoneLabel: 'Phone',
    hoursLabel: 'Open',
    hoursValue: 'Every day',
    hoursNote: 'Please call to confirm opening hours.',
  },
  reservation: {
    eyebrow: 'Reservations',
    titleLines: ['Your evening', 'starts here.'],
    lead: 'Reserve your table by phone — we look forward to welcoming you.',
  },
  reservationDialog: {
    title: 'Reserve a table',
    text: 'To reserve a table, please call Yakkachinar.',
    phoneCaption: 'Reservations & enquiries',
    planTitle: 'Plan your visit',
  },
  footer: {
    tagline: 'An evening worth remembering.',
    navTitle: 'Explore',
    contactTitle: 'Contact',
    followTitle: 'Follow',
    languageTitle: 'Language',
    rights: '© {year} Yakkachinar. All rights reserved.',
  },
  photos: {
    hero: 'A dimly lit dining room with set tables under warm pendant lights',
    experienceMain: 'A table lit by a warm lamp against a textured wall',
    experienceDetail: 'Candles and flowers on a set table',
    entertainment: 'A dancer performing on stage in a warm spotlight',
    stage: 'A saxophonist playing under stage lights',
    weddings: 'A banquet hall prepared for a celebration',
    celebrations: 'Two glasses raised against fireworks',
    privateEvents: 'A private dining table set with gilded plates',
    specialOccasions: 'Tall candles in golden candlesticks',
    gatherings: 'Shared plates and drinks on a warmly lit table',
    reservation: 'Candlelit tables in a dark, intimate room',
    lounge: 'A long dining table in a dark, elegant room',
    chandelier: 'A candle chandelier glowing in warm light',
    toast: 'Glasses raised against the evening lights',
    dinner: 'Friends sharing dinner by candlelight',
    banquet: 'A grand hall beneath an ornate chandelier',
    tableDetail: 'Golden table decorations and candles',
  },
};

export const translations: Record<Language, Translation> = { tj, ru, en };
