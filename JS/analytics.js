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
            
          // Safely handle potentially missing elements
          if (authButtons) authButtons.style.display = "none";
          if (userSection) userSection.style.display = "flex";
          if (navUsername) navUsername.textContent = `Welcome, ${name}`;
        } catch (e) {
          console.error("Error parsing user data:", e);
          window.location.href='error.html'
          clearUserData();
        }
      }
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
      window.location.href = "/HTML/index.html";
    }
  
    if (logoutBtn) {
      logoutBtn.addEventListener("click", function (e) {
        e.preventDefault();
        performLogout();
      });
    }
    
    if (loginBtn) {
      loginBtn.addEventListener("click", function (e) {
        e.preventDefault();
        window.location.href = "/HTML/login.html";
      });
    }
    
    if (signupBtn) {
      signupBtn.addEventListener("click", function (e) {
        e.preventDefault();
        window.location.href = "/HTML/signup.html";
      });
    }
  
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
        if (userDropdown) userDropdown.style.display = "none";
      });
    }
    
    const id = localStorage.getItem("unique_id");
    const unique_id = document.getElementById("uniqueid");
  
    if (id && unique_id) {
      unique_id.innerText = "ID: " + id;
    }
  
    // Feature card animations (only if feature cards exist on page)
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
  
    // Join quiz button functionality (only if exists on page)
    const joinQuizBtn = document.getElementById("joinQuizBtn");
    if (joinQuizBtn) {
      joinQuizBtn.addEventListener("click", function () {
        const code = document.getElementById("quizCode")?.value.trim();
        if (code) {
          alert(`Joining quiz with code: ${code}`);
        } else {
          alert("Please enter a quiz code");
        }
      });
    }
  
    // Testimonial slider (only if exists on page)
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
  
    // Try it now button functionality (only if exists on page)
    const tryBtn = document.querySelector(".try-btn");
    if (tryBtn) {
      tryBtn.addEventListener("click", function () {
        const token = localStorage.getItem("token");
        window.location.href = token ? "create-quiz.html" : "signup.html";
      });
    }
    
    // Get started button functionality (only if exists on page)
    const ctaBtn = document.querySelector(".cta-btn");
    if (ctaBtn) {
      ctaBtn.addEventListener("click", function (e) {
        if (localStorage.getItem("authToken")) {
          window.location.href = "dashboard.html";
        } else {
          window.location.href = "login.html";
        }
      });
    }
  
    const analyticsBtn = document.querySelector("#cta-btn_analytics");
    if (analyticsBtn) {
      analyticsBtn.addEventListener("click", function (e) {
        if (localStorage.getItem("authToken")) {
          window.location.href = "Analytics.html";
        } else {
          window.location.href = "login.html";
        }
      });
    }
  
    const myquiz = document.querySelector("#cta-btn_quiz");
    if (myquiz) {
      myquiz.addEventListener("click", function (e) {
        if (localStorage.getItem("authToken")) {
          window.location.href = "quiz-room.html";
        } else {
          window.location.href = "login.html";
        }
      });
    }
});