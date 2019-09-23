// ==UserScript==
// @name         Morse Code Bot
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  A bot to send morse code messages on morsecode.me
// @author       deadpixl
// @match        http://morsecode.me/*
// @grant        none
// ==/UserScript==

(function() {
	'use strict';

	// Your code here...
	let code = `
		<div class="withbg" style="position:fixed;top:10px;left:0;width:200px;height:210px;font-size:14px;10px;">
			<p style="font-size:18px;">Morse Code Bot<br /><span style="font-size:14px;">by deadpixl</span></p>
			<p></p>
			<p>wpm<br />
			<input id="customWpmInput" type="number" style="background:transparent;border:1px solid white;color:white;font-family:"Cutive Mono", monospace;" value="15"></p>
			<p></p>
			<p>message<br />
			<textarea id="customMessageTextarea" placeholder="enter message..." style="width:180px;height:50px;background:transparent;border:1px solid white;color:white;font-family:"Cutive Mono", monospace;"></textarea></p>
			<p></p><p id="customSendButton" style="cursor:pointer;">[send]</p>
		</div>
		<style>
			#customMessageTextarea:focus
			{
				outline-color:white !important;
			}
		</style>
	`;
	$("#content").append(code);
	$(document).unbind("keydown");
	$(document).unbind("keyup");
	
	let numToSend;
	let theMessage;
	let messageLocation;
	let unitLength = 100;

	setUnitLength(15);

	function setUnitLength(wpm)
	{
		unitLength=1200/(wpm-5);
		console.log(unitLength);
	}

	function sendMessage(msg) {
	    theMessage = "";
	    messageLocation = 0;
	    for (let i = 0; i < msg.length; i++) {
	        theMessage += morseTextDict[msg[i]] + " "
	    }
	    sendCharacter()
	}

	function sendCharacter() {
	    if (messageLocation > theMessage.length) {
	        console.log("done!");
	        return
	    }
	    if (theMessage[messageLocation] === ".") {
	        console.log("instruction: send dit");
	        sendDit()
	    } else if (theMessage[messageLocation] === "-") {
	        console.log("instruction: send dah");
	        sendDah()
	    } else {
	        console.log("instruction: send space");
	        sendSpace()
	    }
	    messageLocation++
	}

	function sendDit() {
        app.morsers.me.keyDown();
        setTimeout(function() {
            app.morsers.me.keyUp();
            setTimeout(sendCharacter, 1*unitLength);
        }, 1*unitLength);
	}

	function sendDah() {
        app.morsers.me.keyDown();
        setTimeout(function() {
            app.morsers.me.keyUp();
            setTimeout(sendCharacter, 1*unitLength);
        }, 3*unitLength);
	}

	function sendSpace() {
	    setTimeout(sendCharacter, 1*unitLength);
	}
	const morseTextDict = {
	    "a": ".-",
	    "b": "-...",
	    "c": "-.-.",
	    "d": "-..",
	    "e": ".",
	    "f": "..-.",
	    "g": "--.",
	    "h": "....",
	    "i": "..",
	    "j": ".---",
	    "k": "-.-",
	    "l": ".-..",
	    "m": "--",
	    "n": "-.",
	    "o": "---",
	    "p": ".--.",
	    "q": "--.-",
	    "r": ".-.",
	    "s": "...",
	    "t": "-",
	    "u": "..-",
	    "v": "...-",
	    "w": ".--",
	    "x": "-..-",
	    "y": "-.--",
	    "z": "--..",
	    "0": "-----",
	    "1": ".----",
	    "2": "..---",
	    "3": "...--",
	    "4": "....-",
	    "5": ".....",
	    "6": "-....",
	    "7": "--...",
	    "8": "---..",
	    "9": "----.",
	    ".": ".-.-.-",
	    ",": "--..--",
	    ":": "---...",
	    "?": "..--..",
	    "'": ".----.",
	    "-": "-....-",
	    "/": "-..-.",
	    "\"": ".-..-.",
	    "@": ".--.-.",
	    "=": "-...-",
	    "!": "---.",
	    " ": "/////"
	};

	$("#customSendButton").click(function(e)
	{
		sendMessage($("#customMessageTextarea").val().toLowerCase());
		$("#customMessageTextarea").val("");
	});

	$(document).keydown(function(e)
	{
		if (e.which == 13)
		{
			$("#customSendButton").click();
			e.preventDefault();
		}
	});

	$("#customWpmInput").change(function(e)
	{
		let val = $(this).val()
		if (val!=null && val!=undefined)
		{
			setUnitLength(parseInt(val));
		}
	});

	$("#customWpmInput").focus(function(e)
	{
		$(this).select();
	})
})();