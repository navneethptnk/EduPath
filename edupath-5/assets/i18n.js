/**
 * EduPath Internationalization (i18n) System
 * Supports multiple languages with dynamic content loading
 */

class I18nManager {
  constructor() {
    this.currentLanguage = 'en';
    this.defaultLanguage = 'en';
    this.translations = {};
    this.supportedLanguages = {
      'en': { name: 'English', flag: '🇺🇸', dir: 'ltr' },
      'hi': { name: 'हिंदी', flag: '🇮🇳', dir: 'ltr' },
      'ur': { name: 'اردو', flag: '🇵🇰', dir: 'rtl' },
      'ks': { name: 'کٲشُر', flag: '🏔️', dir: 'rtl' },
      'es': { name: 'Español', flag: '🇪🇸', dir: 'ltr' },
      'fr': { name: 'Français', flag: '🇫🇷', dir: 'ltr' },
      'de': { name: 'Deutsch', flag: '🇩🇪', dir: 'ltr' },
      'zh': { name: '中文', flag: '🇨🇳', dir: 'ltr' },
      'ar': { name: 'العربية', flag: '🇸🇦', dir: 'rtl' }
    };
    
    this.initializeTranslations();
    this.loadSavedLanguage();
  }

  initializeTranslations() {
    // English (Default)
    this.translations.en = {
      'nav.home': 'Home',
      'nav.quiz': 'Quiz',
      'nav.courses': 'Courses',
      'nav.career': 'Career',
      'nav.colleges': 'Colleges',
      'nav.scholarships': 'Scholarships',
      'nav.timeline': 'Timeline',
      'nav.profile': 'Profile',
      'common.loading': 'Loading...',
      'common.search': 'Search',
      'common.save': 'Save',
      'common.cancel': 'Cancel',
      'common.language': 'Language',
      'home.hero.title': 'Find Your Perfect Career Path in <span class="highlight-text">Minutes</span>',
      'home.hero.subtitle': 'Join over 25,000 students who found their ideal career paths through our comprehensive platform.',
      'home.hero.cta.primary': '🚀 Take Career Assessment',
      'home.hero.cta.secondary': '📚 Explore 750+ Courses',
      'home.stats.students': 'Students Guided',
      'home.stats.colleges': 'Colleges Listed',
      'home.stats.scholarships': 'Active Scholarships',
      'home.stats.placement': 'Placement Rate',
      'home.trending.title': '🔥 Trending Now',
      'home.trending.subtitle': 'See what\'s popular among students this week',
      'home.trending.cs.badge': 'Most Searched',
      'home.trending.cs.title': '💻 Computer Science & AI',
      'home.trending.cs.salary': 'Average Salary: ₹8-35 LPA',
      'home.trending.neet.badge': 'Hot Topic',
      'home.trending.neet.title': '🏥 NEET & JEE 2024',
      'home.trending.neet.desc': 'Registration & Exam Dates',
      'home.trending.green.badge': 'Trending',
      'home.trending.green.title': '🌱 Green Technology',
      'home.trending.green.desc': 'Sustainable Engineering',
      'footer.copyright': 'EduPath. Empowering students to make informed career decisions.'
    };

    // Hindi translations
    this.translations.hi = {
      'nav.home': 'होम',
      'nav.quiz': 'प्रश्नोत्तरी',
      'nav.courses': 'कोर्स',
      'nav.career': 'करियर',
      'nav.colleges': 'कॉलेज',
      'nav.scholarships': 'छात्रवृत्ति',
      'nav.timeline': 'समयसीमा',
      'nav.profile': 'प्रोफ़ाइल',
      'common.loading': 'लोड हो रहा है...',
      'common.search': 'खोजें',
      'common.save': 'सहेजें',
      'common.cancel': 'रद्द करें',
      'common.language': 'भाषा',
      'home.hero.title': '<span class="highlight-text">मिनटों</span> में अपना सही करियर पथ खोजें',
      'home.hero.subtitle': '25,000+ छात्रों के साथ जुड़ें जिन्होंने हमारे प्लेटफॉर्म से अपना आदर्श करियर पाया।',
      'home.hero.cta.primary': '🚀 करियर मूल्यांकन लें',
      'home.hero.cta.secondary': '📚 750+ कोर्स देखें',
      'home.stats.students': 'छात्रों को मार्गदर्शन',
      'home.stats.colleges': 'कॉलेज सूचीबद्ध',
      'home.stats.scholarships': 'सक्रिय छात्रवृत्ति',
      'home.stats.placement': 'प्लेसमेंट दर',
      'footer.copyright': 'EduPath. छात्रों को सूचित करियर निर्णय लेने के लिए सशक्त बनाना।'
    };

    // Spanish translations
    this.translations.es = {
      'nav.home': 'Inicio',
      'nav.quiz': 'Cuestionario',
      'nav.courses': 'Cursos',
      'nav.career': 'Carrera',
      'nav.colleges': 'Universidades',
      'nav.scholarships': 'Becas',
      'nav.timeline': 'Cronología',
      'nav.profile': 'Perfil',
      'common.loading': 'Cargando...',
      'common.search': 'Buscar',
      'common.save': 'Guardar',
      'common.cancel': 'Cancelar',
      'common.language': 'Idioma',
      'home.hero.title': 'Encuentra tu Carrera Perfecta en <span class="highlight-text">Minutos</span>',
      'home.hero.subtitle': 'Únete a más de 25,000 estudiantes que encontraron sus carreras ideales.',
      'home.hero.cta.primary': '🚀 Tomar Evaluación',
      'home.hero.cta.secondary': '📚 Explorar 750+ Cursos',
      'home.stats.students': 'Estudiantes Orientados',
      'home.stats.colleges': 'Universidades',
      'home.stats.scholarships': 'Becas Activas',
      'home.stats.placement': 'Tasa de Colocación',
      'footer.copyright': 'EduPath. Empoderando estudiantes para decisiones de carrera informadas.'
    };

    // Urdu translations
    this.translations.ur = {
      'nav.home': 'گھر',
      'nav.quiz': 'سوالات',
      'nav.courses': 'کورسز',
      'nav.career': 'کیریر',
      'nav.colleges': 'کالج',
      'nav.scholarships': 'وظائف',
      'nav.timeline': 'ٹائم لائن',
      'nav.profile': 'پروفائل',
      'common.loading': 'لوڈ ہو رہا ہے...',
      'common.search': 'تلاش کریں',
      'common.save': 'محفوظ کریں',
      'common.cancel': 'منظور کریں',
      'common.language': 'زبان',
      'home.hero.title': '<span class="highlight-text">منٹوں</span> میں اپنا بہترین کیریر راستہ تلاش کریں',
      'home.hero.subtitle': '25,000+ طلباء کے ساتھ جڑیں جنہوں نے ہمارے پلیٹ فارم سے اپنا بہترین کیریر پایا۔',
      'home.hero.cta.primary': '🚀 کیریر اسیسمنٹ لیں',
      'home.hero.cta.secondary': '📚 750+ کورسز دیکھیں',
      'home.stats.students': 'طلباء کو رہنمائی',
      'home.stats.colleges': 'کالج فہرست',
      'home.stats.scholarships': 'فعال وظائف',
      'home.stats.placement': 'پلیسمنٹ ریٹ',
      'footer.copyright': 'EduPath. طلباء کو بہتر کیریر فیصلے کرنے کے لیے بااختیار بنانا۔'
    };

    // Kashmiri translations
    this.translations.ks = {
      'nav.home': 'گهر',
      'nav.quiz': 'سوال',
      'nav.courses': 'کورس',
      'nav.career': 'کار',
      'nav.colleges': 'کالج',
      'nav.scholarships': 'وظیفہ',
      'nav.timeline': 'وقت کی لائن',
      'nav.profile': 'پروفائل',
      'common.loading': 'لوڈ گچھان...',
      'common.search': 'تلاش',
      'common.save': 'محفوظ',
      'common.cancel': 'رد',
      'common.language': 'زبان',
      'home.hero.title': '<span class="highlight-text">منٹن</span> منز پنن بہترین کیریر راہ لبیو',
      'home.hero.subtitle': '25,000+ طالب علماں ساتھ ملیو یمن امی پلیٹفارم پیٹھ پنن بہترین کیریر وونیو۔',
      'home.hero.cta.primary': '🚀 کیریر تشخیص کریو',
      'home.hero.cta.secondary': '📚 750+ کورس وچھیو',
      'home.stats.students': 'طالب علماں کس رہنمائی',
      'home.stats.colleges': 'کالج فہرست',
      'home.stats.scholarships': 'فعال وظائف',
      'home.stats.placement': 'پلیسمنٹ ریٹ',
      'footer.copyright': 'EduPath. طالب علماں کس بہتر کیریر فیصلے کرنک کی بااختیار کرن۔'
    };
    this.translations.fr = {
      'nav.home': 'Accueil',
      'nav.quiz': 'Quiz',
      'nav.courses': 'Cours',
      'nav.career': 'Carrière',
      'nav.colleges': 'Universités',
      'nav.scholarships': 'Bourses',
      'nav.timeline': 'Chronologie',
      'nav.profile': 'Profil',
      'common.loading': 'Chargement...',
      'common.search': 'Rechercher',
      'common.save': 'Enregistrer',
      'common.cancel': 'Annuler',
      'common.language': 'Langue',
      'home.hero.title': 'Trouvez Votre Carrière en <span class="highlight-text">Minutes</span>',
      'home.hero.subtitle': 'Rejoignez plus de 25 000 étudiants qui ont trouvé leur carrière idéale.',
      'home.hero.cta.primary': '🚀 Évaluation de Carrière',
      'home.hero.cta.secondary': '📚 Explorer 750+ Cours',
      'home.stats.students': 'Étudiants Guidés',
      'home.stats.colleges': 'Universités Listées',
      'home.stats.scholarships': 'Bourses Actives',
      'home.stats.placement': 'Taux de Placement',
      'footer.copyright': 'EduPath. Donner aux étudiants les moyens de prendre des décisions éclairées.'
    };

    // German translations
    this.translations.de = {
      'nav.home': 'Startseite',
      'nav.quiz': 'Quiz',
      'nav.courses': 'Kurse',
      'nav.career': 'Karriere',
      'nav.colleges': 'Hochschulen',
      'nav.scholarships': 'Stipendien',
      'nav.timeline': 'Zeitplan',
      'nav.profile': 'Profil',
      'common.loading': 'Wird geladen...',
      'common.search': 'Suchen',
      'common.save': 'Speichern',
      'common.cancel': 'Abbrechen',
      'common.language': 'Sprache',
      'home.hero.title': 'Finden Sie Ihren perfekten Karriereweg in <span class="highlight-text">Minuten</span>',
      'home.hero.subtitle': 'Schließen Sie sich über 25.000 Studenten an, die ihren idealen Karriereweg gefunden haben.',
      'home.hero.cta.primary': '🚀 Karriere-Assessment',
      'home.hero.cta.secondary': '📚 750+ Kurse erkunden',
      'home.stats.students': 'Studenten begleitet',
      'home.stats.colleges': 'Hochschulen gelistet',
      'home.stats.scholarships': 'Aktive Stipendien',
      'home.stats.placement': 'Vermittlungsrate',
      'footer.copyright': 'EduPath. Studenten befähigen, fundierte Karriereentscheidungen zu treffen.'
    };

    // Chinese translations
    this.translations.zh = {
      'nav.home': '首页',
      'nav.quiz': '测验',
      'nav.courses': '课程',
      'nav.career': '职业',
      'nav.colleges': '院校',
      'nav.scholarships': '奖学金',
      'nav.timeline': '时间线',
      'nav.profile': '个人资料',
      'common.loading': '加载中...',
      'common.search': '搜索',
      'common.save': '保存',
      'common.cancel': '取消',
      'common.language': '语言',
      'home.hero.title': '在<span class="highlight-text">几分钟</span>内找到您的完美职业道路',
      'home.hero.subtitle': '加入25,000多名通过我们的平台找到理想职业道路的学生。',
      'home.hero.cta.primary': '🚀 进行职业评估',
      'home.hero.cta.secondary': '📚 探索750+课程',
      'home.stats.students': '指导学生数',
      'home.stats.colleges': '院校列表',
      'home.stats.scholarships': '活跃奖学金',
      'home.stats.placement': '就业率',
      'footer.copyright': 'EduPath. 帮助学生做出明智的职业决策。'
    };

    // Arabic translations
    this.translations.ar = {
      'nav.home': 'الرئيسية',
      'nav.quiz': 'الاختبار',
      'nav.courses': 'الدورات',
      'nav.career': 'المهنة',
      'nav.colleges': 'الكليات',
      'nav.scholarships': 'المنح الدراسية',
      'nav.timeline': 'الجدول الزمني',
      'nav.profile': 'الملف الشخصي',
      'common.loading': 'جاري التحميل...',
      'common.search': 'بحث',
      'common.save': 'حفظ',
      'common.cancel': 'إلغاء',
      'common.language': 'اللغة',
      'home.hero.title': 'اعثر على مسارك المهني المثالي في <span class="highlight-text">دقائق</span>',
      'home.hero.subtitle': 'انضم إلى أكثر من 25,000 طالب وجدوا مساراتهم المهنية المثالية.',
      'home.hero.cta.primary': '🚀 خذ تقييم المهنة',
      'home.hero.cta.secondary': '📚 استكشف 750+ دورة',
      'home.stats.students': 'الطلاب الموجهون',
      'home.stats.colleges': 'الكليات المدرجة',
      'home.stats.scholarships': 'المنح النشطة',
      'home.stats.placement': 'معدل التوظيف',
      'footer.copyright': 'EduPath. تمكين الطلاب لاتخاذ قرارات مهنية مدروسة.'
    };
  }

