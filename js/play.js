// play.js — Ada’s Chat UI + Avatar Initialization

// 1) Keep track of the last AI reply for TTS
let lastResponse = "";

// 2) Avatar helpers
function formatAvatarName(avatar) {
  switch (avatar) {
    case "carvis":
      return "C.A.R.V.I.S. (Concise & Logical)";
    case "origami":
      return "Origami (Helpful & Friendly)";
    case "calfred":
      return "Alfred (Wise & Supportive)";
    case "starship-computer":
      return "Starship Computer (Precise & Formal)";
    case "code-of-duty":
      return "Code of Duty (Tactical & Focused)";
    case "ada":
      return "Ada (Empathetic & Inspiring)";
    default:
      return "Ada (Empathetic & Inspiring)";
  }
}

function avatarImagePath(avatar) {
  switch (avatar) {
    case "carvis":
      return "/assets/avatars/carvis.png";
    case "origami":
      return "/assets/avatars/origami.png";
    case "calfred":
      return "/assets/avatars/calfred.png";
    case "starship-computer":
      return "/assets/avatars/starship.png";
    case "code-of-duty":
      return "/assets/avatars/code-of-duty.png";
    case "ada":
      return "/assets/avatars/ada.png";
    default:
      return "/assets/avatars/ada.png";
  }
}

// 3) Run everything after DOM is ready
document.addEventListener("DOMContentLoaded", () => {
  // — Avatar / Greeting setup —
  const params = new URLSearchParams(window.location.search);
  const name = params.get("name") || "Student";
  const rawAvatar = params.get("avatar") || "origami";
  const avatarLabel = formatAvatarName(rawAvatar).split(" ")[0];

  // Update greeting text
  const greetingEl = document.getElementById("personal-greeting");
  if (greetingEl) {
    greetingEl.innerText = `Hi ${name}, I'm ${avatarLabel}.`;
  }

  // Update persona line
  const personaEl = document.getElementById("avatar-persona");
  if (personaEl) {
    personaEl.innerText = `Tutor Style: ${formatAvatarName(rawAvatar)}`;
  }

  // Update avatar image + label
  const imgEl = document.getElementById("avatar-image");
  const labelEl = document.getElementById("avatar-label");
  if (imgEl) {
    imgEl.src = avatarImagePath(rawAvatar);
    imgEl.alt = formatAvatarName(rawAvatar);
  }
  if (labelEl) {
    labelEl.innerText = avatarLabel;
  }

  // — Chat form & TTS setup —
  const form = document.getElementById("ask-form");
  const input = document.getElementById("user-input");
  const chatLog = document.getElementById("chat-log");
  const playBtn = document.getElementById("play-btn");

  // Chat submission handler
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
          appendMessage(avatarLabel, data.reply);
          lastResponse = data.reply; // ← store AI reply for TTS
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

  // Play button → speak lastResponse
  if (playBtn) {
    if (!("speechSynthesis" in window)) {
      playBtn.disabled = true;
      playBtn.title = "Text-to-Speech not supported";
    } else {
      playBtn.addEventListener("click", () => {
        if (!lastResponse) return;
        const utter = new SpeechSynthesisUtterance(lastResponse);
        window.speechSynthesis.speak(utter);
      });
    }
  }
});

// 4) Message appender
function appendMessage(sender, message) {
  const div = document.createElement("div");
  div.classList.add("mb-2");
  div.innerHTML = `<strong>${sender}:</strong> ${message}`;
  const chatLog = document.getElementById("chat-log");
  chatLog.appendChild(div);
  chatLog.scrollTop = chatLog.scrollHeight;
}
