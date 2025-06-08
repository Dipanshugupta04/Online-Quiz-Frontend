document.addEventListener("DOMContentLoaded", () => {
  // --- Mobile Menu Toggle ---
  const mobileMenu = document.getElementById("mobile-menu");
  const navLinks = document.querySelector(".nav-links");

  mobileMenu?.addEventListener("click", function () {
    this.classList.toggle("active");
    navLinks.classList.toggle("active");
  });

  // --- User Dropdown Toggle ---
  const userSection = document.getElementById("userSection");
  const userDropdown = document.getElementById("userDropdown");

  userSection?.addEventListener("click", function (e) {
    e.stopPropagation();
    userDropdown.classList.toggle("show");
  });

  document.addEventListener("click", function () {
    userDropdown?.classList.remove("show");
  });

  // --- Display Username from localStorage ---
  const userNameSpan = document.getElementById("navUsername");
  const userData = localStorage.getItem("user");

  if (userData) {
    try {
      const user = JSON.parse(userData);
      const name = user.name || user.username || user.fullName || "User";
      userNameSpan.textContent = `Welcome, ${name}`;
    } catch (error) {
      console.error("Failed to parse user data:", error);
      userNameSpan.textContent = "Welcome";
    }
  } else {
    userNameSpan.textContent = "Welcome";
  }

  // Date Validation
  const startDateInput = document.getElementById("startDate");
  const endDateInput = document.getElementById("endDate");

  // Set minimum start date to today
  const today = new Date().toISOString().split("T")[0];
  startDateInput.min = today;

  startDateInput.addEventListener("change", function () {
    // When start date changes, set end date min to the same value
    endDateInput.min = this.value;

    // If end date is before start date, reset it
    if (endDateInput.value && endDateInput.value < this.value) {
      endDateInput.value = this.value;
    }
  });

  // Form Submission
  const examForm = document.getElementById("examForm");
  examForm.addEventListener("submit", async function (e) {
    e.preventDefault();

    // Get form values
    const examName = document.getElementById("examName").value.trim();
    const creatorName = document.getElementById("creatorName").value.trim();
    const durationMinutes = parseInt(
      document.getElementById("examDuration").value
    );
    const startDate = document.getElementById("startDate").value;
    const endDate = document.getElementById("endDate").value;

    // Validate inputs
    if (
      !examName ||
      !creatorName ||
      isNaN(durationMinutes) ||
      !startDate ||
      !endDate
    ) {
      alert("Please fill in all required fields");
      return;
    }

    if (durationMinutes <= 0) {
      alert("Duration must be a positive number");
      return;
    }

    if (endDate < startDate) {
      alert("End date must be on or after start date");
      return;
    }

    // Prepare exam data
    const examData = {
      examName: examName,
      createdBy: creatorName,
      durationMinutes: durationMinutes,
      startDate: startDate,
      endDate: endDate,
    };

    console.log(examName);
    try {
      localStorage.setItem("examName", examData.examName);
      const token = localStorage.getItem("authToken");
      if (!token) {
        alert("Please login first");
        window.location.href = "/HTML/login.html";
        return;
      }

      const response = await fetch("http://localhost:8081/quiz/exam/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(examData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to create exam");
      }

      const result = await response.json();
      const examId = result.examId ||result.id;

      if (examId) {
        console.log("Exam ID:", examId);
        localStorage.setItem("examId", examId);
      } else {
        console.error("Exam ID not found in response");
      }

      alert("Exam created successfully!");
      window.location.href = `/HTML/create-quiz.html?examId=${result.examId}`;
    } catch (error) {
      console.error("Error:", error);
      alert(`Error: ${error.message}`);
    }
  });
});
// --- Global Logout Function ---
function performLogout() {
  localStorage.removeItem("authToken");

  localStorage.removeItem("rememberedEmail");
  localStorage.removeItem("user");
  localStorage.removeItem("examId");
  localStorage.removeItem("examName");
  // Remove other keys if needed
  window.location.href = "/HTML/index.html";
}
const logoutBtn = document.getElementById("logoutBtn");
logoutBtn?.addEventListener("click", function (e) {
  e.preventDefault();
  performLogout();
});
