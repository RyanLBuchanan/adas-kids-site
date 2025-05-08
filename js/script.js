// ✅ Animate on Scroll Init
AOS.init();

// 🍔 Mobile Menu Toggle
// Ensure the DOM is fully loaded before attaching listeners
document.addEventListener('DOMContentLoaded', () => {
  const btn = document.getElementById("mobile-menu-button");
  const menu = document.getElementById("mobile-menu");
  if (btn && menu) {
    btn.addEventListener("click", () => {
      menu.classList.toggle("hidden");
    });
  }
});

// Chat functionality
const form = document.getElementById("ask-form");
const userInput = document.getElementById("user-input");
const chatLog = document.getElementById("chat-log");
if (form && userInput && chatLog) {
  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const message = userInput.value.trim();
    if (!message) return;

    appendMessage("You", message);
    userInput.value = "";

    try {
      const response = await fetch("/.netlify/functions/chat-ada", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message }),
      });
      const data = await response.json();

      if (response.ok) {
        appendMessage("Ada", data.reply);
      } else {
        appendMessage(
          "Ada",
          `⚠️ Error: ${data.error?.message || "Something went wrong."}`
        );
      }
    } catch (err) {
      appendMessage("Ada", "❌ Network error. Please try again later.");
    }
  });
}

// Helper to append messages
tfunction appendMessage(sender, message) {
  const messageEl = document.createElement("div");
  messageEl.innerHTML = `<strong>${sender}:</strong> ${message}`;
  chatLog.appendChild(messageEl);
  chatLog.scrollTop = chatLog.scrollHeight;
}

// Carousel functionality
const track = document.querySelector(".carousel-track");
const slides = document.querySelectorAll(".carousel-track > div");
let currentIndex = 0;
function updateCarousel() {
  if (!track || slides.length === 0) return;
  const slideWidth = slides[0].offsetWidth;
  track.style.transform = `translateX(-${currentIndex * slideWidth}px)`;
}
const prevBtn = document.getElementById("prevBtn");
const nextBtn = document.getElementById("nextBtn");
if (prevBtn && nextBtn) {
  prevBtn.addEventListener("click", () => {
    currentIndex = (currentIndex - 1 + slides.length) % slides.length;
    updateCarousel();
  });
  nextBtn.addEventListener("click", () => {
    currentIndex = (currentIndex + 1) % slides.length;
    updateCarousel();
  });
}
