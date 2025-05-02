document.addEventListener('DOMContentLoaded', function() {
    // Mobile menu toggle
    const mobileMenu = document.getElementById('mobile-menu');
    const navLinks = document.querySelector('.nav-links');
    
    mobileMenu.addEventListener('click', function() {
        this.classList.toggle('active');
        navLinks.classList.toggle('active');
    });
    
    // Initialize with one question
    addNewQuestion();
    
    // Add question button
    const addQuestionBtn = document.getElementById('addQuestion');
    addQuestionBtn.addEventListener('click', addNewQuestion);
    
    // Save draft button
    const saveDraftBtn = document.getElementById('saveDraft');
    saveDraftBtn.addEventListener('click', function() {
        showToast('Draft saved successfully!', 'success');
    });
    
    // Form submission
    const quizForm = document.getElementById('quizForm');
    quizForm.addEventListener('submit', function(e) {
        e.preventDefault();
        validateAndSubmitQuiz();
    });
    
    // Popup close buttons
    const closePopup = document.querySelector('.close');
    const closePopupBtn = document.getElementById('closePopup');
    const popup = document.getElementById('quizPopup');
    
    closePopup.addEventListener('click', function() {
        popup.style.display = 'none';
    });
    
    closePopupBtn.addEventListener('click', function() {
        popup.style.display = 'none';
    });
    
    // View quiz button
    const viewQuizBtn = document.getElementById('viewQuiz');
    viewQuizBtn.addEventListener('click', function() {
        showToast('This would navigate to the quiz page in a real app', 'success');
    });
    
    // Copy link button
    const copyLinkBtn = document.querySelector('.copy-link');
    copyLinkBtn.addEventListener('click', function() {
        const quizLink = document.getElementById('quizLink').textContent;
        navigator.clipboard.writeText(quizLink);
        showToast('Link copied to clipboard!', 'success');
    });
});

// Add a new question to the form
function addNewQuestion() {
    const questionContainer = document.getElementById('questionContainer');
    const questionCount = questionContainer.children.length + 1;
    
    const questionItem = document.createElement('div');
    questionItem.className = 'question-item card-hover';
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
    
    // Add event listeners for the new question
    setupQuestionEvents(questionItem);
    
    // Scroll to the new question
    questionItem.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

// Set up event listeners for a question element
function setupQuestionEvents(questionItem) {
    // Delete question button
    const deleteBtn = questionItem.querySelector('.delete-question');
    deleteBtn.addEventListener('click', function() {
        if (document.querySelectorAll('.question-item').length > 1) {
            questionItem.remove();
            updateQuestionNumbers();
        } else {
            showToast('You need at least one question!', 'error');
        }
    });
    
    // Correct answer buttons
    const correctBtns = questionItem.querySelectorAll('.correct-btn');
    correctBtns.forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.preventDefault();
            // Remove selected class from all buttons in this question
            questionItem.querySelectorAll('.correct-btn').forEach(b => {
                b.classList.remove('selected');
                b.innerHTML = '<i class="far fa-circle"></i>';
            });
            
            // Add selected class to clicked button
            this.classList.add('selected');
            this.innerHTML = '<i class="far fa-check-circle"></i>';
        });
    });
    
    // Add option button
    const addOptionBtn = questionItem.querySelector('.add-option-btn');
    addOptionBtn.addEventListener('click', function(e) {
        e.preventDefault();
        addNewOption(questionItem);
    });
    
    // Remove option buttons
    const removeOptionBtns = questionItem.querySelectorAll('.remove-option');
    removeOptionBtns.forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.preventDefault();
            if (questionItem.querySelectorAll('.option-item').length > 2) {
                this.parentElement.remove();
                updateOptionNumbers(questionItem);
            } else {
                showToast('You need at least two options!', 'error');
            }
        });
    });
}