  // Get translation for a key
  t(key, params = {}) {
    const translation = this.translations[this.currentLanguage]?.[key] || 
                       this.translations[this.defaultLanguage]?.[key] || 
                       key;
    return this.replaceParams(translation, params);
  }

  // Replace parameters in translation string
  replaceParams(text, params) {
    return text.replace(/\{(\w+)\}/g, (match, param) => {
      return params[param] !== undefined ? params[param] : match;
    });
  }

  // Change language
  async changeLanguage(language) {
    if (!this.supportedLanguages[language]) return false;

    this.currentLanguage = language;
    localStorage.setItem('edupath_language', language);
    
    document.documentElement.lang = language;
    document.documentElement.dir = this.supportedLanguages[language].dir;
    
    this.updateAllTranslations();
    
    window.dispatchEvent(new CustomEvent('languageChanged', {
      detail: { current: language }
    }));
    
    return true;
  }

  // Load saved language
  loadSavedLanguage() {
    const savedLanguage = localStorage.getItem('edupath_language');
    const browserLanguage = navigator.language.split('-')[0];
    const languageToUse = savedLanguage || 
                         (this.supportedLanguages[browserLanguage] ? browserLanguage : this.defaultLanguage);
    this.changeLanguage(languageToUse);
  }

  // Update all translatable elements
  updateAllTranslations() {
    // Update elements with data-i18n attribute
    document.querySelectorAll('[data-i18n]').forEach(element => {
      const key = element.getAttribute('data-i18n');
      const translation = this.t(key);
      
      if (element.hasAttribute('data-i18n-html')) {
        element.innerHTML = translation;
      } else {
        element.textContent = translation;
      }
    });

    // Update placeholders
    document.querySelectorAll('[data-i18n-placeholder]').forEach(element => {
      const key = element.getAttribute('data-i18n-placeholder');
      element.placeholder = this.t(key);
    });
    
    // Update title attributes
    document.querySelectorAll('[data-i18n-title]').forEach(element => {
      const key = element.getAttribute('data-i18n-title');
      element.title = this.t(key);
    });
    
    // Update aria-label attributes
    document.querySelectorAll('[data-i18n-aria]').forEach(element => {
      const key = element.getAttribute('data-i18n-aria');
      element.setAttribute('aria-label', this.t(key));
    });
    
    // Force update of floating language selector tooltip
    const floatingButton = document.querySelector('.floating-lang-button');
    if (floatingButton) {
      floatingButton.title = `Language: ${this.supportedLanguages[this.currentLanguage].name}`;
    }
    
    // Update dynamic content immediately
    this.updateDynamicContent();
  }
  // Update dynamic content not covered by data-i18n
  updateDynamicContent() {
    // Update trending section content
    this.updateTrendingContent();
    
    // Update testimonials
    this.updateTestimonials();
    
    // Update quick benefits
    this.updateQuickBenefits();
    
    // Update hero note
    this.updateHeroNote();
  }
  
