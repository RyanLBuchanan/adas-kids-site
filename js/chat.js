// Replace this with your real OpenAI key for testing ONLY
const OPENAI_API_KEY = "sk-REPLACE-ME";

const sendBtn = document.getElementById("send-btn");
const userInput = document.getElementById("user-input");
const chatLog = document.getElementById("chat-log");

sendBtn.addEventListener("click", async () => {
  const userMessage = userInput.value;
  if (!userMessage) return;

  appendMessage("You", userMessage);
  userInput.value = "";

  const response = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${OPENAI_API_KEY}`,
    },
    body: JSON.stringify({
      model: "gpt-3.5-turbo",
      messages: [{ role: "user", content: userMessage }],
    }),
  });

  const data = await response.json();
  const aiMessage = data.choices?.[0]?.message?.content;
  appendMessage("Ada", aiMessage);
});

function appendMessage(sender, message) {
  const messageEl = document.createElement("div");
  messageEl.innerHTML = `<strong>${sender}:</strong> ${message}`;
  chatLog.appendChild(messageEl);
  chatLog.scrollTop = chatLog.scrollHeight;
}
