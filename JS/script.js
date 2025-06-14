document.addEventListener("DOMContentLoaded", function () {
  // Authentication state management
  const authButtons = document.getElementById("authButtons");
  const userSection = document.getElementById("userSection");
  const navUsername = document.getElementById("navUsername");
  const logoutBtn = document.getElementById("logoutBtn");
  const loginBtn = document.getElementById("login-btn");
  const signupBtn = document.getElementById("signup-btn");

 
  // Check authentication status
  function checkAuthStatus() {
    const userData = localStorage.getItem("user");

    if (userData) {
      try {
        const user = JSON.parse(userData);

        const name =
          user.name || user.username || user.fullName || user.user || "User";
        authButtons.style.display = "none";
        userSection.style.display = "flex";
        navUsername.textContent = `Welcome, ${name}`;
      } catch (e) {
        window.location.href='error.html';
        console.error("Error parsing user data:", e);
        clearUserData();
        showAuthButtons();
      }
    } else {
      showAuthButtons();
    }
  }
 
  function showAuthButtons() {
    authButtons.style.display = "flex";
    userSection.style.display = "none";
  }

  function clearUserData() {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("currentUser");
    localStorage.removeItem("username");
  }

  // Initialize auth status
  checkAuthStatus();

  // Logout functionality
  function performLogout() {
    localStorage.removeItem("authToken");

    localStorage.removeItem("rememberedEmail");
    localStorage.removeItem("user");
    localStorage.removeItem("examId");
    localStorage.removeItem("examName");
    localStorage.removeItem("unique_id");
    // Remove other keys if needed
    window.location.href = "/HTML/index.html";
  }

  logoutBtn?.addEventListener("click", function (e) {
    e.preventDefault();
    performLogout();
  });
  loginBtn?.addEventListener("click", function (e) {
    e.preventDefault();
    window.location.href = "/HTML/login.html";
  });
  signupBtn?.addEventListener("click", function (e) {
    e.preventDefault();
    window.location.href = "/HTML/signup.html";
  });

  // Mobile menu toggle
  const hamburger = document.getElementById("hamburger");
  const navContainer = document.getElementById("navContainer");

  if (hamburger && navContainer) {
    hamburger.addEventListener("click", function () {
      this.classList.toggle("active");
      navContainer.classList.toggle("active");
      document.body.style.overflow = navContainer.classList.contains("active")
        ? "hidden"
        : "";
    });
  }

  // Close menu when clicking on a link
  const navLinks = document.querySelectorAll(".nav-links a, .auth-anchor");
  navLinks.forEach((link) => {
    link.addEventListener("click", function () {
      if (hamburger) hamburger.classList.remove("active");
      if (navContainer) navContainer.classList.remove("active");
      document.body.style.overflow = "";
    });
  });

  // User dropdown toggle
  const userProfile = document.querySelector(".user-profile");
  const userDropdown = document.getElementById("userDropdown");

  if (userProfile && userDropdown) {
    userProfile.addEventListener("click", function (e) {
      e.stopPropagation();
      userDropdown.style.display =
        userDropdown.style.display === "block" ? "none" : "block";
    });

    // Close dropdown when clicking outside
    document.addEventListener("click", function () {
      userDropdown.style.display = "none";
    });
  }
  const id = localStorage.getItem("unique_id");
  const unique_id = document.getElementById("uniqueid");

  if (id && unique_id) {
    unique_id.innerText = "ID: " + id;
  }

  // Feature card animations
  const featureCards = document.querySelectorAll(".feature-card");
  if (featureCards.length > 0) {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry, index) => {
          if (entry.isIntersecting) {
            setTimeout(() => {
              entry.target.style.opacity = 1;
              entry.target.style.transform = "translateY(0)";
            }, index * 200);
          }
        });
      },
      { threshold: 0.1 }
    );

    featureCards.forEach((card) => {
      card.style.opacity = 0;
      card.style.transform = "translateY(20px)";
      card.style.transition = "all 0.6s ease";
      observer.observe(card);
    });
  }

  // Join quiz button functionality
  const joinQuizBtn = document.getElementById("joinQuizBtn");
  if (joinQuizBtn) {
    joinQuizBtn.addEventListener("click", function () {
      const code = document.getElementById("quizCode")?.value.trim();
      if (code) {
        alert(`Joining quiz with code: ${code}`);
        // window.location.href = `/quiz/${code}`;
      } else {
        alert("Please enter a quiz code");
      }
    });
  }

  // Testimonial slider
  const testimonialCards = document.querySelectorAll(".testimonial-card");
  const prevBtn = document.querySelector(".prev-btn");
  const nextBtn = document.querySelector(".next-btn");

  if (testimonialCards.length > 0) {
    let currentIndex = 0;

    function showTestimonial(index) {
      testimonialCards.forEach((card) => card.classList.remove("active"));
      testimonialCards[index].classList.add("active");
    }

    showTestimonial(currentIndex);

    if (prevBtn) {
      prevBtn.addEventListener("click", function () {
        currentIndex =
          (currentIndex - 1 + testimonialCards.length) %
          testimonialCards.length;
        showTestimonial(currentIndex);
      });
    }

    if (nextBtn) {
      nextBtn.addEventListener("click", function () {
        currentIndex = (currentIndex + 1) % testimonialCards.length;
        showTestimonial(currentIndex);
      });
    }

    let testimonialInterval = setInterval(() => {
      currentIndex = (currentIndex + 1) % testimonialCards.length;
      showTestimonial(currentIndex);
    }, 5000);

    const testimonialSlider = document.querySelector(".testimonial-slider");
    if (testimonialSlider) {
      testimonialSlider.addEventListener("mouseenter", () => {
        clearInterval(testimonialInterval);
      });

      testimonialSlider.addEventListener("mouseleave", () => {
        testimonialInterval = setInterval(() => {
          currentIndex = (currentIndex + 1) % testimonialCards.length;
          showTestimonial(currentIndex);
        }, 5000);
      });
    }
  }

  // Smooth scrolling for anchor links
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", function (e) {
      e.preventDefault();

      const targetId = this.getAttribute("href");
      if (targetId === "#") return;

      const targetElement = document.querySelector(targetId);
      if (targetElement) {
        window.scrollTo({
          top: targetElement.offsetTop - 80,
          behavior: "smooth",
        });
      }
    });
  });

  // Try it now button functionality
  const tryBtn = document.querySelector(".try-btn");
  if (tryBtn) {
    tryBtn.addEventListener("click", function () {
      const token = localStorage.getItem("token");
      window.location.href = token ? "create-quiz.html" : "signup.html";
    });
  }
  // Initialize auth status
  const isLoggedIn = checkAuthStatus();
  // Get started button functionality
  const ctaBtn = document.querySelector(".cta-btn");
  if (ctaBtn) {
    ctaBtn.addEventListener("click", function (e) {
      // Check if user is logged in
      if (localStorage.getItem("authToken")) {
        // User is logged in - redirect to dashboard
        window.location.href = "dashboard.html";
      } else {
        // User is not logged in - redirect to login
        window.location.href = "login.html";
      }
    });
  }

  const analyticsBtn=document.querySelector("#cta-btn_analytics");
  if (analyticsBtn) {
    analyticsBtn.addEventListener("click", function (e) {
      // Check if user is logged in
      if (localStorage.getItem("authToken")) {
        // User is logged in - redirect to dashboard
        window.location.href = "Analytics.html";
      } else {
        // User is not logged in - redirect to login
        window.location.href = "login.html";
      }
    });
  }

  const myquiz = document.querySelector("#cta-btn_quiz");
  if (myquiz) {
    myquiz.addEventListener("click", function (e) {
      // Check if user is logged in
      if (localStorage.getItem("authToken")) {
        // User is logged in - redirect to dashboard
        window.location.href = "quiz-room.html";
      } else {
        // User is not logged in - redirect to login
        window.location.href = "login.html";
      }
    });
  }

  // Get started button functionality
  const tryctaBtn = document.querySelector(".try-btn ");
  if (tryctaBtn) {
    tryctaBtn.addEventListener("click", function (e) {
      // Check if user is logged in
      if (localStorage.getItem("authToken")) {
        // User is logged in - redirect to dashboard
        window.location.href = "dashboard.html";
      } else {
        // User is not logged in - redirect to login
        window.location.href = "login.html";
      }
    });
  }
});


