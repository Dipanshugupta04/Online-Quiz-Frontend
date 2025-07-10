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
    const name = user.name || user.username || user.fullName || "User";
    userNameSpan.textContent = `Welcome, ${name}`;
  } catch (error) {
    console.error("Failed to parse user data:", error);
    window.location.href='error.html';
    userNameSpan.textContent = "Welcome";
  }
} else {
  userNameSpan.textContent = "Welcome";
}

document.addEventListener("DOMContentLoaded", function () {
  // Mobile menu toggle
  const mobileMenu = document.getElementById("mobile-menu");
  const navLinks = document.querySelector(".nav-links");

  mobileMenu.addEventListener("click", function () {
    this.classList.toggle("active");
    navLinks.classList.toggle("active");
  });

  // Initialize with one question
  addNewQuestion();

  // Add question button
  const addQuestionBtn = document.getElementById("addQuestion");
  addQuestionBtn.addEventListener("click", addNewQuestion);

  // Save draft button
  const saveDraftBtn = document.getElementById("saveDraft");
  saveDraftBtn.addEventListener("click", function () {
    showToast("Draft saved successfully!", "success");
  });

  // Form submission
  const quizForm = document.getElementById("quizForm");
  quizForm.addEventListener("submit", function (e) {
    e.preventDefault();
    validateAndSubmitQuiz();
  });
});

// Add a new question to the form
function addNewQuestion() {
  const questionContainer = document.getElementById("questionContainer");
  const questionCount = questionContainer.children.length + 1;

  const questionItem = document.createElement("div");
  questionItem.className = "question-item card-hover";
  questionItem.innerHTML = `
    <div class="question-header">
      <span class="question-number">Question ${questionCount}</span>
      <button class="delete-question" title="Delete question"><i class="fas fa-trash-alt"></i></button>
    </div>
    <div class="form-group">
      <label for="question${questionCount}"><i class="fas fa-question"></i> Question Text</label>
      <textarea id="question${questionCount}" placeholder="Enter your question..." required></textarea>
    </div>
    <div class="options-group">
      <h3><i class="fas fa-list-ol"></i> Options <span class="hint-text">(Click the checkmark to mark correct answer)</span></h3>
      <div class="option-item">
        <div class="option-number">A</div>
        <input type="text" placeholder="Option 1" required>
        <button class="correct-btn" title="Mark as correct answer"><i class="far fa-check-circle"></i></button>
        <button class="remove-option" title="Remove option"><i class="fas fa-times"></i></button>
      </div>
      <div class="option-item">
        <div class="option-number">B</div>
        <input type="text" placeholder="Option 2" required>
        <button class="correct-btn" title="Mark as correct answer"><i class="far fa-circle"></i></button>
        <button class="remove-option" title="Remove option"><i class="fas fa-times"></i></button>
      </div>
      <button class="add-option-btn"><i class="fas fa-plus"></i> Add Another Option</button>
    </div>
  `;

  questionContainer.appendChild(questionItem);
  setupQuestionEvents(questionItem);
  questionItem.scrollIntoView({ behavior: "smooth", block: "nearest" });
}

// Set up event listeners for a question element
function setupQuestionEvents(questionItem) {
  const deleteBtn = questionItem.querySelector(".delete-question");
  deleteBtn.addEventListener("click", function () {
    if (document.querySelectorAll(".question-item").length > 1) {
      questionItem.remove();
      updateQuestionNumbers();
    } else {
      showToast("You need at least one question!", "error");
    }
  });

  const correctBtns = questionItem.querySelectorAll(".correct-btn");
  correctBtns.forEach((btn) => {
    btn.addEventListener("click", function (e) {
      e.preventDefault();
      questionItem.querySelectorAll(".correct-btn").forEach((b) => {
        b.classList.remove("selected");
        b.innerHTML = '<i class="far fa-circle"></i>';
      });
      this.classList.add("selected");
      this.innerHTML = '<i class="far fa-check-circle"></i>';
    });
  });

  const addOptionBtn = questionItem.querySelector(".add-option-btn");
  addOptionBtn.addEventListener("click", function (e) {
    e.preventDefault();
    addNewOption(questionItem);
  });

  const removeOptionBtns = questionItem.querySelectorAll(".remove-option");
  removeOptionBtns.forEach((btn) => {
    btn.addEventListener("click", function (e) {
      e.preventDefault();
      if (questionItem.querySelectorAll(".option-item").length > 2) {
        this.parentElement.remove();
        updateOptionNumbers(questionItem);
      } else {
        showToast("You need at least two options!", "error");
      }
    });
  });
}

