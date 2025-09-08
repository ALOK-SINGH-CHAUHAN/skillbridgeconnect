// Modern Dashboard JavaScript
document.addEventListener('DOMContentLoaded', function() {
    initializeDashboard();
    initializeNavigation();
    initializeProgressCircle();
    initializeStreak();
    initializeCatalogue();
    initializeMobileMenu();
    initializeScrollProgress();
    loadUserData();
    setupNotifications();
    
    // Add modern loading animation
    document.body.classList.add('loaded');
});

// Initialize dashboard functionality
function initializeDashboard() {
    // Load user data from localStorage
    const user = JSON.parse(localStorage.getItem('skillbridge_user') || '{}');
    
    if (user.username) {
        const userNameElement = document.getElementById('userName');
        const teacherUserNameElement = document.getElementById('teacherUserName');
        const userInitialsElement = document.getElementById('userInitials');
        
        if (userNameElement) userNameElement.textContent = user.username;
        if (teacherUserNameElement) teacherUserNameElement.textContent = user.username;
        
        const sponsorUserNameElement = document.getElementById('sponsorUserName');
        if (sponsorUserNameElement) sponsorUserNameElement.textContent = user.username;
        if (userInitialsElement) userInitialsElement.textContent = user.username.charAt(0).toUpperCase();
    }
    
    // Initialize course data with loading animation
    showLoadingState();
    setTimeout(() => {
        loadRecentCourses();
        loadActiveCourses();
        loadCompletedCourses();
        loadCatalogCourses();
        hideLoadingState();
    }, 500);
    
    // Initialize dashboard based on user type
    if (user.user_type === 'teacher') {
        initializeTeacherDashboard();
    } else if (user.user_type === 'sponsor') {
        initializeSponsorDashboard();
    }
}

// Modern Navigation functionality
function initializeNavigation() {
    const navLinks = document.querySelectorAll('.nav-link[data-page]');
    const pages = document.querySelectorAll('.page-content');
    const navItems = document.querySelectorAll('.nav-item');
    
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetPage = this.getAttribute('data-page');
            
            // Update active nav item with animation
            navItems.forEach(item => item.classList.remove('active'));
            this.closest('.nav-item').classList.add('active');
            
            // Show target page with fade animation
            pages.forEach(page => {
                page.classList.remove('active');
                page.style.display = 'none';
            });
            
            const targetElement = document.getElementById(targetPage + 'Page');
            if (targetElement) {
                targetElement.style.display = 'block';
                setTimeout(() => {
                    targetElement.classList.add('active');
                }, 10);
            }
            
            // Close mobile menu if open
            closeMobileMenu();
        });
    });
    
    // Logout functionality
    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Show logout confirmation
            if (confirm('Are you sure you want to logout?')) {
                showNotification('Logging out...', 'info');
                localStorage.removeItem('skillbridge_user');
                
                setTimeout(() => {
                    window.location.href = 'index.html';
                }, 1000);
            }
        });
    }
    
    // Settings functionality
    const settingsBtn = document.getElementById('settingsBtn');
    if (settingsBtn) {
        settingsBtn.addEventListener('click', function(e) {
            e.preventDefault();
            openSettingsModal();
        });
    }
}

// Enhanced Progress circle animation
function initializeProgressCircle() {
    const progressCircles = document.querySelectorAll('.progress-circle');
    
    progressCircles.forEach(circle => {
        const progress = circle.getAttribute('data-progress');
        
        // Animate progress circle with easing
        setTimeout(() => {
            circle.style.setProperty('--progress', 0);
            
            // Smooth animation to target value
            let currentProgress = 0;
            const targetProgress = parseInt(progress);
            const increment = targetProgress / 60; // 1 second animation at 60fps
            
            const animateProgress = () => {
                currentProgress += increment;
                if (currentProgress >= targetProgress) {
                    currentProgress = targetProgress;
                    circle.style.setProperty('--progress', currentProgress);
                } else {
                    circle.style.setProperty('--progress', currentProgress);
                    requestAnimationFrame(animateProgress);
                }
            };
            
            requestAnimationFrame(animateProgress);
        }, 800);
    });
}

// Course toggle functionality
function initializeCourseToggle() {
    const toggleBtns = document.querySelectorAll('.toggle-btn');
    const activeCoursesList = document.getElementById('activeCoursesList');
    const completedCoursesList = document.getElementById('completedCoursesList');
    
    toggleBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const type = this.getAttribute('data-type');
            
            // Update active button
            toggleBtns.forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            
            // Show/hide course lists
            if (type === 'active') {
                activeCoursesList.style.display = 'grid';
                completedCoursesList.style.display = 'none';
            } else {
                activeCoursesList.style.display = 'none';
                completedCoursesList.style.display = 'grid';
            }
        });
    });
}

