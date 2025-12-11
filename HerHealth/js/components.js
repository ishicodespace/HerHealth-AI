/* =====================================================
   HerHealth Components Module
   Reusable interactive component behaviors
   ===================================================== */

// =====================================================
// TOGGLE SWITCH
// =====================================================
class ToggleSwitch {
  constructor(element) {
    this.element = element;
    this.input = element.querySelector("input");
    this.init();
  }

  init() {
    if (this.input) {
      this.input.addEventListener("change", () => {
        this.onToggle(this.input.checked);
      });
    }
  }

  onToggle(isChecked) {
    // Haptic feedback
    if (navigator.vibrate) {
      navigator.vibrate(10);
    }

    // Dispatch custom event
    const event = new CustomEvent("toggle", {
      detail: { checked: isChecked },
    });
    this.element.dispatchEvent(event);
  }

  setValue(value) {
    if (this.input) {
      this.input.checked = value;
    }
  }

  getValue() {
    return this.input?.checked || false;
  }
}

// Initialize all toggle switches
document.querySelectorAll(".toggle-switch").forEach((toggle) => {
  new ToggleSwitch(toggle);
});

// =====================================================
// BOTTOM SHEET MODAL
// =====================================================
class BottomSheet {
  constructor(element) {
    this.element = element;
    this.content = element.querySelector(".modal-content, .quick-log-sheet");
    this.handle = element.querySelector(".modal-handle");
    this.isDragging = false;
    this.startY = 0;
    this.currentY = 0;
    this.init();
  }

  init() {
    // Handle drag
    if (this.handle && this.content) {
      this.handle.addEventListener("touchstart", this.onDragStart.bind(this), {
        passive: true,
      });
      this.handle.addEventListener("touchmove", this.onDragMove.bind(this), {
        passive: false,
      });
      this.handle.addEventListener("touchend", this.onDragEnd.bind(this), {
        passive: true,
      });
    }

    // Close on backdrop click
    this.element.addEventListener("click", (e) => {
      if (e.target === this.element) {
        this.close();
      }
    });
  }

  onDragStart(e) {
    this.isDragging = true;
    this.startY = e.touches[0].clientY;
    this.content.style.transition = "none";
  }

  onDragMove(e) {
    if (!this.isDragging) return;

    this.currentY = e.touches[0].clientY - this.startY;

    if (this.currentY > 0) {
      e.preventDefault();
      this.content.style.transform = `translateY(${this.currentY}px)`;
    }
  }

  onDragEnd() {
    this.isDragging = false;
    this.content.style.transition = "transform 0.3s ease";

    if (this.currentY > 100) {
      this.close();
    } else {
      this.content.style.transform = "translateY(0)";
    }

    this.currentY = 0;
  }

  open() {
    this.element.classList.add("active");
    document.body.style.overflow = "hidden";
  }

  close() {
    this.element.classList.remove("active");
    this.content.style.transform = "";
    document.body.style.overflow = "";
  }
}

// Initialize all bottom sheets
document.querySelectorAll(".modal-overlay").forEach((modal) => {
  const sheet = new BottomSheet(modal);
  modal._bottomSheet = sheet;
});

// =====================================================
// CARD RIPPLE EFFECT
// =====================================================
function createRipple(event, element) {
  const circle = document.createElement("span");
  const diameter = Math.max(element.clientWidth, element.clientHeight);
  const radius = diameter / 2;

  const rect = element.getBoundingClientRect();

  circle.style.width = circle.style.height = `${diameter}px`;
  circle.style.left = `${event.clientX - rect.left - radius}px`;
  circle.style.top = `${event.clientY - rect.top - radius}px`;
  circle.classList.add("ripple");

  // Add ripple styles if not exists
  if (!document.querySelector("#ripple-styles")) {
    const style = document.createElement("style");
    style.id = "ripple-styles";
    style.textContent = `
      .ripple {
        position: absolute;
        border-radius: 50%;
        transform: scale(0);
        animation: ripple-animation 0.6s linear;
        background-color: rgba(0, 0, 0, 0.1);
        pointer-events: none;
      }
      @keyframes ripple-animation {
        to {
          transform: scale(4);
          opacity: 0;
        }
      }
    `;
    document.head.appendChild(style);
  }

  const ripple = element.querySelector(".ripple");
  if (ripple) {
    ripple.remove();
  }

  element.style.position = "relative";
  element.style.overflow = "hidden";
  element.appendChild(circle);

  setTimeout(() => circle.remove(), 600);
}

