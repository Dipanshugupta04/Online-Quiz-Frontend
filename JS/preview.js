// DOM Elements
const quizTitleEl = document.getElementById('quizTitle');
const quizAuthorEl = document.getElementById('quizAuthor');
const quizDateEl = document.getElementById('quizDate');
const questionCountEl = document.getElementById('questionCount');
const questionsContainerEl = document.getElementById('questionsContainer');
const editBtn = document.getElementById('editBtn');
const publishBtn = document.getElementById('publishBtn');
const userSection = document.getElementById('userSection');
const userDropdown = document.getElementById('userDropdown');
const navUsername = document.getElementById('navUsername');
const uniqueIdDisplay = document.getElementById("uniqueid");

// Get room ID from URL
const urlParams = new URLSearchParams(window.location.search);
const roomId = urlParams.get('roomid') || localStorage.getItem("roomid");
const authToken = localStorage.getItem("authToken");
const unique_id = localStorage.getItem("unique_id");

// Initialize the page
async function init() {
    if (!authToken || !unique_id) {
        window.location.href = '/login.html';
        return;
    }

    if (unique_id && uniqueIdDisplay) {
        uniqueIdDisplay.innerText = `ID: ${unique_id}`;
    }

    try {
        // Load quiz data from API
        const quizData = await fetchQuizData(roomId);
        console.log(quizData);
        // Render quiz data
        renderQuiz(quizData);
        
        // Set up event listeners
        setupEventListeners();
        
        // Load user data
        loadUserData();

    } catch (error) {
        console.error('Error initializing quiz:', error);
        alert('Failed to load quiz. Please try again.');
    window.location.href = `error.html`
        
    }
}

// Fetch quiz data from API
async function fetchQuizData(roomId) {
    const response = await fetch(`http://quizwiz.ap-south-1.elasticbeanstalk.com/api/quizzes/preview/${roomId}`, {
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

// Render quiz data
function renderQuiz(quizData) {
    quizTitleEl.textContent = quizData.title;
    quizAuthorEl.textContent = quizData.userName;
    quizDateEl.textContent = new Date(quizData.createdAt).toLocaleDateString();
    questionCountEl.textContent = quizData.questions.length;
    
    // Render questions
    renderQuestions(quizData.questions);
}

// Render all questions
function renderQuestions(questions) {
    questionsContainerEl.innerHTML = '';
    
    questions.forEach((question, index) => {
        const questionEl = document.createElement('div');
        questionEl.className = 'question-card';
        questionEl.innerHTML = `
            <h3 class="question-text">Q${index + 1}. ${question.questionText}</h3>
            <ul class="options-list">
                ${question.answers.map((answer, optIndex) => `
                    <li class="option-item ${answer.correctAnswer ? 'correct' : ''}">
                        <span class="option-letter">${String.fromCharCode(65 + optIndex)}</span>
                        ${answer.answerText}
                        ${answer.correctAnswer ? '<i class="fas fa-check" style="margin-left: auto; color: var(--success-color);"></i>' : ''}
                    </li>
                `).join('')}
            </ul>
        `;
        questionsContainerEl.appendChild(questionEl);
    });
}

// Set up event listeners
function setupEventListeners() {
    // User dropdown toggle
    userSection.addEventListener('click', function(e) {
        e.stopPropagation();
        userDropdown.classList.toggle('show');
    });

    // Close dropdown when clicking elsewhere
    document.addEventListener('click', function() {
        userDropdown.classList.remove('show');
    });

    // Edit button
    editBtn.addEventListener('click', function() {
        window.location.href = `Edit_questions.html?roomid=${roomId}`;
    });

    // Delete button
    publishBtn.addEventListener('click', async function() {
        if (confirm('Are you sure you want to delete this quiz? This action cannot be undone.')) {
            try {
                const response = await fetch(`http://quizwiz.ap-south-1.elasticbeanstalk.com/api/quizzes/${roomId}`, {
                    method: 'DELETE',
                    headers: {
                        'Authorization': `Bearer ${authToken}`,
                        'Content-Type': 'application/json'
                    }
                });

                if (response.ok) {
                    alert('Quiz deleted successfully!');
                    window.location.href = 'quiz-room.html';
                } else {
                    throw new Error('Failed to delete quiz');
                }
            } catch (error) {
                console.error('Error deleting quiz:', error);
                window.location.href='error.html';
                alert('Failed to delete quiz. Please try again.');
            }
        }
    });

    // Logout
    document.getElementById('logoutBtn')?.addEventListener('click', function(e) {
        e.preventDefault();
        localStorage.removeItem('authToken');
        localStorage.removeItem('user');
        localStorage.removeItem('unique_id');
        localStorage.removeItem("email");
        window.location.href = 'login.html';
    });
}

// Load user data from localStorage
function loadUserData() {
    const userData = localStorage.getItem('user');
    if (userData) {
        try {
            const user = JSON.parse(userData);
            navUsername.textContent = `Welcome, ${user.name || user.username || user || 'User'}`;
        } catch (e) {
            window.location.href='error.html';
            console.error('Error parsing user data:', e);
        }
    }
}

// Initialize the page when DOM is loaded
document.addEventListener('DOMContentLoaded', init);