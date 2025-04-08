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
        appendMessage("Ada", `⚠️ Error: ${data.error?.message || "Something went wrong."}`);
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