  updateTrendingContent() {
    const trendingItems = document.querySelectorAll('.trending-item');
    if (trendingItems.length >= 3) {
      const lang = this.currentLanguage;
      
      // Update trending item 1 (Computer Science & AI)
      const item1 = trendingItems[0];
      const badge1 = item1.querySelector('.trending-badge');
      const title1 = item1.querySelector('h3');
      const desc1 = item1.querySelector('p');
      
      if (lang === 'hi') {
        if (badge1) badge1.textContent = 'सबसे खोजा गया';
        if (title1) title1.textContent = '💻 कंप्यूटर साइंस और AI';
        if (desc1) desc1.textContent = 'औसत वेतन: ₹8-35 LPA';
      } else if (lang === 'ur') {
        if (badge1) badge1.textContent = 'سب سے زیادہ تلاش';
        if (title1) title1.textContent = '💻 کمپیوٹر سائنس اور AI';
        if (desc1) desc1.textContent = 'اوسط تنخواہ: ₹8-35 LPA';
      } else {
        if (badge1) badge1.textContent = 'Most Searched';
        if (title1) title1.textContent = '💻 Computer Science & AI';
        if (desc1) desc1.textContent = 'Average Salary: ₹8-35 LPA';
      }
    }
  }
  
  updateTestimonials() {
    // This will be handled by existing testimonial update logic
  }
  
