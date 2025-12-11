/* =====================================================
   HerHealth App Core JavaScript
   Main application logic and state management
   ===================================================== */

// App State
const AppState = {
  currentScreen: "home",
  user: {
    name: "Siya",
    cycleDay: 20,
    cyclePhase: "Luteal",
    cycleLength: 28,
    periodDue: 8,
  },
  isLoading: false,
  modals: {
    quickLog: false,
  },
  currentChatRoom: null,
};

// DOM Ready
document.addEventListener("DOMContentLoaded", () => {
  initApp();
});

// Initialize Application
function initApp() {
  // Show splash screen for 2 seconds
  setTimeout(() => {
    hideSplashScreen();
    initNavigation();
    loadScreen("home");
    initFAB();
    initQuickLogModal();
    updateDate();
  }, 2000);
}

// Hide Splash Screen
function hideSplashScreen() {
  const splashScreen = document.getElementById("splash-screen");
  const appShell = document.getElementById("app-shell");

  if (splashScreen) {
    splashScreen.classList.add("hidden");
    setTimeout(() => {
      splashScreen.style.display = "none";
    }, 500);
  }

  // Make app shell visible
  if (appShell) {
    appShell.classList.add("visible");
  }
}

// Update Current Date
function updateDate() {
  const dateElement = document.getElementById("current-date");
  if (dateElement) {
    const options = { weekday: "long", month: "short", day: "numeric" };
    const today = new Date();
    dateElement.textContent = today.toLocaleDateString("en-US", options);
  }
}

// Initialize Navigation
function initNavigation() {
  const navItems = document.querySelectorAll(".nav-item");

  navItems.forEach((item) => {
    item.addEventListener("click", (e) => {
      const screen = item.dataset.screen;
      if (screen && screen !== AppState.currentScreen) {
        // Update active state
        navItems.forEach((nav) => nav.classList.remove("active"));
        item.classList.add("active");

        // Load new screen
        loadScreen(screen);
        AppState.currentScreen = screen;

        // Haptic feedback (if supported)
        if (navigator.vibrate) {
          navigator.vibrate(10);
        }
      }
    });
  });
}

// Load Screen
function loadScreen(screenName) {
  const container = document.getElementById("screen-container");
  const template = document.getElementById(`${screenName}-screen-template`);

  if (!container) {
    console.error("Screen container not found");
    return;
  }

  if (!template) {
    console.error(`Template not found: ${screenName}-screen-template`);
    return;
  }

  // Animate out current content
  container.style.opacity = "0";
  container.style.transform = "translateX(-10px)";

  setTimeout(() => {
    // Clear and load new content
    container.innerHTML = "";
    const content = template.content.cloneNode(true);
    container.appendChild(content);

    // Animate in new content
    container.style.opacity = "1";
    container.style.transform = "translateX(0)";

    // Initialize screen-specific features
    initScreenFeatures(screenName);

    // Update date on home screen
    if (screenName === "home") {
      const dateEl = container.querySelector(".date-text");
      if (dateEl) {
        const options = { weekday: "long", month: "short", day: "numeric" };
        dateEl.textContent = new Date().toLocaleDateString("en-US", options);
      }
    }
  }, 150);
}

// Initialize Screen-specific Features
function initScreenFeatures(screenName) {
  switch (screenName) {
    case "home":
      initHomeScreen();
      break;
    case "insights":
      initInsightsScreen();
      break;
    case "community":
      initCommunityScreen();
      break;
    case "profile":
      initProfileScreen();
      break;
    case "diet":
      initDietScreen();
      break;
    case "ayurveda":
      initAyurvedaScreen();
      break;
    case "remedies":
      initRemediesScreen();
      break;
    case "doctor":
      initDoctorScreen();
      break;
    case "calendar":
      initCalendarScreen();
      break;
    case "chatroom":
      initChatRoomScreen();
      break;
    case "ai-assistant":
      initAIAssistantScreen();
      break;
    case "onboarding-welcome":
    case "onboarding-cycle":
    case "onboarding-goals":
    case "onboarding-diet":
      initOnboardingScreen(screenName);
      break;
  }
}

// Home Screen Init
function initHomeScreen() {
  // Animate cycle ring
  animateCycleRing();

  // Initialize quick action cards
  const actionCards = document.querySelectorAll(".action-card");
  actionCards.forEach((card) => {
    card.addEventListener("click", () => {
      const action = card.dataset.action;
      handleQuickAction(action);
    });
  });

  // Initialize notification button
  const notifBtn = document.querySelector(".notification-btn");
  if (notifBtn) {
    notifBtn.addEventListener("click", () => {
      showToast("You have 3 new notifications");
    });
  }
}

// Animate Cycle Ring
function animateCycleRing() {
  const ring = document.querySelector(".cycle-ring-progress");
  if (ring) {
    // Calculate progress based on cycle day
    const progress = (AppState.user.cycleDay / AppState.user.cycleLength) * 100;
    const circumference = 534; // 2 * PI * 85
    const offset = circumference - (progress / 100) * circumference;

    setTimeout(() => {
      ring.style.strokeDashoffset = offset;
    }, 300);
  }
}