// Initialize streak calendar with color legend
function initializeStreak() {
    const calendarGrid = document.getElementById('calendarGrid');
    const calendarMonth = document.getElementById('calendarMonth');
    const prevMonth = document.getElementById('prevMonth');
    const nextMonth = document.getElementById('nextMonth');
    
    // Add color legend if not exists
    addStreakLegend();
    
    let currentDate = new Date();
    
    function generateCalendar(date) {
        const year = date.getFullYear();
        const month = date.getMonth();
        const firstDay = new Date(year, month, 1);
        const lastDay = new Date(year, month + 1, 0);
        const daysInMonth = lastDay.getDate();
        const startingDay = firstDay.getDay();
        
        // Update month display
        const monthNames = [
            'January', 'February', 'March', 'April', 'May', 'June',
            'July', 'August', 'September', 'October', 'November', 'December'
        ];
        calendarMonth.textContent = `${monthNames[month]} ${year}`;
        
        // Clear calendar
        calendarGrid.innerHTML = '';
        
        // Add day headers
        const dayHeaders = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
        dayHeaders.forEach(day => {
            const headerDiv = document.createElement('div');
            headerDiv.className = 'calendar-day-header';
            headerDiv.textContent = day;
            headerDiv.style.fontWeight = '600';
            headerDiv.style.color = 'var(--text-secondary)';
            headerDiv.style.padding = '0.5rem';
            headerDiv.style.textAlign = 'center';
            calendarGrid.appendChild(headerDiv);
        });
        
        // Add empty cells for days before month starts
        for (let i = 0; i < startingDay; i++) {
            const emptyDiv = document.createElement('div');
            calendarGrid.appendChild(emptyDiv);
        }
        
        // Add days of the month
        for (let day = 1; day <= daysInMonth; day++) {
            const dayDiv = document.createElement('div');
            dayDiv.className = 'calendar-day';
            dayDiv.textContent = day;
            
            // Add streak indicators (mock data)
            const dayDate = new Date(year, month, day);
            const today = new Date();
            
            if (dayDate.toDateString() === today.toDateString()) {
                dayDiv.classList.add('today');
                dayDiv.innerHTML = `${day}<div class="day-indicator">📚</div>`;
            } else if (day % 3 === 0 && day <= today.getDate() && month === today.getMonth()) {
                dayDiv.classList.add('streak');
                dayDiv.innerHTML = `${day}<div class="day-indicator">🔥</div>`;
            } else if (day % 7 === 0 && day <= today.getDate() && month === today.getMonth()) {
                dayDiv.classList.add('missed');
                dayDiv.innerHTML = `${day}<div class="day-indicator">💔</div>`;
            } else if (day % 4 === 0 && day <= today.getDate() && month === today.getMonth()) {
                dayDiv.classList.add('perfect');
                dayDiv.innerHTML = `${day}<div class="day-indicator">⭐</div>`;
            }
            
            calendarGrid.appendChild(dayDiv);
        }
    }
    
    // Navigation event listeners
    prevMonth.addEventListener('click', () => {
        currentDate.setMonth(currentDate.getMonth() - 1);
        generateCalendar(currentDate);
    });
    
    nextMonth.addEventListener('click', () => {
        currentDate.setMonth(currentDate.getMonth() + 1);
        generateCalendar(currentDate);
    });
    
    // Initialize calendar
    generateCalendar(currentDate);
    
    // Settings modal event listeners
    setupSettingsModal();
}

// Add streak color legend
function addStreakLegend() {
    const streakPage = document.getElementById('streakPage');
    const existingLegend = document.querySelector('.streak-legend');
    
    if (!existingLegend && streakPage) {
        const legendHTML = `
            <div class="streak-legend">
                <h4 class="legend-title">
                    <i class="fas fa-info-circle"></i>
                    Streak Color Guide
                </h4>
                <div class="legend-items">
                    <div class="legend-item">
                        <div class="legend-color today"></div>
                        <span class="legend-text">
                            <strong>Today</strong> - Current day (Blue) 📚
                        </span>
                    </div>
                    <div class="legend-item">
                        <div class="legend-color streak"></div>
                        <span class="legend-text">
                            <strong>Learning Day</strong> - Completed lessons (Green) 🔥
                        </span>
                    </div>
                    <div class="legend-item">
                        <div class="legend-color perfect"></div>
                        <span class="legend-text">
                            <strong>Perfect Day</strong> - Exceeded goals (Gold) ⭐
                        </span>
                    </div>
                    <div class="legend-item">
                        <div class="legend-color missed"></div>
                        <span class="legend-text">
                            <strong>Missed Day</strong> - No activity (Red) 💔
                        </span>
                    </div>
                    <div class="legend-item">
                        <div class="legend-color inactive"></div>
                        <span class="legend-text">
                            <strong>Upcoming</strong> - Future days (Gray)
                        </span>
                    </div>
                </div>
            </div>
        `;
        
        const calendarContainer = streakPage.querySelector('.streak-calendar');
        if (calendarContainer) {
            calendarContainer.insertAdjacentHTML('afterend', legendHTML);
        }
    }
}

