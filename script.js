import { initializeApp } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-app.js";
import {
  getDatabase,
  ref,
  push,
  onValue,
  set,
} from "https://www.gstatic.com/firebasejs/9.15.0/firebase-database.js";
const appSettings = {
  databaseURL:
    "https://realtime-database-199cb-default-rtdb.asia-southeast1.firebasedatabase.app/",
};
const app = initializeApp(appSettings);
const database = getDatabase(app);
const endorsementListInDB = ref(database, "endorsementList");
let isClick = false;
let prevId = "";
let prevLikes = 0;

// const endorsement = document.getElementById("endorsement-el")
const container = document.querySelector(".container");
const list = document.querySelector(".a");
const textEndorsement = document.getElementById("text-el");
const inputFromEl = document.getElementById("from-input-el");
const inputToEl = document.getElementById("to-input-el");
const publishBtn = document.getElementById("publish-btn-el");
let endorsementObject = {
  like: 0,
  textFrom: "",
  textTo: "",
  text: "",
};

publishBtn.addEventListener("click", function () {
  endorsementObject.text = textEndorsement.value;
  endorsementObject.textFrom = inputFromEl.value;
  endorsementObject.textTo = inputToEl.value;
  if (
    endorsementObject.text &&
    endorsementObject.textFrom &&
    endorsementObject.textTo
  ) {
    //clear
    push(endorsementListInDB, endorsementObject);
    clearInputField();
    isClick = false;
  } else {
    alert("Please complete input field");
  }
});

onValue(endorsementListInDB, function (snapshots) {
  if (snapshots.exists()) {
    clearList();
    let itemArray = Object.entries(snapshots.val());
    for (let i = 0; i < itemArray.length; i++) {
      let id = itemArray[i][0];
      endorsementObject.text = itemArray[i][1].text;
      endorsementObject.textFrom = itemArray[i][1].textFrom;
      endorsementObject.textTo = itemArray[i][1].textTo;
      addEndorsement(endorsementObject, id);
    }
  } else {
    console.log("wala laman");
  }
});
//localStorage.clear();

function addEndorsement(item, id) {
  //
  const endorsement = document.createElement("div");
  endorsement.classList.add("endorsement-el");
  //endorsement.setAttribute("id",`${id}`)
  //
  const h3From = document.createElement("h3");
  h3From.setAttribute("id", "from-el");
  h3From.textContent = item.textFrom;
  //
  const h3To = document.createElement("h3");
  h3To.setAttribute("id", "to-el");
  h3To.textContent = item.textTo;

  //
  const paragraph = document.createElement("p");
  paragraph.textContent = item.text;

  const inline = document.createElement("div");
  let likes = 0;

  const span = document.createElement("span");
  span.setAttribute("id", id);
  span.classList.add(span.id);

  const like = ref(database, `endorsementList/${id}/like`);
  prevLikes = likes;
  onValue(like, function (snapshot) {
    likes = snapshot.val();
  });

  span.textContent = `🖤 ${likes}`;
  //localStorage.clear();

  span.addEventListener("click", function () {
    //////////////// ilagay sa varaiable/////////////
    set(like, (likes += 1));
  });

  inline.classList.add("inline");
  inline.appendChild(h3To);
  inline.appendChild(span);
  endorsement.appendChild(h3From);
  endorsement.appendChild(paragraph);
  endorsement.appendChild(inline);
  endorsement.addEventListener("click", function () {
    console.log();
  });
  list.appendChild(endorsement);
}

function endorsementDiv() {}

function clearInputField() {
  textEndorsement.value = "";
  inputFromEl.value = "";
  inputToEl.value = "";
}
function clearList() {
  list.innerHTML = "";
}
