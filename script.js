// TriageCare AI Chat Interface
class TriageCareChat {
  constructor() {
    this.chatWindow = document.getElementById("chat-window");
    this.userInput = document.getElementById("user-input");
    this.sendBtn = document.getElementById("send-btn");
    this.startTriageBtn = document.getElementById("start-triage-btn");
    this.conversationHistory = [];
    this.currentSymptoms = [];

    this.initializeChat();
    this.bindEvents();
  }

  initializeChat() {
    this.addMessage(
      "bot",
      "AI",
      "Hello! I'm TriageCare AI, your medical intake assistant. Please describe your symptoms or health concerns, and I'll help guide you to the appropriate care."
    );
  }

  bindEvents() {
    this.sendBtn?.addEventListener("click", () => this.sendMessage());
    this.userInput?.addEventListener("keypress", (e) => {
      if (e.key === "Enter") this.sendMessage();
    });
    this.startTriageBtn?.addEventListener("click", () => {
      document.getElementById("demo").scrollIntoView({ behavior: "smooth" });
    });
  }

  addMessage(type, sender, text) {
    const messageDiv = document.createElement("div");
    messageDiv.className = `message ${type}`;

    messageDiv.innerHTML = `
            <div class="avatar">${sender === "AI" ? "AI" : "U"}</div>
            <div class="text">${text
              .replace(/\n/g, "<br>")
              .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")}</div>
        `;

    this.chatWindow.appendChild(messageDiv);
    this.chatWindow.scrollTop = this.chatWindow.scrollHeight;
  }

  async sendMessage() {
    const message = this.userInput.value.trim();
    if (!message) return;

    this.addMessage("user", "User", message);
    this.userInput.value = "";
    this.conversationHistory.push(`User: ${message}`);

    // Show typing indicator
    this.showTyping();

    const response = await this.getAIResponse(message);
    this.hideTyping();
    this.addMessage("bot", "AI", response);
  }

  showTyping() {
    const typingDiv = document.createElement("div");
    typingDiv.className = "message bot typing";
    typingDiv.innerHTML = `
            <div class="avatar">AI</div>
            <div class="text">Analyzing your symptoms...</div>
        `;
    this.chatWindow.appendChild(typingDiv);
    this.chatWindow.scrollTop = this.chatWindow.scrollHeight;
  }

  hideTyping() {
    const typing = this.chatWindow.querySelector(".typing");
    if (typing) typing.remove();
  }