//JWT TOKWN EXPIRY CHECK

import { decodeJwt } from "https://cdn.jsdelivr.net/npm/jose@4.14.4/+esm";

const tokenKey = "authToken";
const checkInterval = 5 * 60 * 1000; // Check every 5 minutes
let logoutInProgress = false;

// Enhanced token expiration check with error handling
function getTokenExpiration(token) {
  if (!token) return null;
  
  try {
    const decodedToken = decodeJwt(token);
    return decodedToken?.exp ? decodedToken.exp * 1000 : null;
  } catch (error) {
    window.location.href='error.html';
    console.error("Token validation error:", error.message);
    return null;
  }
}

// Safe token expiration check
function isTokenExpired(token) {
  const expirationTime = getTokenExpiration(token);
  return expirationTime ? Date.now() >= expirationTime : true;
}

// Safe logout handler with navigation guard
async function autoLogout() {
  if (logoutInProgress) return;
  logoutInProgress = true;
  
  console.log("Session expired. Performing automatic logout...");
  
  // Clear all auth-related data
  localStorage.removeItem("authToken");
  localStorage.removeItem("currentQuizId");
  localStorage.removeItem("examId");
  localStorage.removeItem("examName");
  
  // Use replaceState before redirect to prevent navigation issues
  window.history.replaceState(null, "", window.location.href);
  
  // Delay redirect to ensure state is properly updated
  await new Promise(resolve => setTimeout(resolve, 100));
  
  // Check if we're already on the index page to avoid unnecessary redirects
  if (!window.location.pathname.endsWith("index.html")) {
    window.location.href = "index.html";
  }
  
  logoutInProgress = false;
}