// Handle Quick Actions
function handleQuickAction(action) {
  switch (action) {
    case "calendar":
      loadScreen("calendar");
      break;
    case "doctor":
      loadScreen("doctor");
      break;
    case "diet":
      loadScreen("diet");
      break;
    case "ayurveda":
      loadScreen("ayurveda");
      break;
    case "remedies":
      loadScreen("remedies");
      break;
  }
}

// Insights Screen Init
function initInsightsScreen() {
  // Initialize period selector
  const periodBtns = document.querySelectorAll(".period-btn");
  periodBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      periodBtns.forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");
      // Update charts based on selected period
    });
  });

  // Animate progress bars
  setTimeout(() => {
    const bars = document.querySelectorAll(".bar-fill, .breakdown-fill");
    bars.forEach((bar) => {
      bar.style.transition = "width 1s ease";
    });
  }, 300);
}

// Community Screen Init
function initCommunityScreen() {
  // Initialize room cards - navigate to chat room on click
  const roomCards = document.querySelectorAll(".room-card");
  roomCards.forEach((card) => {
    card.addEventListener("click", () => {
      const roomName = card.querySelector(".room-name").textContent;
      const roomMembers = card.querySelector(".room-members").textContent;
      const roomActive = card.querySelector(".room-active").textContent;

      // Store room info for chat screen
      AppState.currentChatRoom = {
        name: roomName,
        members: roomMembers,
        active: roomActive,
      };

      loadScreen("chatroom");
    });
  });

  // Initialize peer connect buttons
  const connectBtns = document.querySelectorAll(".peer-card .btn");
  connectBtns.forEach((btn) => {
    btn.addEventListener("click", (e) => {
      e.stopPropagation();
      btn.textContent = "Requested";
      btn.disabled = true;
      showToast("Connection request sent");
    });
  });

  // Initialize anonymous toggle
  const anonToggle = document.querySelector(".anonymous-toggle input");
  if (anonToggle) {
    anonToggle.addEventListener("change", () => {
      const status = anonToggle.checked ? "enabled" : "disabled";
      showToast(`Anonymous mode ${status}`);
    });
  }
}

// Chat Room Screen Init
function initChatRoomScreen() {
  // Update room info from state
  if (AppState.currentChatRoom) {
    const roomNameEl = document.querySelector(".chat-room-name");
    const roomMembersEl = document.querySelector(".chat-room-members");

    if (roomNameEl) roomNameEl.textContent = AppState.currentChatRoom.name;
    if (roomMembersEl) {
      roomMembersEl.textContent = `${AppState.currentChatRoom.members} ${AppState.currentChatRoom.active}`;
    }
  }

  // Back button handler
  const backBtn = document.querySelector(".back-btn");
  if (backBtn) {
    backBtn.addEventListener("click", () => {
      loadScreen("community");
      // Re-activate community nav item
      document
        .querySelectorAll(".nav-item")
        .forEach((nav) => nav.classList.remove("active"));
      document
        .querySelector('.nav-item[data-screen="community"]')
        ?.classList.add("active");
    });
  }

  // Pinned message close
  const pinClose = document.querySelector(".pin-close");
  if (pinClose) {
    pinClose.addEventListener("click", () => {
      const pinnedMsg = document.querySelector(".pinned-message");
      if (pinnedMsg) {
        pinnedMsg.style.animation = "slideUp 0.2s ease reverse";
        setTimeout(() => pinnedMsg.remove(), 200);
      }
    });
  }

  // Chat input and send
  const chatInput = document.getElementById("chat-input");
  const sendBtn = document.getElementById("chat-send-btn");
  const chatMessages = document.getElementById("chat-messages");

  const sendMessage = () => {
    const message = chatInput.value.trim();
    if (!message) return;

    // Remove typing indicator
    const typingMsg = document.querySelector(".chat-message.typing");
    if (typingMsg) typingMsg.remove();

    // Create new message
    const messageEl = document.createElement("div");
    messageEl.className = "chat-message self";
    messageEl.innerHTML = `
      <div class="message-content">
        <div class="message-header">
          <span class="message-sender">You</span>
          <span class="message-time">${new Date().toLocaleTimeString("en-US", {
            hour: "numeric",
            minute: "2-digit",
            hour12: true,
          })}</span>
        </div>
        <div class="message-bubble">
          <p>${escapeHtml(message)}</p>
        </div>
      </div>
    `;

    chatMessages.appendChild(messageEl);
    chatInput.value = "";

    // Scroll to bottom
    chatMessages.scrollTop = chatMessages.scrollHeight;

    // Simulate response after a delay
    setTimeout(() => {
      simulateChatResponse(chatMessages);
    }, 1500 + Math.random() * 2000);
  };

  if (sendBtn) {
    sendBtn.addEventListener("click", sendMessage);
  }

  if (chatInput) {
    chatInput.addEventListener("keypress", (e) => {
      if (e.key === "Enter") {
        sendMessage();
      }
    });
  }

  // Emoji picker toggle
  const emojiBtn = document.querySelector(".chat-emoji-btn");
  const emojiPicker = document.getElementById("emoji-picker");

  if (emojiBtn && emojiPicker) {
    emojiBtn.addEventListener("click", () => {
      emojiPicker.style.display =
        emojiPicker.style.display === "none" ? "block" : "none";
    });

    // Emoji selection
    const emojiBtns = emojiPicker.querySelectorAll(".emoji-btn");
    emojiBtns.forEach((btn) => {
      btn.addEventListener("click", () => {
        chatInput.value += btn.textContent;
        chatInput.focus();
        emojiPicker.style.display = "none";
      });
    });

    // Close emoji picker when clicking outside
    document.addEventListener("click", (e) => {
      if (!emojiPicker.contains(e.target) && e.target !== emojiBtn) {
        emojiPicker.style.display = "none";
      }
    });
  }

  // Reaction buttons
  const reactionBtns = document.querySelectorAll(".reaction-btn");
  reactionBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      const currentCount = parseInt(btn.textContent.match(/\d+/)?.[0] || 0);
      const emoji = btn.textContent.match(/[^\d\s]+/)?.[0] || "❤️";
      btn.textContent = `${emoji} ${currentCount + 1}`;
      btn.style.background = "var(--color-primary-100)";
    });
  });

  // Scroll to bottom initially
  if (chatMessages) {
    chatMessages.scrollTop = chatMessages.scrollHeight;
  }
}

