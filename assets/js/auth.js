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
          <img src="${user.profileImage || "https://via.placeholder.com/32"}" alt="Profile" 
               class="rounded-circle me-2" width="32" height="32">
          <span class="text-white fw-semibold">${user.firstName}</span>
        </button>
        <ul class="dropdown-menu dropdown-menu-end" aria-labelledby="profileDropdown">
          <li><a class="dropdown-item" href="#" id="profileBtn">Profile</a></li>
          <li><hr class="dropdown-divider"></li>
          <li><a class="dropdown-item text-danger" href="#" id="logoutBtn">Logout</a></li>
        </ul>
      </div>
    `;

    // 🔹 Logout with confirmation
    document.getElementById("logoutBtn").addEventListener("click", (e) => {
      e.preventDefault();

      Swal.fire({
        title: "Are you sure?",
        text: "Do you really want to log out?",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#d33",
        cancelButtonColor: "#3085d6",
        confirmButtonText: "Yes, logout",
        cancelButtonText: "No, stay logged in"
      }).then((result) => {
        if (result.isConfirmed) {
          localStorage.removeItem("loggedIn");
          localStorage.removeItem("user");

          Swal.fire({
            icon: "success",
            title: "Logout Successful",
            showConfirmButton: false,
            timer: 1500
          }).then(() => {
            location.reload();
          });
        }
      });
    });

    //  Profile modal handler (added)
    document.getElementById("profileBtn")?.addEventListener("click", (e) => {
      e.preventDefault();

      const user = JSON.parse(localStorage.getItem("user"));
      if (!user) return;

      // Fill user details
      document.getElementById("profileImage").src = user.profileImage || "https://via.placeholder.com/60";
      document.getElementById("profileName").innerText = user.firstName + " " + (user.lastName || "");
      document.getElementById("profileEmail").innerText = user.email;

      // Load registered events
      const registeredEvents = JSON.parse(localStorage.getItem("registeredEvents")) || [];
      const registeredList = document.getElementById("registeredEvents");
      registeredList.innerHTML = registeredEvents.length
        ? registeredEvents.map(ev => `<li class="list-group-item">${ev.title} - ${ev.date}</li>`).join("")
        : `<li class="list-group-item text-muted">No events registered yet.</li>`;

      // Load bookmarked events
      const wishlist = JSON.parse(localStorage.getItem("wishlist")) || [];
      const wishlistList = document.getElementById("bookmarkedEvents");
      wishlistList.innerHTML = wishlist.length
        ? wishlist.map(ev => `<li class="list-group-item">${ev.title}</li>`).join("")
        : `<li class="list-group-item text-muted">No bookmarked events.</li>`;

      // Show modal
      const profileModal = new bootstrap.Modal(document.getElementById("profileModal"));
      profileModal.show();
    });

  } else {
    authArea.innerHTML = `
      <a href="login.html" class="btn btn-outline-light btn-sm" id="loginNavBtn">Login</a>
    `;
  }
});
