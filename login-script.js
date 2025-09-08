// Login/Register Page JavaScript
document.addEventListener('DOMContentLoaded', function() {
    const loginForm = document.getElementById('loginFormElement');
    const registerForm = document.getElementById('registerFormElement');

    // Form submission handlers
    if (loginForm) {
        loginForm.addEventListener('submit', handleLogin);
    }
    
    if (registerForm) {
        registerForm.addEventListener('submit', handleRegister);
    }

    // Real-time validation
    setupFormValidation();

    // Check if user is already logged in
    checkAuthStatus();
});

// Switch between login and register forms
function switchToRegister() {
    document.getElementById('loginForm').classList.add('hidden');
    document.getElementById('registerForm').classList.remove('hidden');
    clearMessages();
    clearFormErrors();
}

function switchToLogin() {
    document.getElementById('registerForm').classList.add('hidden');
    document.getElementById('loginForm').classList.remove('hidden');
    clearMessages();
    clearFormErrors();
}

// Toggle password visibility
function togglePassword(inputId) {
    const input = document.getElementById(inputId);
    const toggle = input.parentElement.querySelector('.password-toggle');
    const icon = toggle.querySelector('.toggle-icon');
    
    if (input.type === 'password') {
        input.type = 'text';
        icon.textContent = '🙈';
    } else {
        input.type = 'password';
        icon.textContent = '👁️';
    }
}

// Handle login form submission
async function handleLogin(e) {
    e.preventDefault();
    
    const form = e.target;
    const submitBtn = form.querySelector('.submit-btn');
    const formData = new FormData(form);
    
    // Clear previous errors
    clearFormErrors();
    
    // Validate form
    if (!validateLoginForm(form)) {
        return;
    }
    
    // Show loading state
    setLoadingState(submitBtn, true);
    
    try {
        const response = await fetch('/api/auth/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                email: formData.get('email'),
                password: formData.get('password')
            }),
            credentials: 'include'
        });
        
        const data = await response.json();
        
        if (data.success) {
            showMessage('Login successful! Redirecting to dashboard...', 'success');
            
            // Store user data
            localStorage.setItem('user', JSON.stringify(data.user));
            
            // Redirect after short delay
            setTimeout(() => {
                window.location.href = '/dashboard';
            }, 1500);
        } else {
            showMessage(data.message || 'Login failed. Please try again.', 'error');
            
            // Show field-specific errors
            if (data.errors) {
                showFieldErrors(data.errors);
            }
        }
    } catch (error) {
        console.error('Login error:', error);
        showMessage('Network error. Please check your connection and try again.', 'error');
    } finally {
        setLoadingState(submitBtn, false);
    }
}

// Handle register form submission
async function handleRegister(e) {
    e.preventDefault();
    
    const form = e.target;
    const submitBtn = form.querySelector('.submit-btn');
    const formData = new FormData(form);
    
    // Clear previous errors
    clearFormErrors();
    
    // Validate form
    if (!validateRegisterForm(form)) {
        return;
    }
    
    // Show loading state
    setLoadingState(submitBtn, true);
    
    try {
        const requestData = {
            email: formData.get('email'),
            password: formData.get('password'),
            firstName: formData.get('firstName'),
            lastName: formData.get('lastName'),
            phone: formData.get('phone'),
            dateOfBirth: formData.get('dateOfBirth'),
            disabilityType: formData.get('disabilityType'),
            accessibilityNeeds: formData.get('accessibilityNeeds'),
            emergencyContactName: formData.get('emergencyContactName'),
            emergencyContactPhone: formData.get('emergencyContactPhone')
        };

        const response = await fetch('/api/auth/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(requestData),
            credentials: 'include'
        });
        
        const data = await response.json();
        
        if (data.success) {
            showMessage('Registration successful! Welcome to ShaktiPath. Redirecting to dashboard...', 'success');
            
            // Store user data
            localStorage.setItem('user', JSON.stringify(data.user));
            
            // Redirect after short delay
            setTimeout(() => {
                window.location.href = '/dashboard';
            }, 2000);
        } else {
            showMessage(data.message || 'Registration failed. Please try again.', 'error');
            
            // Show field-specific errors
            if (data.errors) {
                showFieldErrors(data.errors);
            }
        }
    } catch (error) {
        console.error('Registration error:', error);
        showMessage('Network error. Please check your connection and try again.', 'error');
    } finally {
        setLoadingState(submitBtn, false);
    }
}

// Form validation functions
function validateLoginForm(form) {
    let isValid = true;
    
    const email = form.querySelector('input[name="email"]');
    const password = form.querySelector('input[name="password"]');
    
    // Email validation
    if (!email.value.trim()) {
        showFieldError('loginEmailError', 'Email is required');
        isValid = false;
    } else if (!isValidEmail(email.value)) {
        showFieldError('loginEmailError', 'Please enter a valid email address');
        isValid = false;
    }
    
    // Password validation
    if (!password.value.trim()) {
        showFieldError('loginPasswordError', 'Password is required');
        isValid = false;
    }
    
    return isValid;
}