// Simulate chat response
function simulateChatResponse(chatMessages) {
  const responses = [
    {
      sender: "MeenaHealth",
      text: "That's a great question! I've been dealing with the same thing 💜",
    },
    {
      sender: "Anonymous",
      text: "Have you tried consulting with Dr. Priya? She's really helpful for these issues.",
    },
    {
      sender: "WellnessGuru",
      text: "I found that adding turmeric milk before bed really helped me! 🥛✨",
    },
    {
      sender: "SnehaFit",
      text: "Yes, I agree! Also try doing some gentle yoga, it really makes a difference 🧘‍♀️",
    },
    {
      sender: "HealthyDiva",
      text: "Thanks for sharing! This community is so supportive 🙏❤️",
    },
  ];

  const response = responses[Math.floor(Math.random() * responses.length)];
  const initial = response.sender.charAt(0);

  const messageEl = document.createElement("div");
  messageEl.className = "chat-message other";
  messageEl.innerHTML = `
    <div class="message-avatar">${initial}</div>
    <div class="message-content">
      <div class="message-header">
        <span class="message-sender">${response.sender}</span>
        <span class="message-time">${new Date().toLocaleTimeString("en-US", {
          hour: "numeric",
          minute: "2-digit",
          hour12: true,
        })}</span>
      </div>
      <div class="message-bubble">
        <p>${response.text}</p>
      </div>
      <div class="message-reactions">
        <button class="reaction-btn">❤️ 0</button>
        <button class="reaction-btn">👍 0</button>
      </div>
    </div>
  `;

  chatMessages.appendChild(messageEl);
  chatMessages.scrollTop = chatMessages.scrollHeight;

  // Add reaction handlers to new message
  const newReactions = messageEl.querySelectorAll(".reaction-btn");
  newReactions.forEach((btn) => {
    btn.addEventListener("click", () => {
      const currentCount = parseInt(btn.textContent.match(/\d+/)?.[0] || 0);
      const emoji = btn.textContent.match(/[^\d\s]+/)?.[0] || "❤️";
      btn.textContent = `${emoji} ${currentCount + 1}`;
      btn.style.background = "var(--color-primary-100)";
    });
  });
}

// Escape HTML to prevent XSS
function escapeHtml(text) {
  const div = document.createElement("div");
  div.textContent = text;
  return div.innerHTML;
}

// AI Assistant Screen Init
function initAIAssistantScreen() {
  const chatMessages = document.getElementById("ai-chat-messages");
  const chatInput = document.getElementById("ai-chat-input");
  const sendBtn = document.getElementById("ai-send-btn");
  const voiceBtn = document.getElementById("ai-voice-btn");

  // Send message function
  const sendMessage = (messageText) => {
    const message = messageText || chatInput.value.trim();
    if (!message) return;

    // Remove suggestions after first message
    const suggestions = document.querySelector(".ai-suggestions");
    if (suggestions) suggestions.remove();

    // Add user message
    const userMessageEl = document.createElement("div");
    userMessageEl.className = "ai-message user";
    userMessageEl.innerHTML = `
      <div class="ai-message-content">
        <div class="ai-message-bubble">
          <p>${escapeHtml(message)}</p>
        </div>
        <span class="ai-message-time">${new Date().toLocaleTimeString("en-US", {
          hour: "numeric",
          minute: "2-digit",
          hour12: true,
        })}</span>
      </div>
    `;
    chatMessages.appendChild(userMessageEl);
    chatInput.value = "";
    chatMessages.scrollTop = chatMessages.scrollHeight;

    // Show typing indicator
    const typingEl = document.createElement("div");
    typingEl.className = "ai-typing";
    typingEl.innerHTML = `
      <div class="ai-message-avatar">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M12 2a2 2 0 0 1 2 2c0 .74-.4 1.39-1 1.73V7h1a7 7 0 0 1 7 7h1a1 1 0 0 1 1 1v3a1 1 0 0 1-1 1h-1v1a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-1H2a1 1 0 0 1-1-1v-3a1 1 0 0 1 1-1h1a7 7 0 0 1 7-7h1V5.73c-.6-.34-1-.99-1-1.73a2 2 0 0 1 2-2z" />
          <circle cx="7.5" cy="14.5" r="1.5" fill="currentColor" />
          <circle cx="16.5" cy="14.5" r="1.5" fill="currentColor" />
          <path d="M9 18h6" stroke-linecap="round" />
        </svg>
      </div>
      <div class="ai-typing-indicator">
        <span></span>
        <span></span>
        <span></span>
      </div>
    `;
    chatMessages.appendChild(typingEl);
    chatMessages.scrollTop = chatMessages.scrollHeight;

    // Generate AI response after delay
    setTimeout(() => {
      typingEl.remove();
      const aiResponse = generateAIResponse(message);
      addAIMessage(aiResponse, chatMessages);
    }, 1500 + Math.random() * 1000);
  };

  // Send button click
  if (sendBtn) {
    sendBtn.addEventListener("click", () => sendMessage());
  }

  // Enter key to send
  if (chatInput) {
    chatInput.addEventListener("keypress", (e) => {
      if (e.key === "Enter") sendMessage();
    });
  }

  // Voice button (simulated)
  if (voiceBtn) {
    voiceBtn.addEventListener("click", () => {
      voiceBtn.classList.toggle("recording");
      if (voiceBtn.classList.contains("recording")) {
        showToast("🎤 Listening...");
        setTimeout(() => {
          voiceBtn.classList.remove("recording");
          chatInput.value = "What foods help with period cramps?";
          showToast("Voice captured!");
        }, 2000);
      }
    });
  }

  // Quick topic buttons
  const topicBtns = document.querySelectorAll(".quick-topic-btn");
  topicBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      const topic = btn.dataset.topic;
      const topicQuestions = {
        cycle: "Tell me about my menstrual cycle and what to expect",
        symptoms:
          "What are common symptoms I might experience during my cycle?",
        nutrition: "What should I eat for better hormonal health?",
        ayurveda: "What Ayurvedic practices can help with women's health?",
        mental: "How can I manage mood swings and stress during my cycle?",
      };
      sendMessage(
        topicQuestions[topic] || "Tell me more about " + btn.textContent
      );
    });
  });

  // Suggestion chips
  const suggestionChips = document.querySelectorAll(".suggestion-chip");
  suggestionChips.forEach((chip) => {
    chip.addEventListener("click", () => {
      const question = chip.dataset.question;
      sendMessage(question);
    });
  });
}

