document.addEventListener('DOMContentLoaded', async function () {
    // Get room ID from URL
    const urlParams = new URLSearchParams(window.location.search);
    const roomId = urlParams.get('roomid');
    const authToken = localStorage.getItem('authToken');

    if (!roomId) {
        alert('No quiz ID provided');
        window.location.href = 'error.html';
        return;
    }

    loadUserData();

    // Load draft if available
    loadDraft();

    try {
        const quizData = await fetchQuizData(roomId, authToken);
        populateForm(quizData);
        console.log(quizData);
    } catch (error) {
        console.error('Error loading quiz:', error);
        alert('Failed to load quiz data');
        window.location.href='error.html';
    }

    setupEventListeners(roomId);
});

// Fetch quiz from server
async function fetchQuizData(roomId, authToken) {
    const response = await fetch(`https://quizwiz.ap-south-1.elasticbeanstalk.com/api/quizzes/preview/${roomId}`, {
        headers: {
            'Authorization': `Bearer ${authToken}`,
            'Content-Type': 'application/json'
        }
    });

    if (!response.ok) {
        throw new Error('Failed to fetch quiz data');
    }

    return await response.json();
}

// Populate quiz form
function populateForm(quizData) {
    document.getElementById('quizTitle').value = quizData.title || '';
    const questionContainer = document.getElementById('questionContainer');
    questionContainer.innerHTML = '';

    quizData.questions.forEach((question, qIndex) => {
        const questionItem = document.createElement('div');
        questionItem.className = 'question-item card-hover';
        questionItem.innerHTML = `
            <div class="question-header">
                <span class="question-number">Question ${qIndex + 1}</span>
                <button type="button" class="delete-question" title="Delete question">
                    <i class="fas fa-trash-alt"></i>
                </button>
            </div>
            <div class="form-group">
                <label><i class="fas fa-question"></i> Question Text</label>
                <textarea placeholder="Enter your question..." required>${question.questionText}</textarea>
            </div>
            <div class="options-group">
                <h3><i class="fas fa-list-ol"></i> Options <span class="hint-text">(Click the checkmark to mark correct answer)</span></h3>
                <div class="options-container">
                    ${question.answers.map((answer, aIndex) => `
                        <div class="option-item">
                            <div class="option-number">${String.fromCharCode(65 + aIndex)}</div>
                            <input type="text" value="${answer.answerText}" placeholder="Option ${aIndex + 1}" required>
                            <button type="button" class="correct-btn ${answer.correctAnswer ? 'selected' : ''}" title="Mark as correct answer">
                                <i class="far ${answer.correctAnswer ? 'fa-check-circle' : 'fa-circle'}"></i>
                            </button>
                            <button type="button" class="remove-option" title="Remove option">
                                <i class="fas fa-times"></i>
                            </button>
                        </div>
                    `).join('')}
                </div>
                <button type="button" class="add-option-btn"><i class="fas fa-plus"></i> Add Another Option</button>
            </div>
        `;
        questionContainer.appendChild(questionItem);
        setupQuestionEvents(questionItem);
    });
}

// Setup events
function setupEventListeners(roomId) {
    document.getElementById('userSection').addEventListener('click', function (e) {
        e.stopPropagation();
        document.getElementById('userDropdown').classList.toggle('show');
    });

    document.addEventListener('click', function () {
        document.getElementById('userDropdown').classList.remove('show');
    });

    document.getElementById('logoutBtn').addEventListener('click', function (e) {
        e.preventDefault();
        localStorage.removeItem('authToken');
        localStorage.removeItem('user');
        window.location.href = 'login.html';
    });

    document.getElementById('quizForm').addEventListener('submit', async function (e) {
        e.preventDefault();
        await updateQuiz(roomId);
    });

    document.getElementById('addQuestion').addEventListener('click', addNewQuestion);
    document.getElementById('saveDraft').addEventListener('click', saveDraft);
}

