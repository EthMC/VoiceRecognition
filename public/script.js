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
