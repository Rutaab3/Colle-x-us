// index.js
document.addEventListener("DOMContentLoaded", () => {
  loadEvents();
  loadGallery();
});

// Load Featured Events
function loadEvents() {
  fetch("assets/data/events.json")
    .then(res => res.json())
    .then(data => {
      const eventsRow = document.getElementById("eventsRow");
      eventsRow.innerHTML = "";

      data.slice(0, 3).forEach(event => {
        const card = `
          <div class="col-md-4">
            <div class="card h-100 shadow position-relative">
              <!-- Category pill -->
              <span class="badge bg-primary position-absolute top-0 start-0 m-2">${event.category}</span>
              <!-- Bookmark button -->
           <button 
  class="btn btn-light btn-sm position-absolute top-0 end-0 m-2 bookmark-btn" 
  data-id="${event.id}" 
  data-type="event" 
  data-item='${JSON.stringify({ ...event, type: "event" })}'>
  <i class="bi bi-bookmark"></i>
</button>


              <!-- Image -->
              <img src="${event.image}" class="card-img-top" alt="${event.title}">
              <!-- Card body -->
              <div class="card-body">
                <h5 class="card-title">${event.title}</h5>
                <p class="card-text"><strong>Date:</strong> ${event.date}</p>
                <p class="card-text"><strong>Venue:</strong> ${event.venue}</p>
                <button class="btn btn-primary w-100 view-details-btn" data-type="event" data-id="${event.id}">View Details</button>
              </div>
            </div>
          </div>
        `;
        eventsRow.insertAdjacentHTML("beforeend", card);
      });

      attachDetailListeners(data, "event");
    })
    .catch(err => console.error("Error loading events.json:", err));
}

// Load Gallery
function loadGallery() {
  fetch("assets/data/gallery.json")
    .then(res => res.json())
    .then(data => {
      const galleryRow = document.getElementById("galleryRow");
      galleryRow.innerHTML = "";

      data.slice(0, 3).forEach(item => {
        const card = `
          <div class="col-md-4">
            <div class="card h-100 shadow position-relative">
              <!-- Category pill -->
              <span class="badge bg-success position-absolute top-0 start-0 m-2">${item.category}</span>
              <!-- Image -->
              <img src="${item.path}" class="card-img-top" alt="${item.title}">
              <!-- Card body -->
              <div class="card-body">
                <h5 class="card-title">${item.title}</h5>
                <p class="card-text"><strong>Date:</strong> ${item.date}</p>
                <button class="btn btn-primary w-100 view-details-btn" data-type="gallery" data-id="${item.id}">View Details</button>
              </div>
            </div>
          </div>
        `;
        galleryRow.insertAdjacentHTML("beforeend", card);
      });

      attachDetailListeners(data, "gallery");
    })
    .catch(err => console.error("Error loading gallery.json:", err));
}

// Attach listeners for details
function attachDetailListeners(data, type) {
  document.querySelectorAll(".view-details-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      const id = btn.getAttribute("data-id");
      const item = data.find(d => d.id === id);
      if (item) showDetails(item, type);
    });
  });
}

// Show details in modal
function showDetails(item, type) {
  let content = "";

  if (type === "event") {
    content = `
      <h3>${item.title}</h3>
      <p><strong>Date:</strong> ${item.date}</p>
      <p><strong>Time:</strong> ${item.time}</p>
      <p><strong>Venue:</strong> ${item.venue}</p>
      <p><strong>Department:</strong> ${item.department}</p>
      <p><strong>Organizer:</strong> ${item.organizer}</p>
      <p><strong>Category:</strong> ${item.category}</p>
      <p class="mt-3">${item.description}</p>
     <button class="btn btn-success w-100 register-btn" data-event-id="EVT001">
  Register
</button>

    `;
  } else if (type === "gallery") {
    content = `
      <h3>${item.title}</h3>
      <p><strong>Date:</strong> ${item.date}</p>
      <p><strong>Category:</strong> ${item.category}</p>
      <p class="mt-3">${item.description}</p>
      <div class="row g-2 mt-3">
        ${item.recap.map(img => `
          <div class="col-6">
            <img src="${img}" class="img-fluid rounded" alt="recap">
          </div>
        `).join("")}
      </div>
    `;
  }

  // Inject into modal
  const modalBody = document.getElementById("detailsModalBody");
  modalBody.innerHTML = content;

  const modal = new bootstrap.Modal(document.getElementById("detailsModal"));
  modal.show();
}

document.addEventListener("click", (e) => {
  if (e.target.classList.contains("register-btn")) {
    const eventId = e.target.getAttribute("data-event-id");
    window.location.href = `register.html?event=${eventId}`;
  }
});
