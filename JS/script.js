// Join Quiz Button Functionality
document.getElementById('joinQuizBtn').addEventListener('click', function() {
    const quizCode = document.getElementById('quizCode').value.trim();
    if (quizCode) {
        alert(`Joining quiz with code: ${quizCode}`);
        // Redirect to quiz page (replace with actual logic)
        // window.location.href = `/quiz/${quizCode}`;
    } else {
        alert('Please enter a quiz code!');
    }
});

// CTA Button (Get Started) - Redirect to Signup
document.querySelector('.cta-btn').addEventListener('click', function() {
    window.location.href = '#signup'; // Replace with actual signup page link
});

// Try It Button - Scroll to Features
document.querySelector('.try-btn').addEventListener('click', function() {
    document.querySelector('.features').scrollIntoView({ behavior: 'smooth' });
});

// Login/Signup Buttons (Navigation)
document.querySelector('.login-btn').addEventListener('click', function() {
    window.location.href = '#login'; // Replace with actual login page link
});

document.querySelector('.signup-btn').addEventListener('click', function() {
    window.location.href = '#signup'; // Replace with actual signup page link
});