// Setup settings modal event listeners
function setupSettingsModal() {
    const modalClose = document.getElementById('modalClose');
    const modalOverlay = document.getElementById('modalOverlay');
    const saveSettings = document.getElementById('saveSettings');
    const resetSettings = document.getElementById('resetSettings');
    
    if (modalClose) {
        modalClose.addEventListener('click', closeSettingsModal);
    }
    
    if (modalOverlay) {
        modalOverlay.addEventListener('click', closeSettingsModal);
    }
    
    if (saveSettings) {
        saveSettings.addEventListener('click', saveUserSettings);
    }
    
    if (resetSettings) {
        resetSettings.addEventListener('click', resetSettings);
    }
    
    // Close modal with Escape key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            closeSettingsModal();
        }
    });
}

// Initialize catalogue functionality
function initializeCatalogue() {
    const filterBtns = document.querySelectorAll('.filter-btn');
    const searchInput = document.getElementById('courseSearch');
    
    // Filter functionality
    filterBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const category = this.getAttribute('data-category');
            
            // Update active button
            filterBtns.forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            
            // Filter courses
            filterCourses(category, searchInput.value);
        });
    });
    
    // Search functionality
    if (searchInput) {
        searchInput.addEventListener('input', function() {
            const activeFilter = document.querySelector('.filter-btn.active').getAttribute('data-category');
            filterCourses(activeFilter, this.value);
        });
    }
    
    // Initialize course toggle when courses page is accessed
    setTimeout(initializeCourseToggle, 100);
    
    // Setup settings modal after DOM is ready
    setTimeout(setupSettingsModal, 200);
    
    // Setup universal logout and settings functionality
    setupUniversalLogout();
    setupUniversalSettings();
}

// Load recent courses data
function loadRecentCourses() {
    // This would typically come from an API
    const recentCourses = [
        {
            title: 'Web Development Fundamentals',
            description: 'Learn HTML, CSS, and JavaScript basics',
            progress: 65,
            icon: 'fas fa-code'
        },
        {
            title: 'Database Design',
            description: 'Master SQL and database concepts',
            progress: 40,
            icon: 'fas fa-database'
        },
        {
            title: 'Mobile App Development',
            description: 'Build apps with React Native',
            progress: 15,
            icon: 'fas fa-mobile-alt'
        }
    ];
    
    // Recent courses are already in the HTML, no need to regenerate
}

// Load active courses
function loadActiveCourses() {
    const activeCourses = [
        {
            title: 'Advanced JavaScript',
            description: 'Master ES6+ features and async programming',
            progress: 75,
            icon: 'fab fa-js-square',
            coins: 150
        },
        {
            title: 'React Development',
            description: 'Build modern web applications with React',
            progress: 50,
            icon: 'fab fa-react',
            coins: 200
        },
        {
            title: 'Node.js Backend',
            description: 'Server-side development with Node.js',
            progress: 30,
            icon: 'fab fa-node-js',
            coins: 180
        }
    ];
    
    const container = document.getElementById('activeCoursesList');
    container.innerHTML = activeCourses.map(course => `
        <div class="course-card">
            <div class="course-image">
                <i class="${course.icon}"></i>
            </div>
            <div class="course-info">
                <h4 class="course-title">${course.title}</h4>
                <p class="course-description">${course.description}</p>
                <div class="course-progress">
                    <div class="progress-bar">
                        <div class="progress-fill" style="width: ${course.progress}%"></div>
                    </div>
                    <span class="progress-text">${course.progress}% Complete</span>
                </div>
                <div class="course-coins" style="margin-top: 1rem; color: var(--accent-green); display: flex; align-items: center; gap: 0.5rem;">
                    <i class="fas fa-gift" style="color: var(--accent-green);"></i>
                    <span style="font-weight: 600;">Reward: ${course.coins} coins</span>
                </div>
            </div>
        </div>
    `).join('');
}