// Add AI Message to chat
function addAIMessage(response, chatMessages) {
  const messageEl = document.createElement("div");
  messageEl.className = "ai-message assistant";
  messageEl.innerHTML = `
    <div class="ai-message-avatar">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <path d="M12 2a2 2 0 0 1 2 2c0 .74-.4 1.39-1 1.73V7h1a7 7 0 0 1 7 7h1a1 1 0 0 1 1 1v3a1 1 0 0 1-1 1h-1v1a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-1H2a1 1 0 0 1-1-1v-3a1 1 0 0 1 1-1h1a7 7 0 0 1 7-7h1V5.73c-.6-.34-1-.99-1-1.73a2 2 0 0 1 2-2z" />
        <circle cx="7.5" cy="14.5" r="1.5" fill="currentColor" />
        <circle cx="16.5" cy="14.5" r="1.5" fill="currentColor" />
        <path d="M9 18h6" stroke-linecap="round" />
      </svg>
    </div>
    <div class="ai-message-content">
      <div class="ai-message-bubble">
        ${response}
      </div>
      <span class="ai-message-time">${new Date().toLocaleTimeString("en-US", {
        hour: "numeric",
        minute: "2-digit",
        hour12: true,
      })}</span>
    </div>
  `;
  chatMessages.appendChild(messageEl);
  chatMessages.scrollTop = chatMessages.scrollHeight;
}

