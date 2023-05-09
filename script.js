// import {https} from "./node_modules/require.js/require.js";
// import("./require");
// import(https);
const apiKey = "fk201173-O6vIx81J8OUtiWTUNNEnJTxeW0iZ1UBX";
const chatapiUrl = "https://api.openai.com/v1/engines/davinci-codex/completions";
// const https = require('https');

var SpeechRecognition = SpeechRecognition || webkitSpeechRecognition
var SpeechGrammarList = SpeechGrammarList || window.webkitSpeechGrammarList
var SpeechRecognitionEvent = SpeechRecognitionEvent || webkitSpeechRecognitionEvent
let voices = window.speechSynthesis.getVoices();
var recognition = new SpeechRecognition();
// if (SpeechGrammarList) {
//   // SpeechGrammarList is not currently available in Safari, and does not have any effect in any other browser.
//   // This code is provided as a demonstration of possible capability. You may choose not to use it.
//   var speechRecognitionList = new SpeechGrammarList();
//   // var grammar = '#JSGF V1.0; grammar colors; public <color> = ' + colors.join(' | ') + ' ;'
//   speechRecognitionList.addFromString(grammar, 1);
//   recognition.grammars = speechRecognitionList;
// }
recognition.continuous = false;
recognition.lang = 'en-US';
recognition.interimResults = false;
recognition.maxAlternatives = 1;

var diagnostic = document.querySelector('.output');
var bg = document.querySelector('html');
var hints = document.querySelector('.hints');
var dictateButton = document.querySelector('.dictateButton');
var AIFeedback = document.querySelector('.AIFeedback');

var aa = {
  "id": "chatcmpl-7EKAy5Si7bkYZtMZqwTtnaPYRccvS",
  "object": "chat.completion",
  "created": 1683648504,
  "model": "gpt-3.5-turbo-0301",
  "usage": {
      "prompt_tokens": 16,
      "completion_tokens": 35,
      "total_tokens": 51,
      "pre_token_count": 4096,
      "pre_total": 42,
      "adjust_total": 41,
      "final_total": 1
  },
  "choices": [
      {
          "message": {
              "role": "assistant",
              "content": "The world's largest snowflake on record was a whopping 15 inches in diameter and 8 inches thick. It fell in Fort Keogh, Montana in 1887."
          },
          "finish_reason": "stop",
          "index": 0
      }
  ]
};
console.log(aa.choices[0].message.content);

// var colorHTML= '';
// colors.forEach(function(v, i, a){
//   console.log(v, i);
//   colorHTML += '<span style="background-color:' + v + ';"> ' + v + ' </span>';
// });
// hints.innerHTML = 'Tap/click then say a color to change the background color of the app. Try ' + colorHTML + '.';

// document.body.onclick = function() {
//   recognition.start();
//   console.log('Ready to receive a color command.');
// }
dictateButton.onclick = function () {
  console.log(voices);

  recognition.start();
  dictateButton.textContent = 'Recognizing...';
  diagnostic.textContent = '-Keep talking-';
  console.log('Ready to receive a color command.');
}