// Add new question
function addNewQuestion() {
    const questionContainer = document.getElementById('questionContainer');
    const questionCount = questionContainer.children.length + 1;

    const questionItem = document.createElement('div');
    questionItem.className = 'question-item card-hover';
    questionItem.innerHTML = `
        <div class="question-header">
            <span class="question-number">Question ${questionCount}</span>
            <button type="button" class="delete-question" title="Delete question">
                <i class="fas fa-trash-alt"></i>
            </button>
        </div>
        <div class="form-group">
            <label><i class="fas fa-question"></i> Question Text</label>
            <textarea placeholder="Enter your question..." required></textarea>
        </div>
        <div class="options-group">
            <h3><i class="fas fa-list-ol"></i> Options <span class="hint-text">(Click the checkmark to mark correct answer)</span></h3>
            <div class="options-container">
                <div class="option-item">
                    <div class="option-number">A</div>
                    <input type="text" placeholder="Option 1" required>
                    <button type="button" class="correct-btn" title="Mark as correct answer"><i class="far fa-circle"></i></button>
                    <button type="button" class="remove-option" title="Remove option"><i class="fas fa-times"></i></button>
                </div>
                <div class="option-item">
                    <div class="option-number">B</div>
                    <input type="text" placeholder="Option 2" required>
                    <button type="button" class="correct-btn" title="Mark as correct answer"><i class="far fa-circle"></i></button>
                    <button type="button" class="remove-option" title="Remove option"><i class="fas fa-times"></i></button>
                </div>
            </div>
            <button type="button" class="add-option-btn"><i class="fas fa-plus"></i> Add Another Option</button>
        </div>
    `;
    questionContainer.appendChild(questionItem);
    setupQuestionEvents(questionItem);
}

// Event setup for each question
function setupQuestionEvents(questionItem) {
    const optionsContainer = questionItem.querySelector('.options-container');

    const updateOptionLetters = () => {
        optionsContainer.querySelectorAll('.option-item').forEach((opt, i) => {
            opt.querySelector('.option-number').textContent = String.fromCharCode(65 + i);
        });
    };

    questionItem.querySelectorAll('.correct-btn').forEach(btn => {
        btn.addEventListener('click', function () {
            const questionEl = this.closest('.question-item');
            questionEl.querySelectorAll('.correct-btn').forEach(b => {
                b.classList.remove('selected');
                b.querySelector('i').classList.replace('fa-check-circle', 'fa-circle');
            });
            this.classList.add('selected');
            this.querySelector('i').classList.replace('fa-circle', 'fa-check-circle');
        });
    });

    questionItem.querySelector('.delete-question').addEventListener('click', function () {
        if (confirm('Are you sure you want to delete this question?')) {
            questionItem.remove();
            document.querySelectorAll('.question-number').forEach((el, index) => {
                el.textContent = `Question ${index + 1}`;
            });
        }
    });

    questionItem.querySelectorAll('.remove-option').forEach(btn => {
        btn.addEventListener('click', function () {
            const item = this.closest('.option-item');
            if (optionsContainer.querySelectorAll('.option-item').length > 1) {
                item.remove();
                updateOptionLetters();
            } else {
                alert('Each question must have at least one option');
            }
        });
    });

    questionItem.querySelector('.add-option-btn').addEventListener('click', function () {
        const count = optionsContainer.querySelectorAll('.option-item').length;
        const optionLetter = String.fromCharCode(65 + count);

        const optionItem = document.createElement('div');
        optionItem.className = 'option-item';
        optionItem.innerHTML = `
            <div class="option-number">${optionLetter}</div>
            <input type="text" placeholder="Option ${count + 1}" required>
            <button type="button" class="correct-btn" title="Mark as correct answer"><i class="far fa-circle"></i></button>
            <button type="button" class="remove-option" title="Remove option"><i class="fas fa-times"></i></button>
        `;
        optionsContainer.appendChild(optionItem);
        setupQuestionEvents(questionItem);
    });
}