// Generate AI Response based on user message
function generateAIResponse(userMessage) {
  const message = userMessage.toLowerCase();

  // Period/Cycle related
  if (
    message.includes("period") ||
    message.includes("cycle") ||
    message.includes("menstrual")
  ) {
    if (message.includes("late") || message.includes("delay")) {
      return `<p>There are several reasons your period might be late:</p>
        <ul>
          <li>🧘 <strong>Stress</strong> - High stress can delay ovulation</li>
          <li>⚖️ <strong>Weight changes</strong> - Sudden weight loss/gain affects hormones</li>
          <li>💪 <strong>Exercise</strong> - Intense workouts can impact your cycle</li>
          <li>😴 <strong>Sleep changes</strong> - Irregular sleep affects hormones</li>
          <li>🤰 <strong>Pregnancy</strong> - Consider taking a test if applicable</li>
        </ul>
        <p>Based on your tracking data, your average cycle is ${AppState.user.cycleLength} days. If your period is more than 7 days late, consider consulting a doctor. 💜</p>`;
    }
    if (message.includes("expect") || message.includes("what to")) {
      return `<p>Here's what to expect during your cycle phases:</p>
        <ul>
          <li>🔴 <strong>Menstrual (Days 1-5)</strong> - Period bleeding, possible cramps. Rest and stay hydrated!</li>
          <li>🌱 <strong>Follicular (Days 6-13)</strong> - Energy increases, skin clears up. Great time for new projects!</li>
          <li>✨ <strong>Ovulation (Day 14)</strong> - Peak energy & fertility. You might notice clear discharge.</li>
          <li>🍂 <strong>Luteal (Days 15-28)</strong> - Energy decreases, PMS symptoms may appear. Practice self-care!</li>
        </ul>
        <p>You're currently on <strong>Day ${AppState.user.cycleDay}</strong> (${AppState.user.cyclePhase} phase). Would you like specific tips for this phase?</p>`;
    }
    return `<p>Your menstrual cycle is a vital sign of your overall health! 📊</p>
      <p>Currently, you're on <strong>Day ${AppState.user.cycleDay}</strong> of your cycle, in the <strong>${AppState.user.cyclePhase}</strong> phase. Your next period is expected in about <strong>${AppState.user.periodDue} days</strong>.</p>
      <p>Would you like tips for managing this phase, or do you have specific concerns?</p>`;
  }

  // Cramps/Pain related
  if (message.includes("cramp") || message.includes("pain")) {
    return `<p>Here are natural remedies for period cramps that work well for Indian women:</p>
      <ul>
        <li>🫚 <strong>Ginger tea (Adrak chai)</strong> - Anti-inflammatory, reduces prostaglandins</li>
        <li>🌿 <strong>Ajwain water</strong> - Heat ajwain seeds in water, very effective!</li>
        <li>💆 <strong>Warm sesame oil massage</strong> - On lower abdomen, circular motions</li>
        <li>🥛 <strong>Haldi doodh</strong> - Turmeric milk reduces inflammation</li>
        <li>🧘 <strong>Child's pose (Balasana)</strong> - Gentle yoga helps relax muscles</li>
        <li>🔥 <strong>Hot water bottle</strong> - On lower back or tummy</li>
      </ul>
      <p><strong>Avoid:</strong> Cold drinks, caffeine, and salty foods during this time.</p>`;
  }

  // Food/Diet related
  if (
    message.includes("food") ||
    message.includes("eat") ||
    message.includes("diet") ||
    message.includes("nutrition")
  ) {
    return `<p>Here's an Indian diet guide for hormonal health:</p>
      <ul>
        <li>🌾 <strong>Whole grains</strong> - Ragi, jowar, bajra over refined wheat</li>
        <li>🥬 <strong>Green leafy veggies</strong> - Palak, methi, sarson for iron</li>
        <li>🫘 <strong>Dal & legumes</strong> - Moong, masoor, chana for protein</li>
        <li>🥜 <strong>Seeds</strong> - Til (sesame), alsi (flax), sunflower seeds</li>
        <li>🥛 <strong>Dairy</strong> - A2 milk, dahi, paneer in moderation</li>
        <li>🍌 <strong>Fruits</strong> - Banana, pomegranate, papaya</li>
      </ul>
      <p><strong>During periods:</strong> Increase iron-rich foods like dates (khajoor), jaggery (gud), and beetroot!</p>
      <p>Would you like a specific meal plan for your current cycle phase?</p>`;
  }

  // PCOS related
  if (message.includes("pcos") || message.includes("pcod")) {
    return `<p>Managing PCOS with Indian lifestyle approaches:</p>
      <ul>
        <li>🌿 <strong>Methi (Fenugreek)</strong> - Soak seeds overnight, drink water morning</li>
        <li>🫚 <strong>Jeera water</strong> - Boil cumin seeds, helps with insulin resistance</li>
        <li>🥗 <strong>Low GI diet</strong> - Replace white rice with brown rice or millets</li>
        <li>🧘 <strong>Yoga</strong> - Especially Suryanamaskar and Kapalbhati</li>
        <li>😴 <strong>Sleep</strong> - 7-8 hours, same time daily</li>
        <li>🚶‍♀️ <strong>Walk</strong> - 30 mins after meals</li>
      </ul>
      <p><strong>Ayurvedic herbs:</strong> Shatavari, Ashwagandha (consult doctor first)</p>
      <p>Would you like a detailed PCOS management plan?</p>`;
  }

  // Ayurveda related
  if (
    message.includes("ayurved") ||
    message.includes("natural") ||
    message.includes("herbal")
  ) {
    return `<p>Ayurvedic wisdom for women's health:</p>
      <ul>
        <li>🌅 <strong>Morning ritual</strong> - Warm water with lemon, tongue scraping</li>
        <li>🫖 <strong>CCF tea</strong> - Cumin, coriander, fennel seeds tea for digestion</li>
        <li>🌿 <strong>Shatavari</strong> - The "Queen of herbs" for women</li>
        <li>💆 <strong>Abhyanga</strong> - Daily self-massage with warm oil</li>
        <li>🧘 <strong>Pranayama</strong> - Nadi Shodhana for hormonal balance</li>
        <li>😴 <strong>Sleep by 10 PM</strong> - Align with natural cycles</li>
      </ul>
      <p><strong>For your ${AppState.user.cyclePhase} phase:</strong> Focus on calming, grounding practices and warm, nourishing foods.</p>`;
  }

  // Mood/Mental health related
  if (
    message.includes("mood") ||
    message.includes("stress") ||
    message.includes("anxious") ||
    message.includes("mental") ||
    message.includes("depress")
  ) {
    return `<p>Managing mood changes during your cycle:</p>
      <ul>
        <li>🧘 <strong>Pranayama</strong> - Bhramari (bee breath) calms the mind instantly</li>
        <li>🌸 <strong>Aromatherapy</strong> - Lavender, rose, or sandalwood oil</li>
        <li>📝 <strong>Journaling</strong> - Write down your feelings, especially premenstrual</li>
        <li>🚶‍♀️ <strong>Nature walk</strong> - 20 mins outdoor time daily</li>
        <li>🥛 <strong>Ashwagandha milk</strong> - At bedtime for stress relief</li>
        <li>💜 <strong>Self-compassion</strong> - Your feelings are valid!</li>
      </ul>
      <p>Based on your cycle, you're ${
        AppState.user.cycleDay > 20
          ? "in the luteal phase when mood changes are common. Be extra gentle with yourself! 💕"
          : "in a good phase for energy. If you're feeling low, it might be worth exploring other factors."
      }</p>`;
  }

  // Symptoms related
  if (message.includes("symptom")) {
    return `<p>Common symptoms during the menstrual cycle:</p>
      <ul>
        <li>📅 <strong>Before period (PMS)</strong> - Bloating, mood swings, breast tenderness, cravings</li>
        <li>🔴 <strong>During period</strong> - Cramps, fatigue, headaches, back pain</li>
        <li>✨ <strong>Mid-cycle</strong> - Mild cramping during ovulation, increased discharge</li>
        <li>🍂 <strong>Luteal phase</strong> - Acne, anxiety, food cravings</li>
      </ul>
      <p>You're on Day ${
        AppState.user.cycleDay
      }. Common symptoms for this phase include ${
      AppState.user.cyclePhase === "Ovulation"
        ? "mild cramping, increased energy, and clear discharge."
        : AppState.user.cyclePhase === "Menstrual"
        ? "cramps, fatigue, and mood changes."
        : "varies based on individual patterns."
    }</p>
      <p>Would you like remedies for any specific symptom?</p>`;
  }

  // Default response
  return `<p>That's a great question! 💜</p>
    <p>I'm here to help with:</p>
    <ul>
      <li>📅 Period & cycle tracking insights</li>
      <li>🌿 Ayurvedic remedies & natural wellness</li>
      <li>🍽️ Indian diet & nutrition advice</li>
      <li>💊 Symptom management tips</li>
      <li>🧘 Mental wellness support</li>
    </ul>
    <p>Could you tell me more about what you'd like to know? I can provide personalized advice based on your cycle data!</p>`;
}