// Apply ripple to clickable cards
document
  .querySelectorAll(".action-card, .room-card, .menu-item")
  .forEach((card) => {
    card.addEventListener("click", (e) => createRipple(e, card));
  });

// =====================================================
// PULL TO REFRESH
// =====================================================
class PullToRefresh {
  constructor(container, callback) {
    this.container = container;
    this.callback = callback;
    this.isPulling = false;
    this.startY = 0;
    this.pullDistance = 0;
    this.threshold = 80;
    this.init();
  }

  init() {
    this.container.addEventListener(
      "touchstart",
      this.onTouchStart.bind(this),
      { passive: true }
    );
    this.container.addEventListener("touchmove", this.onTouchMove.bind(this), {
      passive: false,
    });
    this.container.addEventListener("touchend", this.onTouchEnd.bind(this), {
      passive: true,
    });
  }

  onTouchStart(e) {
    if (this.container.scrollTop === 0) {
      this.isPulling = true;
      this.startY = e.touches[0].clientY;
    }
  }

  onTouchMove(e) {
    if (!this.isPulling) return;

    this.pullDistance = e.touches[0].clientY - this.startY;

    if (this.pullDistance > 0 && this.container.scrollTop === 0) {
      e.preventDefault();

      // Apply resistance
      const resistance = 0.4;
      const pullAmount = this.pullDistance * resistance;

      // Visual feedback
      this.container.style.transform = `translateY(${pullAmount}px)`;
    }
  }

  onTouchEnd() {
    if (!this.isPulling) return;

    this.container.style.transition = "transform 0.3s ease";
    this.container.style.transform = "";

    if (this.pullDistance > this.threshold) {
      this.refresh();
    }

    this.isPulling = false;
    this.pullDistance = 0;

    setTimeout(() => {
      this.container.style.transition = "";
    }, 300);
  }

  refresh() {
    if (this.callback) {
      this.callback();
    }

    // Haptic feedback
    if (navigator.vibrate) {
      navigator.vibrate([30, 20, 30]);
    }
  }
}

// =====================================================
// MOOD SELECTOR
// =====================================================
class MoodSelector {
  constructor(element) {
    this.element = element;
    this.moods = ["😢", "😔", "😐", "🙂", "😊"];
    this.selectedMood = null;
    this.render();
    this.init();
  }

  render() {
    this.element.innerHTML = `
      <div class="mood-options">
        ${this.moods
          .map(
            (mood, index) => `
          <button class="mood-option" data-index="${index}" data-mood="${mood}">
            ${mood}
          </button>
        `
          )
          .join("")}
      </div>
    `;
  }

  init() {
    const options = this.element.querySelectorAll(".mood-option");
    options.forEach((option) => {
      option.addEventListener("click", () => {
        options.forEach((o) => o.classList.remove("selected"));
        option.classList.add("selected");
        this.selectedMood = option.dataset.mood;

        // Haptic feedback
        if (navigator.vibrate) {
          navigator.vibrate(15);
        }

        // Dispatch event
        const event = new CustomEvent("moodSelected", {
          detail: {
            mood: this.selectedMood,
            index: parseInt(option.dataset.index),
          },
        });
        this.element.dispatchEvent(event);
      });
    });
  }

  getValue() {
    return this.selectedMood;
  }
}

// =====================================================
// INTENSITY SLIDER
// =====================================================
class IntensitySlider {
  constructor(element, options = {}) {
    this.element = element;
    this.min = options.min || 1;
    this.max = options.max || 5;
    this.value = options.value || 1;
    this.labels = options.labels || [
      "Mild",
      "Light",
      "Medium",
      "Strong",
      "Severe",
    ];
    this.render();
    this.init();
  }

