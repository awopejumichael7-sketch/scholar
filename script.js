// ===== GLOBAL VARIABLES =====
let currentUser = null;
let currentTheme = localStorage.getItem('theme') || 'light';

// ===== DOM ELEMENTS =====
const themeBtn = document.getElementById('themeBtn');
const navLinks = document.querySelector('.nav-links');
const menuToggle = document.getElementById('menuToggle');
const loginBtn = document.getElementById('loginBtn');
const signupBtn = document.getElementById('signupBtn');
const loginModal = document.getElementById('loginModal');
const signupModal = document.getElementById('signupModal');
const modalCloseBtns = document.querySelectorAll('.modal-close');
const switchToSignup = document.getElementById('switchToSignup');
const switchToLogin = document.getElementById('switchToLogin');
const loginForm = document.getElementById('loginForm');
const signupForm = document.getElementById('signupForm');
const startPracticeBtn = document.getElementById('startPractice');
const exploreSubjectsBtn = document.getElementById('exploreSubjects');
const ctaSignupBtn = document.getElementById('ctaSignup');

// ===== THEME MANAGEMENT =====
function initTheme() {
    document.documentElement.setAttribute('data-theme', currentTheme);
    updateThemeIcon();
}

function toggleTheme() {
    currentTheme = currentTheme === 'light' ? 'dark' : 'light';
    document.documentElement.setAttribute('data-theme', currentTheme);
    localStorage.setItem('theme', currentTheme);
    updateThemeIcon();
}

function updateThemeIcon() {
    if (themeBtn) {
        const icon = themeBtn.querySelector('i');
        if (currentTheme === 'dark') {
            icon.className = 'fas fa-sun';
            themeBtn.title = 'Switch to light mode';
        } else {
            icon.className = 'fas fa-moon';
            themeBtn.title = 'Switch to dark mode';
        }
    }
}

