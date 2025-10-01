// EduPath Authentication Integration
// This module provides seamless authentication integration across all pages

class EduPathAuth {
  constructor() {
    this.currentUser = null;
    this.init();
  }

  init() {
    this.loadCurrentUser();
    this.updateUI();
    this.initAuthChecks();
  }

  loadCurrentUser() {
    // Check both session and local storage
    const sessionUser = sessionStorage.getItem('edupath-current-user');
    const localUser = localStorage.getItem('edupath-current-user');
    
    if (sessionUser) {
      this.currentUser = JSON.parse(sessionUser);
    } else if (localUser) {
      this.currentUser = JSON.parse(localUser);
    }
  }

  isLoggedIn() {
    return this.currentUser !== null;
  }

  isGuest() {
    return this.currentUser && this.currentUser.isGuest;
  }

  getCurrentUser() {
    return this.currentUser;
  }

  updateUI() {
    this.updateNavigation();
    this.updateProfileElements();
  }

  updateNavigation() {
    // Update navigation based on auth state
    const navContainer = document.querySelector('.nav-desktop');
    const mobileNavContainer = document.querySelector('.nav-mobile');
    
    if (!navContainer) return;

    // Remove existing auth elements
    const existingAuthElements = document.querySelectorAll('.auth-nav-item');
    existingAuthElements.forEach(el => el.remove());

    // Always show profile icon with dropdown for both auth states
    const profileMenu = this.createProfileMenu();
    navContainer.appendChild(profileMenu);
    
    if (mobileNavContainer) {
      const mobileProfileMenu = this.createProfileMenu(true);
      mobileNavContainer.appendChild(mobileProfileMenu);
    }
  }

  createProfileMenu(isMobile = false) {
    const menuContainer = document.createElement('div');
    menuContainer.className = `auth-nav-item profile-menu ${isMobile ? 'mobile' : 'desktop'}`;
    
    if (this.isLoggedIn()) {
      const userName = this.currentUser.name || 'User';
      const userInitials = userName.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
      
      menuContainer.innerHTML = `
        <div class="profile-menu-trigger" onclick="eduPathAuth.toggleProfileMenu(${isMobile})">
          <div class="profile-avatar">${this.isGuest() ? '👤' : userInitials}</div>
          <span class="profile-dropdown-arrow">▼</span>
        </div>
        <div class="profile-menu-dropdown hidden">
          <div class="profile-menu-header">
            <div class="profile-info">
              <div class="profile-avatar-large">${this.isGuest() ? '👤' : userInitials}</div>
              <div class="profile-details">
                <div class="profile-name">${this.isGuest() ? 'Guest User' : userName}</div>
                <div class="profile-status">${this.isGuest() ? 'Browsing as guest' : 'Signed in'}</div>
              </div>
            </div>
          </div>
          ${!this.isGuest() ? `
            <a href="profile.html" class="menu-item">
              <span>👤</span> My Profile
            </a>
            <div class="menu-divider"></div>
          ` : ''}
          <a href="quiz.html" class="menu-item">
            <span>🎯</span> Take Quiz
          </a>
          <a href="colleges.html" class="menu-item">
            <span>🏫</span> Find Colleges
          </a>
          <a href="scholarships.html" class="menu-item">
            <span>💰</span> Scholarships
          </a>
          <div class="menu-divider"></div>
          ${!this.isGuest() ? `
            <button onclick="eduPathAuth.logout()" class="menu-item logout-btn">
              <span>🚪</span> Sign Out
            </button>
          ` : `
            <a href="auth.html" class="menu-item signin-btn">
              <span>🔐</span> Sign In
            </a>
            <a href="auth.html#register" class="menu-item signup-btn">
              <span>✨</span> Sign Up
            </a>
          `}
        </div>
      `;
    } else {
      menuContainer.innerHTML = `
        <div class="profile-menu-trigger" onclick="eduPathAuth.toggleProfileMenu(${isMobile})">
          <div class="profile-avatar">👤</div>
          <span class="profile-dropdown-arrow">▼</span>
        </div>
        <div class="profile-menu-dropdown hidden">
          <div class="profile-menu-header">
            <div class="profile-info">
              <div class="profile-avatar-large">👤</div>
              <div class="profile-details">
                <div class="profile-name">Welcome!</div>
                <div class="profile-status">Sign in to save progress</div>
              </div>
            </div>
          </div>
          <a href="quiz.html" class="menu-item">
            <span>🎯</span> Take Quiz
          </a>
          <a href="colleges.html" class="menu-item">
            <span>🏫</span> Find Colleges
          </a>
          <a href="scholarships.html" class="menu-item">
            <span>💰</span> Scholarships
          </a>
          <div class="menu-divider"></div>
          <a href="auth.html" class="menu-item signin-btn">
            <span>🔐</span> Sign In
          </a>
          <a href="auth.html#register" class="menu-item signup-btn featured">
            <span>✨</span> Sign Up
          </a>
        </div>
      `;
    }
    
    return menuContainer;
  }