  render() {
    this.element.innerHTML = `
      <div class="intensity-track">
        ${Array.from(
          { length: this.max },
          (_, i) => `
          <button class="intensity-dot ${
            i < this.value ? "active" : ""
          }" data-value="${i + 1}"></button>
        `
        ).join("")}
      </div>
      <span class="intensity-label">${this.labels[this.value - 1]}</span>
    `;
  }

  init() {
    const dots = this.element.querySelectorAll(".intensity-dot");
    const label = this.element.querySelector(".intensity-label");

    dots.forEach((dot) => {
      dot.addEventListener("click", () => {
        this.value = parseInt(dot.dataset.value);

        dots.forEach((d, i) => {
          d.classList.toggle("active", i < this.value);
        });

        label.textContent = this.labels[this.value - 1];

        // Haptic feedback
        if (navigator.vibrate) {
          navigator.vibrate(10);
        }

        // Dispatch event
        const event = new CustomEvent("intensityChanged", {
          detail: { value: this.value },
        });
        this.element.dispatchEvent(event);
      });
    });
  }

  getValue() {
    return this.value;
  }
}

// =====================================================
// DATE PICKER (Simple)
// =====================================================
class SimpleDatePicker {
  constructor(element, options = {}) {
    this.element = element;
    this.selectedDate = options.selectedDate || new Date();
    this.minDate = options.minDate || null;
    this.maxDate = options.maxDate || null;
    this.render();
    this.init();
  }

  render() {
    const today = new Date();
    const dates = [];

    for (let i = -3; i <= 3; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      dates.push(date);
    }

    this.element.innerHTML = `
      <div class="date-picker-scroll">
        ${dates
          .map(
            (date) => `
          <button class="date-item ${
            this.isSameDay(date, this.selectedDate) ? "selected" : ""
          }" 
                  data-date="${date.toISOString()}">
            <span class="date-day">${this.getDayName(date)}</span>
            <span class="date-num">${date.getDate()}</span>
          </button>
        `
          )
          .join("")}
      </div>
    `;
  }

  init() {
    const items = this.element.querySelectorAll(".date-item");
    items.forEach((item) => {
      item.addEventListener("click", () => {
        items.forEach((i) => i.classList.remove("selected"));
        item.classList.add("selected");
        this.selectedDate = new Date(item.dataset.date);

        // Haptic feedback
        if (navigator.vibrate) {
          navigator.vibrate(10);
        }

        // Dispatch event
        const event = new CustomEvent("dateSelected", {
          detail: { date: this.selectedDate },
        });
        this.element.dispatchEvent(event);
      });
    });
  }

  getDayName(date) {
    const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    return days[date.getDay()];
  }

  isSameDay(d1, d2) {
    return (
      d1.getDate() === d2.getDate() &&
      d1.getMonth() === d2.getMonth() &&
      d1.getFullYear() === d2.getFullYear()
    );
  }

  getValue() {
    return this.selectedDate;
  }
}

// =====================================================
// LOADING SPINNER
// =====================================================
function showLoading(message = "Loading...") {
  // Remove existing loader
  hideLoading();

  const loader = document.createElement("div");
  loader.className = "loading-overlay";
  loader.id = "loading-overlay";
  loader.innerHTML = `
    <div class="loading-content">
      <div class="loading-spinner"></div>
      <span class="loading-text">${message}</span>
    </div>
  `;

  // Add styles if not exists
  if (!document.querySelector("#loading-styles")) {
    const style = document.createElement("style");
    style.id = "loading-styles";
    style.textContent = `
      .loading-overlay {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(255, 255, 255, 0.9);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 9999;
        animation: fadeIn 0.2s ease;
      }
      .loading-content {
        text-align: center;
      }
      .loading-spinner {
        width: 40px;
        height: 40px;
        border: 3px solid var(--color-neutral-200);
        border-top-color: var(--color-primary-500);
        border-radius: 50%;
        animation: spin 1s linear infinite;
        margin: 0 auto var(--space-3);
      }
      .loading-text {
        font-size: var(--font-size-sm);
        color: var(--color-neutral-600);
      }
    `;
    document.head.appendChild(style);
  }

  document.body.appendChild(loader);
}

function hideLoading() {
  const loader = document.getElementById("loading-overlay");
  if (loader) {
    loader.remove();
  }
}

// =====================================================
// EXPORT COMPONENTS
// =====================================================
window.Components = {
  ToggleSwitch,
  BottomSheet,
  PullToRefresh,
  MoodSelector,
  IntensitySlider,
  SimpleDatePicker,
  showLoading,
  hideLoading,
  createRipple,
};
