const API_BASE = "https://uniserver-0z7e.onrender.com/api";

/* ===== INIT ===== */
window.onload = () => {
  registerSW();
  if(!localStorage.getItem("email") || !localStorage.getItem("password")) return;
  login(localStorage.getItem("email"), localStorage.getItem("password"));
};

/* ===== LOGIN ===== */
async function login(email, password) {
  if(!email || !password) {
    email = document.getElementById("email").value;
    password = document.getElementById("password").value;
  }

  try {
    const payload = JSON.stringify({ email, password });
    const res = await fetch(`${API_BASE}/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: `${payload}`
    });

    const data = await res.text();
    if (data === "Invalid") throw new Error("Invalid credentials");
    if(data === "Fill")throw new Error("Fill your credentials");
    console.log(data)
    localStorage.setItem("email", email);
    localStorage.setItem("password", password);
    loadApp(data);

  } catch (err) {
    console.log(err)
    document.getElementById("loginError").innerText = err.message;
  }
}

/* ===== LOAD APP ===== */
async function loadApp(data) {
  loginView.style.display = "none";
  appView.style.display = "block";

  console.log(JSON.parse(data))

  const courses = JSON.parse(data);
  renderCourses(courses);
}

/* ===== RENDER COURSES ===== */
function renderCourses(courses) {
  courseList.innerHTML = "";

  Object.values(courses).forEach(course => {
    const div = document.createElement("div");
    div.className = "course";

    div.innerHTML = `
      <span>${course.name}</span>`;

    div.onclick = e => {
      if (e.target.tagName === "A") return;
      showGrades(course);
    };

    courseList.appendChild(div);
  });
}

/* ===== GRADES ===== */
function showGrades(course) {
  gradesPanel.innerHTML = `<h3>${course.name}</h3>`;

  if (!Object.keys(course.grades).length) {
    gradesPanel.innerHTML += `<p>No grades yet</p>`;
    return;
  }

  Object.values(course.grades).forEach(g => {
    gradesPanel.innerHTML += `
      <div class="grade-row">
        <span>${g.name}</span>
        <strong>${g.number}</strong>
      </div>
    `;
  });
}

/* ===== LOGOUT ===== */
function logout() {
  localStorage.removeItem("email");
  localStorage.removeItem("password");
  location.reload();
}

/* ===== SERVICE WORKER ===== */
function registerSW() {
  if ("serviceWorker" in navigator) {
    navigator.serviceWorker.register("sw.js");
  }
}
