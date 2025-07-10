//call profiles function

refreshProfilePicture();
refreshProfileDetails();
refreshUserArchievements();
refreshUserHistory();

document.addEventListener("DOMContentLoaded", function () {
  const tabs = document.querySelectorAll(".tab");
  const tabContents = document.querySelectorAll(".tab-content");
  const editProfileBtn = document.getElementById("editProfileBtn");

  function showTab(tabId) {
    tabContents.forEach((content) => {
      content.classList.remove("active");
    });
    tabs.forEach((tab) => {
      tab.classList.remove("active");
    });

    document.getElementById(tabId + "-tab").classList.add("active");
    document
      .querySelector(`.tab[data-tab="${tabId}"]`)
      .classList.add("active");
  }

  tabs.forEach((tab) => {
    tab.addEventListener("click", function () {
      const tabId = this.dataset.tab;
      showTab(tabId);
    });
  });

  // Handle the "Edit Profile" button click to switch to the edit tab
  if (editProfileBtn) {
    editProfileBtn.addEventListener("click", function () {
      showTab("edit");
    });
  }

  showTab("achievements");
});

//edit profile

document.addEventListener('DOMContentLoaded', function() {
// Initialize password toggle functionality
document.querySelectorAll('.toggle-password').forEach(icon => {
icon.addEventListener('click', function() {
const targetId = this.getAttribute('data-target');
const input = document.getElementById(targetId);
const type = input.getAttribute('type') === 'password' ? 'text' : 'password';
input.setAttribute('type', type);
this.classList.toggle('fa-eye-slash');
});
});

// Password validation
const passwordInput = document.getElementById('Password');
const confirmPasswordInput = document.getElementById('Confirm_Password');
const matchStatus = document.querySelector('.password-match-status');

function checkPasswordMatch() {
if (passwordInput.value && confirmPasswordInput.value) {
if (passwordInput.value !== confirmPasswordInput.value) {
  matchStatus.innerHTML = '<i class="fas fa-times-circle"></i> Passwords do not match';
  matchStatus.style.color = '#ff4757';
  return false;
} else {
  matchStatus.innerHTML = '<i class="fas fa-check-circle"></i> Passwords match';
  matchStatus.style.color = '#2ed573';
  return true;
}
}
matchStatus.innerHTML = '';
return true;
}

passwordInput.addEventListener('input', checkPasswordMatch);
confirmPasswordInput.addEventListener('input', checkPasswordMatch);

// Cancel button functionality
document.getElementById('cancelEditBtn').addEventListener('click', function() {
// Reset form
document.getElementById('editName').value = '';
document.getElementById('contact').value = '';
passwordInput.value = '';
confirmPasswordInput.value = '';
matchStatus.innerHTML = '';
document.querySelector('.tab[data-tab="achievements"]').click();
});

// Save profile functionality
document.getElementById('saveProfileBtn').addEventListener('click', async function() {
const name = document.getElementById('editName').value.trim();
const contactNo = document.getElementById('contact').value.trim();
const password = passwordInput.value;
const confirmPassword = confirmPasswordInput.value;

// Validate passwords if they're being changed
if (password && !checkPasswordMatch()) {
alert('Passwords do not match!');
return;
}

const token = localStorage.getItem('authToken');
if (!token) {
alert('You need to be logged in to update your profile');
return;
}

try {
const response = await fetch('http://quizwiz.ap-south-1.elasticbeanstalk.com/api/edit-profile', {
  method: 'PUT',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  },
  body: JSON.stringify({
    name: name || undefined,
    password: password || undefined,
    contactNo: contactNo || undefined
  })
});

const result = await response.json();

if (response.ok) {
  alert('Profile updated successfully!');
  // Update the displayed name if changed
  if (name) {
    document.getElementById('profileName').textContent = name;
  }
  // Clear password fields
  passwordInput.value = '';
  confirmPasswordInput.value = '';
  matchStatus.innerHTML = '';
} else {
  throw new Error(result.message || 'Failed to update profile');
}
} catch (err) {
console.error('Error updating profile:', err);
alert(err.message || 'Failed to update profile. Please try again.');
}
});
});
// Upload profile picture