  async getAIResponse(userMessage) {
    const lowerMessage = userMessage.toLowerCase();
    this.conversationHistory.push(userMessage);

    // Handle greetings
    if (lowerMessage.includes("hi") || lowerMessage.includes("hello")) {
      return "Hello! I'm TriageCare AI. Please describe your symptoms and I'll provide appropriate recommendations based on severity.";
    }

    // Check for multiple symptoms in one message
    const symptoms = this.extractSymptoms(userMessage);
    if (symptoms.length > 0) {
      this.currentSymptoms = [
        ...new Set([...this.currentSymptoms, ...symptoms]),
      ];
    }

    // Handle follow-up questions about existing symptoms
    if (
      this.isFollowUpQuestion(lowerMessage) &&
      this.currentSymptoms.length > 0
    ) {
      return this.handleFollowUp(lowerMessage);
    }

    // Get medical recommendation for new symptoms
    const recommendation = SYMPTOM_CLASSIFIER.getRecommendation(userMessage);

    if (recommendation) {
      let response = `**${recommendation.severity} SEVERITY**\n\n`;

      if (recommendation.severity === "SEVERE") {
        response += `🚨 **${recommendation.action}**\n\n${recommendation.advice}`;
      } else {
        response += `**Condition:** ${recommendation.condition}\n\n`;

        if (recommendation.medicines) {
          response += "**Recommended Medications:**\n";
          recommendation.medicines.forEach((med) => {
            response += `• ${med.name}: ${med.dose} (Max: ${med.maxDaily}/day)\n`;
          });
          response += "\n";
        }

        response += `**Advice:** ${recommendation.advice}`;

        if (recommendation.severity === "MEDIUM") {
          response +=
            "\n\n⚠️ Monitor symptoms closely and consult a doctor if they worsen.";
        }
      }

      response +=
        "\n\nDo you have any other symptoms or questions about your current condition?";
      return response;
    }

    // Handle pain-related queries intelligently
    if (
      lowerMessage.includes("pain") ||
      lowerMessage.includes("hurt") ||
      lowerMessage.includes("ache")
    ) {
      let response = "**PAIN ASSESSMENT**\n\n";
      response += "I understand you're experiencing pain. ";

      if (
        lowerMessage.includes("leg") ||
        lowerMessage.includes("running") ||
        lowerMessage.includes("exercise")
      ) {
        const painRec = SYMPTOM_CLASSIFIER.getRecommendation("leg pain");
        if (painRec) {
          response = `**${painRec.severity} SEVERITY - LEG PAIN**\n\n`;
          response += "**Recommended Medications:**\n";
          painRec.medicines.forEach((med) => {
            response += `• ${med.name}: ${med.dose} (Max: ${med.maxDaily}/day)\n`;
          });
          response += `\n**Advice:** ${painRec.advice}`;
          response += "\n\nDo you have any other symptoms or questions?";
          return response;
        }
      }

      response += "To provide better guidance:\n\n";
      response += "• **Location**: Where exactly is the pain?\n";
      response += "• **Intensity**: Rate 1-10 (10 being unbearable)\n";
      response += "• **Duration**: How long have you had this pain?\n";
      response += "• **Cause**: Any recent injury or activity?\n\n";
      response += "Please provide more details for specific recommendations.";
      return response;
    }

    // Try API call for unknown symptoms
    try {
      const context =
        this.currentSymptoms.length > 0
          ? `Current symptoms discussed: ${this.currentSymptoms.join(", ")}. `
          : "";
      const prompt = `You are TriageCare AI. ${context}User says: "${userMessage}". Provide helpful medical guidance and ask follow-up questions. Keep response under 100 words.`;

      const response = await fetch(
        `${CONFIG.GEMINI_API_URL}?key=${CONFIG.GEMINI_API_KEY}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            contents: [{ parts: [{ text: prompt }] }],
          }),
        }
      );

      if (response.ok) {
        const data = await response.json();
        return (
          data.candidates[0].content.parts[0].text +
          "\n\nIs there anything else you'd like to know?"
        );
      }
    } catch (error) {
      console.log("API unavailable, using fallback");
    }

    return "I'm here to help with your health concerns. Could you describe your symptoms in more detail? For example, mention the location, intensity, and any activities that might have caused the issue.";
  }

  extractSymptoms(message) {
    const symptomKeywords = [
      "headache",
      "fever",
      "cough",
      "cold",
      "stomach pain",
      "diarrhea",
      "back pain",
      "sore throat",
      "chest pain",
      "breathing",
      "nausea",
      "vomiting",
      "leg pain",
      "muscle pain",
    ];
    const found = [];
    const lowerMessage = message.toLowerCase();

    // Check for pain-related terms
    if (
      lowerMessage.includes("pain in leg") ||
      lowerMessage.includes("leg pain")
    ) {
      found.push("leg pain");
    }
    if (lowerMessage.includes("muscle") && lowerMessage.includes("pain")) {
      found.push("muscle pain");
    }
    if (lowerMessage.includes("running") || lowerMessage.includes("exercise")) {
      found.push("exercise pain");
    }

    symptomKeywords.forEach((symptom) => {
      if (lowerMessage.includes(symptom)) {
        found.push(symptom);
      }
    });

    return found;
  }

  isFollowUpQuestion(message) {
    const followUpKeywords = [
      "what about",
      "also",
      "and",
      "plus",
      "additionally",
      "more",
      "other",
      "else",
    ];
    return followUpKeywords.some((keyword) => message.includes(keyword));
  }

  handleFollowUp(message) {
    const lowerMessage = message.toLowerCase();

    // Check if asking about a specific symptom
    if (lowerMessage.includes("cough")) {
      const coughRec = SYMPTOM_CLASSIFIER.getRecommendation("cough");
      if (coughRec) {
        let response = `**For your cough (LOW SEVERITY):**\n\n`;
        response += "**Recommended Medications:**\n";
        coughRec.medicines.forEach((med) => {
          response += `• ${med.name}: ${med.dose} (Max: ${med.maxDaily}/day)\n`;
        });
        response += `\n**Advice:** ${coughRec.advice}`;
        response += "\n\nAnything else you'd like to know about your symptoms?";
        return response;
      }
    }

    if (lowerMessage.includes("cold")) {
      const coldRec = SYMPTOM_CLASSIFIER.getRecommendation("cold");
      if (coldRec) {
        let response = `**For your cold (LOW SEVERITY):**\n\n`;
        response += "**Recommended Medications:**\n";
        coldRec.medicines.forEach((med) => {
          response += `• ${med.name}: ${med.dose} (Max: ${med.maxDaily}/day)\n`;
        });
        response += `\n**Advice:** ${coldRec.advice}`;
        response +=
          "\n\nIs there anything else about your symptoms you'd like to discuss?";
        return response;
      }
    }

    return `Based on your current symptoms (${this.currentSymptoms.join(
      ", "
    )}), I can provide more specific guidance. What would you like to know more about?`;
  }
}

// Initialize chat when DOM is loaded
document.addEventListener("DOMContentLoaded", () => {
  new TriageCareChat();
  initializeCalendar();
});

// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener("click", function (e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute("href"));
    if (target) {
      target.scrollIntoView({ behavior: "smooth" });
    }
  });
});

// Calendar Functionality
const today = new Date();
const startMonth = today.getMonth(); // Current month
const startYear = today.getFullYear();
let currentMonth = startMonth;
let currentYear = startYear;

function initializeCalendar() {
  const calendarCard = document.querySelector(".calendar-card");
  if (!calendarCard) return;

  const calendarGrid = calendarCard.querySelector(".calendar-grid");
  const calendarMonthLabel = calendarCard.querySelector(
    ".calendar-month > span"
  );
  const leftArrow = calendarCard.querySelectorAll(".cal-nav")[0];
  const rightArrow = calendarCard.querySelectorAll(".cal-nav")[1];
  const timeSlotsTitle = calendarCard.querySelector(".time-slots h5");
  const slotsGrid = calendarCard.querySelector(".slots-grid");
  const confirmBtn = calendarCard.querySelector(".confirm-btn");

  let selectedDate = null;
  let selectedTime = null;
  let selectedMonth = currentMonth;
  let selectedYear = currentYear;

  // Render initial calendar
  renderCalendar(calendarGrid, calendarMonthLabel, currentMonth, currentYear);

  // Handle left arrow (previous month) - only if not at start month
  if (leftArrow) {
    leftArrow.classList.add("disabled");
    leftArrow.addEventListener("click", () => {
      // Check if we can go back (only to current month, not past)
      if (
        currentYear > startYear ||
        (currentYear === startYear && currentMonth > startMonth)
      ) {
        currentMonth--;
        if (currentMonth < 0) {
          currentMonth = 11;
          currentYear--;
        }
        renderCalendar(
          calendarGrid,
          calendarMonthLabel,
          currentMonth,
          currentYear
        );
        bindDaySelection(
          calendarGrid,
          timeSlotsTitle,
          slotsGrid,
          confirmBtn,
          () => selectedDate,
          (d) => {
            selectedDate = d;
            selectedMonth = currentMonth;
            selectedYear = currentYear;
          },
          () => selectedTime,
          (t) => {
            selectedTime = t;
          }
        );

        // Reset selection when changing month
        selectedDate = null;
        selectedTime = null;
        if (timeSlotsTitle) {
          timeSlotsTitle.textContent = "Select a date first";
        }
        updateConfirmButton(confirmBtn, null, null);

        // Update arrow states
        updateArrowStates(leftArrow, rightArrow);
      }
    });
  }

  function updateArrowStates(left, right) {
    // Disable left arrow if at start month
    if (currentYear === startYear && currentMonth === startMonth) {
      left.classList.add("disabled");
    } else {
      left.classList.remove("disabled");
    }
  }

  // Handle right arrow (next month)
  if (rightArrow) {
    rightArrow.addEventListener("click", () => {
      currentMonth++;
      if (currentMonth > 11) {
        currentMonth = 0;
        currentYear++;
      }
      renderCalendar(
        calendarGrid,
        calendarMonthLabel,
        currentMonth,
        currentYear
      );
      bindDaySelection(
        calendarGrid,
        timeSlotsTitle,
        slotsGrid,
        confirmBtn,
        () => selectedDate,
        (d) => {
          selectedDate = d;
          selectedMonth = currentMonth;
          selectedYear = currentYear;
        },
        () => selectedTime,
        (t) => {
          selectedTime = t;
        }
      );

      // Reset selection when changing month
      selectedDate = null;
      selectedTime = null;
      if (timeSlotsTitle) {
        timeSlotsTitle.textContent = "Select a date first";
      }
      updateConfirmButton(confirmBtn, null, null);

      // Update arrow states
      updateArrowStates(leftArrow, rightArrow);
    });
  }

  // Initial day selection binding
  bindDaySelection(
    calendarGrid,
    timeSlotsTitle,
    slotsGrid,
    confirmBtn,
    () => selectedDate,
    (d) => {
      selectedDate = d;
      selectedMonth = currentMonth;
      selectedYear = currentYear;
    },
    () => selectedTime,
    (t) => {
      selectedTime = t;
    }
  );

  // Handle time slot selection
  if (slotsGrid) {
    slotsGrid.addEventListener("click", (e) => {
      const slot = e.target.closest(".time-slot");
      if (!slot) return;

      // Remove previous selection
      slotsGrid.querySelectorAll(".time-slot.selected").forEach((s) => {
        s.classList.remove("selected");
      });

      // Add selection
      slot.classList.add("selected");
      selectedTime = slot.textContent;

      updateConfirmButton(
        confirmBtn,
        selectedDate,
        selectedTime,
        selectedMonth,
        selectedYear
      );
    });
  }

  // Handle confirm button
  if (confirmBtn) {
    confirmBtn.addEventListener("click", () => {
      if (selectedDate && selectedTime) {
        const monthNames = [
          "January",
          "February",
          "March",
          "April",
          "May",
          "June",
          "July",
          "August",
          "September",
          "October",
          "November",
          "December",
        ];
        showAppointmentConfirmation(
          selectedDate,
          selectedTime,
          monthNames[selectedMonth],
          selectedYear
        );
      } else {
        showNotification("Please select a date and time first", "warning");
      }
    });
  }
}

function renderCalendar(calendarGrid, monthLabel, month, year) {
  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  // Update month label
  if (monthLabel) {
    monthLabel.textContent = `${monthNames[month]} ${year}`;
  }

  // Get first day of month and total days
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const todayDate = new Date();
  const isCurrentMonth =
    month === todayDate.getMonth() && year === todayDate.getFullYear();
  const isPastMonth =
    year < todayDate.getFullYear() ||
    (year === todayDate.getFullYear() && month < todayDate.getMonth());

  // Build calendar HTML
  let html = `
    <span class="day-header">Su</span>
    <span class="day-header">Mo</span>
    <span class="day-header">Tu</span>
    <span class="day-header">We</span>
    <span class="day-header">Th</span>
    <span class="day-header">Fr</span>
    <span class="day-header">Sa</span>
  `;

  // Empty cells for days before first of month
  for (let i = 0; i < firstDay; i++) {
    html += `<span class="day"></span>`;
  }

  // Days of the month
  for (let day = 1; day <= daysInMonth; day++) {
    const dayOfWeek = new Date(year, month, day).getDay();
    const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;
    const isPast = isPastMonth || (isCurrentMonth && day < todayDate.getDate());
    const isToday = isCurrentMonth && day === todayDate.getDate();

    let classes = "day";
    if (isPast) {
      classes += " past";
    } else if (isWeekend) {
      classes += ""; // Unavailable on weekends
    } else {
      classes += " available";
    }

    if (isToday) {
      classes += " today";
    }

    html += `<span class="${classes}">${day}</span>`;
  }

  // Fill remaining cells
  const totalCells = firstDay + daysInMonth;
  const remainingCells = (7 - (totalCells % 7)) % 7;
  for (let i = 0; i < remainingCells; i++) {
    html += `<span class="day"></span>`;
  }

  calendarGrid.innerHTML = html;
}

function bindDaySelection(
  calendarGrid,
  timeSlotsTitle,
  slotsGrid,
  confirmBtn,
  getSelectedDate,
  setSelectedDate,
  getSelectedTime,
  setSelectedTime
) {
  const days = calendarGrid.querySelectorAll(".day.available");
  const monthNames = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];

  days.forEach((day) => {
    day.addEventListener("click", () => {
      // Remove previous selection
      calendarGrid.querySelectorAll(".day.selected").forEach((d) => {
        d.classList.remove("selected");
      });

      // Add selection to clicked day
      day.classList.add("selected");
      setSelectedDate(day.textContent);

      // Update time slots title
      if (timeSlotsTitle) {
        timeSlotsTitle.textContent = `Available Times for ${monthNames[currentMonth]} ${day.textContent}`;
      }

      // Generate random available times for variety
      updateTimeSlots(slotsGrid);

      // Reset time selection
      setSelectedTime(null);
      updateConfirmButton(confirmBtn, day.textContent, null);
    });
  });
}

function updateTimeSlots(slotsGrid) {
  if (!slotsGrid) return;

  const allTimes = [
    "9:00 AM",
    "9:30 AM",
    "10:00 AM",
    "10:30 AM",
    "11:00 AM",
    "11:30 AM",
    "1:00 PM",
    "1:30 PM",
    "2:00 PM",
    "2:30 PM",
    "3:00 PM",
    "3:30 PM",
    "4:00 PM",
  ];

  // Randomly select 4-6 available times
  const shuffled = allTimes.sort(() => 0.5 - Math.random());
  const available = shuffled.slice(0, Math.floor(Math.random() * 3) + 4);
  available.sort((a, b) => {
    const timeA = new Date("1/1/2025 " + a);
    const timeB = new Date("1/1/2025 " + b);
    return timeA - timeB;
  });

  slotsGrid.innerHTML = available
    .map((time) => `<button class="time-slot">${time}</button>`)
    .join("");
}

function updateConfirmButton(btn, date, time) {
  if (!btn) return;

  const monthNames = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];

  if (date && time) {
    btn.textContent = `Confirm: ${monthNames[currentMonth]} ${date} at ${time}`;
    btn.classList.add("ready");
  } else if (date) {
    btn.textContent = `Select a time slot`;
    btn.classList.remove("ready");
  } else {
    btn.textContent = `Confirm Appointment`;
    btn.classList.remove("ready");
  }
}

function showAppointmentConfirmation(date, time, monthName, year) {
  // Create modal
  const modal = document.createElement("div");
  modal.className = "appointment-modal";
  modal.innerHTML = `
        <div class="modal-content">
            <div class="modal-icon">
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
                    <polyline points="22 4 12 14.01 9 11.01"/>
                </svg>
            </div>
            <h3>Appointment Confirmed!</h3>
            <p class="modal-details">
                <strong>Dr. Sarah Johnson</strong> - Cardiologist<br>
                <span class="modal-datetime">${monthName} ${date}, ${year} at ${time}</span>
            </p>
            <div class="modal-info">
                <p>📧 Confirmation email sent</p>
                <p>📱 Reminder set for 24 hours before</p>
            </div>
            <button class="modal-close-btn">Done</button>
        </div>
    `;

  document.body.appendChild(modal);

  // Animate in
  setTimeout(() => modal.classList.add("active"), 10);

  // Close button
  modal.querySelector(".modal-close-btn").addEventListener("click", () => {
    modal.classList.remove("active");
    setTimeout(() => modal.remove(), 300);
  });

  // Close on overlay click
  modal.addEventListener("click", (e) => {
    if (e.target === modal) {
      modal.classList.remove("active");
      setTimeout(() => modal.remove(), 300);
    }
  });
}

function showNotification(message, type = "info") {
  const notification = document.createElement("div");
  notification.className = `notification ${type}`;
  notification.innerHTML = `
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="12" cy="12" r="10"/>
            <line x1="12" y1="8" x2="12" y2="12"/>
            <line x1="12" y1="16" x2="12.01" y2="16"/>
        </svg>
        <span>${message}</span>
    `;

  document.body.appendChild(notification);
  setTimeout(() => notification.classList.add("active"), 10);

  setTimeout(() => {
    notification.classList.remove("active");
    setTimeout(() => notification.remove(), 300);
  }, 3000);
}