  updateProfileElements() {
    // Update any profile-specific elements on the current page
    const profileNameElements = document.querySelectorAll('[data-user-name]');
    const profileEmailElements = document.querySelectorAll('[data-user-email]');
    
    if (this.isLoggedIn()) {
      profileNameElements.forEach(el => {
        el.textContent = this.currentUser.name;
      });
      
      profileEmailElements.forEach(el => {
        el.textContent = this.currentUser.email;
      });
    }
  }

  toggleProfileMenu(isMobile = false) {
    const selector = isMobile ? '.profile-menu.mobile .profile-menu-dropdown' : '.profile-menu.desktop .profile-menu-dropdown';
    const dropdown = document.querySelector(selector);
    
    if (dropdown) {
      dropdown.classList.toggle('hidden');
      
      // Close dropdown when clicking outside
      if (!dropdown.classList.contains('hidden')) {
        setTimeout(() => {
          document.addEventListener('click', this.closeProfileMenuOnOutsideClick.bind(this), { once: true });
        }, 0);
      }
    }
  }

  closeProfileMenuOnOutsideClick(event) {
    if (!event.target.closest('.profile-menu')) {
      document.querySelectorAll('.profile-menu-dropdown').forEach(dropdown => {
        dropdown.classList.add('hidden');
      });
    }
  }

  async logout() {
    if (confirm('Are you sure you want to sign out?')) {
      // Clear auth data
      sessionStorage.removeItem('edupath-current-user');
      localStorage.removeItem('edupath-current-user');
      
      // Log activity
      this.logActivity('logout', 'User logged out');
      
      // Show notification
      if (window.__showNotification) {
        window.__showNotification('You have been signed out successfully!', 'info');
      }
      
      // Redirect to home or auth page
      setTimeout(() => {
        window.location.href = 'index.html';
      }, 1500);
    }
  }

  requireAuth(redirectTo = 'auth.html', message = 'Please sign in to continue') {
    if (!this.isLoggedIn()) {
      const currentUrl = encodeURIComponent(window.location.pathname + window.location.search);
      window.location.href = `${redirectTo}?redirect=${currentUrl}&message=${encodeURIComponent(message)}`;
      return false;
    }
    return true;
  }

  // New method for conditional authentication prompts
  promptAuthIfNeeded(action = 'save data', callback = null) {
    if (!this.isLoggedIn()) {
      return this.showAuthPrompt(action, callback);
    }
    if (callback) callback();
    return true;
  }

  showAuthPrompt(action, callback = null) {
    const modal = this.createAuthPromptModal(action, callback);
    document.body.appendChild(modal);
    return false;
  }

  createAuthPromptModal(action, callback) {
    const modal = document.createElement('div');
    modal.className = 'auth-prompt-modal';
    modal.innerHTML = `
      <div class="auth-prompt-overlay" onclick="this.parentElement.remove()"></div>
      <div class="auth-prompt-content">
        <div class="auth-prompt-header">
          <h3>🔐 Sign in to ${action}</h3>
          <button class="auth-prompt-close" onclick="this.closest('.auth-prompt-modal').remove()">&times;</button>
        </div>
        <div class="auth-prompt-body">
          <p>Create an account or sign in to save your progress and get personalized recommendations.</p>
          <div class="auth-prompt-benefits">
            <div class="benefit-item">
              <span class="benefit-icon">💾</span>
              <span>Save your quiz results and preferences</span>
            </div>
            <div class="benefit-item">
              <span class="benefit-icon">🎯</span>
              <span>Get personalized career recommendations</span>
            </div>
            <div class="benefit-item">
              <span class="benefit-icon">📊</span>
              <span>Track your learning progress</span>
            </div>
            <div class="benefit-item">
              <span class="benefit-icon">💫</span>
              <span>Access saved colleges and courses</span>
            </div>
          </div>
        </div>
        <div class="auth-prompt-actions">
          <button class="btn-secondary" onclick="eduPathAuth.continueAsGuest(${callback ? 'true' : 'false'})">
            Continue as Guest
          </button>
          <a href="auth.html?redirect=${encodeURIComponent(window.location.pathname)}" class="btn-primary">
            Sign In / Sign Up
          </a>
        </div>
      </div>
    `;
    return modal;
  }