async function uploadProfilePicture(file) {
  const formData = new FormData();
  formData.append("file", file);

  const token = localStorage.getItem("authToken");

  try {
    const response = await fetch(
      "http://quizwiz.ap-south-1.elasticbeanstalk.com/profile/upload-profile-picture",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      }
    );

    if (response.ok) {
      const result = await response.text();
      console.log("Profile picture uploaded:", result);
      // Refresh the profile picture display
      refreshProfilePicture();
    } else {
      console.error("Upload failed:", response.statusText);
    }
  } catch (error) {
    console.error("Error uploading profile picture:", error);
  }
}

async function refreshProfilePicture() {
  const token = localStorage.getItem("authToken");
  const previewImage = document.getElementById("previewImage");

  try {
    const response = await fetch(
      "http://quizwiz.ap-south-1.elasticbeanstalk.com/profile/profile-picture",
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (response.ok) {
      const blob = await response.blob();
      const imageUrl = URL.createObjectURL(blob);
      previewImage.src = imageUrl;
      previewImage.style.display = "block";
      document.querySelector(".profile-avatar i").style.display = "none";
    } else {
      console.error("Failed to fetch profile picture");
    }
  } catch (error) {
    console.error("Error fetching profile picture:", error);
  }
}

const userAvatar = document.getElementById("userAvatar");
const fileInput = document.getElementById("fileInput");
const previewImage = document.getElementById("previewImage");
const icon = userAvatar.querySelector("i");

userAvatar.addEventListener("click", function () {
  fileInput.click();
});

fileInput.addEventListener("change", function (event) {
  const file = event.target.files[0];
  if (file) {
    const reader = new FileReader();

    reader.onload = function (e) {
      previewImage.src = e.target.result;
      previewImage.style.display = "block";
      icon.style.display = "none";

      // Upload the profile picture
      uploadProfilePicture(file);
    };

    reader.readAsDataURL(file);
  }
});

// update profile data

async function refreshProfileDetails() {
  document.addEventListener("DOMContentLoaded", async function () {
    const token = localStorage.getItem("authToken");

    try {
      const response = await fetch("http://quizwiz.ap-south-1.elasticbeanstalk.com/api/user", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch user details");
      }

      const user = await response.json();
      console.log(user);

      // Fill the profile UI with user data
      document.getElementById("profileName").textContent =
        user.name || "N/A";
      document.getElementById("usernameDisplay").textContent = `Email :${
        user.email || "N/A"
      }`;
      document.getElementById(
        "profile_uniqueid"
      ).textContent = `Unique ID: ${user.uniqueId || "N/A"}`;
      document.getElementById(
        "profile_contact"
      ).textContent = `Contact No:${user.contact || "N/A"}`;
    } catch (err) {
      console.error("Error loading profile info:", err);
      document.getElementById("profileName").textContent = "Guest User";
      document.getElementById("usernameDisplay").textContent = "Unknown";
      document.getElementById("profile_uniqueid").textContent = "123456";
    }
  });
}

//fetch user achievements

async function refreshUserArchievements() {
const token = localStorage.getItem("authToken");
const container = document.querySelector(".achievements-grid");
const avg = document.getElementById("avgScore");
const progressTab = document.querySelector("#progress-tab");

try {
const response = await fetch("http://quizwiz.ap-south-1.elasticbeanstalk.com/profile/user/achievements", {
headers: {
Authorization: `Bearer ${token}`
}
});

if (!response.ok) throw new Error("Failed to fetch achievements");

const data = await response.json();
container.innerHTML = ""; // Clear achievements
progressTab.innerHTML = `<h2>Your Progress</h2>`; // Reset dynamic progress bars

if (data.length === 0) {
container.innerHTML = `<p>No achievements yet.</p>`;
avg.textContent = "0%";
return;
}

let total = 0;
const categoryMap = new Map(); // key: quizTitle, value: { total, count }

data.forEach((item) => {
total += item.score;

const title = item.quizTitle || "General";

if (!categoryMap.has(title)) {
categoryMap.set(title, { total: 0, count: 0 });
}

const stats = categoryMap.get(title);
stats.total += item.score;
stats.count += 1;

// Achievement Card UI
const card = document.createElement("div");
card.classList.add("achievement-card");
card.innerHTML = `
<div class="achievement-icon">
<i class="fas fa-trophy"></i>
</div>
<div class="achievement-details">
<h4>${item.quizTitle}</h4>
<p>Score: ${item.score}%</p>
<p>Marks: ${item.marks}</p>
<span class="achievement-date">
<i class="far fa-calendar-alt"></i> ${new Date(item.submittedAt).toLocaleDateString()}
</span>
</div>
`;
container.appendChild(card);
});

// Calculate and set average score
const avgScore = Math.round(total / data.length);
avg.textContent = `${avgScore}%`;

// Generate dynamic progress bars
categoryMap.forEach((value, title) => {
const average = Math.round(value.total / value.count);
const progressContainer = document.createElement("div");
progressContainer.classList.add("progress-container");

progressContainer.innerHTML = `
<div class="progress-title">
<span>${title}</span>
<span>${average}%</span>
</div>
<div class="progress-bar">
<div class="progress-fill" style="width: ${average}%"></div>
</div>
`;

progressTab.appendChild(progressContainer);
});

} catch (error) {
console.error("Error loading achievements:", error);
container.innerHTML = `<p>Error loading achievements.</p>`;
avg.textContent = "0%";
progressTab.innerHTML = `<h2>Your Progress</h2>`;
}
}




//User exam history


async function refreshUserHistory() {
document.addEventListener("DOMContentLoaded", async function () {
const token = localStorage.getItem("authToken");
const historyContainer = document.querySelector(".quiz-history");
const quiztaken = document.getElementById("quizzesTaken");
const streakElement = document.getElementById("currentStreak");

try {
const response = await fetch("http://quizwiz.ap-south-1.elasticbeanstalk.com/profile/user/history", {
headers: {
Authorization: `Bearer ${token}`
}
});

if (!response.ok) throw new Error("Failed to load history");

const data = await response.json();

historyContainer.innerHTML = ""; // Clear existing
quiztaken.textContent = data.length;

// --- Calculate Day Streak ---
const lastDateSet = new Set(
data.map(item => item.lastdate).filter(date => !!date)
);

const uniqueDates = Array.from(lastDateSet)
.map(d => new Date(d).toISOString().split('T')[0])
.sort((a, b) => new Date(b) - new Date(a)); // latest to oldest

let streak = 0;
let currentDate = new Date();
currentDate.setHours(0, 0, 0, 0);

for (let dateStr of uniqueDates) {
const quizDate = new Date(dateStr);
quizDate.setHours(0, 0, 0, 0);

if (quizDate.getTime() === currentDate.getTime()) {
streak++;
currentDate.setDate(currentDate.getDate() - 1);
} else {
break;
}
}

streakElement.textContent = streak;
localStorage.setItem("dayStreak", streak);
console.log("Day Streak:", streak);

// --- Render History List ---
data.forEach(item => {
const quizDiv = document.createElement("div");
quizDiv.classList.add("quiz-item");

quizDiv.innerHTML = `
<div class="quiz-info">
<div class="quiz-title">
  <span>Exam Title:</span>
  <span class="quiz-category">${item.examName || 'General'}</span>
</div>
<div class="quiz-info">
  Exam Description:
  <span class="quiz-category">${item.description || 'General'}</span>
</div>
<div class="quiz-meta">
  <span><i class="far fa-calendar-alt"></i> ${new Date(item.startDate).toLocaleString()}</span>
  <span><i class="far fa-clock"></i> ${item.durationMinutes} mins</span>
</div>
</div>
`;

historyContainer.appendChild(quizDiv);
});

if (data.length === 0) {
historyContainer.innerHTML = `<p>No quiz history found.</p>`;
}

} catch (error) {
console.error("Error loading quiz history:", error);
historyContainer.innerHTML = `<p>Error loading history.</p>`;
}
});
}