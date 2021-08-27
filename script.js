let input = document.querySelector("#input");
let searchBtn = document.querySelector("#search");
let apiKey = "1189cfc7-1511-453f-89e5-34d6fd00ecd1";
let notFound = document.querySelector(".not__found");
let defBox = document.querySelector(".def");
let audioBox = document.querySelector(".audio");
let loading = document.querySelector(".loading");

searchBtn.addEventListener("click", dict);

function dict(e) {
  e.preventDefault();
  let word = input.value;
  if (word === "") {
    alert("Word is required");
    return;
  }
  ClearOutput();
  getData(word);
}

function search(e) {
  console.log(e.target.value);
  console.log(e.key);
  if (e.key === "Enter") {
    dict(e);
  }
  return false;
}
document.getElementById("input").addEventListener("input", ClearOutput());

function ClearOutput() {
  document.querySelector(".def").innerHTML = "";
  document.querySelector(".audio").innerHTML = "";
  document.querySelector(".not__found").innerHTML = "";
}

async function getData(word) {
  loading.style.display = "block";

  const response = await fetch(
    `https://www.dictionaryapi.com/api/v3/references/learners/json/${word}?key=${apiKey}`
  );

  const data = await response.json();
  console.log(data);

  if (!data.length) {
    loading.style.display = "none";
    notFound.innerText = " No result found";
    return;
  }

  if (typeof data[0] === "string") {
    loading.style.display = "none";
    let heading = document.createElement("h3");
    heading.innerText = "Did you mean?";
    notFound.appendChild(heading);
    data.forEach((element) => {
      let suggetion = document.createElement("span");
      suggetion.classList.add("suggested");
      suggetion.innerText = element;
      notFound.appendChild(suggetion);
    });
    return;
  }

  // Result found
  loading.style.display = "none";
  let defination = data[0].shortdef[0];
  defBox.innerText = defination;

  // Sound
  const soundName = data[0].hwi.prs[0].sound.audio;
  if (soundName) {
    renderSound(soundName);
  }

  console.log(data);
}

function renderSound(soundName) {
  // https://media.merriam-webster.com/soundc11
  let subfolder = soundName.charAt(0);
  let soundSrc = `https://media.merriam-webster.com/soundc11/${subfolder}/${soundName}.wav?key=${apiKey}`;
  let aud = document.createElement("audio");
  aud.src = soundSrc;
  aud.controls = true;
  audioBox.appendChild(aud);
}