// Profile Screen Init
function initProfileScreen() {
  // Initialize menu items
  const menuItems = document.querySelectorAll(".menu-item");
  menuItems.forEach((item) => {
    item.addEventListener("click", () => {
      const label = item.querySelector(".menu-label").textContent;
      // Handle specific menu actions
      if (label.includes("Find a Gynecologist")) {
        loadScreen("doctor");
      } else {
        showToast(`Opening ${label}...`);
      }
    });
  });

  // Initialize logout button
  const logoutBtn = document.querySelector(".logout-btn");
  if (logoutBtn) {
    logoutBtn.addEventListener("click", () => {
      if (confirm("Are you sure you want to log out?")) {
        showToast("Logging out...");
      }
    });
  }
}

// Diet Screen Init
function initDietScreen() {
  // Initialize filter chips
  const filterChips = document.querySelectorAll(".diet-filter .filter-chip");
  filterChips.forEach((chip) => {
    chip.addEventListener("click", () => {
      filterChips.forEach((c) => c.classList.remove("active"));
      chip.classList.add("active");
      showToast(`Showing ${chip.textContent} diet plans`);
    });
  });

  // Initialize swap buttons
  const swapBtns = document.querySelectorAll(".swap-btn");
  swapBtns.forEach((btn) => {
    btn.addEventListener("click", (e) => {
      e.stopPropagation();
      showToast("Finding alternative meal...");
    });
  });

  // Initialize water tracker
  const addWaterBtn = document.querySelector(".add-water-btn");
  if (addWaterBtn) {
    addWaterBtn.addEventListener("click", () => {
      const waterFill = document.querySelector(".water-fill");
      const currentHeight = parseInt(waterFill.style.height) || 62;
      const newHeight = Math.min(currentHeight + 12.5, 100);
      waterFill.style.height = `${newHeight}%`;

      const waterCurrent = document.querySelector(".water-current");
      if (waterCurrent) {
        const current = parseInt(waterCurrent.textContent);
        waterCurrent.textContent = Math.min(current + 1, 8);
      }
      showToast("Water intake +1 glass 💧");
    });
  }

  // Initialize back button
  initBackButton();
}

// Ayurveda Screen Init
function initAyurvedaScreen() {
  // Initialize ritual checks
  const ritualCards = document.querySelectorAll(".ritual-card");
  ritualCards.forEach((card) => {
    card.addEventListener("click", () => {
      const check = card.querySelector(".ritual-check");
      if (check.classList.contains("empty")) {
        check.classList.remove("empty");
        check.textContent = "✓";
        card.classList.add("completed");
        showToast("Ritual completed! 🎉");
      }
    });
  });

  // Initialize retake quiz button
  const retakeBtn = document.querySelector(".retake-btn");
  if (retakeBtn) {
    retakeBtn.addEventListener("click", () => {
      showToast("Opening Dosha Quiz...");
    });
  }

  // Initialize back button
  initBackButton();
}

// Remedies Screen Init
function initRemediesScreen() {
  // Initialize symptom categories
  const categoryCards = document.querySelectorAll(".category-card");
  categoryCards.forEach((card) => {
    card.addEventListener("click", () => {
      categoryCards.forEach((c) => c.classList.remove("active"));
      card.classList.add("active");
      const symptom = card.dataset.symptom;
      updateRemediesForSymptom(symptom);
    });
  });

  // Initialize view recipe buttons
  const viewRecipeBtns = document.querySelectorAll(".remedy-card .btn");
  viewRecipeBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      showToast("Opening full recipe...");
    });
  });

  // Initialize back button
  initBackButton();
}

