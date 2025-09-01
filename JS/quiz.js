window.addEventListener('DOMContentLoaded', async () => {
    // DOM Elements
    const tableBody = document.getElementById('examTableBody');
    const uniqueId = localStorage.getItem("unique_id");
    const authToken = localStorage.getItem("authToken");
    const uniqueIdDisplay = document.getElementById("uniqueid");
    const userNameSpan = document.getElementById("navUsername");
    const userDropdown = document.getElementById("userDropdown");
    const userSection = document.getElementById("userSection");
    const logoutBtn = document.getElementById("logoutBtn");

    // Display user info
    displayUserInfo();
    setupEventListeners();

    // Show unique ID on screen
    if (uniqueId && uniqueIdDisplay) {
        uniqueIdDisplay.innerText = `ID: ${uniqueId}`;

    }
    console.log(uniqueId)
console.log(authToken)

    // Load exams data
    await loadExams();

    // --- Functions ---

    async function loadExams() {
        try {
            // Validate authentication
            if (!authToken || !uniqueId) {
                throw new Error("Authentication required - Please login again");
            }

            const response = await fetch(`https://quizwiz-bcn5.onrender.com/api/exam/by-user/${uniqueId}`, {
                headers: {
                    
                    'Authorization': `Bearer ${authToken}`,
                    'Content-Type': 'application/json'
                }
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(errorData.message || "Failed to fetch exam data");
            }

            const exams = await response.json();
            renderExams(exams);
        } catch (error) {
            window.location.href='error.html';
            console.error("Error loading exams:", error);
        alert("Failed to load exams: " + error.message);
            
            // Redirect to login if unauthorized
            if (error.message.includes("401") || error.message.includes("Authentication")) {
                setTimeout(() => {
                    performLogout();
                }, 2000);
            }
        }
    }

    function renderExams(exams) {
        if (!exams || exams.length === 0) {
            tableBody.innerHTML = `<tr><td colspan="7" class="no-exams">No exams found. Create your first exam!</td></tr>`;
            return;
        }
        
        


        tableBody.innerHTML = '';
        exams.forEach(exam => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${exam.examName || 'N/A'}</td>
                <td>${exam.duration || 0} min</td>
                <td>${exam.createdBy || 'N/A'}</td>
                <td>${exam.startDate}</td>
                <td>${exam.endDate}</td>
      <td>
  ${exam.roomCode || "N/A"}
  <button class="copy-btn" data-room-code="${exam.roomCode}">
    <i class="fas fa-copy"></i>
  </button>
</td>

                
                </td>
                
                 <td>
                    <button class="action-btn delete-btn" data-exam-id="${exam.roomCode}">
                      <i class="fa-solid fa-trash"></i> Delete
                    </button>
                </td>
                <td>
                    <button class="action-btn preview-btn" data-exam-id="${exam.examName}" data-room-code="${exam.roomCode}">
                        <i class="fas fa-eye"></i> Preview
                    </button>
                </td>
                
            `;
            tableBody.appendChild(row);
        });

// COPY LINK OR ROOM CODE

document.querySelectorAll('.copy-btn').forEach(btn => {
    btn.addEventListener('click', async (e) => {
        e.preventDefault();
        const button = e.currentTarget;
        const roomCode = button.getAttribute('data-room-code');
        console.log(roomCode);
        if (!roomCode || roomCode === "N/A") {
            showToast("No room code found to copy.", "error");
            return;
        }

        // Visual feedback
        const originalHTML = button.innerHTML;
        button.innerHTML = '<i class="fas fa-spinner fa-spin"></i>';
        button.disabled = true;

        try {
            // Check if we're in a secure context or localhost
            if (isSecureContext() || window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'|| window.location.hostname === 'http://quizwiz-frontend.s3-website.ap-south-1.amazonaws.com') {
                
                    // Fallback for browsers without Clipboard API support
                    fallbackCopyText(roomCode);
                
            } else {
                // For non-secure contexts (HTTP)
                fallbackCopyText(roomCode);
            }
        } catch (err) {
            console.error('Copy failed:', err);
            showToast("Failed to copy. Please try again or copy manually.", "error");
        } finally {
            // Restore button state
            setTimeout(() => {
                button.innerHTML = originalHTML;
                button.disabled = false;
            }, 2000);
        }
    });
});

// Fallback copy method for non-secure contexts
function fallbackCopyText(text) {
    try {
        // Method 1: Create temporary textarea
        const textarea = document.createElement('textarea');
        textarea.value = text;
        textarea.style.position = 'fixed';
        textarea.style.opacity = '0';
        document.body.appendChild(textarea);
        textarea.select();
        
        const successful = document.execCommand('copy');
        document.body.removeChild(textarea);
        
        if (successful) {
            showToast("Room ID copied to clipboard!", "success");
            return true;
        }
        
        // Method 2: Select text and prompt user
        const range = document.createRange();
        const selection = window.getSelection();
        const tempElement = document.createElement('div');
        tempElement.textContent = text;
        tempElement.style.position = 'fixed';
        tempElement.style.top = '-9999px';
        document.body.appendChild(tempElement);
        
        range.selectNodeContents(tempElement);
        selection.removeAllRanges();
        selection.addRange(range);
        
        showToast("Please use Ctrl+C to copy the Room ID", "info");
        return false;
    } catch (err) {
        console.error('Fallback copy failed:', err);
        return false;
    }
}

// Check if context is secure
function isSecureContext() {
    return window.isSecureContext || 
           window.location.protocol === 'https:' || 
           window.location.hostname === 'localhost' || 
           window.location.hostname === '127.0.0.1'||
           window.location.hostname === 'http'||
           window.location.hostname === 'http://quizwiz-frontend.s3-website.ap-south-1.amazonaws.com';


}
function showToast(message, type) {
    const toast = document.createElement("div");
    toast.classList.add("toast", type);
  
    // Determine icon based on type
    let iconClass = "fas fa-info-circle"; // Default for 'info' or general
    if (type === "success") {
      iconClass = "fas fa-check-circle";
    } else if (type === "error") {
      iconClass = "fas fa-times-circle"; // Or fa-exclamation-circle for errors
    }
    // Add more types/icons if needed, e.g., 'warning'
  
    toast.innerHTML = `<i class="${iconClass}"></i> ${message}`;
    document.body.appendChild(toast);
  
    // Show the toast (add 'show' class after a brief delay for CSS transition)
    setTimeout(() => {
      toast.classList.add("show");
    }, 100); // Give browser a moment to render before adding 'show'
  
    // Hide and remove the toast after a longer duration
    setTimeout(() => {
      toast.classList.remove("show");
      // Remove the toast from the DOM after the CSS transition finishes
      toast.addEventListener("transitionend", () => toast.remove(), {
        once: true
      }); // Use { once: true } to remove the listener after it fires
    }, 3000); // **FIXED: Increased duration to 3 seconds (3000ms)**
  }
  

        //   Delete the room
        document.querySelectorAll('.delete-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
               
                const examId = e.currentTarget.getAttribute('data-exam-id');
                console.log(examId);
                const examTitle = e.currentTarget.getAttribute('data-exam-id'); // Optional: for confirmation message
                
                // Confirmation dialog
                if (confirm(`Are you sure you want to delete "${examTitle}"?`)) {
                    deleteExam(examId);
                }
            });
        });
        
        async function deleteExam(examId) {
            try {
                const response = await fetch(`https://quizwiz-bcn5.onrender.com/api/exam/delete-by-room/${examId}`, {
                    method: 'DELETE',
                    headers: {
                        'Authorization': `Bearer ${authToken}`,
                        'Content-Type': 'application/json'

                    }
                });
        
                if (response.ok) {
                    // Remove the exam element from DOM
                    const examElement = document.querySelector(`[data-exam-id="${examId}"]`).closest('.exam-item');
                    // examElement.remove();
                    
                    // Show success message
                    showAlert('Exam deleted successfully!', 'success');
                    window.location.href="quiz-room.html"
                } else {
                    const error = await response.json();
                    throw new Error(error.message || 'Failed to delete exam');
                }
            } catch (error) {
                window.location.href='error.html';
                console.error('Error:', error);
                showAlert(error.message, 'error');
            }
        }
        
        // Helper function to show alerts
        function showAlert(message, type) {
            const alertDiv = document.createElement('div');
            alertDiv.className = `alert alert-${type}`;
            alertDiv.textContent = message;
            
            document.body.prepend(alertDiv);
            
            // Remove after 3 seconds
            setTimeout(() => alertDiv.remove(), 3000);
        }


        // Add event listeners to preview buttons
        document.querySelectorAll('.preview-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                // 'btn' is the button that was clicked
                const roomid = btn.dataset.roomCode; // Directly access data-roomid from the clicked button
        
                if (roomid) {
                    window.location.href = `preview.html?roomid=${encodeURIComponent(roomid)}`;
                } else {
                    console.error("Room ID not found on the clicked preview button.");
                    // alert("Error: Room ID missing."); // User-friendly alert
                }
            });
        });
    }

 

    function previewExam(examId) {
        console.log("Previewing exam with ID:", examId);
        // Implement your preview logic here
        // window.location.href = `preview.html?examId=${examId}`;
    }

    function displayUserInfo() {
        const userData = localStorage.getItem("user");
        if (userData) {
            try {
                const user = JSON.parse(userData);
                const name = user.name || user.username || user || "User";
                userNameSpan.textContent = `Welcome, ${name}`;
            } catch (error) {
                window.location.href='error.html';
                console.error("Failed to parse user data:", error);
                userNameSpan.textContent = "Welcome";
            }
        }
    }

    function setupEventListeners() {
        // User dropdown toggle
        if (userSection && userDropdown) {
            userSection.addEventListener("click", function(e) {
                e.stopPropagation();
                userDropdown.classList.toggle("show");
            });

            document.addEventListener("click", function() {
                userDropdown.classList.remove("show");
            });
        }

        // Logout functionality
        if (logoutBtn) {
            logoutBtn.addEventListener("click", function(e) {
                e.preventDefault();
                performLogout();
            });
        }

        // Create exam buttons
        document.querySelectorAll('.create-btn').forEach(button => {
            button.addEventListener('click', function(e) {
                e.preventDefault();
                window.location.href = 'dashboard.html';
            });
        });

        // Refresh buttons
        document.querySelectorAll('.refresh-btn').forEach(button => {
            button.addEventListener('click', function(e) {
                e.preventDefault();
                window.location.reload();
            });
        });
    }

    function performLogout() {
        // Clear all user data
        localStorage.removeItem("authToken");
        localStorage.removeItem("user");
        localStorage.removeItem("unique_id");
        localStorage.removeItem("email");
    
        // Redirect to login page
        window.location.href = 'login.html';
    }

    function showError(message) {
        // Remove any existing error messages
        const existingError = document.querySelector('.error-message');
        if (existingError) existingError.remove();

        // Create and display new error message
        const errorElement = document.createElement('div');
        errorElement.className = 'error-message';
        errorElement.innerHTML = `
            <i class="fas fa-exclamation-circle"></i> ${message}
        `;
        // document.body.prepend(errorElement);
        alert(errorElement)

        // Auto-remove after 5 seconds
        setTimeout(() => {
            errorElement.remove();
        }, 5000);
    }
});
