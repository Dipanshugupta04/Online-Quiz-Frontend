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

            const response = await fetch(`http://localhost:8081/api/exam/by-user/${uniqueId}`, {
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
            console.error("Error loading exams:", error);
            showError("Failed to load exams: " + error.message);
            
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
                <td>${formatDate(exam.startDate)}</td>
                <td>${formatDate(exam.endDate)}</td>
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
            btn.addEventListener('click', (e) => {
              const roomCode = e.currentTarget.getAttribute('data-room-code');
          
              // Check if roomCode exists
              if (!roomCode) {
                showToast("No room code found to copy.", "error");
                return;
              }
          
              navigator.clipboard.writeText(roomCode)
                .then(() => {
                  showToast("Room ID copied to clipboard!", "success"); // More specific message
                })
                .catch(err => {
                  console.error('Failed to copy Room ID:', err); // Log the full error
                  showToast("Failed to copy Room ID. Please try again.", "error"); // Use your consistent toast
                });
            });
          });
          
          // --- Show Toast Notification (Improved) ---
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
                const response = await fetch(`http://localhost:8081/api/exam/delete-by-room/${examId}`, {
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

    function formatDate(isoDateTime) {
        if (!isoDateTime || typeof isoDateTime !== 'string') return "N/A";
        try {
            const date = new Date(isoDateTime);
            if (isNaN(date.getTime())) throw new Error("Invalid Date");
            return date.toLocaleString(); // Includes date + time
        } catch (e) {
            console.error("Date formatting error:", isoDateTime, e);
            return "N/A";
        }
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
                const name = user.name || user.username || "User";
                userNameSpan.textContent = `Welcome, ${name}`;
            } catch (error) {
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
        
        // Redirect to login page
        window.location.href = '/HTML/login.html';
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
        document.body.prepend(errorElement);

        // Auto-remove after 5 seconds
        setTimeout(() => {
            errorElement.remove();
        }, 5000);
    }
});
