// script.js
document.addEventListener('DOMContentLoaded', function() {
    // Mobile menu toggle
    const menuToggle = document.getElementById('mobile-menu');
    const navLinks = document.querySelector('.nav-links');
    
    menuToggle.addEventListener('click', function() {
        navLinks.classList.toggle('active');
        menuToggle.classList.toggle('active');
    });
    
    // Form submission
    const examForm = document.getElementById('examForm');
    
    examForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Get form values
        const creatorName = document.getElementById('creatorName').value;
        const examName = document.getElementById('examName').value;
        
        // Here you would typically send the data to a server
        console.log('Form submitted:', { creatorName, examName });
        
        // Show success message (you could replace this with a proper modal)
        alert(`Exam "${examName}" created successfully by ${creatorName}!`);
        
        // Reset form
        examForm.reset();
    });
    
    // Date validation (end date shouldn't be before start date)
    const startDate = document.getElementById('startDate');
    const endDate = document.getElementById('endDate');
    
    startDate.addEventListener('change', function() {
        endDate.min = this.value;
    });
});