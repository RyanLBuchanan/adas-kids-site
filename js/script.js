// Smooth scrolling for internal links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener("click", function (e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute("href"));
      if (target) {
        target.scrollIntoView({ behavior: "smooth" });
      }
    });
  });
  
  // Ada chatbot interaction
  async function askAda(message) {
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": "Bearer YOUR_API_KEY_HERE"
      },
      body: JSON.stringify({
        model: "gpt-3.5-turbo",
        messages: [{ role: "user", content: message }]
      })
    });
  
    const data = await response.json();
    const reply = data.choices[0].message.content;
    document.getElementById("ada-response").innerText = reply;
  }
  
  const form = document.getElementById("ask-form");
  if (form) {
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const question = document.getElementById("user-input").value;
      askAda(question);
    });
  }
  