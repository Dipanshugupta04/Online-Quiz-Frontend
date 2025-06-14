// Add this at the beginning of your main JavaScript file (e.g., main.js or the file that runs globally)

window.onerror = function(message, source, lineno, colno, error) {
    console.error("Global Error Caught:", { message, source, lineno, colno, error });

    // Store error details in localStorage to retrieve on the error page
    const errorMessage = error ? error.toString() : message;
    localStorage.setItem('appError', errorMessage);

    // Redirect to your custom error page
    window.location.href = '/HTML/error.html'; // Adjust the path if necessary

    return true; // Prevents the default browser error handling
};

// You can also catch promise rejections (useful for async operations)
window.addEventListener('unhandledrejection', (event) => {
    console.error("Unhandled Promise Rejection:", event.reason);

    const errorMessage = event.reason ? event.reason.toString() : 'An unhandled promise rejection occurred.';
    localStorage.setItem('appError', errorMessage);

    window.location.href = '/HTML/error.html'; // Adjust the path if necessary
});

// Example of how to trigger an error for testing (remove this in production)
// document.addEventListener('DOMContentLoaded', () => {
//     // Simulate an error after 3 seconds
//     setTimeout(() => {
//         // Uncomment one of these lines to test
//         // throw new Error("This is a simulated runtime error!");
//         // Promise.reject("This is a simulated unhandled promise rejection!");
//     }, 3000);
// });

// Your existing JavaScript code will go here, for example:
// document.addEventListener("DOMContentLoaded", function () {
//     // ... your existing code for feature cards, join quiz, testimonial slider, etc.
// });