// ===== MODAL MANAGEMENT =====
function openModal(modal) {
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeModal(modal) {
    modal.classList.remove('active');
    document.body.style.overflow = 'auto';
}

function closeAllModals() {
    closeModal(loginModal);
    closeModal(signupModal);
}

// ===== USER AUTHENTICATION =====
function handleLogin(e) {
    e.preventDefault();
    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;
    
    // Mock authentication - In production, this would call an API
    if (email && password) {
        currentUser = {
            email: email,
            name: email.split('@')[0],
            classLevel: 'ss3',
            subscription: 'free'
        };
        
        localStorage.setItem('currentUser', JSON.stringify(currentUser));
        closeAllModals();
        showNotification('Login successful!', 'success');
        updateAuthUI();
    } else {
        showNotification('Please fill in all fields', 'error');
    }
}

function handleSignup(e) {
    e.preventDefault();
    const firstName = document.getElementById('signupFirstName').value;
    const lastName = document.getElementById('signupLastName').value;
    const email = document.getElementById('signupEmail').value;
    const password = document.getElementById('signupPassword').value;
    const classLevel = document.getElementById('signupClass').value;
    const examTarget = document.getElementById('signupExam').value;
    
    if (firstName && lastName && email && password && classLevel && examTarget) {
        currentUser = {
            firstName: firstName,
            lastName: lastName,
            email: email,
            classLevel: classLevel,
            examTarget: examTarget,
            subscription: 'free',
            joinDate: new Date().toISOString()
        };
        
        localStorage.setItem('currentUser', JSON.stringify(currentUser));
        closeAllModals();
        showNotification('Account created successfully!', 'success');
        updateAuthUI();
    } else {
        showNotification('Please fill in all fields', 'error');
    }
}

function logout() {
    currentUser = null;
    localStorage.removeItem('currentUser');
    showNotification('Logged out successfully', 'success');
    updateAuthUI();
}

function checkAuthStatus() {
    const userData = localStorage.getItem('currentUser');
    if (userData) {
        currentUser = JSON.parse(userData);
        updateAuthUI();
    }
}

function updateAuthUI() {
    const authButtons = document.querySelector('.auth-buttons');
    if (!authButtons) return;
    
    if (currentUser) {
        authButtons.innerHTML = `
            <div class="user-dropdown">
                <button class="btn btn-outline" id="userMenuBtn">
                    <i class="fas fa-user"></i> ${currentUser.firstName || currentUser.name}
                </button>
                <div class="dropdown-content">
                    <a href="dashboard.html"><i class="fas fa-chart-line"></i> Dashboard</a>
                    <a href="#"><i class="fas fa-cog"></i> Settings</a>
                    <a href="#" id="logoutBtn"><i class="fas fa-sign-out-alt"></i> Logout</a>
                </div>
            </div>
        `;
        
        document.getElementById('logoutBtn')?.addEventListener('click', logout);
    } else {
        authButtons.innerHTML = `
            <button class="btn btn-outline" id="loginBtn">Login</button>
            <button class="btn btn-primary" id="signupBtn">Sign Up Free</button>
        `;
        
        // Re-attach event listeners
        document.getElementById('loginBtn')?.addEventListener('click', () => openModal(loginModal));
        document.getElementById('signupBtn')?.addEventListener('click', () => openModal(signupModal));
    }
}

// ===== NOTIFICATION SYSTEM =====
function showNotification(message, type = 'info') {
    // Remove existing notification
    const existingNotification = document.querySelector('.notification');
    if (existingNotification) {
        existingNotification.remove();
    }
    
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <i class="fas fa-${type === 'success' ? 'check-circle' : type === 'error' ? 'exclamation-circle' : 'info-circle'}"></i>
            <span>${message}</span>
        </div>
        <button class="notification-close">&times;</button>
    `;
    
    document.body.appendChild(notification);
    
    // Show notification
    setTimeout(() => {
        notification.classList.add('show');
    }, 10);
    
    // Auto-remove after 5 seconds
    const autoRemove = setTimeout(() => {
        closeNotification(notification);
    }, 5000);
    
    // Close button
    notification.querySelector('.notification-close').addEventListener('click', () => {
        closeNotification(notification);
        clearTimeout(autoRemove);
    });
    
    function closeNotification(notif) {
        notif.classList.remove('show');
        setTimeout(() => {
            if (notif.parentNode) {
                notif.parentNode.removeChild(notif);
            }
        }, 300);
    }
}

// Add notification styles
const notificationStyles = document.createElement('style');
notificationStyles.textContent = `
.notification {
    position: fixed;
    top: 100px;
    right: 20px;
    background-color: var(--bg-white);
    border-radius: var(--radius);
    box-shadow: var(--shadow-lg);
    padding: 15px 20px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    min-width: 300px;
    max-width: 400px;
    z-index: 2000;
    transform: translateX(150%);
    transition: transform 0.3s ease;
}

.notification.show {
    transform: translateX(0);
}

.notification-content {
    display: flex;
    align-items: center;
    gap: 10px;
}

.notification i {
    font-size: 1.2rem;
}

.notification-success i {
    color: var(--accent-color);
}

.notification-error i {
    color: var(--danger-color);
}

.notification-info i {
    color: var(--primary-color);
}

.notification-close {
    background: none;
    border: none;
    font-size: 1.5rem;
    color: var(--text-secondary);
    cursor: pointer;
    line-height: 1;
    padding: 0;
    margin-left: 15px;
}
`;
document.head.appendChild(notificationStyles);

// ===== SUBJECTS DATA =====
const subjectsData = [
    { name: 'Mathematics', icon: 'calculator', count: 4200, color: '#4361ee' },
    { name: 'English', icon: 'language', count: 3800, color: '#7209b7' },
    { name: 'Physics', icon: 'atom', count: 2500, color: '#ef476f' },
    { name: 'Chemistry', icon: 'flask', count: 2300, color: '#06d6a0' },
    { name: 'Biology', icon: 'dna', count: 2700, color: '#ff9e00' },
    { name: 'ICT', icon: 'laptop-code', count: 1800, color: '#3a86ff' },
    { name: 'Economics', icon: 'chart-line', count: 1900, color: '#8338ec' },
    { name: 'Government', icon: 'landmark', count: 1600, color: '#fb5607' },
    { name: 'Geography', icon: 'globe-africa', count: 1400, color: '#3a86ff' },
    { name: 'Commerce', icon: 'shopping-cart', count: 1200, color: '#06d6a0' },
    { name: 'Accounting', icon: 'calculator', count: 1500, color: '#4361ee' },
    { name: 'Literature', icon: 'book-open', count: 1300, color: '#7209b7' }
];

function populateSubjects() {
    const subjectsGrid = document.querySelector('.subjects-grid');
    if (!subjectsGrid) return;
    
    let html = '';
    subjectsData.forEach(subject => {
        html += `
            <div class="subject-card" data-subject="${subject.name.toLowerCase()}">
                <i class="fas fa-${subject.icon}"></i>
                <h4>${subject.name}</h4>
                <span class="question-count">${subject.count.toLocaleString()} questions</span>
            </div>
        `;
    });
    
    html += `
        <div class="view-all">
            <a href="library.html">
                <i class="fas fa-ellipsis-h"></i>
                <span>View All 30+ Subjects</span>
            </a>
        </div>
    `;
    
    subjectsGrid.innerHTML = html;
    
    // Add click event to subject cards
    document.querySelectorAll('.subject-card').forEach(card => {
        card.addEventListener('click', function() {
            const subject = this.getAttribute('data-subject');
            window.location.href = `library.html?subject=${subject}`;
        });
    });
}

// ===== EVENT LISTENERS =====
document.addEventListener('DOMContentLoaded', function() {
    // Initialize theme
    initTheme();
    
    // Initialize user authentication
    checkAuthStatus();
    
    // Populate subjects
    populateSubjects();
    
    // Theme toggle
    if (themeBtn) {
        themeBtn.addEventListener('click', toggleTheme);
    }
    
    // Mobile menu toggle
    if (menuToggle) {
        menuToggle.addEventListener('click', function() {
            navLinks.classList.toggle('active');
        });
    }
    
    // Close mobile menu when clicking outside
    document.addEventListener('click', function(event) {
        if (!event.target.closest('.navbar') && navLinks.classList.contains('active')) {
            navLinks.classList.remove('active');
        }
    });
    
    // Modal open buttons
    if (loginBtn) loginBtn.addEventListener('click', () => openModal(loginModal));
    if (signupBtn) signupBtn.addEventListener('click', () => openModal(signupModal));
    if (startPracticeBtn) startPracticeBtn.addEventListener('click', () => openModal(signupModal));
    if (exploreSubjectsBtn) exploreSubjectsBtn.addEventListener('click', () => {
        document.querySelector('.subjects')?.scrollIntoView({ behavior: 'smooth' });
    });
    if (ctaSignupBtn) ctaSignupBtn.addEventListener('click', () => openModal(signupModal));
    
    // Modal close buttons
    modalCloseBtns.forEach(btn => {
        btn.addEventListener('click', closeAllModals);
    });
    
    // Modal switches
    if (switchToSignup) {
        switchToSignup.addEventListener('click', function(e) {
            e.preventDefault();
            closeModal(loginModal);
            openModal(signupModal);
        });
    }
    
    if (switchToLogin) {
        switchToLogin.addEventListener('click', function(e) {
            e.preventDefault();
            closeModal(signupModal);
            openModal(loginModal);
        });
    }
    
    // Close modals on outside click
    window.addEventListener('click', function(event) {
        if (event.target.classList.contains('modal')) {
            closeAllModals();
        }
    });
    
    // Form submissions
    if (loginForm) {
        loginForm.addEventListener('submit', handleLogin);
    }
    
    if (signupForm) {
        signupForm.addEventListener('submit', handleSignup);
    }
    
    // Quick links cards
    document.querySelectorAll('.link-card').forEach(card => {
        card.addEventListener('click', function() {
            const url = this.getAttribute('onclick')?.match(/'([^']+)'/)?.[1];
            if (url) {
                window.location.href = url;
            }
        });
    });
    
    // Demo data for stats animation
    animateStats();
});

// ===== ANIMATION FUNCTIONS =====
function animateStats() {
    const stats = document.querySelectorAll('.stat h3');
    if (!stats.length) return;
    
    stats.forEach(stat => {
        const target = parseInt(stat.textContent.replace(/\D/g, ''));
        let current = 0;
        const increment = target / 50;
        const timer = setInterval(() => {
            current += increment;
            if (current >= target) {
                current = target;
                clearInterval(timer);
            }
            stat.textContent = Math.floor(current).toLocaleString() + (stat.textContent.includes('%') ? '%' : '+');
        }, 30);
    });
}

// ===== LOCAL STORAGE DATA =====
// Initialize demo data if not exists
function initDemoData() {
    if (!localStorage.getItem('examData')) {
        const demoData = {
            subjects: subjectsData,
            exams: [
                { name: 'WAEC', years: [2024, 2023, 2022, 2021, 2020] },
                { name: 'JAMB', years: [2024, 2023, 2022, 2021, 2020] },
                { name: 'NECO', years: [2024, 2023, 2022, 2021, 2020] }
            ],
            classes: ['JSS1', 'JSS2', 'JSS3', 'SS1', 'SS2', 'SS3'],
            terms: ['1st Term', '2nd Term', '3rd Term']
        };
        localStorage.setItem('examData', JSON.stringify(demoData));
    }
}

// Call init function
initDemoData();

// ===== UTILITY FUNCTIONS =====
function getQueryParams() {
    const params = {};
    const queryString = window.location.search.substring(1);
    const pairs = queryString.split('&');
    
    for (const pair of pairs) {
        const [key, value] = pair.split('=');
        if (key && value) {
            params[decodeURIComponent(key)] = decodeURIComponent(value);
        }
    }
    
    return params;
}

function formatTime(seconds) {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    
    return `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
}

// ===== EXPORT FOR OTHER PAGES =====
// This allows functions to be used in other HTML files
window.ExamMaster = {
    currentUser,
    showNotification,
    logout,
    formatTime,
    getQueryParams
};