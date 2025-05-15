// play.js — Ada’s Chat UI + Avatar Initialization

// 1) Keep track of the last AI reply for TTS
let lastResponse = "";

// 2) Avatar helpers
function formatAvatarName(avatar) {
  switch (avatar) {
    case "saudi-businessman":
      return "SaudiBusinessman (Confident & Professional)";
    case "saudi-doctor":
      return "SaudiDoctor (Smart & Empathetic)";
    case "saudi-warrior":
      return "SaudiWarrior (Disciplined & Tactical)";
    case "code-of-duty":
      return "CodeOfDuty (Tactical & Focused)";
    case "origami":
      return "Origami (Friendly & Curious)";
    case "ada":
      return "Ada (Empathetic & Inspiring)";
    default:
      return "Ada (Empathetic & Inspiring)";
  }
}

function avatarImagePath(avatar) {
  switch (avatar) {
    case "saudi-businessman":
      return "/assets/avatars/saudi-businessman.png";
    case "origami":
      return "/assets/avatars/origami.png";
    case "saudi-doctor":
      return "/assets/avatars/saudi-doctor.png";
    case "saudi-warrior":
      return "/assets/avatars/saudi-warrior.png";
    case "code-of-duty":
      return "/assets/avatars/code-of-duty.png";
    case "ada":
      return "/assets/avatars/ada.png";
    default:
      return "/assets/avatars/ada.png";
  }
}

// 💬 NEW: System message behavior mapping
function getSystemMessage(avatar) {
  switch (avatar) {
    case "saudi-businessman":
      return "You are a confident and professional Saudi businessman in traditional attire. Your speech is polished, diplomatic, and persuasive, like a CEO addressing a boardroom. Use analogies from finance, leadership, and deal-making to explain concepts. Your tone is poised, motivational, and focused on results.";
    case "saudi-doctor":
      return "You are a Saudi female doctor: smart, compassionate, and clear. You guide students with empathy and precision, like a skilled physician diagnosing with care. Speak with reassurance and warmth, using examples from science, biology, and health when helpful.";
    case "saudi-warrior":
      return "You are a wise and disciplined Saudi warrior who values strength, honor, and history. You speak with authority but with calm restraint, like a seasoned commander. Use metaphors from battle, strategy, and ancient wisdom. Encourage students to persevere with strength and focus.";
    default:
      return "You are a helpful and empathetic AI tutor named Ada who helps students learn with encouragement and clarity.";
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

      const systemMessage = getSystemMessage(rawAvatar);

      try {
        const res = await fetch("/.netlify/functions/chat-ada", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            message,
            system: systemMessage,
          }),
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

  const walkthroughBtn = document.getElementById("walkthrough-link");
  if (walkthroughBtn) {
    const currentParams = new URLSearchParams(window.location.search);
    walkthroughBtn.href = `problem.html?${currentParams.toString()}`;
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
