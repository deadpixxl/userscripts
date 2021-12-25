// ==UserScript==
// @name        Morse Code
// @namespace   deadpixl
// @match       *://beta.morsecode.me/*
// @grant       none
// @version     2.0
// @author      deadpixl
// @description A bot to send morse code messages on morsecode.me
// @require https://ajax.googleapis.com/ajax/libs/jquery/3.6.0/jquery.min.js
// @require https://ajax.googleapis.com/ajax/libs/jqueryui/1.12.1/jquery-ui.min.js
// ==/UserScript==

$(document).ready(function () {
  let unitLength = 100;
  const formElements = ["#wpm", "#message", "#sendMessage"];

  const characterToMorse = {
    a: ".-",
    b: "-...",
    c: "-.-.",
    d: "-..",
    e: ".",
    f: "..-.",
    g: "--.",
    h: "....",
    i: "..",
    j: ".---",
    k: "-.-",
    l: ".-..",
    m: "--",
    n: "-.",
    o: "---",
    p: ".--.",
    q: "--.-",
    r: ".-.",
    s: "...",
    t: "-",
    u: "..-",
    v: "...-",
    w: ".--",
    x: "-..-",
    y: "-.--",
    z: "--..",
    0: "-----",
    1: ".----",
    2: "..---",
    3: "...--",
    4: "....-",
    5: ".....",
    6: "-....",
    7: "--...",
    8: "---..",
    9: "----.",
    ".": ".-.-.-",
    ",": "--..--",
    ":": "---...",
    "?": "..--..",
    "'": ".----.",
    "-": "-....-",
    "/": "-..-.",
    '"': ".-..-.",
    "@": ".--.-.",
    "=": "-...-",
    "!": "---.",
    " ": "//////",
  };

  function gui() {
    const $container = $(`<div class="container" />`).appendTo("body");

    const $gui = $(`
      <div id="morse-code-app">
        <div class="status-bar">
            <div class="title">
                Morse Code Bot <span class="version"></span>
            </div>
        </div>
        <div class="body">
          <div class="input">
            <label for="wpm">WPM</label>
            <input id="wpm" name="wpm" type="number" value="15" />
          </div>
          <div class="input">
            <label for="message">Message</label>
            <textarea id="message" name="message"></textarea>
          </div>
          <div class="input">
            <button id="sendMessage" class="button">Send message</button>
          </div>
        </div>
      </div>
    `).appendTo($container);

    $gui.draggable({
      handle: ".status-bar",
      containment: "window",
    });

    $(".version").text(GM.info.script.version);
  }

  function style() {
    $(`
      <style>
        .container {
          position: absolute;
          top: 20px;
          left: 20px;
          pointer-events: none;
        }
        
        #morse-code-app {
          position: absolute;
          top: 20px;
          left: 20px;
          width: 250px;
          background-color: #444;
          display: flex;
          flex-direction: column;
          box-shadow: 0px 10px 15px -3px rgba(0, 0, 0, 0.5);
          z-index: 20;
          pointer-events: auto;
        }

        .status-bar {
          width: 100%;
          padding: 10px;
          background-color: #3a3a3a;
          cursor: move;
        }

        .title {
          color: #ccc;
          text-transform: uppercase;
        }

        .version {
          color: #777;
        }

        .body {
          flex: 1;
          width: 100%;
          padding: 10px;
        }

        .input {
          display: flex;
          flex-direction: column;
        }

        .input + .input {
          margin-top: 10px;
        }
        
        .input > label {
          color: #ccc;
        }

        .input > input, textarea {
          margin-top: 4px;
          width: 100%;
          color: #fff;
          background-color: #3a3a3a;
          border: 1px solid #ccc;
          outline: none;
          padding: 5px;
        }

        .input > input:focus, textarea:focus {
          border-color: #fff;
        }

        .button {
          padding: 10px;
          background-color: #734e36;
          color: white;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .button[disabled],
        .input > input[disabled], textarea[disabled] {
          opacity: 0.5;
          cursor: not-allowed;
        }
      </style>
    `).appendTo("head");
  }

  function events() {
    $("#morse-code-app").on("keydown keyup", (e) => {
      e.stopPropagation();
    });

    $("#wpm").change((e) => {
      const wpm = e.target.value;
      unitLength = 1200 / (wpm - 5);
    });

    $("#sendMessage").click(() => {
      const message = $("#message").val();
      sendMessage(message);
    });
  }

  async function sendMessage(message) {
    setFormDisabled(true);

    var key = document.querySelector(".Key");

    for (const character of message) {
      await sendCharacter(key, character);
    }

    setFormDisabled(false);
    $("#message").val("").focus();
  }

  function setFormDisabled(disabled) {
    for (const element of formElements) {
      $(element).attr("disabled", disabled);
    }
  }

  async function sendCharacter(key, character) {
    var morse = characterToMorse[character];

    if (!morse) {
      return;
    }

    for (const part of morse) {
      switch (part) {
        case ".":
          await sendDit(key);
          break;
        case "-":
          await sendDah(key);
          break;
        default:
          await sleep(1);
          break;
      }
    }

    await sleep(2);
  }

  async function sendDit(key) {
    keyDown(key);
    await sleep(1);
    keyUp(key);
    await sleep(1);
  }

  async function sendDah(key) {
    keyDown(key);
    await sleep(3);
    keyUp(key);
    await sleep(1);
  }

  function keyDown(key) {
    key.dispatchEvent(new Event("mousedown", { bubbles: true }));
  }

  function keyUp(key) {
    key.dispatchEvent(new Event("mouseup", { bubbles: true }));
  }

  function sleep(units) {
    return new Promise((resolve) => setTimeout(resolve, units * unitLength));
  }

  function initialize() {
    gui();
    style();
    events();
  }

  initialize();
});
