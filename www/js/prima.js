// js/prima.js
// Front-end logic to connect to your Jetson Nano + voice I/O

// 1) Keep track of the last AI reply
let lastResponse = "";

// 2) Feature detection
window.SpeechRecognition =
  window.SpeechRecognition || window.webkitSpeechRecognition;
const hasSTT = !!window.SpeechRecognition;
const hasTTS = "speechSynthesis" in window;

// 3) DOM ready → wire everything up
document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("ask-form");
  const input = document.getElementById("user-input");
  const chatLog = document.getElementById("chat-log");
  const micBtn = document.getElementById("mic-btn");
  const playBtn = document.getElementById("play-btn");

  // 🔧 Your backend endpoint
  const API_URL = "http://192.168.96.18:5000/api/chat";

  // — Speech Recognition setup —
  let recognition;
  if (hasSTT && micBtn) {
    recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = false;

    recognition.onstart = () => micBtn.classList.add("bg-blue-700");
    recognition.onend = () => micBtn.classList.remove("bg-blue-700");
    recognition.onerror = (e) => console.error("STT error", e.error);

    recognition.onresult = (e) => {
      input.value = e.results[0][0].transcript;
    };

    micBtn.addEventListener("click", () => {
      if (micBtn.classList.contains("bg-blue-700")) {
        recognition.stop();
      } else {
        recognition.lang = "en-US"; // or tie to a dropdown
        recognition.start();
      }
    });
  } else if (micBtn) {
    micBtn.disabled = true;
    micBtn.title = "Speech-to-Text not supported";
  }

  // — Text-to-Speech play button —
  if (playBtn) {
    if (!hasTTS) {
      playBtn.disabled = true;
      playBtn.title = "Text-to-Speech not supported";
    } else {
      playBtn.addEventListener("click", () => {
        if (!lastResponse) return;
        const u = new SpeechSynthesisUtterance(lastResponse);
        // u.lang = 'en-US'; // optional: tie to a language selector
        window.speechSynthesis.speak(u);
      });
    }
  }

  // — Chat form submission —
  if (form && input && chatLog) {
    form.addEventListener("submit", async (e) => {
      e.preventDefault();
      const message = input.value.trim();
      if (!message) return;

      appendMessage("You", message);
      input.value = "";

      try {
        const res = await fetch(API_URL, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ message }),
        });
        const json = await res.json();

        if (res.ok) {
          lastResponse = json.reply; // ← store for TTS
          appendMessage("Prima", json.reply);
          // auto-speak the reply:
          if (hasTTS) {
            const u = new SpeechSynthesisUtterance(json.reply);
            window.speechSynthesis.speak(u);
          }
        } else {
          appendMessage("Prima", `⚠️ ${json.error || "Server error"}`);
        }
      } catch (err) {
        console.error("Chat error", err);
        appendMessage("Prima", "❌ Network or server error.");
      }
    });
  }
});

// 4) Helper to append chat bubbles
function appendMessage(sender, text) {
  const msgEl = document.createElement("div");
  msgEl.classList.add(
    "mb-4",
    "py-2",
    "px-4",
    "rounded-lg",
    "max-w-[80%]",
    "flex"
  );
  if (sender === "You" || sender === "user") {
    msgEl.classList.add("self-end", "bg-purple-200", "text-purple-900");
  } else {
    msgEl.classList.add("self-start", "bg-purple-100", "text-purple-800");
  }
  msgEl.innerText = text;
  const chatLog = document.getElementById("chat-log");
  chatLog.appendChild(msgEl);
  chatLog.scrollTop = chatLog.scrollHeight;
}
