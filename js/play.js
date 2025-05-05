// play.js — for Prima's Chat UI on play.html

// ✅ DOM elements
const form = document.getElementById("prima-form");
const input = document.getElementById("prima-input");
const chatLog = document.getElementById("prima-chat-log");

// ✅ Handle message submission
if (form && input && chatLog) {
  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const message = input.value.trim();
    if (!message) return;

    appendMessage("You", message);
    input.value = "";

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
        appendMessage("Prima", data.reply);
      } else {
        appendMessage(
          "Prima",
          `⚠️ Error: ${data.error?.message || "Something went wrong."}`
        );
      }
    } catch (err) {
      appendMessage("Prima", "❌ Network error. Please try again later.");
    }
  });
}

// ✅ Add messages to chat
function appendMessage(sender, message) {
  const wrapper = document.createElement("div");
  wrapper.classList.add("mb-2");
  wrapper.innerHTML = `<strong>${sender}:</strong> ${message}`;
  chatLog.appendChild(wrapper);
  chatLog.scrollTop = chatLog.scrollHeight;
}
