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
  const id = localStorage.getItem("unique_id");
  const unique_id = document.getElementById("uniqueid"); 
  
  if (id && unique_id) {
      unique_id.innerText = "ID: " + id;
  }
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
      const name = user.name || user.username || user.fullName || user || "User";
      userNameSpan.textContent = `Welcome, ${name}`;
    } catch (error) {
      console.error("Failed to parse user data:", error);
      window.location.href='error.html';
      userNameSpan.textContent = "Welcome";
    }
  } else {
    userNameSpan.textContent = "Welcome";
  }

  // --- Date Validation ---
  const startDateInput = document.getElementById("startDate");
  const endDateInput = document.getElementById("endDate");

  const today = new Date().toISOString().split("T")[0];
  startDateInput.min = today;

  startDateInput.addEventListener("change", function () {
    endDateInput.min = this.value;
    if (endDateInput.value && endDateInput.value < this.value) {
      endDateInput.value = this.value;
    }
  });

  // --- Form Submission ---
  const examForm = document.getElementById("examForm");

  examForm.addEventListener("submit", async function (e) {
    e.preventDefault();

    const examName = document.getElementById("examName").value.trim();
    const creatorName = document.getElementById("creatorName").value.trim();
    const durationMinutes = parseInt(document.getElementById("examDuration").value);
    const startDate = document.getElementById("startDate").value;
    const endDate = document.getElementById("endDate").value;
    const examDescription = document.getElementById("examDescription").value.trim();

    if (!examName || !creatorName || isNaN(durationMinutes) || !startDate || !endDate) {
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

    const examData = {
      examName,
      createdBy: creatorName,
      durationMinutes,
      startDate,
      endDate,
      examDescription
    };

    try {
      localStorage.setItem("examName", examData.examName);
      const token = localStorage.getItem("authToken");

      if (!token) {
        alert("Please login first");
        window.location.href = "/login.html";
        return;
      }
      const uniqueId=localStorage.getItem('unique_id');
      console.log(uniqueId);
      const payload={
        ...examData,
        uniqueId: uniqueId
      };

     
      console.log(payload)
      const response = await fetch("http://localhost:8081/quiz/exam/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to create exam");
      }

      const result = await response.json();
      console.log(result);
      const examId = result.examId || result.id;

      if (examId) {
        localStorage.setItem("examId", examId);
        console.log("Exam ID:", examId);
      } else {
        console.error("Exam ID not found in response");
        alert("Error: Exam ID not found after creation.");
        return;
      }

      const roomResponse = await fetch(`http://localhost:8081/quiz/generate-room/${examId}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          quiz_id: examId,
          exam_d: examId // Optional/redundant
        })
      });

      if (!roomResponse.ok) {
        const errorData = await roomResponse.json();
        throw new Error(errorData.message || "Failed to generate room");
      }

      const roomResult = await roomResponse.json();
      const roomCode = roomResult.roomCode;
      localStorage.setItem("roomid",roomCode);

      if (roomCode) {
        showSuccessPopup(roomCode);
      } else {
        console.error("Room code not found in response");
        alert("Exam created, but room code not generated.");
      }

    } catch (error) {
      console.error("Error:", error);
      window.location.href='error.html';
      alert(`Error: ${error.message}`);
    }
  });

  // --- Show success popup with room code ---
  function showSuccessPopup(roomCode) {
    const popup = document.getElementById("quizPopup");
    const quizLinkSpan = document.getElementById("quizLink");
    const copyLinkBtn = document.querySelector(".copy-link");
    const closePopupBtn = document.getElementById("closePopup"); // This is the button inside the popup

    if (popup && quizLinkSpan && copyLinkBtn && closePopupBtn) { 
      popup.style.display = "flex";
      quizLinkSpan.textContent = `${roomCode}`;

      // Recreate and attach listener for copy link
      const newCopyLinkBtn = copyLinkBtn.cloneNode(true);
      copyLinkBtn.parentNode.replaceChild(newCopyLinkBtn, copyLinkBtn);
      newCopyLinkBtn.addEventListener("click", function () {
        navigator.clipboard.writeText(`${roomCode}`);
        showToast("Link copied to clipboard!", "success");
      });

      // --- Corrected logic for closePopupBtn ---
      // Clone the close button to remove existing listeners (if any were there before)
      const newClosePopupBtn = closePopupBtn.cloneNode(true);
      closePopupBtn.parentNode.replaceChild(newClosePopupBtn, closePopupBtn);

      // Attach a single event listener to the new button
      newClosePopupBtn.addEventListener("click", () => {
        hideSuccessPopup(); // First, hide the popup
        window.location.href = 'create-quiz.html'; // Then, navigate to create-quiz.html
      });

      // Allow clicking outside the popup to close it
      popup.addEventListener("click", function (e) {
        if (e.target === popup) {
          hideSuccessPopup();
        }
      });
    } else {
      console.error("One or more popup elements not found.");
    }
  }

  // --- Hide success popup ---
  function hideSuccessPopup() {
    const popup = document.getElementById("quizPopup");
    if (popup) {
      popup.style.display = "none";
    }
  }

  // --- Show Toast Notification ---
  function showToast(message, type) {
    const toast = document.createElement("div");
    toast.classList.add("toast", type);
    toast.innerHTML = `<i class="fas fa-info-circle"></i> ${message}`;
    document.body.appendChild(toast);

    setTimeout(() => {
      toast.classList.add("show");
    }, 100);

    setTimeout(() => {
      toast.classList.remove("show");
      toast.addEventListener("transitionend", () => toast.remove());
    }, 3000);
  }

  // --- Global Logout Function ---
  function performLogout() {
    localStorage.removeItem("authToken");
    localStorage.removeItem("rememberedEmail");
    localStorage.removeItem("user");
    localStorage.removeItem("examId");
    localStorage.removeItem("email");
    localStorage.removeItem("examName");
    localStorage.removeItem("unique_id");
    window.location.href = "/index.html";
  }

  const logoutBtn = document.getElementById("logoutBtn");
  logoutBtn?.addEventListener("click", function (e) {
    e.preventDefault();
    performLogout();
  });

  // --- My Quiz Redirect ---
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