  updateQuickBenefits() {
    // This will be handled by data-i18n attributes
  }
  
  updateHeroNote() {
    // This will be handled by data-i18n attributes
  }

  // Create language selector
  createLanguageSelector(floating = false) {
    const selector = document.createElement('div');
    selector.className = floating ? 'language-selector floating' : 'language-selector';
    
    if (floating) {
      selector.innerHTML = `
        <button class="language-button" type="button" title="Select Language (${this.supportedLanguages[this.currentLanguage].name})">
          <span class="current-language">
            <span class="flag">🌐</span>
          </span>
        </button>
        <div class="language-dropdown">
          ${Object.entries(this.supportedLanguages).map(([code, info]) => `
            <button class="language-option ${code === this.currentLanguage ? 'active' : ''}" 
                    data-language="${code}" type="button" title="Switch to ${info.name}">
              <span class="flag">${info.flag}</span>
              <span class="name">${info.name}</span>
            </button>
          `).join('')}
        </div>
      `;
    } else {
      selector.innerHTML = `
        <button class="language-button" type="button" title="Select Language">
          <span class="current-language">
            <span class="flag">🌐</span>
            <span class="name">${this.supportedLanguages[this.currentLanguage].name}</span>
          </span>
          <span class="dropdown-arrow">▼</span>
        </button>
        <div class="language-dropdown">
          ${Object.entries(this.supportedLanguages).map(([code, info]) => `
            <button class="language-option ${code === this.currentLanguage ? 'active' : ''}" 
                    data-language="${code}" type="button" title="Switch to ${info.name}">
              <span class="flag">${info.flag}</span>
              <span class="name">${info.name}</span>
            </button>
          `).join('')}
        </div>
      `;
    }

    const button = selector.querySelector('.language-button');
    const dropdown = selector.querySelector('.language-dropdown');

    button.addEventListener('click', () => {
      dropdown.classList.toggle('show');
    });

    selector.querySelectorAll('.language-option').forEach(option => {
      option.addEventListener('click', () => {
        const language = option.getAttribute('data-language');
        this.changeLanguage(language);
        dropdown.classList.remove('show');
        
        const currentLang = this.supportedLanguages[language];
        
        if (floating) {
          // Update tooltip for floating button
          button.setAttribute('title', `Select Language (${currentLang.name})`);
        } else {
          // Update name for regular button
          const nameSpan = button.querySelector('.name');
          if (nameSpan) {
            nameSpan.textContent = currentLang.name;
          }
        }
        
        // Update active state in dropdown
        selector.querySelectorAll('.language-option').forEach(opt => opt.classList.remove('active'));
        option.classList.add('active');
      });
    });

    // Close dropdown when clicking outside
    document.addEventListener('click', (e) => {
      if (!selector.contains(e.target)) {
        dropdown.classList.remove('show');
      }
    });

    return selector;
  }