// Load completed courses
function loadCompletedCourses() {
    const completedCourses = [
        {
            title: 'HTML & CSS Basics',
            description: 'Foundation of web development',
            completedDate: '2024-11-15',
            icon: 'fab fa-html5',
            rating: 5
        },
        {
            title: 'JavaScript Fundamentals',
            description: 'Core JavaScript concepts',
            completedDate: '2024-11-20',
            icon: 'fab fa-js-square',
            rating: 4
        },
        {
            title: 'Git Version Control',
            description: 'Source code management',
            completedDate: '2024-11-25',
            icon: 'fab fa-git-alt',
            rating: 5
        }
    ];
    
    const container = document.getElementById('completedCoursesList');
    container.innerHTML = completedCourses.map(course => `
        <div class="course-card">
            <div class="course-image">
                <i class="${course.icon}"></i>
            </div>
            <div class="course-info">
                <h4 class="course-title">${course.title}</h4>
                <p class="course-description">${course.description}</p>
                <div class="course-meta" style="display: flex; justify-content: space-between; align-items: center; margin-top: 1rem;">
                    <span style="color: var(--text-secondary); font-size: 0.85rem;">
                        Completed: ${new Date(course.completedDate).toLocaleDateString()}
                    </span>
                    <div class="rating" style="color: var(--accent-warning);">
                        ${'★'.repeat(course.rating)}${'☆'.repeat(5 - course.rating)}
                    </div>
                </div>
            </div>
        </div>
    `).join('');
}

// Load catalog courses
function loadCatalogCourses() {
    const catalogCourses = [
        {
            title: 'Python for Data Science',
            description: 'Learn Python for data analysis and machine learning',
            category: 'data',
            price: 250,
            rating: 4.8,
            students: 1205,
            icon: 'fab fa-python'
        },
        {
            title: 'UI/UX Design Principles',
            description: 'Master user interface and experience design',
            category: 'design',
            price: 180,
            rating: 4.9,
            students: 856,
            icon: 'fas fa-palette'
        },
        {
            title: 'Business Strategy',
            description: 'Strategic thinking for modern businesses',
            category: 'business',
            price: 300,
            rating: 4.7,
            students: 623,
            icon: 'fas fa-chart-line'
        },
        {
            title: 'Full Stack Development',
            description: 'Complete web development bootcamp',
            category: 'programming',
            price: 400,
            rating: 4.9,
            students: 2105,
            icon: 'fas fa-laptop-code'
        },
        {
            title: 'Machine Learning Basics',
            description: 'Introduction to ML algorithms and concepts',
            category: 'data',
            price: 320,
            rating: 4.6,
            students: 945,
            icon: 'fas fa-robot'
        },
        {
            title: 'Graphic Design Mastery',
            description: 'Professional graphic design techniques',
            category: 'design',
            price: 220,
            rating: 4.8,
            students: 734,
            icon: 'fas fa-paint-brush'
        }
    ];
    
    window.allCatalogCourses = catalogCourses; // Store for filtering
    renderCatalogCourses(catalogCourses);
}

// Render catalog courses
function renderCatalogCourses(courses) {
    const container = document.getElementById('catalogueGrid');
    container.innerHTML = courses.map(course => `
        <div class="course-card" data-category="${course.category}">
            <div class="course-image">
                <i class="${course.icon}"></i>
            </div>
            <div class="course-info">
                <h4 class="course-title">${course.title}</h4>
                <p class="course-description">${course.description}</p>
                <div class="course-meta" style="display: flex; justify-content: space-between; align-items: center; margin: 1rem 0;">
                    <div class="course-rating" style="color: var(--accent-warning);">
                        ★ ${course.rating} (${course.students})
                    </div>
                    <div class="course-price" style="color: var(--accent-secondary); font-weight: 600;">
                        ${course.price} coins
                    </div>
                </div>
                <button class="enroll-btn" style="width: 100%; padding: 0.75rem; background: var(--gradient-primary); border: none; border-radius: var(--border-radius); color: white; font-weight: 600; cursor: pointer; transition: var(--transition-normal);">
                    Enroll Now
                </button>
            </div>
        </div>
    `).join('');
    
    // Add click handlers for enroll buttons
    container.querySelectorAll('.enroll-btn').forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.stopPropagation();
            alert('Enrollment functionality will be implemented with backend integration!');
        });
    });
}

