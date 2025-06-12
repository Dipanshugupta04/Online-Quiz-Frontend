document.addEventListener('DOMContentLoaded', async function() {
    // Get room ID from URL
    const urlParams = new URLSearchParams(window.location.search);
    const roomId = urlParams.get('roomid');
    const authToken = localStorage.getItem('authToken');
    
    if (!roomId) {
        alert('No quiz ID provided');
        window.location.href = 'my-quizzes.html';
        return;
    }

    // Load user data
    loadUserData();
    
    // Fetch quiz data from API
    try {
        const quizData = await fetchQuizData(roomId, authToken);
        populateForm(quizData);
    } catch (error) {
        console.error('Error loading quiz:', error);
        alert('Failed to load quiz data');
        window.location.href = 'my-quizzes.html';
    }

    // Set up event listeners
    setupEventListeners(roomId);
});

async function fetchQuizData(roomId, authToken) {
    const response = await fetch(`http://localhost:8081/api/quizzes/preview/${roomId}`, {
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

function populateForm(quizData) {
    // Set quiz title
    document.getElementById('quizTitle').innerText = quizData.title || '';
    
    // Add questions to form
    const questionContainer = document.getElementById('questionContainer');
    questionContainer.innerHTML = '';
    
    quizData.questions.forEach((question, qIndex) => {
        const questionId = `question${qIndex + 1}`;
        const questionEl = document.createElement('div');
        questionEl.className = 'question-item card-hover';
        questionEl.innerHTML = `
            <div class="question-header">
                <span class="question-number">Question ${qIndex + 1}</span>
                <button class="delete-question" title="Delete question">
                    <i class="fas fa-trash-alt"></i>
                </button>
            </div>
            <div class="form-group">
                <label for="${questionId}"><i class="fas fa-question"></i> Question Text</label>
                <textarea id="${questionId}" placeholder="Enter your question..." required>${question.questionText}</textarea>
            </div>
            <div class="options-group">
                <h3><i class="fas fa-list-ol"></i> Options <span class="hint-text">(Click the checkmark to mark correct answer)</span></h3>
                <div id="optionsContainer${qIndex + 1}">
                    <!-- Options will be added here -->
                </div>
                <button class="add-option-btn"><i class="fas fa-plus"></i> Add Another Option</button>
            </div>
        `;
        questionContainer.appendChild(questionEl);
        
        // Add options to question
        const optionsContainer = document.getElementById(`optionsContainer${qIndex + 1}`);
        question.answers.forEach((answer, aIndex) => {
            const optionId = `question${qIndex + 1}_option${aIndex + 1}`;
            const optionEl = document.createElement('div');
            optionEl.className = 'option-item';
            optionEl.innerHTML = `
                <div class="option-number">${String.fromCharCode(65 + aIndex)}</div>
                <input type="text" id="${optionId}" value="${answer.answerText}" placeholder="Option ${aIndex + 1}" required>
                <button class="correct-btn ${answer.correctAnswer ? 'selected' : ''}" title="Mark as correct answer">
                    <i class="far ${answer.correctAnswer ? 'fa-check-circle' : 'fa-circle'}"></i>
                </button>
                <button class="remove-option" title="Remove option">
                    <i class="fas fa-times"></i>
                </button>
            `;
            optionsContainer.appendChild(optionEl);
        });
    });
}

function loadUserData() {
    const userData = localStorage.getItem('user');
    const unique_id = localStorage.getItem('unique_id');
    
    if (userData) {
        try {
            const user = JSON.parse(userData);
            const username=document.getElementById('navUsername') 
            const name=user.name || user.username || 'User';
            if(name!=null){
                username.innerText="Welcome, "+name;
            }
        } catch (e) {
            console.error('Error parsing user data:', e);
        }
    }
    
    if (unique_id) {
        document.getElementById('uniqueid').textContent += `ID: ${unique_id}`;
    }
}

function setupEventListeners(roomId) {
    // User dropdown toggle
    document.getElementById('userSection').addEventListener('click', function(e) {
        e.stopPropagation();
        document.getElementById('userDropdown').classList.toggle('show');
    });

    // Close dropdown when clicking elsewhere
    document.addEventListener('click', function() {
        document.getElementById('userDropdown').classList.remove('show');
    });

    // Logout
    document.getElementById('logoutBtn').addEventListener('click', function(e) {
        e.preventDefault();
        localStorage.removeItem('authToken');
        localStorage.removeItem('user');
        window.location.href = 'login.html';
    });

    // Form submission
    document.getElementById('quizForm').addEventListener('submit', async function(e) {
        e.preventDefault();
        await updateQuiz(roomId);
    });

    // Add question button
    document.getElementById('addQuestion').addEventListener('click', addNewQuestion);
}

async function updateQuiz(roomId) {
    const authToken = localStorage.getItem('authToken');
    const quizTitle = document.getElementById('quizTitle').value;
    const questions = [];
    
    // Collect all questions and options
    document.querySelectorAll('.question-item').forEach((questionEl, qIndex) => {
        const questionText = questionEl.querySelector('textarea').value;
        const answers = [];
        
        questionEl.querySelectorAll('.option-item').forEach((optionEl, aIndex) => {
            const optionText = optionEl.querySelector('input').value;
            const isCorrect = optionEl.querySelector('.correct-btn.selected') !== null;
            
            answers.push({
                answerText: optionText,
                correctAnswer: isCorrect
            });
        });
        
        questions.push({
            questionText,
            answers
        });
    });
    
    try {
        const response = await fetch(`http://localhost:8081/api/quizzes/${roomId}`, {
            method: 'PUT',
            headers: {
                'Authorization': `Bearer ${authToken}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                title: quizTitle,
                questions: questions
            })
        });
        
        if (response.ok) {
            alert('Quiz updated successfully!');
            window.location.href = 'my-quizzes.html';
        } else {
            throw new Error('Failed to update quiz');
        }
    } catch (error) {
        console.error('Error updating quiz:', error);
        alert('Failed to update quiz: ' + error.message);
    }
}

// Function to add new question (same as in create-quiz.js)
function addNewQuestion() {
    const questionContainer = document.getElementById('questionContainer');
    const questionCount = questionContainer.children.length + 1;
    
    const questionItem = document.createElement('div');
    questionItem.className = 'question-item card-hover';
    questionItem.innerHTML = `
        <div class="question-header">
            <span class="question-number">Question ${questionCount}</span>
            <button class="delete-question" title="Delete question">
                <i class="fas fa-trash-alt"></i>
            </button>
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
                <button class="correct-btn" title="Mark as correct answer">
                    <i class="far fa-check-circle"></i>
                </button>
                <button class="remove-option" title="Remove option">
                    <i class="fas fa-times"></i>
                </button>
            </div>
            <div class="option-item">
                <div class="option-number">B</div>
                <input type="text" placeholder="Option 2" required>
                <button class="correct-btn" title="Mark as correct answer">
                    <i class="far fa-circle"></i>
                </button>
                <button class="remove-option" title="Remove option">
                    <i class="fas fa-times"></i>
                </button>
            </div>
            <button class="add-option-btn"><i class="fas fa-plus"></i> Add Another Option</button>
        </div>
    `;
    
    questionContainer.appendChild(questionItem);
    setupQuestionEvents(questionItem);
}

// Function to setup question events (same as in create-quiz.js)
function setupQuestionEvents(questionItem) {
    // Add event listeners for delete, correct answer selection, etc.
    // (Implementation would be similar to your create-quiz.js)
}