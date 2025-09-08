// Smooth scrolling function
function scrollToSection(sectionId) {
    const element = document.getElementById(sectionId);
    if (element) {
        element.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
        });
    }
}

// Navigation smooth scrolling
document.addEventListener('DOMContentLoaded', function() {
    // Add click events to navigation links
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href').substring(1);
            scrollToSection(targetId);
        });
    });

    // Contact form submission
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            handleContactSubmission(this);
        });
    }

    // Ticket form submission
    const ticketForm = document.getElementById('ticketForm');
    if (ticketForm) {
        ticketForm.addEventListener('submit', function(e) {
            e.preventDefault();
            handleTicketSubmission(this);
        });
    }

    // Add category button functionality
    const categoryButtons = document.querySelectorAll('.category-btn');
    categoryButtons.forEach(button => {
        button.addEventListener('click', function() {
            showCourseModal(this.parentElement);
        });
    });

    // Add scroll effect to navigation
    window.addEventListener('scroll', function() {
        const navbar = document.querySelector('.navbar');
        if (window.scrollY > 50) {
            navbar.style.background = 'rgba(44, 62, 80, 0.95)';
        } else {
            navbar.style.background = '#2c3e50';
        }
    });

    // Add fade-in animation to sections
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);

    // Observe all sections
    const sections = document.querySelectorAll('section');
    sections.forEach(section => {
        section.style.opacity = '0';
        section.style.transform = 'translateY(30px)';
        section.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(section);
    });

    // Add counter animation to hero stats
    animateCounters();
});

// Contact form handler
function handleContactSubmission(form) {
    const formData = new FormData(form);
    
    // Show loading state
    const submitBtn = form.querySelector('.submit-btn');
    const originalText = submitBtn.textContent;
    submitBtn.textContent = 'Sending...';
    submitBtn.disabled = true;
    
    // Simulate form submission (replace with actual API call)
    setTimeout(() => {
        showMessage('contact', 'success', 'Thank you for your message! We will get back to you within 24 hours.');
        form.reset();
        submitBtn.textContent = originalText;
        submitBtn.disabled = false;
    }, 2000);
}

// Ticket form handler
function handleTicketSubmission(form) {
    const formData = new FormData(form);
    
    // Generate ticket ID
    const ticketId = 'SP-' + Math.random().toString(36).substr(2, 9).toUpperCase();
    
    // Show loading state
    const submitBtn = form.querySelector('.submit-btn');
    const originalText = submitBtn.textContent;
    submitBtn.textContent = 'Creating Ticket...';
    submitBtn.disabled = true;
    
    // Simulate ticket creation (replace with actual API call)
    setTimeout(() => {
        showMessage('ticket', 'success', `Ticket created successfully! Your ticket ID is: ${ticketId}. We will respond within 2 business hours.`);
        form.reset();
        submitBtn.textContent = originalText;
        submitBtn.disabled = false;
    }, 2000);
}

// Show success/error messages
function showMessage(section, type, message) {
    const sectionElement = document.getElementById(section);
    let messageDiv = sectionElement.querySelector('.success-message, .error-message');
    
    if (!messageDiv) {
        messageDiv = document.createElement('div');
        sectionElement.querySelector('.container').insertBefore(messageDiv, sectionElement.querySelector('form').parentElement);
    }
    
    messageDiv.className = type === 'success' ? 'success-message' : 'error-message';
    messageDiv.textContent = message;
    messageDiv.style.display = 'block';
    
    // Auto hide after 5 seconds
    setTimeout(() => {
        messageDiv.style.display = 'none';
    }, 5000);
}

