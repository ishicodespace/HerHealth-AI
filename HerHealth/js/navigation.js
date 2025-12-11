/* =====================================================
   HerHealth Navigation Module
   Handles navigation, routing, and screen transitions
   ===================================================== */

// Navigation State
const NavState = {
  history: ["home"],
  currentIndex: 0,
  isTransitioning: false,
};

// Screen Container Transition Styles
const screenContainer = document.getElementById("screen-container");
if (screenContainer) {
  screenContainer.style.transition = "opacity 0.15s ease, transform 0.15s ease";
}

// Handle Back Navigation
function navigateBack() {
  if (NavState.currentIndex > 0) {
    NavState.currentIndex--;
    const screen = NavState.history[NavState.currentIndex];
    loadScreenWithTransition(screen, "back");
  }
}

// Navigate to Screen
function navigateTo(screenName) {
  if (NavState.isTransitioning) return;

  // Add to history
  NavState.currentIndex++;
  NavState.history = NavState.history.slice(0, NavState.currentIndex);
  NavState.history.push(screenName);

  loadScreenWithTransition(screenName, "forward");
}

// Load Screen with Transition
function loadScreenWithTransition(screenName, direction = "forward") {
  NavState.isTransitioning = true;

  const container = document.getElementById("screen-container");
  if (!container) {
    NavState.isTransitioning = false;
    return;
  }

  // Exit animation
  if (direction === "forward") {
    container.style.opacity = "0";
    container.style.transform = "translateX(-20px)";
  } else {
    container.style.opacity = "0";
    container.style.transform = "translateX(20px)";
  }

  setTimeout(() => {
    // Load content
    if (window.HerHealth && window.HerHealth.loadScreen) {
      // Use main app's loadScreen function
    } else {
      loadScreenContent(screenName);
    }

    // Enter animation
    if (direction === "forward") {
      container.style.transform = "translateX(20px)";
    } else {
      container.style.transform = "translateX(-20px)";
    }

    requestAnimationFrame(() => {
      container.style.opacity = "1";
      container.style.transform = "translateX(0)";
    });

    NavState.isTransitioning = false;
  }, 150);
}

// Load Screen Content (Fallback)
function loadScreenContent(screenName) {
  const container = document.getElementById("screen-container");
  const template = document.getElementById(`${screenName}-screen-template`);

  if (container && template) {
    container.innerHTML = "";
    const content = template.content.cloneNode(true);
    container.appendChild(content);
  }
}

// Handle Swipe Gestures for Navigation
let touchStartX = 0;
let touchEndX = 0;

document.addEventListener(
  "touchstart",
  (e) => {
    touchStartX = e.changedTouches[0].screenX;
  },
  { passive: true }
);

document.addEventListener(
  "touchend",
  (e) => {
    touchEndX = e.changedTouches[0].screenX;
    handleSwipeGesture();
  },
  { passive: true }
);

function handleSwipeGesture() {
  const threshold = 100;
  const diff = touchEndX - touchStartX;

  // Swipe right to go back
  if (diff > threshold && touchStartX < 50) {
    navigateBack();
  }
}

// Update Active Nav Item
function updateActiveNav(screenName) {
  const navItems = document.querySelectorAll(".nav-item");
  navItems.forEach((item) => {
    if (item.dataset.screen === screenName) {
      item.classList.add("active");
    } else {
      item.classList.remove("active");
    }
  });
}

// Scroll to Top of Screen
function scrollToTop(smooth = true) {
  const container = document.getElementById("screen-container");
  if (container) {
    container.scrollTo({
      top: 0,
      behavior: smooth ? "smooth" : "auto",
    });
  }
}

// Handle Tab Bar Item Double-Tap to Scroll Top
const navItems = document.querySelectorAll(".nav-item");
let lastTap = 0;

navItems.forEach((item) => {
  item.addEventListener("click", () => {
    const currentTime = Date.now();
    const screen = item.dataset.screen;

    if (
      currentTime - lastTap < 300 &&
      window.HerHealth?.state?.currentScreen === screen
    ) {
      scrollToTop();
    }

    lastTap = currentTime;
    updateActiveNav(screen);
  });
});

// Export Navigation Functions
window.Navigation = {
  navigateTo,
  navigateBack,
  scrollToTop,
  state: NavState,
};
