import { getAllDiscs } from "../discs.js";

if (document.readyState !== "loading") {
  setTimeout(loadPageButtons, 0);
  setTimeout(ShowAllDiscs, 0);
  setTimeout(createMyDiscsDiv, 0);
} else {
  document.addEventListener("DOMContentLoaded", ShowAllDiscs);
}

// Page Load functions
async function ShowAllDiscs() {
  console.log("loading all discs / users discs");
  const discData = await getAllDiscs();
  discData.forEach((disc) => {
    const button = document.createElement("button");
    button.textContent = "Save Disc";
    button.value = disc;

    // button.addEventListener("click", () => {
    //   saveDiscID(disc);
    // });

    const markup = `
    <li>
      <div class="discData">
        <a href="${disc.link}" target="_blank">
            <img src="${disc.pic}">
            <p class="name">${disc.name}</p>
            <p class="type">${disc.category}</p>
            <span class="specs">${disc.speed}|${disc.glide}|${disc.turn}|${disc.fade}</span>
            <p class="brand">${disc.brand}</p>
        </a>
        <button class="saveButton" data-id="${disc}">Save</button>
      </div>
    </li>`;

    const temp = document.createElement("template");
    temp.innerHTML = markup.trim();
    const discElement = temp.content.firstChild;

    discElement.querySelector(".saveButton").addEventListener("click", () => {
      addDiscToList(disc);
    });

    document.querySelector(".discList").appendChild(discElement);
  });
}

async function createMyDiscsDiv() {
  const myDiscList = document.querySelector(".myDiscList");
  let discList = getDiscListFromLocalStorage();
  if (!discList) {
    discList = [];
  }

  discList.forEach((disc) => {
    const button = document.createElement("button");
    button.textContent = "Remove Disc";
    button.value = disc;

    const markup = `
    <li>
      <div class="discData">
        <a href="${disc.link}" target="_blank">
            <img src="${disc.pic}">
            <p class="name">${disc.name}</p>
            <p class="type">${disc.category}</p>
            <span class="specs">${disc.speed}|${disc.glide}|${disc.turn}|${disc.fade}</span>
            <p class="brand">${disc.brand}</p>
        </a>
        <button class="removeButton" data-id="${disc}">Remove</button>
      </div>
    </li>`;

    const temp = document.createElement("template");
    temp.innerHTML = markup.trim();
    const discElement = temp.content.firstChild;

    discElement.querySelector(".removeButton").addEventListener("click", () => {
      console.log("button to remove disc..." + disc.id);
      removeDiscFromList(disc.index); //how can i put the index of disc here?
    });

    document.querySelector(".myDiscList").appendChild(discElement);
  });
}

async function refreshMyDiscsDiv() {
  const myDiscList = document.querySelector(".myDiscList");
  while (myDiscList.firstChild) {
    myDiscList.removeChild(myDiscList.firstChild);
  }
  createMyDiscsDiv();
}

function loadPageButtons() {
  const allDiscButton = document.querySelector(".showAllDiscs");
  const myDiscButton = document.querySelector(".showMyDiscs");

  allDiscButton.addEventListener("click", showAllDiscs);
  myDiscButton.addEventListener("click", showMyDiscs);
}

// Button JavaScript for Sections
const listOfMyDiscs = document.getElementById("my-discs");
const listOfAllDiscs = document.getElementById("all-discs");

function showMyDiscs() {
  listOfMyDiscs.classList.add("active");
  listOfAllDiscs.classList.remove("active");
}

function showAllDiscs() {
  listOfAllDiscs.classList.add("active");
  listOfMyDiscs.classList.remove("active");
}

// Saving Discs FUnctions
function addDiscToList(discToSave) {
  let discList = getDiscListFromLocalStorage();
  if (!discList) {
    discList = [];
  }

  const index = discList.length;
  discList.push({ ...discToSave, index });
  saveDiscListtoLocalStorage(discList);
}

function removeDiscFromList(indexToRemove) {
  let discList = getDiscListFromLocalStorage();

  //indexes change when removing them. Disc can be at index:0, but has value of index:2.
  //following line then breaks.
  discList.splice(indexToRemove, 1);
  saveDiscListtoLocalStorage(discList);
}

function saveDiscListtoLocalStorage(DiscList) {
  const discListJSON = JSON.stringify(DiscList);
  localStorage.setItem("discList", discListJSON); //Will this delete old version?
  refreshMyDiscsDiv();
}

function getDiscListFromLocalStorage() {
  const discListJSON = localStorage.getItem("discList");
  return JSON.parse(discListJSON);
}