  continueAsGuest(hasCallback = false) {
    // Create guest session
    const guestUser = {
      id: 'guest_' + Date.now(),
      name: 'Guest User',
      email: '',
      isGuest: true,
      createdAt: new Date().toISOString()
    };
    
    this.currentUser = guestUser;
    sessionStorage.setItem('edupath-current-user', JSON.stringify(guestUser));
    
    // Update UI
    this.updateUI();
    
    // Close modal
    document.querySelector('.auth-prompt-modal')?.remove();
    
    // Show guest notification
    if (window.__showNotification) {
      window.__showNotification('Continuing as guest. Sign up to save your progress!', 'info');
    }
    
    // Execute callback if provided
    if (hasCallback && window.pendingCallback) {
      window.pendingCallback();
      window.pendingCallback = null;
    }
  }

  initAuthChecks() {
    // Only check for strict auth requirements (like profile page)
    const requiresAuth = document.body.dataset.requiresAuth === 'true';
    const isProfilePage = window.location.pathname.includes('profile.html');
    
    // Only require auth for profile page
    if (isProfilePage && !this.isLoggedIn()) {
      this.requireAuth('auth.html', 'Please sign in to access your profile');
      return;
    }
    
    // Show gentle signup prompts for other features
    this.setupOptionalAuthPrompts();
    
    // Hide guest-only elements if user is logged in
    if (this.isLoggedIn()) {
      document.querySelectorAll('[data-guest-only]').forEach(el => {
        el.style.display = 'none';
      });
    }
    
    // Hide auth-only elements if user is not logged in
    if (!this.isLoggedIn()) {
      document.querySelectorAll('[data-auth-only]').forEach(el => {
        el.style.display = 'none';
      });
    }
  }

  setupOptionalAuthPrompts() {
    // Add auth prompts to specific actions that benefit from authentication
    
    // Quiz page - prompt before starting quiz
    if (window.location.pathname.includes('quiz.html')) {
      this.setupQuizAuthPrompt();
    }
    
    // Colleges page - prompt when saving colleges
    if (window.location.pathname.includes('colleges.html')) {
      this.setupCollegesSavePrompt();
    }
    
    // Career page - prompt when saving career interests
    if (window.location.pathname.includes('career.html')) {
      this.setupCareerSavePrompt();
    }
  }

  setupQuizAuthPrompt() {
    // Add gentle prompt before starting quiz
    const startQuizBtn = document.querySelector('#start-quiz, .start-quiz-btn, [data-action="start-quiz"]');
    if (startQuizBtn && !this.isLoggedIn()) {
      const originalOnClick = startQuizBtn.onclick;
      startQuizBtn.onclick = (e) => {
        e.preventDefault();
        window.pendingCallback = originalOnClick;
        this.promptAuthIfNeeded('get personalized quiz results', () => {
          if (originalOnClick) originalOnClick();
        });
      };
    }
  }

  setupCollegesSavePrompt() {
    // Monitor for save college actions
    document.addEventListener('click', (e) => {
      if (e.target.matches('.save-college, [data-action="save-college"]') && !this.isLoggedIn()) {
        e.preventDefault();
        this.promptAuthIfNeeded('save colleges to your list');
      }
    });
  }

  setupCareerSavePrompt() {
    // Monitor for save career actions
    document.addEventListener('click', (e) => {
      if (e.target.matches('.save-career, [data-action="save-career"]') && !this.isLoggedIn()) {
        e.preventDefault();
        this.promptAuthIfNeeded('save career interests');
      }
    });
  }

  logActivity(type, description) {
    if (window.__storage) {
      const activity = window.__storage.get('user-activity', []);
      activity.push({
        type,
        description,
        timestamp: new Date().toISOString(),
        userId: this.currentUser?.id
      });
      window.__storage.set('user-activity', activity);
    }
  }

  // Utility methods for other pages
  saveUserPreference(key, value) {
    if (this.isLoggedIn()) {
      const userPrefs = window.__storage?.get(`user-prefs-${this.currentUser.id}`, {}) || {};
      userPrefs[key] = value;
      window.__storage?.set(`user-prefs-${this.currentUser.id}`, userPrefs);
    }
  }

  getUserPreference(key, defaultValue = null) {
    if (this.isLoggedIn()) {
      const userPrefs = window.__storage?.get(`user-prefs-${this.currentUser.id}`, {}) || {};
      return userPrefs[key] || defaultValue;
    }
    return defaultValue;
  }

