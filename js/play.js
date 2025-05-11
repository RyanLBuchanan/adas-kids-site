// play.js — Ada’s Chat UI + Avatar + TTS

// 0) Feature-detect TTS
const hasTTS = "speechSynthesis" in window;

// 1) Track last AI reply
let lastResponse = "";

// 2) Avatar helpers (unchanged) …
function formatAvatarName(avatar) {
  /* … */
}
function avatarImagePath(avatar) {
  /* … */
}

// 3) DOM ready
document.addEventListener("DOMContentLoaded", () => {
  // — Avatar / greeting setup (unchanged) —
  const params = new URLSearchParams(window.location.search);
  const name = params.get("name") || "Student";
  const rawAvatar = params.get("avatar") || "chortana";
  const avatarLabel = formatAvatarName(rawAvatar).split(" ")[0];

  document.getElementById(
    "personal-greeting"
  ).innerText = `Hi ${name}, I'm ${avatarLabel}.`;
  document.getElementById(
    "avatar-persona"
  ).innerText = `Tutor Style: ${formatAvatarName(rawAvatar)}`;

  const imgEl = document.getElementById("avatar-image");
  const labelEl = document.getElementById("avatar-label");
  imgEl.src = avatarImagePath(rawAvatar);
  imgEl.alt = formatAvatarName(rawAvatar);
  labelEl.innerText = avatarLabel;

  // — Chat form setup (unchanged) —
  const form = document.getElementById("ask-form");
  const input = document.getElementById("user-input");
  const chatLog = document.getElementById("chat-log");

  if (form && input && chatLog) {
    form.addEventListener("submit", async (e) => {
      e.preventDefault();
      const message = input.value.trim();
      if (!message) return;

      appendMessage("You", message);
      input.value = "";

      try {
        const res = await fetch("/.netlify/functions/chat-ada", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ message }),
        });
        const data = await res.json();

        if (res.ok) {
          appendMessage("Ada", data.reply);
          lastResponse = data.reply; // ← store for TTS
        } else {
          appendMessage("Ada", `⚠️ ${data.error?.message || "Error"}`);
        }
      } catch {
        appendMessage("Ada", "❌ Network error.");
      }
    });
  }

  // — Text-to-Speech “play” button hookup —
  const playBtn = document.getElementById("play-btn");
  if (playBtn) {
    if (!hasTTS) {
      playBtn.disabled = true;
      playBtn.title = "Text-to-Speech not supported";
    } else {
      // preload voices (some mobile browsers load async)
      const synth = window.speechSynthesis;
      let voices = synth.getVoices();
      if (!voices.length) {
        synth.onvoiceschanged = () => {
          voices = synth.getVoices();
        };
      }

      playBtn.addEventListener("click", () => {
        if (!lastResponse) return;
        const utter = new SpeechSynthesisUtterance(lastResponse);
        // pick an English voice if possible
        const voice = voices.find((v) => v.lang.startsWith("en")) || voices[0];
        if (voice) utter.voice = voice;
        utter.lang = voice?.lang || "en-US";
        synth.speak(utter);
      });
    }
  }
});

// 4) Append messages
function appendMessage(sender, message) {
  const div = document.createElement("div");
  div.classList.add("mb-2");
  div.innerHTML = `<strong>${sender}:</strong> ${message}`;
  const chatLog = document.getElementById("chat-log");
  chatLog.appendChild(div);
  chatLog.scrollTop = chatLog.scrollHeight;
}
