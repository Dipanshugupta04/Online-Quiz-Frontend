// Common functions for both login and signup
document.addEventListener("DOMContentLoaded", function () {
  // Initialize particles.js if on signup page
  if (document.getElementById("particles-js")) {
    particlesJS("particles-js", {
      particles: {
        number: { value: 80, density: { enable: true, value_area: 800 } },
        color: { value: "#6c5ce7" },
        shape: { type: "circle" },
        opacity: { value: 0.5, random: true },
        size: { value: 3, random: true },
        line_linked: {
          enable: true,
          distance: 150,
          color: "#a29bfe",
          opacity: 0.4,
          width: 1,
        },
        move: {
          enable: true,
          speed: 2,
          direction: "none",
          random: true,
          straight: false,
          out_mode: "out",
        },
      },
      interactivity: {
        detect_on: "canvas",
        events: {
          onhover: { enable: true, mode: "repulse" },
          onclick: { enable: true, mode: "push" },
        },
      },
    });
  }

  // Toggle password visibility
  document.querySelectorAll(".toggle-password").forEach((icon) => {
    icon.addEventListener("click", function () {
      const input = this.parentElement.querySelector("input");
      const type =
        input.getAttribute("type") === "password" ? "text" : "password";
      input.setAttribute("type", type);

      // Animate the eye icon
      this.style.transform = "scale(1.2)";
      setTimeout(() => {
        this.style.transform = "scale(1)";
      }, 200);

      // Toggle eye icon
      this.classList.toggle("fa-eye");
      this.classList.toggle("fa-eye-slash");
    });
  });

  // Input focus effects
  document.querySelectorAll(".input-group input").forEach((input) => {
    input.addEventListener("focus", function () {
      this.parentElement.style.borderColor = "#6c5ce7";
      this.parentElement.style.boxShadow = "0 0 0 2px rgba(108, 92, 231, 0.2)";
      this.parentElement.querySelector("i").style.color = "#6c5ce7";
    });

    input.addEventListener("blur", function () {
      this.parentElement.style.borderColor = "#e0e0e0";
      this.parentElement.style.boxShadow = "none";
      this.parentElement.querySelector("i").style.color = "#b2bec3";
    });
  });
});