  // Enhanced data tracking for authenticated users
  trackPageView(pageName) {
    if (this.isLoggedIn()) {
      this.logActivity('page_view', `Viewed ${pageName} page`);
    }
  }

  trackInteraction(type, details) {
    if (this.isLoggedIn()) {
      this.logActivity(type, details);
    }
  }
}

// CSS for authentication UI elements
const authStyles = `
  .auth-nav-item {
    display: flex;
    align-items: center;
    gap: 1rem;
  }
  
  .profile-menu {
    position: relative;
  }
  
  .profile-menu-trigger {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.5rem;
    border-radius: 50%;
    cursor: pointer;
    transition: all 0.2s ease;
    border: 2px solid transparent;
    background: transparent;
  }
  
  .profile-menu-trigger:hover {
    background: rgba(102, 126, 234, 0.1);
    border-color: rgba(102, 126, 234, 0.2);
    border-radius: 0.75rem;
  }
  
  .profile-avatar {
    width: 36px;
    height: 36px;
    border-radius: 50%;
    background: linear-gradient(135deg, #667eea, #764ba2);
    color: white;
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: 600;
    font-size: 0.875rem;
    box-shadow: 0 2px 8px rgba(102, 126, 234, 0.3);
    transition: all 0.2s ease;
  }
  
  .profile-menu-trigger:hover .profile-avatar {
    transform: scale(1.05);
    box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
  }
  
  .profile-dropdown-arrow {
    font-size: 0.6rem;
    color: #6b7280;
    transition: transform 0.2s ease;
    margin-left: -0.25rem;
    opacity: 0;
  }
  
  .profile-menu-trigger:hover .profile-dropdown-arrow {
    opacity: 1;
    transform: rotate(180deg);
  }
  
  .profile-menu-dropdown {
    position: absolute;
    top: calc(100% + 0.5rem);
    right: 0;
    background: white;
    border-radius: 1rem;
    box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
    border: 1px solid #e5e7eb;
    min-width: 280px;
    z-index: 1000;
    overflow: hidden;
    animation: dropdownSlideIn 0.2s ease;
  }
  
  @keyframes dropdownSlideIn {
    from {
      opacity: 0;
      transform: translateY(-10px) scale(0.95);
    }
    to {
      opacity: 1;
      transform: translateY(0) scale(1);
    }
  }
  
  .profile-menu-dropdown.hidden {
    display: none;
  }
  
  .profile-menu-header {
    background: linear-gradient(135deg, #667eea, #764ba2);
    padding: 1.5rem;
    color: white;
  }
  
  .profile-info {
    display: flex;
    align-items: center;
    gap: 1rem;
  }
  
  .profile-avatar-large {
    width: 48px;
    height: 48px;
    border-radius: 50%;
    background: rgba(255, 255, 255, 0.2);
    color: white;
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: 600;
    font-size: 1.125rem;
    border: 2px solid rgba(255, 255, 255, 0.3);
  }
  
  .profile-details {
    flex: 1;
  }
  
  .profile-name {
    font-weight: 600;
    font-size: 1.125rem;
    margin-bottom: 0.25rem;
  }
  
  .profile-status {
    opacity: 0.9;
    font-size: 0.875rem;
  }
  
  .menu-item {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    padding: 0.875rem 1.5rem;
    color: #374151;
    text-decoration: none;
    transition: all 0.2s ease;
    border: none;
    background: none;
    width: 100%;
    text-align: left;
    cursor: pointer;
    font-size: 0.875rem;
    font-weight: 500;
  }
  
  .menu-item:hover {
    background: #f3f4f6;
    color: #1f2937;
  }
  
  .menu-item span {
    font-size: 1rem;
    width: 20px;
    text-align: center;
  }
  
  .signin-btn {
    color: #667eea;
  }
  
  .signin-btn:hover {
    background: #f0f9ff;
    color: #4f46e5;
  }
  
  .signup-btn.featured {
    background: linear-gradient(135deg, #667eea, #764ba2);
    color: white;
    margin: 0.5rem;
    border-radius: 0.75rem;
    font-weight: 600;
  }
  
  .signup-btn.featured:hover {
    background: linear-gradient(135deg, #4f46e5, #6366f1);
    transform: translateY(-1px);
    box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
  }
  
  .logout-btn {
    color: #dc2626;
  }
  
  .logout-btn:hover {
    background: #fef2f2;
    color: #b91c1c;
  }
  
  .menu-divider {
    height: 1px;
    background: #e5e7eb;
    margin: 0.25rem 0;
  }
  
  /* Auth Prompt Modal */
  .auth-prompt-modal {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    z-index: 10000;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 1rem;
  }
  
  .auth-prompt-overlay {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.5);
    backdrop-filter: blur(4px);
  }
  
  .auth-prompt-content {
    position: relative;
    background: white;
    border-radius: 1rem;
    box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
    max-width: 480px;
    width: 100%;
    max-height: 90vh;
    overflow-y: auto;
    animation: authModalSlideIn 0.3s ease;
  }
  
  @keyframes authModalSlideIn {
    from {
      opacity: 0;
      transform: translateY(-20px) scale(0.95);
    }
    to {
      opacity: 1;
      transform: translateY(0) scale(1);
    }
  }
  
  .auth-prompt-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 1.5rem 1.5rem 1rem;
    border-bottom: 1px solid #e5e7eb;
  }
  
  .auth-prompt-header h3 {
    margin: 0;
    font-size: 1.25rem;
    font-weight: 600;
    color: #1f2937;
  }
  
  .auth-prompt-close {
    background: none;
    border: none;
    font-size: 1.5rem;
    color: #6b7280;
    cursor: pointer;
    padding: 0.25rem;
    border-radius: 0.25rem;
    transition: all 0.2s ease;
  }
  
  .auth-prompt-close:hover {
    background: #f3f4f6;
    color: #374151;
  }
  
  .auth-prompt-body {
    padding: 1.5rem;
  }
  
  .auth-prompt-body p {
    margin: 0 0 1.5rem;
    color: #6b7280;
    line-height: 1.6;
  }
  
  .auth-prompt-benefits {
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }
  
  .benefit-item {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    padding: 0.75rem;
    background: #f8fafc;
    border-radius: 0.5rem;
    border: 1px solid #e2e8f0;
  }
  
  .benefit-icon {
    font-size: 1.25rem;
    flex-shrink: 0;
  }
  
  .benefit-item span:last-child {
    color: #374151;
    font-size: 0.875rem;
    line-height: 1.4;
  }
  
  .auth-prompt-actions {
    display: flex;
    gap: 0.75rem;
    padding: 1rem 1.5rem 1.5rem;
    border-top: 1px solid #e5e7eb;
  }
  
  .auth-prompt-actions .btn-secondary {
    flex: 1;
    padding: 0.75rem 1rem;
    background: #f3f4f6;
    color: #374151;
    border: 1px solid #d1d5db;
    border-radius: 0.5rem;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.2s ease;
    text-decoration: none;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  
  .auth-prompt-actions .btn-secondary:hover {
    background: #e5e7eb;
    border-color: #9ca3af;
  }
  
  .auth-prompt-actions .btn-primary {
    flex: 1;
    padding: 0.75rem 1rem;
    background: linear-gradient(135deg, #667eea, #764ba2);
    color: white;
    border: none;
    border-radius: 0.5rem;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.2s ease;
    text-decoration: none;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  
  .auth-prompt-actions .btn-primary:hover {
    transform: translateY(-1px);
    box-shadow: 0 4px 8px rgba(102, 126, 234, 0.3);
  }
  
  /* Mobile styles */
  @media (max-width: 768px) {
    .auth-nav-item.mobile {
      flex-direction: column;
      align-items: stretch;
      gap: 0.5rem;
    }
    
    .profile-menu.mobile .profile-menu-dropdown {
      position: static;
      margin-top: 0;
      box-shadow: none;
      border: none;
      border-top: 1px solid #e5e7eb;
      border-radius: 0;
      animation: none;
    }
    
    .profile-menu.mobile .profile-menu-trigger {
      justify-content: center;
      padding: 1rem;
    }
    
    .auth-prompt-content {
      margin: 0.5rem;
      max-width: none;
    }
    
    .auth-prompt-actions {
      flex-direction: column;
    }
  }
`;

// Add styles to document
const styleSheet = document.createElement('style');
styleSheet.textContent = authStyles;
document.head.appendChild(styleSheet);

// Initialize authentication system
const eduPathAuth = new EduPathAuth();

// Make it globally available
window.eduPathAuth = eduPathAuth;

// Auto-track page views
document.addEventListener('DOMContentLoaded', () => {
  const pageName = document.title.split('—')[1]?.trim() || 'EduPath';
  eduPathAuth.trackPageView(pageName);
});

console.log('🔐 EduPath Authentication System Loaded!');