// Filter courses function
function filterCourses(category, searchTerm) {
    let filteredCourses = window.allCatalogCourses || [];
    
    // Filter by category
    if (category !== 'all') {
        filteredCourses = filteredCourses.filter(course => course.category === category);
    }
    
    // Filter by search term
    if (searchTerm) {
        filteredCourses = filteredCourses.filter(course => 
            course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            course.description.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }
    
    renderCatalogCourses(filteredCourses);
}

// Load user data
function loadUserData() {
    const user = JSON.parse(localStorage.getItem('skillbridge_user') || '{}');
    
    if (!user.id && !user.username) {
        // Show gentle redirect message
        showNotification('Please login to access your dashboard', 'info');
        setTimeout(() => {
            window.location.href = 'auth.html';
        }, 2000);
        return;
    }
    
    // Update UI with user data
    if (user.username) {
        const elements = ['userName', 'teacherUserName'];
        elements.forEach(id => {
            const element = document.getElementById(id);
            if (element) element.textContent = user.username;
        });
        
        // Set user initials
        const userInitials = document.getElementById('userInitials');
        if (userInitials) {
            userInitials.textContent = user.username.charAt(0).toUpperCase();
        }
    }
    
    // Load user-specific dashboard
    if (user.user_type === 'teacher') {
        switchToTeacherDashboard();
    } else if (user.user_type === 'sponsor') {
        switchToSponsorDashboard();
    }
}

// Settings Modal Functions
function openSettingsModal() {
    const modal = document.getElementById('settingsModal');
    if (modal) {
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
        loadUserSettings();
    }
}

function closeSettingsModal() {
    const modal = document.getElementById('settingsModal');
    if (modal) {
        modal.classList.remove('active');
        document.body.style.overflow = 'auto';
    }
}

function loadUserSettings() {
    const user = JSON.parse(localStorage.getItem('skillbridge_user') || '{}');
    const displayNameInput = document.getElementById('displayName');
    if (displayNameInput && user.username) {
        displayNameInput.value = user.username;
    }
}

function saveUserSettings() {
    const displayName = document.getElementById('displayName').value;
    const emailNotifications = document.getElementById('emailNotifications').checked;
    const theme = document.getElementById('themeSelect').value;
    const animations = document.getElementById('animationsToggle').checked;
    const courseUpdates = document.getElementById('courseUpdates').checked;
    const achievementAlerts = document.getElementById('achievementAlerts').checked;
    
    const settings = {
        displayName,
        emailNotifications,
        theme,
        animations,
        courseUpdates,
        achievementAlerts
    };
    
    localStorage.setItem('skillbridge_settings', JSON.stringify(settings));
    
    // Update user data if display name changed
    if (displayName) {
        let user = JSON.parse(localStorage.getItem('skillbridge_user') || '{}');
        user.username = displayName;
        localStorage.setItem('skillbridge_user', JSON.stringify(user));
        
        // Update UI elements
        const userNameElements = document.querySelectorAll('#userName, #teacherUserName');
        userNameElements.forEach(el => el.textContent = displayName);
        const userInitials = document.getElementById('userInitials');
        if (userInitials) userInitials.textContent = displayName.charAt(0).toUpperCase();
    }
    
    showNotification('Settings saved successfully!', 'success');
    closeSettingsModal();
}

function resetSettings() {
    localStorage.removeItem('skillbridge_settings');
    document.getElementById('displayName').value = '';
    document.getElementById('emailNotifications').checked = true;
    document.getElementById('themeSelect').value = 'dark';
    document.getElementById('animationsToggle').checked = true;
    document.getElementById('courseUpdates').checked = true;
    document.getElementById('achievementAlerts').checked = true;
    showNotification('Settings reset to default', 'info');
}

// Enhanced notification system
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    
    // Add icon based on type
    const icons = {
        success: 'fas fa-check-circle',
        error: 'fas fa-exclamation-circle',
        info: 'fas fa-info-circle',
        warning: 'fas fa-exclamation-triangle'
    };
    
    notification.innerHTML = `
        <i class="${icons[type] || icons.info}"></i>
        <span>${message}</span>
    `;
    
    notification.style.cssText = `
        display: flex;
        align-items: center;
        gap: 12px;
        font-size: 14px;
        font-weight: 500;
    `;
    
    document.body.appendChild(notification);
    
    // Animate in
    setTimeout(() => {
        notification.classList.add('show');
    }, 100);
    
    // Auto remove
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => {
            if (document.body.contains(notification)) {
                document.body.removeChild(notification);
            }
        }, 300);
    }, 4000);
}

// Mobile menu functionality
function initializeMobileMenu() {
    const mobileToggle = document.getElementById('mobileMenuToggle');
    const sidebar = document.getElementById('sidebar');
    const glassOverlay = document.getElementById('glassOverlay');
    
    if (mobileToggle && sidebar && glassOverlay) {
        mobileToggle.addEventListener('click', function() {
            sidebar.classList.toggle('open');
            glassOverlay.classList.toggle('sidebar-open');
        });
        
        glassOverlay.addEventListener('click', function() {
            closeMobileMenu();
        });
    }
}

function closeMobileMenu() {
    const sidebar = document.getElementById('sidebar');
    const glassOverlay = document.getElementById('glassOverlay');
    
    if (sidebar) sidebar.classList.remove('open');
    if (glassOverlay) glassOverlay.classList.remove('sidebar-open');
}

