document.addEventListener("DOMContentLoaded", () => {
  // 🔒 Check if user is logged in
  const user = localStorage.getItem("collexusUser");
  
  if (!user) {
    Swal.fire({
      icon: "warning",
      title: "Login Required",
      text: "You must be logged in to register for an event.",
      confirmButtonText: "Go to Login"
    }).then(() => {
      window.location.href = "login.html";
    });
    return; // stop loading the page
  }

  // if user exists → continue with registration logic



document.addEventListener("DOMContentLoaded", () => {
  const params = new URLSearchParams(window.location.search);
  const eventId = params.get("event");

  // Load Event Data
  fetch("assets/data/events.json")
    .then(res => res.json())
    .then(events => {
      const event = events.find(ev => ev.id === eventId);
      if (event) {
        document.getElementById("event-category").innerText = event.category;
        document.getElementById("event-title").innerText = event.title;
        document.getElementById("event-date").innerText = `${event.date} | ${event.time}`;
        document.getElementById("event-location").innerText = event.venue;
      }
    })
    .catch(err => console.error("Error loading event:", err));

  // ✅ Strict Validation with JustValidate
  const validation = new JustValidate('#registrationForm');

  validation
    .addField('#firstName', [
      { rule: 'required', errorMessage: 'First name is required' },
      { rule: 'minLength', value: 2 },
    ])
    .addField('#lastName', [
      { rule: 'required', errorMessage: 'Last name is required' },
      { rule: 'minLength', value: 2 },
    ])
    .addField('#email', [
      { rule: 'required', errorMessage: 'Email is required' },
      { rule: 'email' },
    ])
    .addField('#phone', [
      { rule: 'required', errorMessage: 'Phone number is required' },
      { rule: 'minLength', value: 10 },
      { rule: 'maxLength', value: 15 },
    ])
    .addField('#userType', [
      { rule: 'required', errorMessage: 'Please select a user type' },
    ])
    .addField('#department', [
      { rule: 'required', errorMessage: 'Please select a department' },
    ])
    .addField('#terms', [
      { rule: 'required', errorMessage: 'You must agree to terms' },
    ])
    .onSuccess((event) => {
      event.preventDefault();

      // ✅ SweetAlert2 success popup
      Swal.fire({
        icon: "success",
        title: "Registration Successful!",
        text: "Your registration has been recorded. You can now download your ticket.",
        showCancelButton: true,
        confirmButtonText: "Download Ticket",
        cancelButtonText: "Close"
      }).then((result) => {
        if (result.isConfirmed) {
          generateTicket();
        }
      });

      // Reset form after submit
      event.target.reset();
    });

  // ✅ Ticket Download
  function generateTicket() {
    const firstName = document.getElementById("firstName").value;
    const eventTitle = document.getElementById("event-title").innerText;
    const eventDate = document.getElementById("event-date").innerText;

    const ticketContent = `
Event Ticket - Collexus
----------------------------
Name: ${firstName}
Event: ${eventTitle}
Date: ${eventDate}
Status: Confirmed ✅
    `;

    const blob = new Blob([ticketContent], { type: "text/plain" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `${firstName}_ticket.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
});

});