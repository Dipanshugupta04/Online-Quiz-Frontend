document.addEventListener('DOMContentLoaded', function() {
    // Mobile menu toggle
    const hamburger = document.getElementById('hamburger');
    const navContainer = document.getElementById('navContainer');
    
    hamburger.addEventListener('click', function() {
        this.classList.toggle('active');
        navContainer.classList.toggle('active');
        
        // Toggle body scroll when menu is open
        if (navContainer.classList.contains('active')) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
    });
    
    // Close menu when clicking on a link
    const navLinks = document.querySelectorAll('.nav-links a, .auth-anchor');
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            hamburger.classList.remove('active');
            navContainer.classList.remove('active');
            document.body.style.overflow = '';
        });
    });
    
    // Feature card animations
    const featureCards = document.querySelectorAll('.feature-card');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                setTimeout(() => {
                    entry.target.style.opacity = 1;
                    entry.target.style.transform = 'translateY(0)';
                }, index * 200);
            }
        });
    }, { threshold: 0.1 });
    
    featureCards.forEach(card => {
        card.style.opacity = 0;
        card.style.transform = 'translateY(20px)';
        card.style.transition = 'all 0.6s ease';
        observer.observe(card);
    });
    
    // Join quiz button functionality
    document.getElementById('joinQuizBtn').addEventListener('click', function() {
        const code = document.getElementById('quizCode').value.trim();
        if (code) {
            alert(`Joining quiz with code: ${code}`);
            // In a real app, you would redirect to the quiz page
            // window.location.href = `/quiz/${code}`;
        } else {
            alert('Please enter a quiz code');
        }
    });
    
    // Testimonial slider
    const testimonialCards = document.querySelectorAll('.testimonial-card');
    const prevBtn = document.querySelector('.prev-btn');
    const nextBtn = document.querySelector('.next-btn');
    let currentIndex = 0;
    
    function showTestimonial(index) {
        testimonialCards.forEach(card => card.classList.remove('active'));
        testimonialCards[index].classList.add('active');
    }
    
    prevBtn.addEventListener('click', function() {
        currentIndex = (currentIndex - 1 + testimonialCards.length) % testimonialCards.length;
        showTestimonial(currentIndex);
    });
    
    nextBtn.addEventListener('click', function() {
        currentIndex = (currentIndex + 1) % testimonialCards.length;
        showTestimonial(currentIndex);
    });
    
    // Auto-rotate testimonials
    let testimonialInterval = setInterval(() => {
        currentIndex = (currentIndex + 1) % testimonialCards.length;
        showTestimonial(currentIndex);
    }, 5000);
    
    // Pause auto-rotation when hovering over testimonials
    const testimonialSlider = document.querySelector('.testimonial-slider');
    testimonialSlider.addEventListener('mouseenter', () => {
        clearInterval(testimonialInterval);
    });
    
    testimonialSlider.addEventListener('mouseleave', () => {
        testimonialInterval = setInterval(() => {
            currentIndex = (currentIndex + 1) % testimonialCards.length;
            showTestimonial(currentIndex);
        }, 5000);
    });
    
    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop - 80,
                    behavior: 'smooth'
                });
            }
        });
    });
});