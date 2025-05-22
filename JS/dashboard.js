
    // Wait for the DOM to fully load
document.addEventListener('DOMContentLoaded', () => {
    // Get the HTML element where we want to show the username
    const userNameSpan = document.getElementById('navUsername');

    // Retrieve the user data stored in localStorage during login
    const userData = localStorage.getItem('user');

    if (userData) {
        try {
            // Parse the JSON string to an object
            const user = JSON.parse(userData);

            // Extract the name (update the field name if different)
            const name = user.name || user.username || user.fullName || 'User';

            // Update the span to show the welcome message
            userNameSpan.textContent = `Welcome, ${name}`;
        } catch (error) {
            console.error('Failed to parse user data from localStorage:', error);
            userNameSpan.textContent = 'Welcome';
        }
    } else {
        // If no user is found in localStorage
        userNameSpan.textContent = 'Welcome';
    }


    
    // // Form submission
    // const examForm = document.getElementById('examForm');
    
    // examForm.addEventListener('submit', function(e) {
    //     e.preventDefault();
        
    //     // Get form values
    //     const creatorName = document.getElementById('creatorName').value;
    //     const examName = document.getElementById('examName').value;
        
    //     // Here you would typically send the data to a server
    //     console.log('Form submitted:', { creatorName, examName });
        
    //     // Show success message (you could replace this with a proper modal)
    //     alert(`Exam "${examName}" created successfully by ${creatorName}!`);
        
    //     // Reset form
    //     examForm.reset();
    // });
    
    // Date validation (end date shouldn't be before start date)
    const startDate = document.getElementById('startDate');
    const endDate = document.getElementById('endDate');
    
    startDate.addEventListener('change', function() {
        endDate.min = this.value;
    });
});
document.addEventListener('DOMContentLoaded', function() {
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
    
    // // Display username if available
    // const navUsername = document.getElementById('navUsername');
    // const username = localStorage.getItem('username') || 'User';
    // navUsername.textContent = username;
    
    // Logout functionality
   // Logout functionality for dashboard
   const logoutBtn = document.getElementById('logoutBtn');
    
   if (logoutBtn) {
       logoutBtn.addEventListener('click', function(e) {
           e.preventDefault();
           performLogout();
       });
   }
   
   // Function to handle logout (can be used by all pages)
   window.performLogout = function() {
       // Clear all authentication-related data
       localStorage.removeItem('authToken');
       localStorage.removeItem('rememberedEmail');
       localStorage.removeItem('user');
       localStorage.removeItem('currentUser');
       localStorage.removeItem('username');
       
       // Clear any other quiz-related data if needed
       localStorage.removeItem('currentQuiz');
       localStorage.removeItem('quizResults');
       
       // Redirect to index.html
       window.location.href = '/HTML/index.html';
   };
    
    // Form submission with API call
    const examForm = document.getElementById('examForm');
    
    examForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        // Get form values
        const creatorName = document.getElementById('creatorName').value;
        const examDuration = document.getElementById('examDuration').value;
        const startDate = document.getElementById('startDate').value;
        const endDate = document.getElementById('endDate').value;
        const examName = document.getElementById('examName').value;
        
        // Validate form
        if (!creatorName || !examDuration || !startDate || !endDate || !examName) {
            alert('Please fill in all fields');
            return;
        }
        
        // Prepare exam data
        const examData = {
            creatorName,
            examDuration,
            startDate,
            endDate,
            examName
        };
        
        try {
            // Get token from localStorage
            const token = localStorage.getItem('token');
            
            if (!token) {
                throw new Error('No authentication token found. Please login again.');
            }
            
            // Make API request
            const response = await fetch('http://localhost:8081/api/login/quiz/exam/create', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(examData)
            });
            
            const result = await response.json();
            
            if (!response.ok) {
                throw new Error(result.message || 'Failed to create exam');
            }
            
            // Success - redirect to create quiz page with exam ID
            window.location.href = `/HTML/create-quiz.html?examId=${result.examId}`;
            
        } catch (error) {
            console.error('Error creating exam:', error);
            alert(`Error: ${error.message}`);
        }
    });
});