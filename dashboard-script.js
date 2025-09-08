// Enhanced Dashboard with Navigation JavaScript
document.addEventListener('DOMContentLoaded', function() {
    // Check authentication
    checkAuth();
    
    // Load user data
    loadUserData();
    
    // Setup navigation
    setupNavigation();
});

// Check if user is authenticated
async function checkAuth() {
    try {
        const response = await fetch('/api/auth/me', {
            credentials: 'include'
        });
        
        if (!response.ok) {
            // User not authenticated, redirect to login
            window.location.href = '/login';
            return;
        }
        
        const data = await response.json();
        if (!data.success) {
            window.location.href = '/login';
            return;
        }
        
        // User is authenticated, update welcome message
        updateWelcomeMessage(data.user);
        
    } catch (error) {
        console.error('Auth check failed:', error);
        window.location.href = '/login';
    }
}

// Load user data and update dashboard
async function loadUserData() {
    try {
        // For now, we'll use static data
        // In a real application, you'd fetch this from the API
        updateDashboardStats({
            enrolledCourses: 0,
            overallProgress: 0,
            certificatesEarned: 0
        });
        
    } catch (error) {
        console.error('Failed to load user data:', error);
        showMessage('Failed to load dashboard data', 'error');
    }
}

// Setup navigation functionality
function setupNavigation() {
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetSection = this.getAttribute('href').substring(1);
            showSection(targetSection);
            
            // Update active nav link
            navLinks.forEach(l => l.classList.remove('active'));
            this.classList.add('active');
        });
    });
}

// Show specific section
function showSection(sectionId) {
    // Hide all sections
    const sections = document.querySelectorAll('.content-section');
    sections.forEach(section => {
        section.classList.remove('active');
    });
    
    // Show target section
    const targetSection = document.getElementById(sectionId);
    if (targetSection) {
        targetSection.classList.add('active');
    }
    
    // Update navigation
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === '#' + sectionId) {
            link.classList.add('active');
        }
    });
}

// Update welcome message
function updateWelcomeMessage(user) {
    const welcomeElement = document.getElementById('userWelcome');
    if (welcomeElement && user) {
        welcomeElement.textContent = `Welcome, ${user.firstName}!`;
    }
}

// Update dashboard statistics
function updateDashboardStats(stats) {
    const statNumbers = document.querySelectorAll('.stat-number');
    if (statNumbers.length >= 3) {
        statNumbers[0].textContent = stats.enrolledCourses;
        statNumbers[1].textContent = `${stats.overallProgress}%`;
        statNumbers[2].textContent = stats.certificatesEarned;
    }
}

// Course enrollment function
function enrollCourse(courseName) {
    showMessage(`Interested in "${courseName}"? This course is specifically designed with accessibility features. Our enrollment team will contact you within 24 hours to discuss your needs and provide personalized support.`, 'success');
    
    // In a real application, this would:
    // 1. Send enrollment request to API
    // 2. Update user's enrolled courses
    // 3. Redirect to course page or show enrollment form
    
    // Simulate enrollment process
    setTimeout(() => {
        showMessage(`Enrollment initiated for "${courseName}". You will receive an email with course access details and accessibility accommodations soon.`, 'info');
    }, 2000);
}

// Show user profile (placeholder)
function showProfile() {
    showMessage('Profile feature coming soon! You can update your personal information, accessibility preferences, and learning goals here.', 'info');
    
    // In a real application, this would show a profile modal or redirect to profile page
}

// Logout function
async function logout() {
    try {
        const response = await fetch('/api/auth/logout', {
            method: 'POST',
            credentials: 'include'
        });
        
        if (response.ok) {
            // Clear local storage
            localStorage.removeItem('user');
            
            // Show success message
            showMessage('Logged out successfully!', 'success');
            
            // Redirect to home page after short delay
            setTimeout(() => {
                window.location.href = '/';
            }, 1000);
        } else {
            showMessage('Logout failed. Please try again.', 'error');
        }
    } catch (error) {
        console.error('Logout error:', error);
        showMessage('Network error during logout. Please try again.', 'error');
    }
}

// Explore course category (legacy function for compatibility)
function exploreCategory(categoryName) {
    showSection('browse');
    showMessage(`Showing all courses for ${categoryName}. Browse through our disability-specific course categories below.`, 'info');
}