recognition.onresult = function (event) {
  // The SpeechRecognitionEvent results property returns a SpeechRecognitionResultList object
  // The SpeechRecognitionResultList object contains SpeechRecognitionResult objects.
  // It has a getter so it can be accessed like an array
  // The first [0] returns the SpeechRecognitionResult at the last position.
  // Each SpeechRecognitionResult object contains SpeechRecognitionAlternative objects that contain individual results.
  // These also have getters so they can be accessed like arrays.
  // The second [0] returns the SpeechRecognitionAlternative at position 0.
  // We then return the transcript property of the SpeechRecognitionAlternative object
  var recognizedWords = event.results[0][0].transcript;
  diagnostic.textContent = 'Your words: ' + recognizedWords;
  console.log('Confidence: ' + event.results[0][0].confidence);

  //发送信息到API
  console.log('Ready to send data to OpenAI...');

  // readOutLoud("Why don't scientists trust atoms? \n\nBecause they make up everything!");
  const postData = JSON.stringify({
    model: 'gpt-3.5-turbo',
    messages: [{ role: 'user', content: recognizedWords }],
  });

  const options = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: 'Bearer ' + apiKey,
    },
    body: postData,
  };
  //OK Below
  fetch('https://openai.api2d.net/v1/chat/completions', options)
    // .then(response => {
    //   console.log('statusCode:', response.status);
    //   console.log('headers:', response.headers);
    //   return response.json();
    // })
    .then(response => response.json())
    .then(data => {
      var feedback = data.choices[0].message.content;
      goTTS(feedback);
      AIFeedback.textContent = 'AI Professor: ' + feedback;
      console.log('Response is successfully received.');
      console.log(data);
      console.log(feedback);
    })
    .catch(error => {
      console.error('Failed to get response. ' + error);
      AIFeedback.textContent = 'Sorry, AI Professor cannot respond you now.';
    });
  //OK Above





  // var rec = {"id":"chatcmpl-7EHH5TxHjyJ3GId4RdcwEvKF7qKG1","object":"chat.completion","created":1683637351,"model":"gpt-3.5-turbo-0301","usage":{"prompt_tokens":13,"completion_tokens":14,"total_tokens":27,"pre_token_count":4096,"pre_total":42,"adjust_total":41,"final_total":1},"choices":[{"message":{"role":"assistant","content":"Why don't scientists trust atoms? \n\nBecause they make up everything!"},"finish_reason":"stop","index":0}]}
  // AIFeedback.textContent = rec.




  // var postData = JSON.stringify({
  //   model: 'gpt-3.5-turbo',
  //   messages: [{ role: 'user', content: recognizedWords }],
  // });
  // var options = {
  //   hostname: 'openai.api2d.net',
  //   port: 443,
  //   path: '/v1/chat/completions',
  //   method: 'POST',
  //   headers: {
  //     'Content-Type': 'application/json',
  //     Authorization: 'Bearer ' + apiKey, // <-- 把 fkxxxxx 替换成你自己的 Forward Key，注意前面的 Bearer 要保留，并且和 Key 中间有一个空格。
  //   },
  // };

  // fetch('https://openai.api2d.net/v1/chat/completions', options)
  // .then(response => {
  //   console.log('statusCode:', response.status);
  //   console.log('headers:', response.headers);
  //   return response.text();
  // })
  // .then(data => {
  //   AIFeedback.textContent = 'AI Professor: ' + data;
  //   console.log('Response is successfully received.');
  // })
  // .catch(error => {
  //   console.error('Failed to get response. ' + error);
  //   AIFeedback.textContent = 'Sorry, AI Professor cannot respond you now.';
  // });

  // var req = https.request(options, (res) => {
  //   console.log('statusCode:', res.statusCode);
  //   console.log('headers:', res.headers);

  //   res.on('data', (d) => {
  //     // process.stdout.write(d);
  //     AIFeedback.textContent = 'AI Professor: '+ d;
  //     console.log('Response is successfully received.');
  //   });
  // });

  // req.on('error', (e) => {
  //   console.error('Failed to get response. ' + e);
  //   AIFeedback.textContent = 'Sorry, AI Professor cannot respond you now.';
  // });
  console.log('Words are sent to OpenAI.');
  // var prompt = 
}

recognition.onspeechend = function () {
  recognition.stop();
  dictateButton.textContent = 'Tap to start dictating';
}

recognition.onnomatch = function (event) {
  // diagnostic.textContent = "I didn't recognise that color.";
}

recognition.onerror = function (event) {
  diagnostic.textContent = 'Error occurred in recognition: ' + event.error;
}


//ChatGPT API
// async function generateText(prompt) {
//   const response = await fetch(apiUrl, {
//     method: "POST",
//     headers: {
//       "Content-Type": "application/json",
//       "Authorization": `Bearer ${apiKey}`
//     },
//     body: JSON.stringify({
//       prompt: prompt,
//       max_tokens: 50,
//       n: 1,
//       stop: "\n"
//     })
//   });
//   const data = await response.json();
//   return data.choices[0].text.trim();
// }

// generateText(prompt).then((text) => {
//   console.log(text);
// }).catch((error) => {
//   console.error(error);
// });

function readOutLoud(message) {
  var speech = new SpeechSynthesisUtterance();

  //设置朗读内容和属性
  speech.text = message;
  speech.volume = 1;
  speech.rate = 1;
  speech.pitch = 1;

  window.speechSynthesis.speak(speech);
}

function goTTS(text) {
  const params = {
    token: 'ttsmaker_demo_token',
    text: text,
    voice_id: 778,
    audio_format: 'wav',
    audio_speed: 1.0,
    audio_volume: 0,
    text_paragraph_pause_time: 0
  };
  // 'I am very happy to be your professor.'
  const proxyUrl = 'https://cors-anywhere.herokuapp.com/';


  fetch('https://api.ttsmaker.com/v1/create-tts-order', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(params)
  })
    .then(response => response.json())
    .then(data => {
      console.log(data);
      const audioUrl = data.audio_file_url;
      fetch(proxyUrl + audioUrl)
        .then(response => response.blob())
        .then(blob => {
          const audio = new Audio(URL.createObjectURL(blob));
          audio.play();
        })
        .catch(error => console.log(error));
    })
    .catch(error => console.log(error));

}