// Update quiz via API
async function updateQuiz(roomId) {
    const authToken = localStorage.getItem('authToken');
    const title = document.getElementById('quizTitle').value.trim();

    if (!title) {
        alert('Please enter a quiz title');
        return;
    }

    const questions = [];
    let isValid = true;

    document.querySelectorAll('.question-item').forEach((questionEl, qIndex) => {
        const questionText = questionEl.querySelector('textarea').value.trim();
        if (!questionText) {
            alert(`Question ${qIndex + 1} cannot be empty`);
            isValid = false;
            return;
        }

        const answers = [];
        let hasCorrect = false;

        questionEl.querySelectorAll('.option-item').forEach((optionEl, aIndex) => {
            const answerText = optionEl.querySelector('input').value.trim();
            if (!answerText) {
                alert(`Option ${aIndex + 1} in Question ${qIndex + 1} cannot be empty`);
                isValid = false;
                return;
            }
            const isCorrect = optionEl.querySelector('.correct-btn').classList.contains('selected');
            if (isCorrect) hasCorrect = true;
            answers.push({ answerText, correctAnswer: isCorrect });
        });

        if (!hasCorrect) {
            alert(`Question ${qIndex + 1} must have a correct answer`);
            isValid = false;
            return;
        }

        questions.push({ questionText, answers });
    });

    if (!isValid) return;

    try {
        const response = await fetch(`https://quizwiz.ap-south-1.elasticbeanstalk.com/quiz/update-by-question/${roomId}`, {
            method: 'PUT',
            headers: {
                'Authorization': `Bearer ${authToken}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ title, questions })
        });

        if (!response.ok) {
            let errorText = 'Failed to update quiz';
        
            // Attempt to read as text only once
            const errorBody = await response.text();
        
            try {
                const errorData = JSON.parse(errorBody); // Try to parse as JSON
                errorText = errorData.message || errorText;
            } catch (e) {
                // If it's not JSON, keep plain text
                errorText = errorBody || errorText;
            }
        
            throw new Error(errorText);
        }
        
        

        alert('Quiz updated successfully!');
        localStorage.removeItem('quizDraft');
        window.location.href = `preview.html?roomid=${roomId}`;
    } catch (error) {
        window.location.href='error.html';
        alert('Failed to update quiz: ' + error.message);
    }
}

// Save draft to localStorage
function saveDraft() {
    const title = document.getElementById('quizTitle').value.trim();
    const questions = [];

    document.querySelectorAll('.question-item').forEach((questionEl) => {
        const questionText = questionEl.querySelector('textarea').value.trim();
        const answers = [];

        questionEl.querySelectorAll('.option-item').forEach((optionEl) => {
            const answerText = optionEl.querySelector('input').value.trim();
            const isCorrect = optionEl.querySelector('.correct-btn').classList.contains('selected');
            answers.push({ answerText, correctAnswer: isCorrect });
        });

        questions.push({ questionText, answers });
    });

    const draft = { title, questions };
    localStorage.setItem('quizDraft', JSON.stringify(draft));
    showToast("Quiz Save in Draft   successfully!", "success");
}

// Load draft if available
function loadDraft() {
    const draft = localStorage.getItem('quizDraft');
    if (draft) {
        try {
            const { title, questions } = JSON.parse(draft);
            document.getElementById('quizTitle').value = title;
            populateForm({ title, questions });
        } catch (e) {
            window.location.href='error.html';
            console.error('Failed to load draft:', e);
        }
    }
}

// Load user info from localStorage
function loadUserData() {
    const userData = localStorage.getItem('user');
    const unique_id = localStorage.getItem('unique_id');

    if (userData) {
        try {
            const user = JSON.parse(userData);
            const name = user.name || user.username || 'User';
            document.getElementById('navUsername').innerText = `Welcome, ${name}`;
        } catch (e) {
            window.location.href='error.html';
            console.error('Error parsing user data:', e);
        }
    }

    if (unique_id) {
        document.getElementById('uniqueid').textContent += `ID: ${unique_id}`;
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
  