  // Format numbers according to current locale
  formatNumber(number, options = {}) {
    const locale = this.getLocaleForLanguage(this.currentLanguage);
    return new Intl.NumberFormat(locale, options).format(number);
  }

  // Format dates according to current locale
  formatDate(date, options = {}) {
    const locale = this.getLocaleForLanguage(this.currentLanguage);
    return new Intl.DateTimeFormat(locale, options).format(date);
  }

  // Get locale code for language
  getLocaleForLanguage(language) {
    const localeMap = {
      'en': 'en-US',
      'hi': 'hi-IN',
      'ur': 'ur-PK',
      'ks': 'ks-IN',
      'es': 'es-ES',
      'fr': 'fr-FR',
      'de': 'de-DE',
      'zh': 'zh-CN',
      'ar': 'ar-SA'
    };
    return localeMap[language] || 'en-US';
  }

  // Create floating language selector (new implementation)
  createFloatingLanguageSelector() {
    // Create main container
    const container = document.createElement('div');
    container.className = 'floating-language-selector';
    
    // Create button with globe icon
    const button = document.createElement('button');
    button.className = 'floating-lang-button';
    button.innerHTML = '🌐';
    button.title = `Language: ${this.supportedLanguages[this.currentLanguage].name}`;
    
    // Create dropdown
    const dropdown = document.createElement('div');
    dropdown.className = 'floating-lang-dropdown';
    
    // Create language options
    Object.entries(this.supportedLanguages).forEach(([code, info]) => {
      const option = document.createElement('button');
      option.className = `floating-lang-option ${code === this.currentLanguage ? 'active' : ''}`;
      option.innerHTML = `
        <span class="flag">${info.flag}</span>
        <span class="name">${info.name}</span>
      `;
      option.onclick = () => this.selectLanguage(code, container);
      dropdown.appendChild(option);
    });
    
    // Add click handler for button
    button.onclick = (e) => {
      e.stopPropagation();
      dropdown.classList.toggle('show');
    };
    
    // Close dropdown when clicking outside
    document.addEventListener('click', (e) => {
      if (!container.contains(e.target)) {
        dropdown.classList.remove('show');
      }
    });
    
    container.appendChild(button);
    container.appendChild(dropdown);
    
    return container;
  }
  
