// Quiz Submission Popup (6.PNG)
document.getElementById('submitQuiz').addEventListener('click', function (e) {
    e.preventDefault();
    const popup = document.getElementById('quizPopup');
    popup.style.display = 'flex';
});

document.querySelector('.close').addEventListener('click', function () {
    document.getElementById('quizPopup').style.display = 'none';
});

// Add More Questions
document.getElementById('addQuestion').addEventListener('click', function (e) {
    e.preventDefault();
    alert('Add more questions logic here.');
});




// create quiz js
// quiz.js
document.addEventListener('DOMContentLoaded', function () {
    // Mobile menu toggle
    const menuToggle = document.getElementById('mobile-menu');
    const navLinks = document.querySelector('.nav-links');

    menuToggle.addEventListener('click', function () {
        this.classList.toggle('active');
        navLinks.classList.toggle('active');

        // Toggle body scroll when menu is open
        if (navLinks.classList.contains('active')) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
    });

    // Close menu when clicking on a link
    document.querySelectorAll('.nav-links a').forEach(link => {
        link.addEventListener('click', () => {
            menuToggle.classList.remove('active');
            navLinks.classList.remove('active');
            document.body.style.overflow = '';
        });
    });

    // Mark correct answer functionality
    document.addEventListener('click', function (e) {
        if (e.target.closest('.correct-btn')) {
            const btn = e.target.closest('.correct-btn');
            const questionItem = btn.closest('.question-item');

            // Remove selected class from all buttons in this question
            questionItem.querySelectorAll('.correct-btn').forEach(button => {
                button.classList.remove('selected');
                button.innerHTML = '<i class="far fa-circle"></i>';
            });

            // Add selected class to clicked button
            btn.classList.add('selected');
            btn.innerHTML = '<i class="fas fa-check-circle"></i>';
        }
    });

    // Add new question
    const addQuestionBtn = document.getElementById('addQuestion');
    const questionContainer = document.getElementById('questionContainer');
    let questionCount = 1;

    addQuestionBtn.addEventListener('click', function () {
        questionCount++;
        const newQuestion = document.createElement('div');
        newQuestion.className = 'question-item card-hover';
        newQuestion.innerHTML = `
            <div class="question-header">
                <span class="question-number">Question ${questionCount}</span>
                <button class="delete-question" title="Delete question"><i class="fas fa-trash-alt"></i></button>
            </div>
            <div class="form-group">
                <label for="question${questionCount}"><i class="fas fa-question"></i> Question Text</label>
                <input type="text" id="question${questionCount}" placeholder="Enter your question..." required>
            </div>
            
            <div class="options-group">
                <h3><i class="fas fa-list-ol"></i> Options <span class="hint-text">(Click the checkmark to mark correct answer)</span></h3>
                <div class="option-item">
                    <div class="option-number">A</div>
                    <input type="text" placeholder="Option 1" required>
                    <button class="correct-btn" title="Mark as correct answer"><i class="far fa-circle"></i></button>
                </div>
                <div class="option-item">
                    <div class="option-number">B</div>
                    <input type="text" placeholder="Option 2" required>
                    <button class="correct-btn" title="Mark as correct answer"><i class="far fa-circle"></i></button>
                </div>
                <div class="option-item">
                    <div class="option-number">C</div>
                    <input type="text" placeholder="Option 3" required>
                    <button class="correct-btn" title="Mark as correct answer"><i class="far fa-circle"></i></button>
                </div>
                <div class="option-item">
                    <div class="option-number">D</div>
                    <input type="text" placeholder="Option 4" required>
                    <button class="correct-btn" title="Mark as correct answer"><i class="far fa-circle"></i></button>
                </div>
                <button class="add-option-btn"><i class="fas fa-plus"></i> Add Another Option</button>
            </div>
        `;

        questionContainer.appendChild(newQuestion);

        // Scroll to new question with offset
        setTimeout(() => {
            newQuestion.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
            window.scrollBy(0, -20);
        }, 100);
    });

    // Delete question
    document.addEventListener('click', function (e) {
        if (e.target.closest('.delete-question')) {
            const questionToDelete = e.target.closest('.question-item');
            if (document.querySelectorAll('.question-item').length > 1) {
                questionToDelete.classList.add('fade-out');
                setTimeout(() => {
                    questionToDelete.remove();
                    // Update question numbers
                    document.querySelectorAll('.question-item').forEach((item, index) => {
                        item.querySelector('.question-number').textContent = `Question ${index + 1}`;
                    });
                    questionCount = document.querySelectorAll('.question-item').length;
                }, 300);
            } else {
                alert('You need at least one question in your quiz!');
            }
        }
    });

    // Add new option
    // document.addEventListener('click', function (e) {
    //     if (e.target.closest('.add-option-btn')) {
    //         const optionsGroup = e.target.closest('.options-group');
    //         const optionItems = optionsGroup.querySelectorAll('.option-item');
    //         const nextLetter = String.fromCharCode(65 + optionItems.length); // A, B, C, etc.

    //         const newOption = document.createElement('div');
    //         newOption.className = 'option-item';
    //         newOption.innerHTML = `
    //             <div class="option-number">${
    //                 nextLetter
    //             }
    //         }
    //       });