function validateRegisterForm(form) {
    let isValid = true;
    
    const firstName = form.querySelector('input[name="firstName"]');
    const lastName = form.querySelector('input[name="lastName"]');
    const email = form.querySelector('input[name="email"]');
    const password = form.querySelector('input[name="password"]');
    const agreeTerms = form.querySelector('input[name="agreeTerms"]');
    
    // First name validation
    if (!firstName.value.trim()) {
        showFieldError('firstNameError', 'First name is required');
        isValid = false;
    } else if (firstName.value.trim().length < 2) {
        showFieldError('firstNameError', 'First name must be at least 2 characters');
        isValid = false;
    }
    
    // Last name validation
    if (!lastName.value.trim()) {
        showFieldError('lastNameError', 'Last name is required');
        isValid = false;
    } else if (lastName.value.trim().length < 2) {
        showFieldError('lastNameError', 'Last name must be at least 2 characters');
        isValid = false;
    }
    
    // Email validation
    if (!email.value.trim()) {
        showFieldError('registerEmailError', 'Email is required');
        isValid = false;
    } else if (!isValidEmail(email.value)) {
        showFieldError('registerEmailError', 'Please enter a valid email address');
        isValid = false;
    }
    
    // Password validation
    if (!password.value.trim()) {
        showFieldError('registerPasswordError', 'Password is required');
        isValid = false;
    } else if (password.value.length < 6) {
        showFieldError('registerPasswordError', 'Password must be at least 6 characters long');
        isValid = false;
    }
    
    // Terms agreement validation
    if (!agreeTerms.checked) {
        showMessage('Please agree to the Terms of Service and Privacy Policy to continue.', 'error');
        isValid = false;
    }
    
    return isValid;
}

// Utility functions
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

function showFieldError(errorElementId, message) {
    const errorElement = document.getElementById(errorElementId);
    const formGroup = errorElement.closest('.form-group');
    
    if (errorElement) {
        errorElement.textContent = message;
        errorElement.classList.add('show');
    }
    
    if (formGroup) {
        formGroup.classList.add('error');
    }
}

function showFieldErrors(errors) {
    errors.forEach(error => {
        if (error.param) {
            const errorId = error.param + 'Error';
            showFieldError(errorId, error.msg);
        }
    });
}

function clearFormErrors() {
    const errorElements = document.querySelectorAll('.error-message');
    const formGroups = document.querySelectorAll('.form-group.error');
    
    errorElements.forEach(element => {
        element.classList.remove('show');
        element.textContent = '';
    });
    
    formGroups.forEach(group => {
        group.classList.remove('error');
    });
}

function showMessage(message, type = 'info') {
    const messageContainer = document.getElementById('messageContainer');
    
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${type}`;
    messageDiv.textContent = message;
    
    messageContainer.appendChild(messageDiv);
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        if (messageDiv.parentNode) {
            messageDiv.parentNode.removeChild(messageDiv);
        }
    }, 5000);
}

function clearMessages() {
    const messageContainer = document.getElementById('messageContainer');
    messageContainer.innerHTML = '';
}

function setLoadingState(button, loading) {
    if (loading) {
        button.classList.add('loading');
        button.disabled = true;
    } else {
        button.classList.remove('loading');
        button.disabled = false;
    }
}

// Setup real-time form validation
function setupFormValidation() {
    const inputs = document.querySelectorAll('input, select, textarea');
    
    inputs.forEach(input => {
        input.addEventListener('blur', function() {
            validateField(this);
        });
        
        input.addEventListener('input', function() {
            // Clear errors on input
            const formGroup = this.closest('.form-group');
            if (formGroup && formGroup.classList.contains('error')) {
                clearFieldError(this);
            }
        });
    });
}

function validateField(field) {
    const formGroup = field.closest('.form-group');
    const fieldName = field.name;
    
    // Clear previous errors
    clearFieldError(field);
    
    // Required field validation
    if (field.hasAttribute('required') && !field.value.trim()) {
        const label = formGroup.querySelector('label').textContent;
        showFieldError(fieldName + 'Error', `${label} is required`);
        return false;
    }
    
    // Email validation
    if (field.type === 'email' && field.value && !isValidEmail(field.value)) {
        showFieldError(fieldName + 'Error', 'Please enter a valid email address');
        return false;
    }
    
    // Password validation
    if (field.type === 'password' && field.value && field.value.length < 6) {
        showFieldError(fieldName + 'Error', 'Password must be at least 6 characters long');
        return false;
    }
    
    return true;
}

function clearFieldError(field) {
    const formGroup = field.closest('.form-group');
    const errorId = field.name + 'Error';
    const errorElement = document.getElementById(errorId);
    
    if (formGroup) {
        formGroup.classList.remove('error');
    }
    
    if (errorElement) {
        errorElement.classList.remove('show');
        errorElement.textContent = '';
    }
}

// Check authentication status
async function checkAuthStatus() {
    try {
        const response = await fetch('/api/auth/me', {
            credentials: 'include'
        });
        
        if (response.ok) {
            const data = await response.json();
            if (data.success) {
                // User is already logged in, redirect to dashboard
                window.location.href = '/dashboard';
            }
        }
    } catch (error) {
        // User is not logged in, which is expected on login page
        console.log('User not logged in');
    }
}

// Keyboard accessibility
document.addEventListener('keydown', function(e) {
    // Enter key on switch buttons
    if (e.key === 'Enter' && e.target.classList.contains('switch-btn')) {
        e.target.click();
    }
    
    // Escape key to clear messages
    if (e.key === 'Escape') {
        clearMessages();
    }
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
}

// Initialize accessibility features
document.addEventListener('DOMContentLoaded', initAccessibility);