// Scroll progress functionality
function initializeScrollProgress() {
    const mainContent = document.getElementById('mainContent');
    const scrollProgress = document.getElementById('scrollProgress');
    
    if (mainContent && scrollProgress) {
        mainContent.addEventListener('scroll', function() {
            const scrollTop = this.scrollTop;
            const scrollHeight = this.scrollHeight - this.clientHeight;
            const scrollPercentage = scrollHeight > 0 ? (scrollTop / scrollHeight) * 100 : 0;
            scrollProgress.style.width = Math.min(scrollPercentage, 100) + '%';
        });
    }
}

// Loading states
function showLoadingState() {
    const courseGrids = document.querySelectorAll('.courses-grid');
    courseGrids.forEach(grid => {
        grid.classList.add('loading');
    });
}

function hideLoadingState() {
    const courseGrids = document.querySelectorAll('.courses-grid');
    courseGrids.forEach(grid => {
        grid.classList.remove('loading');
    });
}

// Setup notifications
function setupNotifications() {
    // Welcome notification
    setTimeout(() => {
        const user = JSON.parse(localStorage.getItem('skillbridge_user') || '{}');
        if (user.username) {
            showNotification(`Welcome back, ${user.username}!`, 'success');
        }
    }, 1500);
}

// Teacher dashboard functionality
function initializeTeacherDashboard() {
    loadTeacherCourses();
    loadTeacherStats();
}

function switchToTeacherDashboard() {
    const studentDashboard = document.getElementById('dashboardPage');
    const teacherDashboard = document.getElementById('teacherDashboardPage');
    
    if (studentDashboard && teacherDashboard) {
        studentDashboard.style.display = 'none';
        studentDashboard.classList.remove('active');
        
        teacherDashboard.style.display = 'block';
        teacherDashboard.classList.add('active');
    }
}

function loadTeacherCourses() {
    const teacherCourses = [
        {
            title: 'Advanced JavaScript Concepts',
            description: 'Deep dive into modern JavaScript features',
            students: 45,
            rating: 4.9,
            progress: 85,
            icon: 'fab fa-js-square'
        },
        {
            title: 'React Development Masterclass',
            description: 'Complete guide to React development',
            students: 67,
            rating: 4.8,
            progress: 92,
            icon: 'fab fa-react'
        },
        {
            title: 'Node.js Backend Development',
            description: 'Server-side development with Node.js',
            students: 38,
            rating: 4.7,
            progress: 78,
            icon: 'fab fa-node-js'
        }
    ];
    
    const container = document.getElementById('teacherCoursesGrid');
    if (container) {
        container.innerHTML = teacherCourses.map(course => `
            <div class="course-card teacher-course">
                <div class="course-image">
                    <i class="${course.icon}"></i>
                </div>
                <div class="course-info">
                    <h4 class="course-title">${course.title}</h4>
                    <p class="course-description">${course.description}</p>
                    <div class="course-stats">
                        <span class="students-enrolled">
                            <i class="fas fa-users"></i> ${course.students} students
                        </span>
                        <span class="course-rating">
                            <i class="fas fa-star"></i> ${course.rating}
                        </span>
                    </div>
                    <div class="course-progress">
                        <div class="progress-bar">
                            <div class="progress-fill" style="width: ${course.progress}%"></div>
                        </div>
                        <span class="progress-text">${course.progress}% completion rate</span>
                    </div>
                </div>
            </div>
        `).join('');
    }
}

function loadTeacherStats() {
    // Animate stats
    const stats = [
        { id: 'totalStudents', target: 156 },
        { id: 'activeCoursesTaught', target: 8 },
        { id: 'avgRating', target: 4.8 }
    ];
    
    stats.forEach(stat => {
        const element = document.getElementById(stat.id);
        if (element) {
            animateNumber(element, stat.target);
        }
    });
}

function animateNumber(element, target) {
    let current = 0;
    const increment = target / 60; // 1 second animation
    const isDecimal = target % 1 !== 0;
    
    const updateNumber = () => {
        current += increment;
        if (current >= target) {
            element.textContent = isDecimal ? target.toFixed(1) : Math.round(target);
        } else {
            element.textContent = isDecimal ? current.toFixed(1) : Math.round(current);
            requestAnimationFrame(updateNumber);
        }
    };
    
    requestAnimationFrame(updateNumber);
}

// Sponsor Dashboard Functions
function initializeSponsorDashboard() {
    loadSponsorStats();
    loadRecentDonations();
    loadSponsoredStudents();
    loadImpactData();
    setupDonationModal();
}