// ===== SIGNUP FUNCTIONALITY =====
if (document.getElementById("signupForm")) {
  const passwordInput = document.getElementById("password");
  const confirmPasswordInput = document.getElementById("confirmPassword");
  const strengthMeter = document.querySelector(".strength-meter");
  const strengthText = document.querySelector(".strength-text span");
  const passwordRequirements = document.querySelector(".password-requirements");

  // Show password requirements when password field is focused
  passwordInput.addEventListener("focus", function () {
    passwordRequirements.style.display = "block";
  });

  passwordInput.addEventListener("input", function () {
    const password = this.value;
    const strength = calculatePasswordStrength(password);

    // Update meter width and color with animation
    strengthMeter.style.transition =
      "width 0.5s ease, background-color 0.5s ease";
    strengthMeter.style.width = strength.percentage + "%";
    strengthMeter.style.backgroundColor = strength.color;

    // Update text with animation
    strengthText.style.transition = "color 0.5s ease";
    strengthText.textContent = strength.text;
    strengthText.style.color = strength.color;

    // Update requirements checklist
    updatePasswordRequirements(password);

    // Check password match if confirm field has value
    if (confirmPasswordInput.value) {
      checkPasswordMatch();
    }
  });

  confirmPasswordInput.addEventListener("input", checkPasswordMatch);

  function checkPasswordMatch() {
    if (passwordInput.value !== confirmPasswordInput.value) {
      confirmPasswordInput.setCustomValidity("Passwords don't match");
      confirmPasswordInput.style.borderColor = "#ff4757";
      confirmPasswordInput.parentElement.querySelector(
        ".match-status"
      ).textContent = "✗ Passwords do not match";
      confirmPasswordInput.parentElement.querySelector(
        ".match-status"
      ).style.color = "#ff4757";
    } else {
      confirmPasswordInput.setCustomValidity("");
      confirmPasswordInput.style.borderColor = "#2ed573";
      confirmPasswordInput.parentElement.querySelector(
        ".match-status"
      ).textContent = "✓ Passwords match";
      confirmPasswordInput.parentElement.querySelector(
        ".match-status"
      ).style.color = "#2ed573";
    }
  }

  function calculatePasswordStrength(password) {
    let strength = 0;

    // Length checks
    if (password.length > 7) strength += 25;
    if (password.length > 11) strength += 25;

    // Character type checks
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumbers = /[0-9]/.test(password);
    const hasSpecialChars = /[^A-Za-z0-9]/.test(password);

    if (hasUpperCase) strength += 15;
    if (hasLowerCase) strength += 10;
    if (hasNumbers) strength += 15;
    if (hasSpecialChars) strength += 20;

    // Determine strength level
    if (strength < 30) {
      return {
        percentage: 25,
        color: "#ff4757",
        text: "Weak",
      };
    } else if (strength < 60) {
      return {
        percentage: 50,
        color: "#ffa502",
        text: "Moderate",
      };
    } else if (strength < 90) {
      return {
        percentage: 75,
        color: "#2ed573",
        text: "Strong",
      };
    } else {
      return {
        percentage: 100,
        color: "#1dd1a1",
        text: "Very Strong",
      };
    }
  }

  function updatePasswordRequirements(password) {
    const requirements = [
      {
        regex: /.{8,}/,
        text: "At least 8 characters",
        element: document.getElementById("req-length"),
      },
      {
        regex: /[A-Z]/,
        text: "At least one uppercase letter",
        element: document.getElementById("req-upper"),
      },
      {
        regex: /[a-z]/,
        text: "At least one lowercase letter",
        element: document.getElementById("req-lower"),
      },
      {
        regex: /[0-9]/,
        text: "At least one number",
        element: document.getElementById("req-number"),
      },
      {
        regex: /[^A-Za-z0-9]/,
        text: "At least one special character",
        element: document.getElementById("req-special"),
      },
    ];

    requirements.forEach((req) => {
      if (req.regex.test(password)) {
        req.element.classList.add("requirement-met");
        req.element.innerHTML = "✓ " + req.text;
      } else {
        req.element.classList.remove("requirement-met");
        req.element.innerHTML = "✗ " + req.text;
      }
    });
  }

  // Form submission with API integration
  document
    .getElementById("signupForm")
    .addEventListener("submit", async function (e) {
      e.preventDefault();
      const submitBtn = this.querySelector('button[type="submit"]');
      const originalText = submitBtn.innerHTML;

      // Validate passwords match
      if (passwordInput.value !== confirmPasswordInput.value) {
        alert("Passwords don't match");
        return;
      }

      // Validate password strength
      const strength = calculatePasswordStrength(passwordInput.value);
      if (strength.text === "Weak") {
        alert("Please choose a stronger password");
        return;
      }

      // Show loading state
      submitBtn.innerHTML =
        '<i class="fas fa-spinner fa-spin"></i> Processing...';
      submitBtn.disabled = true;

      // Get form data
      const formData = {
        email: this.elements.email.value,
        name: this.elements.name.value,
        password: this.elements.password.value,
        confirmPassword: this.elements.confirmPassword.value,
      };

      try {
        // Make API call to register endpoint
        const response = await fetch("https://quizwiz-bcn5.onrender.com/api/register", {
          method: "POST",
          mode:"cors",

          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        });

        const data = await response.json();
        console.log("data is -"+data);

        if (!response.ok) {
          throw new Error(data.message || "Registration failed");
        }

        // Show success animation
        submitBtn.innerHTML = '<i class="fas fa-check"></i> Account Created!';
        submitBtn.style.backgroundColor = "#1dd1a1";

        localStorage.setItem("authToken", data.token);
        localStorage.setItem("unique_id", data,user.unique_id);
        localStorage.setItem("email",data.email);
        localStorage.setItem("user", JSON.stringify(data.user));

        // Redirect after delay
        // setTimeout(() => {
        //   window.location.href = "index.html";
        // }, 1500);
      } catch (error) {
        // Show error message
        submitBtn.innerHTML = originalText;
        submitBtn.disabled = false;
        // window.location.href='error.html';

        // Display error to user
        const errorElement = document.createElement("div");
        errorElement.className = "error-message";
        errorElement.textContent = error.message;

        // Remove any existing error messages
        const existingError = document.querySelector(".error-message");
        if (existingError) existingError.remove();

        this.appendChild(errorElement);

        // Remove error after 5 seconds
        setTimeout(() => {
          errorElement.remove();
        }, 5000);
      }
    });
}

