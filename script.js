// JavaScript for enhanced interactivity and responsive behavior

document.addEventListener('DOMContentLoaded', function() {
    // Get Started button functionality
    const getStartedBtn = document.getElementById('getStartedBtn');
    
    if (getStartedBtn) {
        getStartedBtn.addEventListener('click', function() {
            // Add a click effect
            this.style.transform = 'scale(0.95)';
            setTimeout(() => {
                this.style.transform = '';
                // Redirect to auth page
                window.location.href = 'auth.html';
            }, 150);
        });
    }

    // Contact form handling
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get form data
            const formData = new FormData(this);
            const name = formData.get('name');
            const email = formData.get('email');
            const message = formData.get('message');
            
            // Simple form validation and feedback
            if (name && email && message) {
                // Simulate form submission
                const submitButton = this.querySelector('.send-message-button');
                const originalText = submitButton.textContent;
                
                submitButton.textContent = 'Sending...';
                submitButton.disabled = true;
                
                setTimeout(() => {
                    submitButton.textContent = 'Message Sent!';
                    submitButton.style.background = 'linear-gradient(135deg, #28a745 0%, #20c997 100%)';
                    
                    // Reset form
                    this.reset();
                    
                    setTimeout(() => {
                        submitButton.textContent = originalText;
                        submitButton.disabled = false;
                        submitButton.style.background = 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)';
                    }, 3000);
                }, 1500);
                
                console.log('Contact form submitted:', { name, email, message });
            }
        });
    }

    // Add scroll effect to navbar (optional enhancement)
    let lastScrollTop = 0;
    const navbar = document.querySelector('.navbar');
    
    window.addEventListener('scroll', function() {
        let scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        
        if (scrollTop > lastScrollTop && scrollTop > 100) {
            // Scrolling down
            navbar.style.transform = 'translateY(-100%)';
        } else {
            // Scrolling up
            navbar.style.transform = 'translateY(0)';
        }
        lastScrollTop = scrollTop;
    });

    // Mobile menu toggle (for future enhancement)
    function handleResize() {
        const navLinks = document.querySelector('.nav-links');
        if (window.innerWidth <= 768) {
            // Mobile view adjustments can be added here
            console.log('Mobile view active');
        } else {
            // Desktop view
            console.log('Desktop view active');
        }
    }

    // Listen for window resize
    window.addEventListener('resize', handleResize);
    
    // Run once on load
    handleResize();

    // Authentication page functionality
    initAuthPage();
});

