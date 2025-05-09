// js/prima.js
// Front-end logic to connect to your Nvidia Jetson Orin Nano server running a Phi-2 endpoint

document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("ask-form");
  const input = document.getElementById("user-input");
  const chatLog = document.getElementById("chat-log");

  // 🔧 Update this URL to point at your Jetson Orin Nano's Phi-2 server
  const API_URL = "http://<JETSON_IP>:5000/api/chat"; // e.g. 'http://192.168.1.50:5000/api/chat'

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const message = input.value.trim();
    if (!message) return;

    appendMessage("user", message);
    input.value = "";

    try {
      const res = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message }),
      });

      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const { reply } = await res.json();
      appendMessage("assistant", reply);
      speak(reply);
    } catch (err) {
      console.error("Chat error", err);
      appendMessage("assistant", "⚠️ Something went wrong. Please try again.");
    }
  });

  function appendMessage(sender, text) {
    const msgEl = document.createElement("div");
    msgEl.classList.add("mb-4", "py-2", "px-4", "rounded-lg", "max-w-[80%]");
    if (sender === "user") {
      msgEl.classList.add("self-end", "bg-purple-200", "text-purple-900");
    } else {
      msgEl.classList.add("self-start", "bg-purple-100", "text-purple-800");
    }
    msgEl.innerText = text;
    chatLog.appendChild(msgEl);
    chatLog.scrollTop = chatLog.scrollHeight;
  }

  function speak(text) {
    if (!window.speechSynthesis) return;
    const utter = new SpeechSynthesisUtterance(text);
    utter.lang = "en-US";
    window.speechSynthesis.speak(utter);
  }
});
