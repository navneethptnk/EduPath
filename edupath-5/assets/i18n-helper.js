/**
 * I18n Helper Script for EduPath
 * This script should be included in all HTML pages after the main i18n.js
 */

// Initialize language selectors when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
  // No longer adding language selectors to navigation
  // The floating selector is handled by the main page script
  
  // Update page title based on current page and language
  updatePageTitle();

  // Listen for language changes
  window.addEventListener('languageChanged', () => {
    updatePageTitle();
    updateDynamicContent();
  });
});

function updatePageTitle() {
  const currentPage = getCurrentPageName();
  const baseTitle = 'EduPath';
  let pageTitle = baseTitle;

  if (currentPage && window.i18n) {
    const pageTitleKey = `nav.${currentPage}`;
    const translatedTitle = window.i18n.t(pageTitleKey);
    if (translatedTitle !== pageTitleKey) {
      pageTitle = `${translatedTitle} — ${baseTitle}`;
    }
  }

  document.title = pageTitle;
}

function getCurrentPageName() {
  const path = window.location.pathname;
  const fileName = path.split('/').pop().split('.')[0];
  
  const pageMap = {
    'index': 'home',
    'quiz': 'quiz',
    'courses': 'courses',
    'career': 'career',
    'colleges': 'colleges',
    'scholarships': 'scholarships',
    'timeline': 'timeline',
    'profile': 'profile'
  };

  return pageMap[fileName] || 'home';
}

function updateDynamicContent() {
  // Update any dynamic content that needs language-specific formatting
  // This can be overridden in individual pages for specific content
  
  // Format numbers according to current locale
  document.querySelectorAll('[data-format-number]').forEach(element => {
    const number = parseFloat(element.getAttribute('data-format-number'));
    if (!isNaN(number)) {
      element.textContent = window.i18n.formatNumber(number);
    }
  });

  // Format dates according to current locale
  document.querySelectorAll('[data-format-date]').forEach(element => {
    const dateStr = element.getAttribute('data-format-date');
    const date = new Date(dateStr);
    if (!isNaN(date.getTime())) {
      element.textContent = window.i18n.formatDate(date);
    }
  });
  
  // Update testimonials based on language
  const testimonialElement = document.querySelector('.testimonial-text');
  if (testimonialElement && window.i18n) {
    const currentLang = window.i18n.currentLanguage;
    
    if (currentLang === 'hi') {
      testimonialElement.innerHTML = `
        <strong>"सही कॉलेज में 98% फीस छात्रवृत्ति मिली!"</strong>
        <br><small>- राजेश के., NIT वारंगल</small>
      `;
    } else if (currentLang === 'ur') {
      testimonialElement.innerHTML = `
        <strong>"مجھے 98% فیس اسکالرشپ کے ساتھ اپنا مطلوبہ کالج ملا!"</strong>
        <br><small>- راجیش کے., NIT وارنگل</small>
      `;
    } else if (currentLang === 'ks') {
      testimonialElement.innerHTML = `
        <strong>"مین 98% فیس اسکالرشپ ساتھ پنن مطلوبہ کالج ملیو!"</strong>
        <br><small>- راجیش کے., NIT وارنگل</small>
      `;
    } else if (currentLang === 'es') {
      testimonialElement.innerHTML = `
        <strong>"¡Encontré mi universidad ideal con 98% de beca!"</strong>
        <br><small>- Rajesh K., NIT Warangal</small>
      `;
    } else {
      // Default English
      testimonialElement.innerHTML = `
        <strong>"Found my dream college with 98% fee scholarship!"</strong>
        <br><small>- Rajesh K., NIT Warangal</small>
      `;
    }
  }
}

// Utility function to add translation attributes to existing elements
function addTranslationAttribute(selector, translationKey, isHtml = false) {
  const elements = document.querySelectorAll(selector);
  elements.forEach(element => {
    element.setAttribute('data-i18n', translationKey);
    if (isHtml) {
      element.setAttribute('data-i18n-html', 'true');
    }
    // Apply translation immediately
    if (window.i18n) {
      const translation = window.i18n.t(translationKey);
      if (isHtml) {
        element.innerHTML = translation;
      } else {
        element.textContent = translation;
      }
    }
  });
}

// Language detection and suggestion
function suggestLanguageChange() {
  const browserLang = navigator.language.split('-')[0];
  const currentLang = window.i18n?.currentLanguage || 'en';
  const supportedLanguages = window.i18n?.supportedLanguages || {};

  if (browserLang !== currentLang && supportedLanguages[browserLang]) {
    const langInfo = supportedLanguages[browserLang];
    
    // Create a subtle notification to suggest language change
    const notification = document.createElement('div');
    notification.className = 'language-suggestion';
    notification.innerHTML = `
      <div class="language-suggestion-content">
        <span class="flag">${langInfo.flag}</span>
        <span class="text">Switch to ${langInfo.name}?</span>
        <button onclick="acceptLanguageSuggestion('${browserLang}')" class="accept-btn">Yes</button>
        <button onclick="dismissLanguageSuggestion()" class="dismiss-btn">No</button>
      </div>
    `;
    
    document.body.appendChild(notification);
    
    // Auto-dismiss after 10 seconds
    setTimeout(() => {
      dismissLanguageSuggestion();
    }, 10000);
  }
}

function acceptLanguageSuggestion(language) {
  if (window.i18n) {
    window.i18n.changeLanguage(language);
  }
  dismissLanguageSuggestion();
}

function dismissLanguageSuggestion() {
  const suggestion = document.querySelector('.language-suggestion');
  if (suggestion) {
    suggestion.remove();
  }
  // Remember the user's choice
  localStorage.setItem('edupath_language_suggestion_dismissed', 'true');
}

// Only show language suggestion if not previously dismissed
if (!localStorage.getItem('edupath_language_suggestion_dismissed')) {
  setTimeout(suggestLanguageChange, 3000);
}