// Main token validation function
function validateToken() {
  try {
    const token = localStorage.getItem(tokenKey);
    if (isTokenExpired(token)) {
      autoLogout();
    }
  } catch (error) {
    window.location.href='error.html';
    console.error("Token validation failed:", error);
    autoLogout();
  }
}

// Initial check on page load
document.addEventListener("DOMContentLoaded", () => {
  validateToken();
  
  // Set up periodic checks with cleanup on page unload
  const intervalId = setInterval(validateToken, checkInterval);
  
  window.addEventListener("beforeunload", () => {
    clearInterval(intervalId);
  });
});

// Additional event listeners for better coverage
window.addEventListener("storage", (event) => {
  if (event.key === tokenKey) {
    validateToken();
  }
});

// Visibility change handler for when user returns to tab
document.addEventListener("visibilitychange", () => {
  if (document.visibilityState === "visible") {
    validateToken();
  }
});





//websocket



    let stompClient = null;
    let quizCode = '';
    let currentUser = null;

    // Connect to WebSocket
    function connect() {
        const socket = new SockJS('/quiz-websocket');
        stompClient = Stomp.over(socket);
        stompClient.connect({}, function(frame) {
            console.log('Connected: ' + frame);
            
            // Subscribe to quiz updates
            stompClient.subscribe('/topic/quiz/' + quizCode, function(message) {
                const quizData = JSON.parse(message.body);
                if (quizData.status === "ACTIVE") {
                    displayQuiz(quizData.quiz);
                }
            });
            
            // Subscribe to participant updates
            stompClient.subscribe('/topic/room/' + quizCode + '/participants', function(message) {
                const data = JSON.parse(message.body);
                updateParticipants(data);
            });
        });
    }

    // Join quiz room
    async function joinQuiz() {
        quizCode = document.getElementById('quizCode').value.trim();
        
        const email = "dipanshuguptamitrc@gmail.com"; // Get from auth or input
        console.log(quizCode);
        
        if (!quizCode) {
            alert('Please enter a quiz code');
            return;
        }
        const authToken=localStorage.getItem('authToken');

        try {
            const response = await fetch('http://localhost:8081/quiz/join-room', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${authToken}`,
                },
                body: JSON.stringify({
                    roomCode: quizCode,
                    email: email
                })
            });
            
            const data = await response.json();
            console.log(data);
            
            if (data.status === 'success') {
                currentUser = {
                    name: data.participantName,
                    email: email
                };
                
                // Connect to WebSocket after successful join
                connect();
                
                // Display quiz if already active
                if (data.quiz) {
                    displayQuiz(data.quiz);
                } else {
                    showWaitingMessage();
                }
            } else {
                alert(data.message);
            }
        } catch (error) {
            console.error('Error:', error);
            alert('Failed to join quiz');
        }
    }

    function displayQuiz(quiz) {
        // Hide join form
        document.querySelector('.hero-content').style.display = 'none';
        
        // Create quiz container
        const quizContainer = document.createElement('div');
        quizContainer.className = 'quiz-container';
        quizContainer.innerHTML = `
            <h2>${quiz.title}</h2>
            <div class="participants-count">Participants: <span id="participantCount">1</span></div>
            <div class="question-container" id="questionContainer"></div>
            <div class="quiz-controls">
                <button id="submitQuiz">Submit Answers</button>
            </div>
        `;
        
        document.querySelector('.hero').appendChild(quizContainer);
        
        // Display first question
        displayQuestion(quiz.questions[0], 0, quiz.questions.length);
        
        // Set up event listeners
        document.getElementById('submitQuiz').addEventListener('click', submitAnswers);
    }

    function showWaitingMessage() {
        document.querySelector('.hero-content').innerHTML = `
            <h1>Waiting for quiz to start...</h1>
            <p>The quiz host needs to activate the quiz. Please wait.</p>
            <div class="participants-count">Participants: <span id="participantCount">1</span></div>
        `;
    }

    function updateParticipants(data) {
        const countElement = document.getElementById('participantCount');
        if (countElement) {
            countElement.textContent = data.totalParticipants;
        }
        
        // Optional: Show notification about new participant
        if (data.action === 'participant_joined') {
            showNotification(`${data.participantName} joined the quiz`);
        }
    }

    function showNotification(message) {
        // Implement notification UI
        console.log('Notification:', message);
    }

    // Event listener for join button
    document.getElementById('joinQuizBtn').addEventListener('click', joinQuiz);
