// assets/js/auth.js
document.addEventListener("DOMContentLoaded", () => {
  const authArea = document.getElementById("authArea");
  if (!authArea) return; // safety check

  const loggedIn = localStorage.getItem("loggedIn") === "true";
  const user = JSON.parse(localStorage.getItem("user"));

  if (loggedIn && user) {
    authArea.innerHTML = `
      <div class="dropdown">
        <button class="btn btn-dark dropdown-toggle d-flex align-items-center" 
                type="button" id="profileDropdown" data-bs-toggle="dropdown" aria-expanded="false">
          <img src="${user.profileImage}" alt="Profile" 
               class="rounded-circle me-2" width="32" height="32">
          <span class="text-white fw-semibold">${user.firstName}</span>
        </button>
        <ul class="dropdown-menu dropdown-menu-end" aria-labelledby="profileDropdown">
          <li><a class="dropdown-item" href="#">Profile</a></li>
          <li><hr class="dropdown-divider"></li>
          <li><a class="dropdown-item text-danger" href="#" id="logoutBtn">Logout</a></li>
        </ul>
      </div>
    `;

    // Attach logout handler
    document.getElementById("logoutBtn").addEventListener("click", () => {
      localStorage.removeItem("loggedIn");
      localStorage.removeItem("user");
      location.reload(); // refresh to update navbar
    });

  } else {
    authArea.innerHTML = `
      <a href="login.html" class="btn btn-outline-light btn-sm" id="loginNavBtn">Login</a>
    `;
  }
});