// Course modal functionality
function showCourseModal(categoryElement) {
    const categoryTitle = categoryElement.querySelector('h3').textContent;
    const categoryDescription = categoryElement.querySelector('p').textContent;
    
    // Create modal
    const modal = document.createElement('div');
    modal.innerHTML = `
        <div class="modal-overlay" onclick="closeModal(this.parentElement)">
            <div class="modal-content" onclick="event.stopPropagation()">
                <div class="modal-header">
                    <h3>${categoryTitle} Courses</h3>
                    <button class="modal-close" onclick="closeModal(this.closest('.modal-overlay').parentElement)">&times;</button>
                </div>
                <div class="modal-body">
                    <p>${categoryDescription}</p>
                    <h4>Available Courses:</h4>
                    <div class="course-list">
                        ${generateCourseList(categoryTitle)}
                    </div>
                    <div class="modal-actions">
                        <button class="enroll-btn" onclick="enrollInCategory('${categoryTitle}')">Enroll Now</button>
                        <button class="info-btn" onclick="requestMoreInfo('${categoryTitle}')">Request More Info</button>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    modal.className = 'modal';
    document.body.appendChild(modal);
    
    // Add modal styles
    addModalStyles();
    
    // Prevent body scroll
    document.body.style.overflow = 'hidden';
}

// Close modal
function closeModal(modal) {
    document.body.removeChild(modal);
    document.body.style.overflow = 'auto';
}

// Generate course list based on category
function generateCourseList(category) {
    const courses = {
        'Digital Skills': [
            'Computer Basics for Beginners',
            'Internet Navigation and Safety',
            'Email and Communication Tools',
            'Social Media for Professionals',
            'Digital Document Creation'
        ],
        'Life Skills': [
            'Independent Living Skills',
            'Financial Literacy and Budgeting',
            'Communication and Social Skills',
            'Problem-Solving Techniques',
            'Self-Advocacy Training'
        ],
        'Professional Skills': [
            'Resume Writing and Interview Skills',
            'Customer Service Excellence',
            'Basic Accounting and Bookkeeping',
            'Time Management and Organization',
            'Remote Work Skills'
        ],
        'Creative Arts': [
            'Digital Art and Design',
            'Music Production Basics',
            'Creative Writing Workshop',
            'Photography for Beginners',
            'Craft and Handmade Products'
        ]
    };
    
    const categoryCoures = courses[category] || [];
    return categoryCoures.map(course => `
        <div class="course-item">
            <span class="course-name">${course}</span>
            <span class="course-duration">4-8 weeks</span>
        </div>
    `).join('');
}

// Enrollment function
function enrollInCategory(category) {
    alert(`Thank you for your interest in ${category}! Our enrollment team will contact you within 24 hours to discuss your options and schedule a consultation.`);
    closeModal(document.querySelector('.modal'));
}

// Request more info function
function requestMoreInfo(category) {
    scrollToSection('contact');
    closeModal(document.querySelector('.modal'));
    
    // Pre-fill contact form
    setTimeout(() => {
        const contactForm = document.getElementById('contactForm');
        const subjectSelect = contactForm.querySelector('select[name="subject"]');
        const messageTextarea = contactForm.querySelector('textarea[name="message"]');
        
        subjectSelect.value = 'course-inquiry';
        messageTextarea.value = `I would like more information about ${category} courses. Please provide details about course schedules, requirements, and enrollment process.`;
    }, 500);
}

// Add modal styles
function addModalStyles() {
    if (document.querySelector('#modal-styles')) return;
    
    const styles = document.createElement('style');
    styles.id = 'modal-styles';
    styles.textContent = `
        .modal {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            z-index: 2000;
        }
        
        .modal-overlay {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.7);
            display: flex;
            justify-content: center;
            align-items: center;
            padding: 20px;
        }
        
        .modal-content {
            background: white;
            border-radius: 15px;
            max-width: 600px;
            width: 100%;
            max-height: 80vh;
            overflow-y: auto;
            box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
        }
        
        .modal-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 1.5rem;
            border-bottom: 1px solid #e1e8ed;
        }
        
        .modal-header h3 {
            color: #2c3e50;
            margin: 0;
        }
        
        .modal-close {
            background: none;
            border: none;
            font-size: 1.5rem;
            cursor: pointer;
            color: #666;
            padding: 0;
            width: 30px;
            height: 30px;
            display: flex;
            align-items: center;
            justify-content: center;
        }
        
        .modal-body {
            padding: 1.5rem;
        }
        
        .course-list {
            margin: 1rem 0;
        }
        
        .course-item {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 0.8rem;
            margin-bottom: 0.5rem;
            background: #f8f9fa;
            border-radius: 8px;
            border-left: 3px solid #3498db;
        }
        
        .course-name {
            font-weight: 600;
            color: #2c3e50;
        }
        
        .course-duration {
            color: #666;
            font-size: 0.9rem;
        }
        
        .modal-actions {
            display: flex;
            gap: 1rem;
            margin-top: 2rem;
        }
        
        .enroll-btn, .info-btn {
            flex: 1;
            padding: 1rem;
            border: none;
            border-radius: 8px;
            font-weight: 600;
            cursor: pointer;
            transition: background 0.3s ease;
        }
        
        .enroll-btn {
            background: #e74c3c;
            color: white;
        }
        
        .enroll-btn:hover {
            background: #c0392b;
        }
        
        .info-btn {
            background: #3498db;
            color: white;
        }
        
        .info-btn:hover {
            background: #2980b9;
        }
    `;
    document.head.appendChild(styles);
}

// Animate counters in hero section
function animateCounters() {
    const counters = document.querySelectorAll('.stat h3');
    
    counters.forEach(counter => {
        const target = parseInt(counter.textContent.replace('+', '').replace('%', ''));
        const suffix = counter.textContent.includes('+') ? '+' : (counter.textContent.includes('%') ? '%' : '');
        let current = 0;
        const increment = target / 100;
        const timer = setInterval(() => {
            current += increment;
            if (current >= target) {
                current = target;
                clearInterval(timer);
            }
            counter.textContent = Math.floor(current) + suffix;
        }, 20);
    });
}

// Add keyboard navigation support
document.addEventListener('keydown', function(e) {
    // Close modal with Escape key
    if (e.key === 'Escape') {
        const modal = document.querySelector('.modal');
        if (modal) {
            closeModal(modal);
        }
    }
    
    // Navigate with arrow keys when focused on navigation
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

// Add form validation
function validateForm(form) {
    const requiredFields = form.querySelectorAll('[required]');
    let isValid = true;
    
    requiredFields.forEach(field => {
        if (!field.value.trim()) {
            field.style.borderColor = '#e74c3c';
            isValid = false;
        } else {
            field.style.borderColor = '#e1e8ed';
        }
    });
    
    // Email validation
    const emailFields = form.querySelectorAll('input[type="email"]');
    emailFields.forEach(field => {
        if (field.value && !isValidEmail(field.value)) {
            field.style.borderColor = '#e74c3c';
            isValid = false;
        }
    });
    
    return isValid;
}

// Email validation helper
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// Add real-time form validation
document.addEventListener('DOMContentLoaded', function() {
    const forms = document.querySelectorAll('form');
    forms.forEach(form => {
        const inputs = form.querySelectorAll('input, select, textarea');
        inputs.forEach(input => {
            input.addEventListener('blur', function() {
                if (this.hasAttribute('required') && !this.value.trim()) {
                    this.style.borderColor = '#e74c3c';
                } else if (this.type === 'email' && this.value && !isValidEmail(this.value)) {
                    this.style.borderColor = '#e74c3c';
                } else {
                    this.style.borderColor = '#e1e8ed';
                }
            });
        });
    });
});

// Initialize accessibility features
function initAccessibility() {
    // Add skip to content link
    const skipLink = document.createElement('a');
    skipLink.href = '#home';
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
    
    // Add aria labels to interactive elements
    const buttons = document.querySelectorAll('button');
    buttons.forEach(button => {
        if (!button.getAttribute('aria-label') && button.textContent.trim()) {
            button.setAttribute('aria-label', button.textContent.trim());
        }
    });
    
    // Add role attributes
    const nav = document.querySelector('.navbar');
    if (nav) nav.setAttribute('role', 'navigation');
    
    const main = document.querySelector('.hero');
    if (main) main.setAttribute('role', 'main');
    
    const footer = document.querySelector('.footer');
    if (footer) footer.setAttribute('role', 'contentinfo');
}

// Initialize all accessibility features
document.addEventListener('DOMContentLoaded', initAccessibility);