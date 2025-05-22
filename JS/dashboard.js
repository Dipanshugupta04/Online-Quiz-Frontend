document.addEventListener('DOMContentLoaded', () => {
    // Mobile menu toggle
    const mobileMenu = document.getElementById('mobile-menu');
    const navLinks = document.querySelector('.nav-links');
    
    mobileMenu.addEventListener('click', function() {
        this.classList.toggle('active');
        navLinks.classList.toggle('active');
    });
    
    // User dropdown toggle
    const userSection = document.getElementById('userSection');
    const userDropdown = document.getElementById('userDropdown');
    
    userSection.addEventListener('click', function(e) {
        e.stopPropagation();
        userDropdown.classList.toggle('show');
    });
    
    document.addEventListener('click', function() {
        userDropdown.classList.remove('show');
    });
    
    // Display username from localStorage
    const userNameSpan = document.getElementById('navUsername');
    const userData = localStorage.getItem('user');
    
    if (userData) {
        try {
            const user = JSON.parse(userData);
            const name = user.name || user.username || user.fullName || 'User';
            userNameSpan.textContent = `Welcome, ${name}`;
        } catch (error) {
            console.error('Failed to parse user data:', error);
            userNameSpan.textContent = 'Welcome';
        }
    } else {
        userNameSpan.textContent = 'Welcome';
    }
    
    // Logout functionality
    const logoutBtn = document.getElementById('logoutBtn');
    
    if (logoutBtn) {
        logoutBtn.addEventListener('click', function(e) {
            e.preventDefault();
            performLogout();
        });
    }
    
    // Date validation (end date shouldn't be before start date)
    const startDateInput = document.getElementById('startDate');
    const endDateInput = document.getElementById('endDate');
    
    startDateInput.addEventListener('change', function() {
        endDateInput.min = this.value;
        if (endDateInput.value && endDateInput.value < this.value) {
            endDateInput.value = this.value;
        }
    });
    
    // Form submission
    const examForm = document.getElementById('examForm');
    
    examForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        // Get form values
        const examName = document.getElementById('examName').value.trim();
        const creatorName = document.getElementById('creatorName').value.trim();
        const examDuration = document.getElementById('examDuration').value.trim();
        const startDate = document.getElementById('startDate').value;
        const endDate = document.getElementById('endDate').value;
        
        // Validate form
        if (!examName || !creatorName || !examDuration || !startDate || !endDate) {
            alert('Please fill in all required fields');
            return;
        }
        
        // Convert duration to number
        const durationMinutes = parseInt(examDuration);
        if (isNaN(durationMinutes) || durationMinutes <= 0) {
            alert('Please enter a valid duration in minutes (greater than 0)');
            return;
        }
        
        // Prepare dates with time components
        const startDateTime = new Date(`${startDate}T00:00:00`);
        const endDateTime = new Date(`${endDate}T23:59:59`);
        
        // Validate date range
        if (endDateTime <= startDateTime) {
            alert('End date must be after start date');
            return;
        }
        
        // Prepare exam data
        const examData = {
            exam_name: examName,
            created_by: creatorName,
            duration_minutes: durationMinutes,
            start_date_time: startDateTime.toISOString(),
            end_date_time: endDateTime.toISOString()
        };
        
        try {
            const token = localStorage.getItem('authToken');
            if (!token) {
                throw new Error('No authentication token found. Please login again.');
            }
            
            console.log('Submitting exam data:', examData);
            
            const response = await fetch('http://localhost:8081/quiz/exam/create', {
                method: 'POST',
                mode: 'cors',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                credentials: 'include',
               
                body: JSON.stringify(examData)
            });
            
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Failed to create exam');
            }
            
            const result = await response.json();
            console.log('Exam created successfully:', result);
            
            // Redirect to create quiz page with exam ID
            window.location.href = `/HTML/create-quiz.html?examId=${result.examId}`;
            
        } catch (error) {
            console.error('Error creating exam:', error);
            alert(`Error: ${error.message}`);
        }
    });
});

// Global logout function
function performLogout() {
    // Clear all authentication-related data
    localStorage.removeItem('authToken');
    localStorage.removeItem('rememberedEmail');
    localStorage.removeItem('user');
    localStorage.removeItem('currentUser');
    localStorage.removeItem('username');
    
    // Clear quiz-related data
    localStorage.removeItem('currentQuiz');
    localStorage.removeItem('quizResults');
    
    // Redirect to home page
    window.location.href = '/HTML/index.html';
}