function updateRemediesForSymptom(symptom) {
  const sectionTitle = document.querySelector(
    ".remedies-section .section-title"
  );
  if (sectionTitle) {
    const symptomNames = {
      cramps: "Cramps",
      bloating: "Bloating",
      headache: "Headache",
      fatigue: "Fatigue",
      acne: "Acne",
      mood: "Mood Swings",
    };
    sectionTitle.textContent = `Remedies for ${
      symptomNames[symptom] || symptom
    }`;
  }
  showToast(`Showing remedies for ${symptom}`);
}

// Doctor Screen Init
function initDoctorScreen() {
  // Initialize specialization chips
  const specChips = document.querySelectorAll(".spec-chip");
  specChips.forEach((chip) => {
    chip.addEventListener("click", () => {
      specChips.forEach((c) => c.classList.remove("active"));
      chip.classList.add("active");
      showToast(`Filtering ${chip.textContent} doctors`);
    });
  });

  // Initialize book now buttons
  const bookBtns = document.querySelectorAll(".doctor-card .btn-primary");
  bookBtns.forEach((btn) => {
    btn.addEventListener("click", (e) => {
      e.stopPropagation();
      showToast("Opening appointment booking...");
    });
  });

  // Initialize view profile buttons
  const viewBtns = document.querySelectorAll(".doctor-card .btn-outline");
  viewBtns.forEach((btn) => {
    btn.addEventListener("click", (e) => {
      e.stopPropagation();
      showToast("Opening doctor profile...");
    });
  });

  // Initialize quick video consultation
  const videoBookBtn = document.querySelector(".quick-book-card .btn");
  if (videoBookBtn) {
    videoBookBtn.addEventListener("click", () => {
      showToast("Connecting to available doctor...");
    });
  }

  // Initialize back button
  initBackButton();
}

// Calendar Screen Init
function initCalendarScreen() {
  // Initialize month navigation
  const prevBtn = document.querySelector(".month-nav-btn.prev");
  const nextBtn = document.querySelector(".month-nav-btn.next");

  if (prevBtn) {
    prevBtn.addEventListener("click", () => {
      showToast("Loading previous month...");
    });
  }

  if (nextBtn) {
    nextBtn.addEventListener("click", () => {
      showToast("Loading next month...");
    });
  }

  // Initialize calendar day selection
  const calendarDays = document.querySelectorAll(
    ".calendar-day:not(.other-month)"
  );
  calendarDays.forEach((day) => {
    day.addEventListener("click", () => {
      calendarDays.forEach((d) => d.classList.remove("selected"));
      day.classList.add("selected");
      updateDayInfo(day.textContent, day.classList);
    });
  });

  // Initialize add log button
  const addLogBtn = document.querySelector(".add-log-btn");
  if (addLogBtn) {
    addLogBtn.addEventListener("click", () => {
      openQuickLogModal();
    });
  }

  // Initialize back button
  initBackButton();
}

function updateDayInfo(dayNumber, classList) {
  const dayDate = document.querySelector(".day-date");
  const dayPhase = document.querySelector(".day-phase");

  if (dayDate) {
    dayDate.textContent = `December ${dayNumber}, 2024`;
  }

  if (dayPhase) {
    if (classList.contains("period")) {
      dayPhase.textContent = "Period";
      dayPhase.className = "day-phase period";
    } else if (classList.contains("ovulation")) {
      dayPhase.textContent = "Ovulation Day";
      dayPhase.className = "day-phase ovulation";
    } else if (classList.contains("fertile")) {
      dayPhase.textContent = "Fertile Window";
      dayPhase.className = "day-phase fertile";
    } else {
      dayPhase.textContent = "Regular Day";
      dayPhase.className = "day-phase";
    }
  }
}

