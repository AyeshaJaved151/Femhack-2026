let editingResumeId = null;

function hideAll() {
  signupPage.classList.add("hidden");
  loginPage.classList.add("hidden");
  dashboard.classList.add("hidden");
  resumeForm.classList.add("hidden");
  resumeListPage.classList.add("hidden");
}

function showSignup() { hideAll(); signupPage.classList.remove("hidden"); }
function showLogin() { hideAll(); loginPage.classList.remove("hidden"); }
function showDashboard() { hideAll(); dashboard.classList.remove("hidden"); }
function showResumeForm() { hideAll(); resumeForm.classList.remove("hidden"); }
function showResumes() { hideAll(); resumeListPage.classList.remove("hidden"); loadResumes(); }

/* Signup */
function signup() {
  if (!sName.value || !sEmail.value || !sPass.value || !sCPass.value) {
    Swal.fire("Error", "All fields are required", "error"); return;
  }
  if (sPass.value !== sCPass.value) {
    Swal.fire("Error", "Passwords do not match", "error"); return;
  }
  let users = JSON.parse(localStorage.getItem("users")) || [];
  if (users.find(u => u.email === sEmail.value)) {
    Swal.fire("Error", "Email already exists", "error"); return;
  }
  users.push({ name: sName.value, email: sEmail.value, pass: sPass.value });
  localStorage.setItem("users", JSON.stringify(users));
  Swal.fire("Success", "Signup successful", "success").then(()=>showLogin());
}

/* Login */
function login() {
  let users = JSON.parse(localStorage.getItem("users")) || [];
  let user = users.find(u => u.email === lEmail.value && u.pass === lPass.value);
  if (!user) { Swal.fire("Error", "Invalid email or password", "error"); return; }
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
  if (!rName.value || !rSummary.value) {
    Swal.fire("Error","Name and Summary required","error"); return;
  }

  let resumes = JSON.parse(localStorage.getItem("resumes")) || [];

  if (editingResumeId) {
    let idx = resumes.findIndex(r => r.id === editingResumeId);
    resumes[idx] = {
      id: editingResumeId,
      email: user.email,
      name: rName.value,
      summary: rSummary.value,
      education: rEducation.value,
      experience: rExperience.value,
      skills: rSkills.value,
      languages: rLanguages.value
    };
    editingResumeId = null;
    Swal.fire("Success","Resume updated","success");
  } else {
    // NEW resume
    resumes.push({
      id: Date.now(),
      email: user.email,
      name: rName.value,
      summary: rSummary.value,
      education: rEducation.value,
      experience: rExperience.value,
      skills: rSkills.value,
      languages: rLanguages.value
    });
    Swal.fire("Success","Resume saved","success");
  }

  localStorage.setItem("resumes", JSON.stringify(resumes));
  clearResumeForm();
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
        <button class="btn btn-info btn-sm me-1" onclick="editResume(${r.id})">Edit</button>
        <button class="btn btn-danger btn-sm" onclick="deleteResume(${r.id})">Delete</button>
      </div>
    `;
  });
}

function editResume(id) {
  let resumes = JSON.parse(localStorage.getItem("resumes")) || [];
  let r = resumes.find(res => res.id === id);

  editingResumeId = id;
  rName.value = r.name;
  rSummary.value = r.summary;
  rEducation.value = r.education || "";
  rExperience.value = r.experience || "";
  rSkills.value = r.skills || "";
  rLanguages.value = r.languages || "";

  document.getElementById("resumeFormTitle").textContent = "Edit Resume";
  showResumeForm();
}

function deleteResume(id) {
  Swal.fire({
    title: "Are you sure?",
    text: "This resume will be deleted!",
    icon: "warning",
    showCancelButton: true,
    confirmButtonText: "Yes, delete it!"
  }).then((result) => {
    if (result.isConfirmed) {
      let resumes = JSON.parse(localStorage.getItem("resumes")) || [];
      resumes = resumes.filter(r => r.id !== id);
      localStorage.setItem("resumes", JSON.stringify(resumes));
      loadResumes();
      Swal.fire("Deleted!","Resume has been deleted.","success");
    }
  });
}

function togglePassword(id, icon) {
  let input = document.getElementById(id);
  if (input.type === "password") {
    input.type = "text"; icon.textContent = "🙈";
  } else {
    input.type = "password"; icon.textContent = "👁";
  }
}

function clearResumeForm() {
  rName.value = rSummary.value = rEducation.value = rExperience.value = rSkills.value = rLanguages.value = "";
  document.getElementById("resumeFormTitle").textContent = "Create Resume";
  editingResumeId = null;
}

document.addEventListener("DOMContentLoaded", showSignup);