// Add a new option to a question
function addNewOption(questionItem) {
    const optionsGroup = questionItem.querySelector('.options-group');
    const optionCount = questionItem.querySelectorAll('.option-item').length;
    const optionLetters = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'];
    
    if (optionCount >= 8) {
        showToast('Maximum of 8 options allowed', 'error');
        return;
    }
    
    const optionItem = document.createElement('div');
    optionItem.className = 'option-item';
    optionItem.innerHTML = `
        <div class="option-number">${optionLetters[optionCount]}</div>
        <input type="text" placeholder="Option ${optionCount + 1}" required>
        <button class="correct-btn" title="Mark as correct answer"><i class="far fa-circle"></i></button>
        <button class="remove-option" title="Remove option"><i class="fas fa-times"></i></button>
    `;
    
    // Insert before the add option button
    optionsGroup.insertBefore(optionItem, questionItem.querySelector('.add-option-btn'));
    
    // Add event listeners for the new option
    const correctBtn = optionItem.querySelector('.correct-btn');
    correctBtn.addEventListener('click', function(e) {
        e.preventDefault();
        // Remove selected class from all buttons in this question
        questionItem.querySelectorAll('.correct-btn').forEach(b => {
            b.classList.remove('selected');
            b.innerHTML = '<i class="far fa-circle"></i>';
        });
        
        // Add selected class to clicked button
        this.classList.add('selected');
        this.innerHTML = '<i class="far fa-check-circle"></i>';
    });
    
    const removeBtn = optionItem.querySelector('.remove-option');
    removeBtn.addEventListener('click', function(e) {
        e.preventDefault();
        if (questionItem.querySelectorAll('.option-item').length > 2) {
            optionItem.remove();
            updateOptionNumbers(questionItem);
        } else {
            showToast('You need at least two options!', 'error');
        }
    });
}

// Update question numbers after deletion
function updateQuestionNumbers() {
    const questions = document.querySelectorAll('.question-item');
    questions.forEach((question, index) => {
        const questionNumber = question.querySelector('.question-number');
        questionNumber.textContent = `Question ${index + 1}`;
    });
}

// Update option letters after deletion
function updateOptionNumbers(questionItem) {
    const optionItems = questionItem.querySelectorAll('.option-item');
    const optionLetters = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'];
    
    optionItems.forEach((item, index) => {
        const optionNumber = item.querySelector('.option-number');
        optionNumber.textContent = optionLetters[index];
    });
}

// Validate and submit the quiz
function validateAndSubmitQuiz() {
    const questions = document.querySelectorAll('.question-item');
    let isValid = true;
    
    // Validate each question
    questions.forEach(question => {
        const questionText = question.querySelector('textarea');
        if (!questionText.value.trim()) {
            questionText.focus();
            showToast('Please fill in all question texts', 'error');
            isValid = false;
            return;
        }
        
        const options = question.querySelectorAll('.option-item input');
        options.forEach(option => {
            if (!option.value.trim()) {
                option.focus();
                showToast('Please fill in all option texts', 'error');
                isValid = false;
                return;
            }
        });
        
        const hasCorrectAnswer = question.querySelector('.correct-btn.selected');
        if (!hasCorrectAnswer) {
            showToast('Please mark the correct answer for each question', 'error');
            isValid = false;
            return;
        }
    });
    
    if (isValid) {
        // In a real app, you would submit to a server here
        // For demo, we'll show the success popup
        showSuccessPopup();
    }
}

// Show success popup
function showSuccessPopup() {
    const popup = document.getElementById('quizPopup');
    popup.style.display = 'flex';
    
    // Generate a random quiz ID for demo
    const quizId = Math.random().toString(36).substring(2, 8);
    document.getElementById('quizLink').textContent = `quizmaster.pro/quiz/${quizId}`;
}

// Show toast notification
function showToast(message, type = 'success') {
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.innerHTML = `
        <i class="fas ${type === 'success' ? 'fa-check-circle' : 'fa-exclamation-circle'}"></i>
        <span>${message}</span>
    `;
    
    document.body.appendChild(toast);
    
    setTimeout(() => {
        toast.classList.add('show');
    }, 10);
    
    setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => {
            toast.remove();
        }, 300);
    }, 3000);
}