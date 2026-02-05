let editingResumeId = null;

function hideAll() {
  signupPage.classList.add("hidden");
  loginPage.classList.add("hidden");
  dashboard.classList.add("hidden");
  resumeForm.classList.add("hidden");
  resumeListPage.classList.add("hidden");
  resumeViewPage.classList.add("hidden");
}

function showSignup(){ hideAll(); signupPage.classList.remove("hidden"); }
function showLogin(){ hideAll(); loginPage.classList.remove("hidden"); }
function showDashboard(){ hideAll(); dashboard.classList.remove("hidden"); }
function showResumeForm(){ hideAll(); resumeForm.classList.remove("hidden"); }
function showResumes(){ hideAll(); resumeListPage.classList.remove("hidden"); loadResumes(); }

function signup(){
  let users = JSON.parse(localStorage.getItem("users")) || [];
  users.push({name:sName.value,email:sEmail.value,pass:sPass.value});
  localStorage.setItem("users",JSON.stringify(users));
  Swal.fire("Success","Signup successful","success");
  showLogin();
}

function login(){
  let users = JSON.parse(localStorage.getItem("users")) || [];
  let user = users.find(u=>u.email===lEmail.value && u.pass===lPass.value);
  if(!user){Swal.fire("Error","Invalid login","error");return;}
  localStorage.setItem("loggedInUser",JSON.stringify(user));
  showDashboard();
}

function logout(){
  localStorage.removeItem("loggedInUser");
  showLogin();
}

function saveResume(){
  let user = JSON.parse(localStorage.getItem("loggedInUser"));
  let resumes = JSON.parse(localStorage.getItem("resumes")) || [];
  resumes.push({
    id:Date.now(),
    email:user.email,
    name:rName.value,
    summary:rSummary.value,
    education:rEducation.value,
    experience:rExperience.value,
    skills:rSkills.value,
    languages:rLanguages.value
  });
  localStorage.setItem("resumes",JSON.stringify(resumes));
  Swal.fire("Saved","Resume saved","success");
  showDashboard();
}

function loadResumes(){
  resumeList.innerHTML="";
  let user = JSON.parse(localStorage.getItem("loggedInUser"));
  let resumes = JSON.parse(localStorage.getItem("resumes")) || [];
  resumes.filter(r=>r.email===user.email).forEach(r=>{
    resumeList.innerHTML+=`
      <div class="card mb-2">
        <h5>${r.name}</h5>
        <button class="btn btn-success btn-sm" onclick="viewResume(${r.id})">View</button>
      </div>`;
  });
}

function viewResume(id){
  let resumes = JSON.parse(localStorage.getItem("resumes")) || [];
  let r = resumes.find(x=>x.id===id);

  vName.textContent=r.name;
  vSummary.textContent=r.summary;
  vEducation.textContent=r.education || "—";
  vExperience.textContent=r.experience || "—";
  vSkills.textContent=r.skills || "—";
  vLanguages.textContent=r.languages || "—";

  hideAll();
  resumeViewPage.classList.remove("hidden");
}

function togglePassword(id,icon){
  let i=document.getElementById(id);
  i.type=i.type==="password"?"text":"password";
}
