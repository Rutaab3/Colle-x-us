// gallery.js
document.addEventListener("DOMContentLoaded", () => {
  loadAllGallery();
});

// Load ALL gallery items (rectangle style)
function loadAllGallery() {
  fetch("assets/data/gallery.json")
    .then(res => res.json())
    .then(data => {
      const galleryRow = document.getElementById("galleryRow");
      galleryRow.innerHTML = "";

      data.forEach(item => {
        const card = `
          <div class="col-md-4 mb-4">
            <div class="card event-card shadow-sm position-relative border-0 overflow-hidden view-details-btn" 
                 data-id="${item.id}" data-type="gallery">
              
              <!-- Background image -->
              <div class="event-card-img" style="background-image: url('${item.path}');">
                
                <!-- Category pill -->
                <span class="badge bg-success position-absolute top-0 start-0 m-2">${item.category}</span>
                
                <!-- Overlay text -->
                <div class="event-card-overlay p-3 text-white">
                  <h5 class="mb-1">${item.title}</h5>
                  <p class="mb-0 small"><strong>${item.date}</strong></p>
                </div>
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

// Attach listeners for details (whole card clickable)
function attachDetailListeners(data, type) {
  document.querySelectorAll(".view-details-btn").forEach(card => {
    card.addEventListener("click", (e) => {
      // Don’t trigger if bookmark button is clicked
      if (e.target.closest(".bookmark-btn")) return;

      const id = card.getAttribute("data-id");
      const item = data.find(d => d.id === id);
      if (item) showDetails(item, type);
    });
  });
}

// Show gallery details in modal
function showDetails(item, type) {
  if (type !== "gallery") return;

  let content = `
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

  const modalBody = document.getElementById("detailsModalBody");
  modalBody.innerHTML = content;

  const modal = new bootstrap.Modal(document.getElementById("detailsModal"));
  modal.show();
}