// Onboarding Screen Init
function initOnboardingScreen(screenName) {
  // Initialize next buttons
  const nextBtns = document.querySelectorAll(
    ".onboarding-next, .onboarding-complete"
  );
  nextBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      const nextScreen = btn.dataset.next;
      if (nextScreen) {
        if (nextScreen === "home") {
          // Complete onboarding
          localStorage.setItem("herhealth_onboarded", "true");
          loadScreen("home");
          showToast("Welcome to HerHealth! 🌸");
        } else {
          loadScreen(nextScreen);
        }
      }
    });
  });

  // Initialize back buttons
  const backBtns = document.querySelectorAll(".back-btn[data-back]");
  backBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      const prevScreen = btn.dataset.back;
      if (prevScreen) {
        loadScreen(prevScreen);
      }
    });
  });

  // Initialize skip links
  const skipLinks = document.querySelectorAll(
    ".skip-link[data-skip], .skip-btn"
  );
  skipLinks.forEach((link) => {
    link.addEventListener("click", () => {
      const skipTo = link.dataset.skip;
      if (skipTo) {
        loadScreen(skipTo);
      } else {
        showToast("Opening sign in...");
      }
    });
  });

  // Initialize cycle options
  if (screenName === "onboarding-cycle") {
    const cycleOptions = document.querySelectorAll(".cycle-option");
    cycleOptions.forEach((opt) => {
      opt.addEventListener("click", () => {
        cycleOptions.forEach((o) => o.classList.remove("active"));
        opt.classList.add("active");
      });
    });

    // Initialize period length slider
    const slider = document.querySelector("#period-length");
    const currentValue = document.querySelector(
      ".slider-labels .current-value"
    );
    if (slider && currentValue) {
      slider.addEventListener("input", () => {
        currentValue.textContent = `${slider.value} days`;
      });
    }
  }

  // Initialize goal cards
  if (screenName === "onboarding-goals") {
    const goalCards = document.querySelectorAll(".goal-card");
    goalCards.forEach((card) => {
      card.addEventListener("click", () => {
        card.classList.toggle("active");
      });
    });

    const conditionChips = document.querySelectorAll(".condition-chip");
    conditionChips.forEach((chip) => {
      chip.addEventListener("click", () => {
        chip.classList.toggle("active");
      });
    });
  }

  // Initialize diet type cards
  if (screenName === "onboarding-diet") {
    const dietCards = document.querySelectorAll(".diet-type-card");
    dietCards.forEach((card) => {
      card.addEventListener("click", () => {
        dietCards.forEach((c) => c.classList.remove("active"));
        card.classList.add("active");
      });
    });

    const cuisineChips = document.querySelectorAll(".cuisine-chip");
    cuisineChips.forEach((chip) => {
      chip.addEventListener("click", () => {
        chip.classList.toggle("active");
      });
    });
  }
}

// Initialize Back Button for sub-screens
function initBackButton() {
  const backBtn = document.querySelector(".screen-header.with-back .back-btn");
  if (backBtn && !backBtn.hasAttribute("onclick")) {
    backBtn.addEventListener("click", () => {
      loadScreen("home");
    });
  }
}

// FAB (Floating Action Button)
function initFAB() {
  const fab = document.getElementById("fab-log");
  if (fab) {
    fab.addEventListener("click", () => {
      openQuickLogModal();
    });
  }
}

// Quick Log Modal
function initQuickLogModal() {
  const modal = document.getElementById("quick-log-modal");
  const logItems = document.querySelectorAll(".quick-log-item");

  // Close on overlay click
  if (modal) {
    modal.addEventListener("click", (e) => {
      if (e.target === modal) {
        closeQuickLogModal();
      }
    });
  }

  // Handle log item clicks
  logItems.forEach((item) => {
    item.addEventListener("click", () => {
      const logType = item.dataset.log;
      handleQuickLog(logType);
    });
  });
}

function openQuickLogModal() {
  const modal = document.getElementById("quick-log-modal");
  if (modal) {
    modal.classList.add("active");
    AppState.modals.quickLog = true;

    // Haptic feedback
    if (navigator.vibrate) {
      navigator.vibrate(15);
    }
  }
}

function closeQuickLogModal() {
  const modal = document.getElementById("quick-log-modal");
  if (modal) {
    modal.classList.remove("active");
    AppState.modals.quickLog = false;
  }
}

function handleQuickLog(logType) {
  closeQuickLogModal();

  switch (logType) {
    case "period":
      showToast("Period logged for today");
      break;
    case "mood":
      showToast("Opening mood tracker...");
      break;
    case "symptoms":
      showToast("Opening symptom logger...");
      break;
    case "sleep":
      showToast("Opening sleep tracker...");
      break;
    case "water":
      showToast("Water intake +1 glass");
      break;
    case "medication":
      showToast("Opening medication tracker...");
      break;
  }
}

// Toast Notification
function showToast(message, duration = 3000) {
  // Remove existing toast
  const existingToast = document.querySelector(".toast-notification");
  if (existingToast) {
    existingToast.remove();
  }

  // Create new toast
  const toast = document.createElement("div");
  toast.className = "toast-notification";
  toast.innerHTML = `
    <span class="toast-message">${message}</span>
  `;

  // Add styles if not exists
  if (!document.querySelector("#toast-styles")) {
    const style = document.createElement("style");
    style.id = "toast-styles";
    style.textContent = `
      .toast-notification {
        position: fixed;
        bottom: 100px;
        left: 50%;
        transform: translateX(-50%);
        background: var(--color-neutral-800);
        color: white;
        padding: 12px 24px;
        border-radius: 100px;
        font-size: 14px;
        font-weight: 500;
        z-index: 9999;
        animation: slideInUp 0.3s ease, fadeOut 0.3s ease forwards;
        animation-delay: 0s, ${duration - 300}ms;
        box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
      }
    `;
    document.head.appendChild(style);
  }

  document.body.appendChild(toast);

  // Remove after duration
  setTimeout(() => {
    toast.remove();
  }, duration);
}

// Utility: Format Date
function formatDate(date, format = "short") {
  const d = new Date(date);
  const options =
    format === "short"
      ? { month: "short", day: "numeric" }
      : { weekday: "long", year: "numeric", month: "long", day: "numeric" };
  return d.toLocaleDateString("en-US", options);
}

// Utility: Calculate Days Until
function daysUntil(targetDate) {
  const now = new Date();
  const target = new Date(targetDate);
  const diff = target - now;
  return Math.ceil(diff / (1000 * 60 * 60 * 24));
}

// Export for use in other modules
window.HerHealth = {
  state: AppState,
  showToast,
  loadScreen,
  formatDate,
  daysUntil,
};
