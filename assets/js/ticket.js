document.addEventListener("DOMContentLoaded", () => {
  const params = new URLSearchParams(window.location.search);
  const ticketId = params.get("id");

  const tickets = JSON.parse(localStorage.getItem("tickets")) || {};
  const ticket = tickets[ticketId];

  if (ticket) {
    document.getElementById("ticketDetails").innerHTML = `
      <h3>🎟 Ticket Verification</h3>
      <p><strong>Ticket ID:</strong> ${ticketId}</p>
      <p><strong>Name:</strong> ${ticket.name}</p>
      <p><strong>Date:</strong> ${ticket.date}</p>
    `;
  } else {
    document.getElementById("ticketDetails").innerHTML = "<p>❌ Ticket not found.</p>";
  }
});
