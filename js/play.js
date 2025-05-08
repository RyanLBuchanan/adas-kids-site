// play.js — Ada’s Chat UI

// DOM elements
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
  const div = document.createElement("div");
  div.classList.add("mb-2");
  div.innerHTML = `<strong>${sender}:</strong> ${message}`;
  chatLog.appendChild(div);
  chatLog.scrollTop = chatLog.scrollHeight;
}

// Keep your AOS and mobile-menu toggles in script.js as before
