// wishlist.js
document.addEventListener("DOMContentLoaded", () => {
  // Ensure wishlist exists
  if (!localStorage.getItem("wishlist")) {
    localStorage.setItem("wishlist", JSON.stringify([]));
  }

  // Handle bookmark clicks (event delegation)
  document.body.addEventListener("click", (e) => {
    if (e.target.closest(".bookmark-btn")) {
      const btn = e.target.closest(".bookmark-btn");
      const data = JSON.parse(btn.dataset.item); // full event/gallery object
      toggleBookmark(data, btn);
    }
  });

  // Show wishlist when modal opens
  const wishlistModal = document.getElementById("wishlistModal");
  if (wishlistModal) {
    wishlistModal.addEventListener("show.bs.modal", renderWishlist);
  }
});

// ---- Helpers ----
function showToast(type, title, text) {
  if (window.Swal && Swal.fire) {
    Swal.fire({
      toast: true,
      position: "bottom-end",
      icon: type,           // "success", "info", "warning", "error"
      title: title,
      text: text,
      showConfirmButton: false,
      timer: 2000,
      timerProgressBar: true
    });
  } else {
    // Fallback if SweetAlert2 isn't loaded
    console.log(`${type.toUpperCase()}: ${title} - ${text}`);
  }
}

// Toggle bookmark (card buttons)
function toggleBookmark(item, btn) {
  let wishlist = JSON.parse(localStorage.getItem("wishlist"));
  const exists = wishlist.find(w => w.id === item.id && w.type === item.type);

  if (exists) {
    wishlist = wishlist.filter(w => !(w.id === item.id && w.type === item.type));
    btn.innerHTML = `<i class="bi bi-bookmark"></i>`;
    showToast("info", "Bookmark Removed", "Bookmark removed from your bookmarks");
  } else {
    wishlist.push(item);
    btn.innerHTML = `<i class="bi bi-bookmark-fill text-primary"></i>`;
    showToast("success", "Image Bookmarked", "Bookmark added to your bookmarks");
  }

  localStorage.setItem("wishlist", JSON.stringify(wishlist));
}

// Render Wishlist (modal body)
function renderWishlist() {
  const wishlist = JSON.parse(localStorage.getItem("wishlist")) || [];
  const body = document.getElementById("wishlistBody");

  if (!wishlist.length) {
    body.innerHTML = `<p class="text-muted">No items added yet.</p>`;
    return;
  }

  body.innerHTML = `
    <div class="row g-3">
      ${wishlist.map(item => `
        <div class="col-md-4">
          <div class="card h-100 shadow-sm position-relative">
            <span class="badge bg-primary position-absolute top-0 start-0 m-2">${item.category}</span>
            <img src="${item.image || item.path}" class="card-img-top" alt="${item.title}">
            <div class="card-body">
              <h6 class="card-title">${item.title}</h6>
              ${item.date ? `<p class="small mb-1"><strong>Date:</strong> ${item.date}</p>` : ""}
              ${item.venue ? `<p class="small mb-1"><strong>Venue:</strong> ${item.venue}</p>` : ""}
              <button class="btn btn-sm btn-danger w-100 remove-btn" data-id="${item.id}" data-type="${item.type}">Remove</button>
            </div>
          </div>
        </div>
      `).join("")}
    </div>
  `;

  // Attach remove functionality (inside modal)
  body.querySelectorAll(".remove-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      const id = btn.dataset.id;
      const type = btn.dataset.type;
      removeFromWishlist(id, type);

      // Also reset the icon on the main card, if it's visible
      const cardBtn = document.querySelector(`.bookmark-btn[data-id="${id}"][data-type="${type}"]`);
      if (cardBtn) {
        cardBtn.innerHTML = `<i class="bi bi-bookmark"></i>`;
      }

      renderWishlist(); // refresh modal list
      showToast("info", "Bookmark Removed", "Event removed from your bookmarks");
    });
  });
}

// Remove item (by id + type)
function removeFromWishlist(id, type) {
  let wishlist = JSON.parse(localStorage.getItem("wishlist"));
  wishlist = wishlist.filter(item => !(item.id === id && item.type === type));
  localStorage.setItem("wishlist", JSON.stringify(wishlist));
}