function switchToSponsorDashboard() {
    const studentDashboard = document.getElementById('dashboardPage');
    const sponsorDashboard = document.getElementById('sponsorDashboardPage');
    
    if (studentDashboard && sponsorDashboard) {
        studentDashboard.style.display = 'none';
        studentDashboard.classList.remove('active');
        
        sponsorDashboard.style.display = 'block';
        sponsorDashboard.classList.add('active');
    }
}

function loadSponsorStats() {
    // Animate sponsor stats with realistic numbers
    animateNumber(document.getElementById('totalDonated'), 2450, true, '$');
    animateNumber(document.getElementById('studentsSupported'), 18);
    animateNumber(document.getElementById('coursesSponsored'), 24);
    
    // Set sponsor level based on donation amount
    const totalAmount = 2450;
    let level = 'Bronze';
    if (totalAmount >= 5000) level = 'Platinum';
    else if (totalAmount >= 2000) level = 'Gold';
    else if (totalAmount >= 500) level = 'Silver';
    
    const levelElement = document.getElementById('sponsorLevel');
    if (levelElement) levelElement.textContent = level;
}

function loadRecentDonations() {
    const donations = [
        {
            id: 'D001',
            amount: 100,
            date: '2024-12-01',
            type: 'General Fund',
            recipient: 'SkillBridge Connect',
            status: 'completed',
            impact: '2 students enrolled in new courses'
        },
        {
            id: 'D002',
            amount: 250,
            date: '2024-11-28',
            type: 'Student Sponsorship',
            recipient: 'Sarah Chen',
            status: 'completed',
            impact: 'Completed JavaScript Fundamentals'
        },
        {
            id: 'D003',
            amount: 50,
            date: '2024-11-25',
            type: 'Course Development',
            recipient: 'React Development Course',
            status: 'processing',
            impact: 'Course 80% developed'
        }
    ];
    
    const container = document.getElementById('recentDonationsGrid');
    if (container) {
        container.innerHTML = donations.map(donation => `
            <div class="donation-card">
                <div class="donation-header">
                    <div class="donation-amount">$${donation.amount}</div>
                    <div class="donation-status ${donation.status}">
                        <i class="fas ${donation.status === 'completed' ? 'fa-check-circle' : 'fa-clock'}"></i>
                        ${donation.status === 'completed' ? 'Completed' : 'Processing'}
                    </div>
                </div>
                <div class="donation-details">
                    <div class="donation-type">${donation.type}</div>
                    <div class="donation-recipient">
                        <i class="fas ${
                            donation.type === 'General Fund' ? 'fa-globe' : 
                            donation.type === 'Student Sponsorship' ? 'fa-user-graduate' : 'fa-book'
                        }"></i>
                        ${donation.recipient}
                    </div>
                    <div class="donation-date">${new Date(donation.date).toLocaleDateString()}</div>
                </div>
                <div class="donation-impact">
                    <i class="fas fa-heart"></i>
                    <span>${donation.impact}</span>
                </div>
            </div>
        `).join('');
    }
}

function loadSponsoredStudents() {
    const students = [
        {
            name: 'Sarah Chen',
            course: 'Advanced JavaScript',
            progress: 85,
            avatar: 'SC',
            joined: '2024-10-15',
            achievements: ['Certificate Earned', 'Top Performer']
        },
        {
            name: 'Marcus Rodriguez',
            course: 'React Development',
            progress: 60,
            avatar: 'MR',
            joined: '2024-11-01',
            achievements: ['Quick Learner']
        },
        {
            name: 'Emily Watson',
            course: 'Node.js Backend',
            progress: 45,
            avatar: 'EW',
            joined: '2024-11-20',
            achievements: ['Consistent Progress']
        }
    ];
    
    const container = document.getElementById('sponsoredStudentsGrid');
    if (container) {
        container.innerHTML = students.map(student => `
            <div class="student-card">
                <div class="student-header">
                    <div class="student-avatar">${student.avatar}</div>
                    <div class="student-info">
                        <h4 class="student-name">${student.name}</h4>
                        <p class="student-course">${student.course}</p>
                    </div>
                </div>
                <div class="student-progress">
                    <div class="progress-info">
                        <span class="progress-label">Progress</span>
                        <span class="progress-percentage">${student.progress}%</span>
                    </div>
                    <div class="progress-bar">
                        <div class="progress-fill" style="width: ${student.progress}%"></div>
                    </div>
                </div>
                <div class="student-achievements">
                    ${student.achievements.map(achievement => 
                        `<span class="achievement-badge">
                            <i class="fas fa-star"></i>
                            ${achievement}
                        </span>`
                    ).join('')}
                </div>
                <div class="student-meta">
                    <span class="join-date">Joined: ${new Date(student.joined).toLocaleDateString()}</span>
                </div>
            </div>
        `).join('');
    }
}

