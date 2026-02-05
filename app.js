let editingResumeId = null;
let currentViewId = null;

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

/* Signup */
function signup(){
  if(!sName.value||!sEmail.value||!sPass.value||!sCPass.value){
    Swal.fire("Error","All fields required","error");return;
  }
  if(sPass.value!==sCPass.value){
    Swal.fire("Error","Passwords not match","error");return;
  }
  let users=JSON.parse(localStorage.getItem("users"))||[];
  if(users.find(u=>u.email===sEmail.value)){
    Swal.fire("Error","Email already exists","error");return;
  }
  users.push({name:sName.value,email:sEmail.value,pass:sPass.value});
  localStorage.setItem("users",JSON.stringify(users));
  Swal.fire("Success","Signup successful","success");
  showLogin();
}

/* Login */
function login(){
  let users=JSON.parse(localStorage.getItem("users"))||[];
  let user=users.find(u=>u.email===lEmail.value && u.pass===lPass.value);
  if(!user){Swal.fire("Error","Invalid login","error");return;}
  localStorage.setItem("loggedInUser",JSON.stringify(user));
  showDashboard();
}

/* Logout */
function logout(){
  localStorage.removeItem("loggedInUser");
  showLogin();
}

/* Save Resume */
function saveResume(){
  let user=JSON.parse(localStorage.getItem("loggedInUser"));
  let resumes=JSON.parse(localStorage.getItem("resumes"))||[];

  if(editingResumeId){
    let i=resumes.findIndex(r=>r.id===editingResumeId);
    resumes[i]={id:editingResumeId,email:user.email,name:rName.value,
      summary:rSummary.value,education:rEducation.value,
      experience:rExperience.value,skills:rSkills.value,languages:rLanguages.value};
    editingResumeId=null;
  } else {
    resumes.push({
      id:Date.now(),email:user.email,name:rName.value,
      summary:rSummary.value,education:rEducation.value,
      experience:rExperience.value,skills:rSkills.value,languages:rLanguages.value
    });
  }

  localStorage.setItem("resumes",JSON.stringify(resumes));
  Swal.fire("Saved","Resume saved","success");
  showDashboard();
}

/* Load Resumes */
function loadResumes(){
  resumeList.innerHTML="";
  let user=JSON.parse(localStorage.getItem("loggedInUser"));
  let resumes=JSON.parse(localStorage.getItem("resumes"))||[];

  resumes.filter(r=>r.email===user.email).forEach(r=>{
    resumeList.innerHTML+=`
      <div class="card mb-2">
        <h5>${r.name}</h5>
        <button class="btn btn-success btn-sm" onclick="viewResume(${r.id})">View</button>
        <button class="btn btn-info btn-sm" onclick="editResume(${r.id})">Edit</button>
        <button class="btn btn-danger btn-sm" onclick="deleteResume(${r.id})">Delete</button>
      </div>`;
  });
}

/* View Resume */
function viewResume(id){
  let resumes=JSON.parse(localStorage.getItem("resumes"))||[];
  let r=resumes.find(x=>x.id===id);
  currentViewId=id;

  vName.textContent=r.name;
  vSummary.textContent=r.summary;
  vEducation.textContent=r.education||"—";
  vExperience.textContent=r.experience||"—";
  vSkills.textContent=r.skills||"—";
  vLanguages.textContent=r.languages||"—";

  hideAll();
  resumeViewPage.classList.remove("hidden");
}

/* Edit */
function editResume(id){
  let resumes=JSON.parse(localStorage.getItem("resumes"))||[];
  let r=resumes.find(x=>x.id===id);
  editingResumeId=id;

  rName.value=r.name;
  rSummary.value=r.summary;
  rEducation.value=r.education;
  rExperience.value=r.experience;
  rSkills.value=r.skills;
  rLanguages.value=r.languages;

  showResumeForm();
}

function editFromView(){
  editResume(currentViewId);
}

/* Delete */
function deleteResume(id){
  Swal.fire({title:"Delete?",icon:"warning",showCancelButton:true})
  .then(res=>{
    if(res.isConfirmed){
      let resumes=JSON.parse(localStorage.getItem("resumes"))||[];
      resumes=resumes.filter(r=>r.id!==id);
      localStorage.setItem("resumes",JSON.stringify(resumes));
      Swal.fire("Deleted","Resume deleted","success");
      showResumes();
    }
  });
}

function deleteFromView(){
  deleteResume(currentViewId);
}

/* Password Eye */
function togglePassword(id,icon){
  let i=document.getElementById(id);
  i.type=i.type==="password"?"text":"password";
}

/* Start */
document.addEventListener("DOMContentLoaded",showSignup);
