function hideAll() {
  signupPage.classList.add("hidden");
  loginPage.classList.add("hidden");
  dashboard.classList.add("hidden");
  resumeForm.classList.add("hidden");
  resumeListPage.classList.add("hidden");
}

function showSignup() {
  hideAll();
  signupPage.classList.remove("hidden");
}

function showLogin() {
  hideAll();
  loginPage.classList.remove("hidden");
}

function showDashboard() {
  hideAll();
  dashboard.classList.remove("hidden");
}

function showResumeForm() {
  hideAll();
  resumeForm.classList.remove("hidden");
}

function showResumes() {
  hideAll();
  resumeListPage.classList.remove("hidden");
  loadResumes();
}

/* Signup */
function signup() {
  if (!sName.value || !sEmail.value || !sPass.value || !sCPass.value) {
    alert("All fields required");
    return;
  }
  if (sPass.value !== sCPass.value) {
    alert("Passwords do not match");
    return;
  }

  let users = JSON.parse(localStorage.getItem("users")) || [];
  if (users.find(u => u.email === sEmail.value)) {
    alert("Email already exists");
    return;
  }

  users.push({ name: sName.value, email: sEmail.value, pass: sPass.value });
  localStorage.setItem("users", JSON.stringify(users));
  alert("Signup successful");
  showLogin();
}

/* Login */
function login() {
  let users = JSON.parse(localStorage.getItem("users")) || [];
  let user = users.find(u => u.email === lEmail.value && u.pass === lPass.value);

  if (!user) {
    alert("Invalid email or password");
    return;
  }

  localStorage.setItem("loggedInUser", JSON.stringify(user));
  showDashboard();
}

/* Logout */
function logout() {
  localStorage.removeItem("loggedInUser");
  showLogin();
}

/* Resume */
function saveResume() {
  let user = JSON.parse(localStorage.getItem("loggedInUser"));
  let resumes = JSON.parse(localStorage.getItem("resumes")) || [];

  resumes.push({
    id: Date.now(),
    email: user.email,
    name: rName.value,
    summary: rSummary.value
  });

  localStorage.setItem("resumes", JSON.stringify(resumes));
  alert("Resume saved");
  showDashboard();
}

function loadResumes() {
  resumeList.innerHTML = "";
  let user = JSON.parse(localStorage.getItem("loggedInUser"));
  let resumes = JSON.parse(localStorage.getItem("resumes")) || [];

  resumes.filter(r => r.email === user.email).forEach(r => {
    resumeList.innerHTML += `
      <div class="card p-3 mb-2">
        <h5>${r.name}</h5>
        <p>${r.summary}</p>
        <button class="btn btn-danger btn-sm" onclick="deleteResume(${r.id})">Delete</button>
      </div>
    `;
  });
}

function deleteResume(id) {
  let resumes = JSON.parse(localStorage.getItem("resumes")) || [];
  resumes = resumes.filter(r => r.id !== id);
  localStorage.setItem("resumes", JSON.stringify(resumes));
  loadResumes();
}

/* Password eye */
function togglePassword(id, icon) {
  let input = document.getElementById(id);
  if (input.type === "password") {
    input.type = "text";
    icon.textContent = "🙈";
  } else {
    input.type = "password";
    icon.textContent = "👁";
  }
}

document.addEventListener("DOMContentLoaded", showSignup);
