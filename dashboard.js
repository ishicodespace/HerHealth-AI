// Staff Dashboard JavaScript
// Handles dashboard interactions and real-time updates

document.addEventListener("DOMContentLoaded", function () {
  initializeDashboard();
  setupNavigation();
  setupRealTimeUpdates();
  initializeFilters();
});

function initializeDashboard() {
  // Set current date for appointment filter
  const dateInput = document.getElementById("appointment-date");
  if (dateInput) {
    const today = new Date();
    dateInput.value = today.toISOString().split("T")[0];
  }

  // Update last updated time
  updateLastUpdatedTime();
}

function setupNavigation() {
  // Sidebar navigation
  const sidebarLinks = document.querySelectorAll(".sidebar-link");
  const sections = document.querySelectorAll(".dashboard-section");

  sidebarLinks.forEach((link) => {
    link.addEventListener("click", (e) => {
      e.preventDefault();
      const targetSection = link.getAttribute("data-section");

      // Update active states
      sidebarLinks.forEach((l) => l.classList.remove("active"));
      link.classList.add("active");

      // Show target section
      sections.forEach((section) => {
        section.classList.remove("active");
        if (section.id === targetSection) {
          section.classList.add("active");
        }
      });

      // Update URL hash
      history.pushState(null, null, `#${targetSection}`);
    });
  });

  // Handle direct URL access with hash
  const hash = window.location.hash.slice(1);
  if (hash) {
    const targetLink = document.querySelector(
      `.sidebar-link[data-section="${hash}"]`
    );
    if (targetLink) {
      targetLink.click();
    }
  }
}

function setupRealTimeUpdates() {
  // Simulate real-time updates every 30 seconds
  setInterval(() => {
    updateLastUpdatedTime();
    simulateNewTriageItem();
  }, 30000);
}

function updateLastUpdatedTime() {
  const timeElement = document.getElementById("last-update-time");
  if (timeElement) {
    timeElement.textContent = "Just now";
  }
}

function simulateNewTriageItem() {
  // Flash the triage badge to indicate new items
  const triageBadge = document.querySelector(
    '.sidebar-link[data-section="triage"] .sidebar-badge'
  );
  if (triageBadge) {
    triageBadge.classList.add("pulse");
    setTimeout(() => triageBadge.classList.remove("pulse"), 2000);
  }
}

function initializeFilters() {
  // Triage filter
  const triageFilter = document.getElementById("triage-filter");
  if (triageFilter) {
    triageFilter.addEventListener("change", (e) => {
      filterTriageQueue(e.target.value);
    });
  }

  // Follow-up filter
  const followupFilter = document.getElementById("followup-filter");
  if (followupFilter) {
    followupFilter.addEventListener("change", (e) => {
      filterFollowups(e.target.value);
    });
  }
}

function filterTriageQueue(priority) {
  const queueItems = document.querySelectorAll(".queue-item");
  queueItems.forEach((item) => {
    if (priority === "all" || item.classList.contains(priority)) {
      item.style.display = "flex";
    } else {
      item.style.display = "none";
    }
  });
}

function filterFollowups(filter) {
  const followupCards = document.querySelectorAll(".followup-card");
  followupCards.forEach((card) => {
    if (filter === "all") {
      card.style.display = "block";
    } else if (filter === "overdue" && card.classList.contains("overdue")) {
      card.style.display = "block";
    } else if (filter === "today" && card.classList.contains("due-today")) {
      card.style.display = "block";
    } else if (
      filter === "week" &&
      (card.classList.contains("due-today") ||
        card.classList.contains("upcoming"))
    ) {
      card.style.display = "block";
    } else {
      card.style.display = "none";
    }
  });
}

// Action handlers
function escalateToER(patientId) {
  if (confirm("Escalate this patient to the Emergency Room?")) {
    showNotification(
      "Patient escalated to ER. Emergency team notified.",
      "urgent"
    );
  }
}

function assignDoctor(patientId) {
  // In a real app, this would open a doctor selection modal
  showNotification("Doctor assignment dialog would open here.", "info");
}

function scheduleAppointment(patientId) {
  // In a real app, this would open the scheduling interface
  showNotification("Scheduling interface would open here.", "info");
}

function sendReminder(appointmentId) {
  showNotification("Reminder sent to patient successfully!", "success");
}

function rescheduleAppointment(appointmentId) {
  showNotification("Reschedule dialog would open here.", "info");
}

function cancelAppointment(appointmentId) {
  if (confirm("Are you sure you want to cancel this appointment?")) {
    showNotification(
      "Appointment cancelled. Patient will be notified.",
      "warning"
    );
  }
}

function contactPatient(patientId, method) {
  const methods = {
    call: "Initiating call...",
    sms: "SMS sent to patient.",
    email: "Email sent to patient.",
  };
  showNotification(methods[method] || "Contacting patient...", "success");
}

function showNotification(message, type = "info") {
  // Create notification element
  const notification = document.createElement("div");
  notification.className = `dashboard-notification ${type}`;
  notification.innerHTML = `
        <span class="notification-message">${message}</span>
        <button class="notification-close">&times;</button>
    `;

  // Add to page
  document.body.appendChild(notification);

  // Animate in
  setTimeout(() => notification.classList.add("show"), 10);

  // Auto-remove after 4 seconds
  setTimeout(() => {
    notification.classList.remove("show");
    setTimeout(() => notification.remove(), 300);
  }, 4000);

  // Close button handler
  notification
    .querySelector(".notification-close")
    .addEventListener("click", () => {
      notification.classList.remove("show");
      setTimeout(() => notification.remove(), 300);
    });
}

// Export functions for use in HTML onclick handlers
window.escalateToER = escalateToER;
window.assignDoctor = assignDoctor;
window.scheduleAppointment = scheduleAppointment;
window.sendReminder = sendReminder;
window.rescheduleAppointment = rescheduleAppointment;
window.cancelAppointment = cancelAppointment;
window.contactPatient = contactPatient;