// Add a new option to a question
function addNewOption(questionItem) {
  const optionsGroup = questionItem.querySelector(".options-group");
  const optionCount = questionItem.querySelectorAll(".option-item").length;
  const optionLetters = ["A", "B", "C", "D", "E", "F", "G", "H"];

  if (optionCount >= 8) {
    showToast("Maximum of 8 options allowed", "error");
    return;
  }

  const optionItem = document.createElement("div");
  optionItem.className = "option-item";
  optionItem.innerHTML = `
    <div class="option-number">${optionLetters[optionCount]}</div>
    <input type="text" placeholder="Option ${optionCount + 1}" required>
    <button class="correct-btn" title="Mark as correct answer"><i class="far fa-circle"></i></button>
    <button class="remove-option" title="Remove option"><i class="fas fa-times"></i></button>
  `;

  optionsGroup.insertBefore(optionItem, questionItem.querySelector(".add-option-btn"));

  const correctBtn = optionItem.querySelector(".correct-btn");
  correctBtn.addEventListener("click", function (e) {
    e.preventDefault();
    questionItem.querySelectorAll(".correct-btn").forEach((b) => {
      b.classList.remove("selected");
      b.innerHTML = '<i class="far fa-circle"></i>';
    });
    this.classList.add("selected");
    this.innerHTML = '<i class="far fa-check-circle"></i>';
  });

  const removeBtn = optionItem.querySelector(".remove-option");
  removeBtn.addEventListener("click", function (e) {
    e.preventDefault();
    if (questionItem.querySelectorAll(".option-item").length > 2) {
      optionItem.remove();
      updateOptionNumbers(questionItem);
    } else {
      showToast("You need at least two options!", "error");
    }
  });
}

// Update question numbers after deletion
function updateQuestionNumbers() {
  const questions = document.querySelectorAll(".question-item");
  questions.forEach((question, index) => {
    const questionNumber = question.querySelector(".question-number");
    questionNumber.textContent = `Question ${index + 1}`;
  });
}

// Update option letters after deletion
function updateOptionNumbers(questionItem) {
  const optionItems = questionItem.querySelectorAll(".option-item");
  const optionLetters = ["A", "B", "C", "D", "E", "F", "G", "H"];

  optionItems.forEach((item, index) => {
    const optionNumber = item.querySelector(".option-number");
    optionNumber.textContent = optionLetters[index];
  });
}

// Prepare quiz data for API submission
function prepareQuizData() {
  const examName = localStorage.getItem("examName");
  const userData = localStorage.getItem("user");
  const roomid=localStorage.getItem("roomid")
  let user = "Anonymous";
  
  try {
    if (userData) {
      user = JSON.parse(userData).name || "Anonymous";
    }
    
    const quizTitle = examName || "Untitled Quiz";
    const questions = [];
    const questionElements = document.querySelectorAll(".question-item");

    questionElements.forEach((questionEl) => {
      const questionText = questionEl.querySelector("textarea")?.value.trim();
      if (!questionText) return;

      const answers = [];
      const optionItems = questionEl.querySelectorAll(".option-item");
      let hasCorrectAnswer = false;

      optionItems.forEach((optionEl) => {
        const input = optionEl.querySelector("input");
        const val = input?.value.trim();
        if (val) {
          const isCorrect = optionEl.querySelector(".correct-btn.selected") !== null;
          answers.push({
            answerText: val,
            correctAnswer: isCorrect
          });
          
          if (isCorrect) {
            hasCorrectAnswer = true;
          }
        }
      });

      if (answers.length < 2 || !hasCorrectAnswer) {
        console.warn("Skipping invalid question - needs at least 2 options and one correct answer");
        return;
      }

      questions.push({
        questionText: questionText,
        answers: answers
      });
    });

    if (questions.length === 0) {
      throw new Error("No valid questions were added");
    }

    return {
      roomid:roomid,
      userName: user,
      title: quizTitle,
      questions: questions,
    };
  } catch (error) {
    console.error("Error preparing quiz data:", error);
    window.location.href='error.html';
    throw new Error("Failed to prepare quiz: " + error.message);
  }
}