function initAuthPage() {
    // Check if we're on the auth page
    if (!document.getElementById('loginToggle')) return;

    const loginToggle = document.getElementById('loginToggle');
    const registerToggle = document.getElementById('registerToggle');
    const loginForm = document.getElementById('loginForm');
    const registerForm = document.getElementById('registerForm');
    const switchToRegister = document.getElementById('switchToRegister');
    const switchToLogin = document.getElementById('switchToLogin');

    // Toggle between login and register forms
    function showLogin() {
        loginToggle.classList.add('active');
        registerToggle.classList.remove('active');
        loginForm.classList.remove('hidden');
        registerForm.classList.add('hidden');
    }

    function showRegister() {
        registerToggle.classList.add('active');
        loginToggle.classList.remove('active');
        registerForm.classList.remove('hidden');
        loginForm.classList.add('hidden');
    }

    // Event listeners for toggle buttons
    loginToggle.addEventListener('click', showLogin);
    registerToggle.addEventListener('click', showRegister);
    switchToRegister.addEventListener('click', showRegister);
    switchToLogin.addEventListener('click', showLogin);

    // Login form submission
    const loginFormElement = document.getElementById('loginFormElement');
    if (loginFormElement) {
        loginFormElement.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            const formData = new FormData(this);
            const usernameEmail = formData.get('usernameEmail');
            const password = formData.get('password');
            
            if (usernameEmail && password) {
                const submitButton = this.querySelector('.auth-submit-button');
                const originalText = submitButton.textContent;
                
                submitButton.textContent = 'Logging in...';
                submitButton.disabled = true;
                
                try {
                    const response = await fetch('/api/login', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({ usernameEmail, password })
                    });
                    
                    const data = await response.json();
                    
                    if (data.success) {
                        submitButton.textContent = 'Login Successful!';
                        submitButton.style.background = 'linear-gradient(135deg, #28a745 0%, #20c997 100%)';
                        
                        // Store user data in localStorage
                        localStorage.setItem('skillbridge_user', JSON.stringify(data.user));
                        
                        setTimeout(() => {
                            // Redirect to home page
                            window.location.href = 'index.html';
                        }, 1500);
                    } else {
                        throw new Error(data.message || 'Login failed');
                    }
                } catch (error) {
                    submitButton.textContent = 'Login Failed';
                    submitButton.style.background = 'linear-gradient(135deg, #dc3545 0%, #c82333 100%)';
                    alert(error.message || 'Login failed. Please try again.');
                    
                    setTimeout(() => {
                        submitButton.textContent = originalText;
                        submitButton.disabled = false;
                        submitButton.style.background = 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)';
                    }, 3000);
                }
            }
        });
    }

    // Register form submission
    const registerFormElement = document.getElementById('registerFormElement');
    if (registerFormElement) {
        registerFormElement.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            const formData = new FormData(this);
            const userType = document.querySelector('input[name="userType"]:checked')?.value;
            const username = formData.get('username');
            const email = formData.get('email');
            const password = formData.get('password');
            const confirmPassword = formData.get('confirmPassword');
            
            // Validation
            if (!userType) {
                alert('Please select your user type (Student, Teacher/Mentor, or Sponsor)');
                return;
            }
            
            if (password !== confirmPassword) {
                alert('Passwords do not match. Please try again.');
                return;
            }
            
            if (password.length < 6) {
                alert('Password must be at least 6 characters long.');
                return;
            }
            
            if (username && email && password) {
                const submitButton = this.querySelector('.auth-submit-button');
                const originalText = submitButton.textContent;
                
                submitButton.textContent = 'Creating Account...';
                submitButton.disabled = true;
                
                try {
                    const response = await fetch('/api/register', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({ username, email, password, userType })
                    });
                    
                    const data = await response.json();
                    
                    if (data.success) {
                        submitButton.textContent = 'Account Created!';
                        submitButton.style.background = 'linear-gradient(135deg, #28a745 0%, #20c997 100%)';
                        
                        setTimeout(() => {
                            // Switch to login form
                            showLogin();
                            
                            // Reset button
                            submitButton.textContent = originalText;
                            submitButton.disabled = false;
                            submitButton.style.background = 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)';
                            
                            // Reset form
                            registerFormElement.reset();
                            
                            // Clear user type selection
                            document.querySelectorAll('input[name="userType"]').forEach(radio => {
                                radio.checked = false;
                            });
                            
                            // Show success message
                            alert('Account created successfully! Please login with your credentials.');
                        }, 2000);
                    } else {
                        throw new Error(data.message || 'Registration failed');
                    }
                } catch (error) {
                    submitButton.textContent = 'Registration Failed';
                    submitButton.style.background = 'linear-gradient(135deg, #dc3545 0%, #c82333 100%)';
                    alert(error.message || 'Registration failed. Please try again.');
                    
                    setTimeout(() => {
                        submitButton.textContent = originalText;
                        submitButton.disabled = false;
                        submitButton.style.background = 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)';
                    }, 3000);
                }
            }
        });
    }

    // Real-time password confirmation validation
    const confirmPasswordField = document.getElementById('confirmPassword');
    const passwordField = document.getElementById('registerPassword');
    
    if (confirmPasswordField && passwordField) {
        confirmPasswordField.addEventListener('input', function() {
            if (this.value && passwordField.value) {
                if (this.value !== passwordField.value) {
                    this.style.borderColor = '#dc3545';
                    this.style.boxShadow = '0 0 10px rgba(220, 53, 69, 0.3)';
                } else {
                    this.style.borderColor = '#28a745';
                    this.style.boxShadow = '0 0 10px rgba(40, 167, 69, 0.3)';
                }
            } else {
                this.style.borderColor = 'rgba(102, 126, 234, 0.3)';
                this.style.boxShadow = 'none';
            }
        });
    }
}