// ===== LOGIN FUNCTIONALITY =====
if (document.getElementById("loginForm")) {
  document
    .getElementById("loginForm")
    .addEventListener("submit", async function (e) {
      e.preventDefault();
      const submitBtn = this.querySelector('button[type="submit"]');
      const originalText = submitBtn.innerHTML;

      // Show loading state
      submitBtn.innerHTML =
        '<i class="fas fa-spinner fa-spin"></i> Logging in...';
      submitBtn.disabled = true;

      // Get form data
      const formData = {
        email: this.elements.email.value,
        password: this.elements.password.value,
        remember: this.elements.remember.checked,
      };
      console.log(formData);

      try {
        // Make API call to login endpoint
        const response = await fetch("https://quizwiz-bcn5.onrender.com/api/login", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        });

        const data = await response.json();
        console.log(data)

        if (!response.ok) {
          throw new Error(data.message || "Login failed");
        }

        // Show success animation
        submitBtn.innerHTML = '<i class="fas fa-check"></i> Welcome Back!';
        submitBtn.style.backgroundColor = "#1dd1a1";

        // Store the token and user data
        localStorage.setItem("email",data.email);
        localStorage.setItem("authToken", data.token);
        localStorage.setItem("unique_id", data.unique_id);
        localStorage.setItem("user", JSON.stringify({ name: data.user }));

        // If "Remember me" is checked, store in localStorage
        if (formData.remember) {
          localStorage.setItem("rememberedEmail", formData.email);
        } else {
          localStorage.removeItem("rememberedEmail");
        }

        // Redirect after delay
        setTimeout(() => {
          window.location.href = "index.html";
        }, 1500);
      } catch (error) {
        // Show error message
        submitBtn.innerHTML = originalText;
        window.location.href = "error.html";
        submitBtn.disabled = false;

        // Display error to user
        const errorElement = document.createElement("div");
        errorElement.className = "error-message";
        errorElement.textContent = error.message;

        // Remove any existing error messages
        const existingError = document.querySelector(".error-message");
        if (existingError) existingError.remove();

        this.appendChild(errorElement);

        // Remove error after 5 seconds
        setTimeout(() => {
          errorElement.remove();
        }, 5000);
      }
    });

  // Check if there's a remembered email
  const rememberedEmail = localStorage.getItem("rememberedEmail");
  if (rememberedEmail) {
    document.getElementById("loginEmail").value = rememberedEmail;
    document.querySelector('input[name="remember"]').checked = true;
  }
}
// Handle response from Google Sign-In
function handleCredentialResponse(response) {
  const idToken = response.credential;
  console.log("Google ID Token:", idToken);

  fetch("https://quizwiz-bcn5.onrender.com/auth/google", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    mode: "cors",
    body: JSON.stringify({ idToken }),
  })
    .then((response) => response.json())

    .then((data) => {
      if(data.email){
        localStorage.setItem("email",data.email);
      }
      console.log(data);
      if (data.jwt && (data.user || data.unique_id)) {
        console.log("JWT:", data.jwt);

        localStorage.setItem("authToken", data.jwt);

        if (data.unique_id) {
          localStorage.setItem("unique_id", data.unique_id);
        }

        if (data.user) {
          localStorage.setItem("user", JSON.stringify({ name: data.user }));
        }

        console.log("Login successful! Data saved to localStorage");
        alert("Login successful!");

        setTimeout(() => {
          window.location.href = "index.html";
        }, 100);
      } else {
        console.error("Invalid response format", data);
        alert("Login failed: Invalid response format");
      }
    })

    .catch((error) => console.error("Error logging in:", error));
}
console.log(response);




