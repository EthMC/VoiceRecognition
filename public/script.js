var socket = io();

console.log("TEST");

const texts = document.querySelector(".texts");

window.SpeechRecognition =
  window.SpeechRecognition || window.webkitSpeechRecognition;

const recognition = new SpeechRecognition();
recognition.interimResults = true;

let p = document.createElement("p");

recognition.addEventListener("result", (e) => {
  texts.insertBefore(p, texts.firstChild);
  const text = Array.from(e.results)
    .map((result) => result[0])
    .map((result) => result.transcript)
    .join("");

  p.innerText = text;
  const newSpan = document.createElement("span");
  newSpan.innerHTML = `<span class="gray"></span><span>Listening: </span>`;
  newSpan.id = "status";

  p.insertBefore(newSpan, p.firstChild);

  console.log(e.results);

  if (e.results[0].isFinal) {
    p.innerHTML = p.innerHTML.replace(
      /e/g,
      '<span style="text-decoration-line: underline; font-weight: 500;">e</span>'
    );
    if (text.includes("e")) {
      const status = p.querySelector("#status");
      status.innerHTML = `<span class="green"></span><span>Recognized: </span>`;
      socket.emit("message", "explode");
      speak();
    } else {
      const status = p.querySelector("#status");
      status.innerHTML = `<span class="yellow"></span><span>Unrecognized: </span>`;
    }

    p = document.createElement("p");
  }
});

recognition.addEventListener("end", () => {
  recognition.start();
});

const start = document.getElementById("start");
const titleScreen = document.getElementById("titleScreen");

start.addEventListener("click", () => {
  titleScreen.classList.add("titleScreen--hidden");
  recognition.start();
});

const clear = document.getElementById("clear");

clear.addEventListener("click", () => {
  texts.innerHTML = "";
});

// recognition.start();

function speak() {
  const textToSpeak = "Nice Try";

  // Create a new SpeechSynthesisUtterance object
  var utterance = new SpeechSynthesisUtterance(textToSpeak);

  // Get the voices available on the user's device
  var voices = window.speechSynthesis.getVoices();

  // You can set the voice using the following line if you want a specific voice
  // utterance.voice = voices[0];

  // Set other optional properties
  utterance.rate = 1.0; // Speed of speech. 1.0 is the default.
  utterance.pitch = 1.0; // Pitch of speech. 1.0 is the default.

  // Set the voice using the first available voice
  utterance.voice = voices[0];

  var volume = parseFloat(document.getElementById("volumeSlider").value);
  utterance.volume = volume;

  // Speak the text
  window.speechSynthesis.speak(utterance);
}

// Ensure that voices are loaded before the speak function is called
window.speechSynthesis.onvoiceschanged = function () {
  // Get the list of voices
  var voices = window.speechSynthesis.getVoices();

  // Print the available voices to the console (for reference)
  console.log(voices);

  // You can set the default voice here if needed
  // var defaultVoice = voices[0];
  // console.log(defaultVoice);
};