  // Initialize the floating selector
  initFloatingSelector() {
    console.log('🌐 Initializing new floating language selector...');
    
    // Remove any existing floating selectors
    const existing = document.querySelectorAll('.floating-language-selector, .language-selector.floating');
    existing.forEach(el => el.remove());
    
    // Create and add new floating selector
    const floatingSelector = this.createFloatingLanguageSelector();
    document.body.appendChild(floatingSelector);
    
    console.log('🌐 New floating language selector created successfully');
    return floatingSelector;
  }
  
  // Handle language selection
  selectLanguage(languageCode, container) {
    this.changeLanguage(languageCode);
    
    // Update button title
    const button = container.querySelector('.floating-lang-button');
    button.title = `Language: ${this.supportedLanguages[languageCode].name}`;
    
    // Update active state
    container.querySelectorAll('.floating-lang-option').forEach(opt => {
      opt.classList.remove('active');
    });
    
    // Find and mark the selected option as active
    container.querySelectorAll('.floating-lang-option').forEach(opt => {
      if (opt.onclick.toString().includes(languageCode)) {
        opt.classList.add('active');
      }
    });
    
    // Close dropdown
    container.querySelector('.floating-lang-dropdown').classList.remove('show');
  }
}

// Initialize global i18n instance
window.i18n = new I18nManager();