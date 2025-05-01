// Quiz Submission Popup (6.PNG)
document.getElementById('submitQuiz').addEventListener('click', function(e) {
    e.preventDefault();
    const popup = document.getElementById('quizPopup');
    popup.style.display = 'flex';
});

document.querySelector('.close').addEventListener('click', function() {
    document.getElementById('quizPopup').style.display = 'none';
});

// Add More Questions
document.getElementById('addQuestion').addEventListener('click', function(e) {
    e.preventDefault();
    alert('Add more questions logic here.');
});