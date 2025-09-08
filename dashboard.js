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
            showNotification('Settings feature coming soon!', 'info');
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

// Initialize streak calendar
function initializeStreak() {
    const calendarGrid = document.getElementById('calendarGrid');
    const calendarMonth = document.getElementById('calendarMonth');
    const prevMonth = document.getElementById('prevMonth');
    const nextMonth = document.getElementById('nextMonth');
    
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
            } else if (day % 3 === 0 && day <= today.getDate() && month === today.getMonth()) {
                dayDiv.classList.add('streak');
            } else if (day % 7 === 0 && day <= today.getDate() && month === today.getMonth()) {
                dayDiv.classList.add('missed');
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
                <div class="course-coins" style="margin-top: 1rem; color: var(--accent-warning);">
                    <i class="fas fa-coins"></i> ${course.coins} coins required
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
    }
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