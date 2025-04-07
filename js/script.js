// 🌟 Smooth scrolling for internal links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener("click", function (e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute("href"));
    if (target) {
      target.scrollIntoView({ behavior: "smooth" });
    }
  });
});

// 💬 Ada chatbot interaction
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

// 🧠 Helper to show messages in chat log
function appendMessage(sender, message) {
  const messageEl = document.createElement("div");
  messageEl.innerHTML = `<strong>${sender}:</strong> ${message}`;
  chatLog.appendChild(messageEl);
  chatLog.scrollTop = chatLog.scrollHeight;
}
