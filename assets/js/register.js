// assets/js/register.js
document.addEventListener("DOMContentLoaded", () => {
  // 🔹 Check login before showing registration
  const loggedIn = localStorage.getItem("loggedIn") === "true";
  if (!loggedIn) {
    Swal.fire({
      icon: "warning",
      title: "Login Required",
      text: "You must be logged in to register for an event.",
      confirmButtonText: "Go to Login"
    }).then(() => {
      window.location.href = "login.html";
    });
    return; // stop further script execution
  }

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

  // ✅ JustValidate strict form validation
  const validation = new JustValidate("#registrationForm");

  validation
    .addField("#firstName", [
      { rule: "required", errorMessage: "First name is required" },
      { rule: "minLength", value: 2, errorMessage: "Must be at least 2 characters" }
    ])
    .addField("#lastName", [
      { rule: "required", errorMessage: "Last name is required" },
      { rule: "minLength", value: 2 }
    ])
    .addField("#email", [
      { rule: "required", errorMessage: "Email is required" },
      { rule: "email", errorMessage: "Enter a valid email" }
    ])
    .addField("#phone", [
      { rule: "required", errorMessage: "Phone is required" },
      { rule: "customRegexp", value: /^[0-9]{10,15}$/, errorMessage: "Enter valid phone number" }
    ])
    .addField("#userType", [
      { rule: "required", errorMessage: "Please select a user type" }
    ])
    .addField("#department", [
      { rule: "required", errorMessage: "Please select a department" }
    ])
    .addField("#terms", [
      { rule: "required", errorMessage: "You must agree to terms" }
    ])
    .onSuccess((event) => {
      event.preventDefault();

      Swal.fire({
        icon: "success",
        title: "Registration Successful!",
        text: "Your registration has been recorded. You can now download your ticket.",
        showCancelButton: true,
        confirmButtonText: "Download Ticket",
        cancelButtonText: "Close"
      }).then((result) => {
        if (result.isConfirmed) {
          console.log("Download Ticket clicked ✅");
          generateTicketPDF();
        }
        event.target.reset();
      });
    });

  // ✅ Ticket Download as PDF with embedded QR
function generateTicketPDF() {
  const { jsPDF } = window.jspdf;

  const firstName = document.getElementById("firstName").value;
  const lastName = document.getElementById("lastName").value;
  const eventDate = document.getElementById("event-date").innerText;

  // Unique Ticket ID
  const ticketId = "TCKT-" + Date.now();

  // Save ticket in localStorage
  const tickets = JSON.parse(localStorage.getItem("tickets")) || {};
  tickets[ticketId] = {
    name: `${firstName} ${lastName}`,
    date: eventDate,
    status: "Confirmed ✅"
  };
  localStorage.setItem("tickets", JSON.stringify(tickets));

  // ✅ QR Code encodes only the ticketId
  const qrDiv = document.createElement("div");
  const qr = new QRCode(qrDiv, {
text: window.location.origin + "/ticket.html?id=" + ticketId, 
    width: 128,
    height: 128,
    correctLevel: QRCode.CorrectLevel.L
  });

  setTimeout(() => {
    const qrCanvas = qrDiv.querySelector("canvas");
    const qrDataUrl = qrCanvas.toDataURL("image/png");

    const pdf = new jsPDF();

    pdf.setFontSize(16);
    pdf.text("Collexus Event Ticket", 20, 20);
    pdf.line(20, 25, 190, 25); // top HR

    pdf.setFontSize(12);
    pdf.text(`Name: ${firstName} ${lastName}`, 20, 40);
    pdf.text(`Date: ${eventDate}`, 20, 55);
    pdf.text(`Ticket ID: ${ticketId}`, 20, 70);

    // QR on right side
    pdf.addImage(qrDataUrl, "PNG", 140, 35, 50, 50);

    pdf.line(20, 95, 190, 95); // bottom HR

    pdf.save(`${firstName}_ticket.pdf`);
  }, 500);
}
});
