// Password strength indicator
const passwordInput = document.getElementById('password');
const confirmPasswordInput = document.getElementById('confirmPassword');
const strengthMeter = document.querySelector('.strength-meter');
const strengthText = document.querySelector('.strength-text span');

passwordInput.addEventListener('input', function() {
    const password = this.value;
    const strength = calculatePasswordStrength(password);
    
    // Update meter width
    strengthMeter.style.width = strength.percentage + '%';
    strengthMeter.style.backgroundColor = strength.color;
    
    // Update text
    strengthText.textContent = strength.text;
    strengthText.style.color = strength.color;
    
    // Check password match
    if (confirmPasswordInput.value) {
        checkPasswordMatch();
    }
});

confirmPasswordInput.addEventListener('input', checkPasswordMatch);

function checkPasswordMatch() {
    if (passwordInput.value !== confirmPasswordInput.value) {
        confirmPasswordInput.setCustomValidity("Passwords don't match");
        confirmPasswordInput.style.borderColor = '#ff4757';
    } else {
        confirmPasswordInput.setCustomValidity('');
        confirmPasswordInput.style.borderColor = '#e0e0e0';
    }
}

function calculatePasswordStrength(password) {
    let strength = 0;
    
    // Length check
    if (password.length > 7) strength += 25;
    if (password.length > 11) strength += 25;
    
    // Character type checks
    if (/[A-Z]/.test(password)) strength += 15;
    if (/[0-9]/.test(password)) strength += 15;
    if (/[^A-Za-z0-9]/.test(password)) strength += 20;
    
    // Determine strength level
    if (strength < 30) {
        return { percentage: 25, color: '#ff4757', text: 'Weak' };
    } else if (strength < 60) {
        return { percentage: 50, color: '#ffa502', text: 'Medium' };
    } else if (strength < 90) {
        return { percentage: 75, color: '#2ed573', text: 'Strong' };
    } else {
        return { percentage: 100, color: '#1dd1a1', text: 'Very Strong' };
    }
}

// Toggle password visibility
document.querySelectorAll('.toggle-password').forEach(icon => {
    icon.addEventListener('click', function() {
        const input = this.parentElement.querySelector('input');
        const type = input.getAttribute('type') === 'password' ? 'text' : 'password';
        input.setAttribute('type', type);
        this.classList.toggle('fa-eye-slash');
    });
});

// Form submission
document.getElementById('signupForm').addEventListener('submit', function(e) {
    e.preventDefault();
    // Add your signup logic here
    alert('Account created successfully! Redirecting to dashboard...');
    // window.location.href = 'dashboard.html';
});

// Initialize particles.js
document.addEventListener('DOMContentLoaded', function() {
    particlesJS.load('particles-js', '/assets/particles-config.json', function() {
        console.log('Particles.js loaded');
    });
});