// Check for SpeechRecognition
window.SpeechRecognition =
  window.SpeechRecognition || window.webkitSpeechRecognition;
const hasSTT = !!window.SpeechRecognition;

// Check for SpeechSynthesis
const hasTTS = "speechSynthesis" in window;

console.log("Speech-to-Text supported?", hasSTT);
console.log("Text-to-Speech supported?", hasTTS);

function listVoices() {
  const synth = window.speechSynthesis;
  let voices = synth.getVoices();
  if (!voices.length) {
    // Some browsers load voices asynchronously
    synth.onvoiceschanged = () => {
      voices = synth.getVoices();
      console.table(voices.map((v) => ({ name: v.name, lang: v.lang })));
    };
  } else {
    console.table(voices.map((v) => ({ name: v.name, lang: v.lang })));
  }
}
listVoices();

// SpeechRecognition setup
let recognition;
if (hasSTT) {
  recognition = new window.SpeechRecognition();
  recognition.continuous = false;
  recognition.interimResults = false;
  recognition.onstart = () => console.log("Listening…");
  recognition.onerror = (e) => console.error("STT error", e);
  recognition.onresult = (event) => {
    const transcript = event.results[0][0].transcript;
    console.log("User said:", transcript);
    document.getElementById("user-input").value = transcript;
  };
}

// SpeechSynthesis setup
const synth = hasTTS ? window.speechSynthesis : null;
function speak(text, voiceName = null) {
  if (!hasTTS) return;
  const utter = new SpeechSynthesisUtterance(text);
  if (voiceName) {
    const voice = synth.getVoices().find((v) => v.name === voiceName);
    if (voice) utter.voice = voice;
  }
  utter.lang =
    document.getElementById("voice-lang-select")?.value || utter.lang;
  synth.speak(utter);
}
