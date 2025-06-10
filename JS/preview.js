// Sample quiz data
const quizData = {
    title: "World Geography Challenge",
    author: "Alex Johnson",
    date: "June 15, 2023",
    questions: [
        {
            text: "What is the capital of France?",
            options: [
                { text: "London", correct: false },
                { text: "Berlin", correct: false },
                { text: "Paris", correct: true },
                { text: "Madrid", correct: false }
            ]
        },
        {
            text: "Which river is the longest in the world?",
            options: [
                { text: "Amazon", correct: false },
                { text: "Nile", correct: true },
                { text: "Yangtze", correct: false },
                { text: "Mississippi", correct: false }
            ]
        },
        {
            text: "Which country has the largest population?",
            options: [
                { text: "India", correct: false },
                { text: "United States", correct: false },
                { text: "China", correct: true },
                { text: "Indonesia", correct: false }
            ]
        }
    ]
};

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

// Initialize the page
function init() {
    // Load quiz data
    quizTitleEl.textContent = quizData.title;
    quizAuthorEl.textContent = quizData.author;
    quizDateEl.textContent = quizData.date;
    questionCountEl.textContent = quizData.questions.length;
    
    // Render questions
    renderQuestions();
    
    // Set up event listeners
    setupEventListeners();
    
    // Load user data
    loadUserData();
}

// Render all questions
function renderQuestions() {
    questionsContainerEl.innerHTML = '';
    
    quizData.questions.forEach((question, index) => {
        const questionEl = document.createElement('div');
        questionEl.className = 'question-card';
        questionEl.innerHTML = `
            <h3 class="question-text">Q${index + 1}. ${question.text}</h3>
            <ul class="options-list">
                ${question.options.map((option, optIndex) => `
                    <li class="option-item ${option.correct ? 'correct' : ''}">
                        <span class="option-letter">${String.fromCharCode(65 + optIndex)}</span>
                        ${option.text}
                        ${option.correct ? '<i class="fas fa-check" style="margin-left: auto; color: var(--success-color);"></i>' : ''}
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

    // Button actions
    editBtn.addEventListener('click', function() {
        alert('Edit quiz functionality would go here');
        // window.location.href = 'edit-quiz.html?id=123';
    });

    publishBtn.addEventListener('click', function() {
        alert('Publish quiz functionality would go here');
        // Typically would make an API call to publish the quiz
    });

    // Logout
    document.getElementById('logoutBtn')?.addEventListener('click', function(e) {
        e.preventDefault();
        localStorage.removeItem('authToken');
        localStorage.removeItem('user');
        window.location.href = 'login.html';
    });
}

// Load user data from localStorage
function loadUserData() {
    const userData = localStorage.getItem('user');
    if (userData) {
        try {
            const user = JSON.parse(userData);
            navUsername.textContent = `Welcome, ${user.name || user.username || 'User'}`;
        } catch (e) {
            console.error('Error parsing user data:', e);
        }
    }
}

// Initialize the page when DOM is loaded
document.addEventListener('DOMContentLoaded', init);