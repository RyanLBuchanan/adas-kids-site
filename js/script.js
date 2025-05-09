// ✅ Animate on Scroll Init
AOS.init();

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
        headers: {
          "Content-Type": "application/json",
        },
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

function appendMessage(sender, message) {
  const messageEl = document.createElement("div");
  messageEl.innerHTML = `<strong>${sender}:</strong> ${message}`;
  chatLog.appendChild(messageEl);
  chatLog.scrollTop = chatLog.scrollHeight;
}

const track = document.querySelector(".carousel-track");
const slides = document.querySelectorAll(".carousel-track > div");
let currentIndex = 0;

function updateCarousel() {
  const slideWidth = slides[0].offsetWidth;
  track.style.transform = `translateX(-${currentIndex * slideWidth}px)`;
}

document.getElementById("prevBtn").addEventListener("click", () => {
  currentIndex = (currentIndex - 1 + slides.length) % slides.length;
  updateCarousel();
});

document.getElementById("nextBtn").addEventListener("click", () => {
  currentIndex = (currentIndex + 1) % slides.length;
  updateCarousel();
});

// 🍔 Mobile Menu Toggle
document.addEventListener("DOMContentLoaded", () => {
  const btn = document.getElementById("mobile-menu-button");
  const menu = document.getElementById("mobile-menu");

  if (btn && menu) {
    btn.addEventListener("click", () => {
      menu.classList.toggle("hidden");
    });
  }
});

const translations = {
  en: {
    title: "Welcome to Ada's Kids",
    existing: "👤 Existing User",
    username: "Username",
    password: "Password",
    loginBtn: "Log In →",
    newUser: "✨ New to Ada's Kids?",
    createProf: "Create Profile →",
    // …any other keys…
  },
  ar: {
    title: "مرحبًا بك في أطفال آدا",
    existing: "👤 مستخدم حالي",
    username: "اسم المستخدم",
    password: "كلمة المرور",
    loginBtn: "تسجيل الدخول →",
    newUser: "✨ جديد في أطفال آدا؟",
    createProf: "إنشاء ملف التعريف →",
    // …add RTL-friendly Arabic strings here…
  },
  // add “es”, “fr”, etc. as you go…
};

function translatePage(lang) {
  document.querySelectorAll("[data-i18n]").forEach((el) => {
    const key = el.getAttribute("data-i18n");
    if (translations[lang] && translations[lang][key]) {
      el.innerText = translations[lang][key];
    }
  });
}

window.addEventListener("DOMContentLoaded", () => {
  const params = new URLSearchParams(location.search);
  const lang = params.get("language") || "en";
  const select = document.getElementById("language-select");

  // render initial language
  translatePage(lang);
  select.value = lang;

  // re-translate on change
  select.addEventListener("change", () => {
    params.set("language", select.value);
    translatePage(select.value);
    history.replaceState(null, "", "?" + params.toString());
  });
});