// Show message function
function showMessage(message, type = 'info') {
    const messageContainer = document.getElementById('messageContainer');
    
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${type}`;
    messageDiv.textContent = message;
    
    messageContainer.appendChild(messageDiv);
    
    // Auto remove after 6 seconds for longer messages
    setTimeout(() => {
        if (messageDiv.parentNode) {
            messageDiv.parentNode.removeChild(messageDiv);
        }
    }, 6000);
}

// Keyboard navigation
document.addEventListener('keydown', function(e) {
    // Escape key to close messages
    if (e.key === 'Escape') {
        const messages = document.querySelectorAll('.message');
        messages.forEach(message => {
            if (message.parentNode) {
                message.parentNode.removeChild(message);
            }
        });
    }
    
    // Enter key on course cards and navigation links
    if (e.key === 'Enter') {
        if (e.target.classList.contains('course-card')) {
            e.target.click();
        } else if (e.target.classList.contains('nav-link')) {
            e.target.click();
        }
    }
    
    // Arrow key navigation for navigation menu
    if (e.target.classList.contains('nav-link')) {
        const navLinks = Array.from(document.querySelectorAll('.nav-link'));
        const currentIndex = navLinks.indexOf(e.target);
        
        if (e.key === 'ArrowRight' && currentIndex < navLinks.length - 1) {
            navLinks[currentIndex + 1].focus();
        } else if (e.key === 'ArrowLeft' && currentIndex > 0) {
            navLinks[currentIndex - 1].focus();
        }
    }
});

// Add keyboard navigation attributes to interactive elements
document.addEventListener('DOMContentLoaded', function() {
    // Make course cards focusable and add roles
    const courseCards = document.querySelectorAll('.course-card');
    courseCards.forEach(card => {
        card.setAttribute('tabindex', '0');
        card.setAttribute('role', 'button');
        card.setAttribute('aria-label', `Enroll in ${card.querySelector('h4').textContent}`);
    });
    
    // Make navigation links focusable
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        link.setAttribute('tabindex', '0');
        link.setAttribute('role', 'button');
    });
});

// Initialize accessibility features
function initAccessibility() {
    // Add skip to content link
    const skipLink = document.createElement('a');
    skipLink.href = '#main-content';
    skipLink.textContent = 'Skip to main content';
    skipLink.className = 'skip-link';
    skipLink.style.cssText = `
        position: absolute;
        top: -40px;
        left: 6px;
        background: #000;
        color: #fff;
        padding: 8px;
        text-decoration: none;
        z-index: 1001;
        transition: top 0.3s;
    `;
    
    skipLink.addEventListener('focus', function() {
        this.style.top = '6px';
    });
    
    skipLink.addEventListener('blur', function() {
        this.style.top = '-40px';
    });
    
    document.body.insertBefore(skipLink, document.body.firstChild);
    
    // Add main content id
    const mainContent = document.querySelector('.main-content');
    if (mainContent) {
        mainContent.id = 'main-content';
    }
    
    // Add ARIA labels to sections
    const sections = document.querySelectorAll('.content-section');
    sections.forEach(section => {
        const header = section.querySelector('h2');
        if (header) {
            section.setAttribute('aria-labelledby', header.id || 'section-header');
        }
    });
    
    // Add live region for announcements
    const liveRegion = document.createElement('div');
    liveRegion.id = 'live-region';
    liveRegion.setAttribute('aria-live', 'polite');
    liveRegion.setAttribute('aria-atomic', 'true');
    liveRegion.style.cssText = `
        position: absolute;
        left: -10000px;
        top: auto;
        width: 1px;
        height: 1px;
        overflow: hidden;
    `;
    document.body.appendChild(liveRegion);
}

// Announce section changes to screen readers
function announceToScreenReader(message) {
    const liveRegion = document.getElementById('live-region');
    if (liveRegion) {
        liveRegion.textContent = message;
        // Clear after announcement
        setTimeout(() => {
            liveRegion.textContent = '';
        }, 1000);
    }
}

// Enhanced section switching with accessibility announcements
const originalShowSection = showSection;
showSection = function(sectionId) {
    originalShowSection(sectionId);
    
    // Announce section change to screen readers
    const sectionNames = {
        'overview': 'Dashboard Overview',
        'courses': 'My Courses',
        'browse': 'Browse Courses by Disability Type',
        'progress': 'Learning Progress',
        'support': 'Support and Accessibility'
    };
    
    const sectionName = sectionNames[sectionId] || sectionId;
    announceToScreenReader(`Navigated to ${sectionName} section`);
    
    // Focus management - move focus to section heading
    const targetSection = document.getElementById(sectionId);
    if (targetSection) {
        const heading = targetSection.querySelector('h2');
        if (heading) {
            heading.setAttribute('tabindex', '-1');
            heading.focus();
        }
    }
};

// Initialize all accessibility features
document.addEventListener('DOMContentLoaded', initAccessibility);

// Handle course card interactions with better feedback
document.addEventListener('DOMContentLoaded', function() {
    const courseCards = document.querySelectorAll('.course-card');
    courseCards.forEach(card => {
        card.addEventListener('click', function() {
            const courseName = this.querySelector('h4').textContent;
            enrollCourse(courseName);
        });
        
        // Add hover feedback
        card.addEventListener('mouseenter', function() {
            const courseName = this.querySelector('h4').textContent;
            announceToScreenReader(`Hovering over ${courseName} course`);
        });
    });
});

// Auto-save user preferences (placeholder)
function saveUserPreference(key, value) {
    localStorage.setItem(`shaktipath_${key}`, JSON.stringify(value));
}

function getUserPreference(key, defaultValue = null) {
    const saved = localStorage.getItem(`shaktipath_${key}`);
    return saved ? JSON.parse(saved) : defaultValue;
}

// Remember last visited section
document.addEventListener('DOMContentLoaded', function() {
    const lastSection = getUserPreference('lastSection', 'overview');
    showSection(lastSection);
});

// Save section when switching
const originalShowSectionWithSave = showSection;
showSection = function(sectionId) {
    originalShowSectionWithSave(sectionId);
    saveUserPreference('lastSection', sectionId);
};