// Validate and submit the quiz
async function validateAndSubmitQuiz() {
  const submitBtn = document.getElementById("submitQuiz");
  if (!submitBtn) {
    console.error("Submit button not found");
    return;
  }

  const originalBtnText = submitBtn.innerHTML;

  try {
    // Show loading state
    submitBtn.disabled = true;
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Submitting...';

    // Basic validation
    const questionElements = document.querySelectorAll(".question-item");
    let isValid = true;

    questionElements.forEach((questionEl, index) => {
      const questionText = questionEl.querySelector("textarea")?.value.trim();
      if (!questionText) {
        questionEl.querySelector("textarea")?.focus();
        showToast(`Question ${index + 1} needs text`, "error");
        isValid = false;
        return;
      }

      const options = questionEl.querySelectorAll(".option-item input");
      let validOptions = 0;
      options.forEach((opt) => {
        if (!opt.value.trim()) {
          opt.focus();
          showToast(`Question ${index + 1} has empty options`, "error");
          isValid = false;
          return;
        }
        validOptions++;
      });

      if (validOptions < 2) {
        showToast(`Question ${index + 1} needs at least 2 options`, "error");
        isValid = false;
        return;
      }

      if (!questionEl.querySelector(".correct-btn.selected")) {
        showToast(`Question ${index + 1} needs a correct answer`, "error");
        isValid = false;
        return;
      }
    });

    if (!isValid) {
      throw new Error("Please fix the validation errors");
    }

    // Prepare and validate data
    const quizData = prepareQuizData();
    console.log("Quiz data to submit:", quizData);

    const token = localStorage.getItem("authToken") || localStorage.getItem("token");
    if (!token) {
      throw new Error("Please log in to create quizzes");
    }

    // Create the quiz
    const createResponse = await fetch("http://quizwiz.ap-south-1.elasticbeanstalk.com/quiz/create", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(quizData),
    });

    if (!createResponse.ok) {
      const error = await createResponse.json().catch(() => ({}));
      throw new Error(error.message || "Failed to create quiz");
    }

    const createData = await createResponse.json();
    console.log("Quiz creation response:", createData);
    
    // Store the quiz ID for future use
    localStorage.setItem("currentQuizId", createData.quizId || createData.id);
    
    // Show success message
    showToast("Quiz created successfully!", "success");

    
    // Optionally redirect to another page
    setTimeout(()=>{
      window.location.href = "dashboard.html";
    },1500);
    

  } catch (error) {
    console.error("Quiz submission failed:", error);
    window.location.href='error.html';
    showToast(error.message || "Submission failed. Please try again.", "error");
  } finally {
    submitBtn.disabled = false;
    submitBtn.innerHTML = originalBtnText;
  }
}

// Show toast notification
function showToast(message, type = "success") {
  const toast = document.createElement("div");
  toast.className = `toast ${type}`;
  toast.innerHTML = `
    <i class="fas ${type === "success" ? "fa-check-circle" : "fa-exclamation-circle"}"></i>
    <span>${message}</span>
  `;
  document.body.appendChild(toast);
  
  setTimeout(() => {
    toast.classList.add("show");
  }, 10);
  
  setTimeout(() => {
    toast.classList.remove("show");
    setTimeout(() => {
      toast.remove();
    }, 300);
  }, 3000);
}

// Global Logout
function performLogout() {
  localStorage.removeItem("authToken");
  localStorage.removeItem("rememberedEmail");
  localStorage.removeItem("user");
  localStorage.removeItem("email");
  localStorage.removeItem("examId");
  localStorage.removeItem("examName");
  localStorage.removeItem("unique_id");
  window.location.href = "index.html";
}

const logoutBtn = document.getElementById("logoutBtn");
logoutBtn?.addEventListener("click", function (e) {
  e.preventDefault();
  performLogout();
});

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