function loadImpactData() {
    // This would typically come from analytics API
    // For now, we'll use the existing progress circle initialization
    setTimeout(() => {
        initializeProgressCircle();
    }, 500);
}

// Donation Modal Functions
function setupDonationModal() {
    const makeDonationBtn = document.getElementById('makeDonationBtn');
    const donationModal = document.getElementById('donationModal');
    const donationModalClose = document.getElementById('donationModalClose');
    const donationModalOverlay = document.getElementById('donationModalOverlay');
    const cancelDonation = document.getElementById('cancelDonation');
    const processDonation = document.getElementById('processDonation');
    const amountBtns = document.querySelectorAll('.amount-btn');
    const customAmountInput = document.getElementById('customAmount');
    const summaryAmount = document.getElementById('donationSummaryAmount');
    
    if (makeDonationBtn) {
        makeDonationBtn.addEventListener('click', openDonationModal);
    }
    
    if (donationModalClose) {
        donationModalClose.addEventListener('click', closeDonationModal);
    }
    
    if (donationModalOverlay) {
        donationModalOverlay.addEventListener('click', closeDonationModal);
    }
    
    if (cancelDonation) {
        cancelDonation.addEventListener('click', closeDonationModal);
    }
    
    // Amount selection
    amountBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            amountBtns.forEach(b => b.classList.remove('selected'));
            this.classList.add('selected');
            customAmountInput.value = '';
            updateDonationSummary(this.dataset.amount);
        });
    });
    
    if (customAmountInput) {
        customAmountInput.addEventListener('input', function() {
            amountBtns.forEach(b => b.classList.remove('selected'));
            updateDonationSummary(this.value || 0);
        });
    }
    
    if (processDonation) {
        processDonation.addEventListener('click', processDonationRequest);
    }
    
    // Initialize with default amount
    if (amountBtns.length > 0) {
        amountBtns[0].classList.add('selected');
        updateDonationSummary(amountBtns[0].dataset.amount);
    }
}

function openDonationModal() {
    const modal = document.getElementById('donationModal');
    if (modal) {
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
    }
}

function closeDonationModal() {
    const modal = document.getElementById('donationModal');
    if (modal) {
        modal.classList.remove('active');
        document.body.style.overflow = 'auto';
    }
}

function updateDonationSummary(amount) {
    const summaryElement = document.getElementById('donationSummaryAmount');
    if (summaryElement) {
        summaryElement.textContent = `$${amount}`;
    }
}

function processDonationRequest() {
    const selectedType = document.querySelector('input[name="donationType"]:checked')?.value;
    const selectedAmount = document.querySelector('.amount-btn.selected')?.dataset.amount || 
                          document.getElementById('customAmount')?.value;
    const message = document.getElementById('donationMessage')?.value;
    
    if (!selectedAmount || selectedAmount <= 0) {
        showNotification('Please select a valid donation amount', 'error');
        return;
    }
    
    // Simulate donation processing
    showNotification('Processing your donation...', 'info');
    
    setTimeout(() => {
        showNotification(`Thank you for your $${selectedAmount} donation! Your generosity makes a real difference.`, 'success');
        closeDonationModal();
        
        // Refresh sponsor stats to reflect new donation
        setTimeout(() => {
            loadSponsorStats();
            loadRecentDonations();
        }, 1000);
    }, 2000);
}

// Fix logout functionality to work in all dashboards
function setupUniversalLogout() {
    const logoutBtns = document.querySelectorAll('#logoutBtn, .logout-btn');
    logoutBtns.forEach(btn => {
        if (btn) {
            btn.removeEventListener('click', handleLogout); // Remove any existing listeners
            btn.addEventListener('click', handleLogout);
        }
    });
}

function handleLogout(e) {
    e.preventDefault();
    
    if (confirm('Are you sure you want to logout?')) {
        showNotification('Logging out...', 'info');
        
        // Clear all user data
        localStorage.removeItem('skillbridge_user');
        localStorage.removeItem('userData');
        localStorage.removeItem('user');
        
        // Clear any session data
        sessionStorage.clear();
        
        setTimeout(() => {
            window.location.href = 'auth.html';
        }, 1000);
    }
}

// Enhanced settings modal setup for all dashboard types
function setupUniversalSettings() {
    const settingsBtns = document.querySelectorAll('#settingsBtn, .settings-btn');
    settingsBtns.forEach(btn => {
        if (btn) {
            btn.removeEventListener('click', handleSettings); // Remove any existing listeners
            btn.addEventListener('click', handleSettings);
        }
    });
}

function handleSettings(e) {
    e.preventDefault();
    openSettingsModal();
}