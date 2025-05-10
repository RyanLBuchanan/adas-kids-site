// Check for SpeechRecognition
window.SpeechRecognition =
  window.SpeechRecognition || window.webkitSpeechRecognition;
const hasSTT = !!window.SpeechRecognition;

// Check for SpeechSynthesis
const hasTTS = "speechSynthesis" in window;

console.log("Speech-to-Text supported?", hasSTT);
console.log("Text-to-Speech supported?", hasTTS);
