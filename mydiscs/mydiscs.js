import { getAllDiscs } from "../discs.js";

if (document.readyState !== "loading") {
  setTimeout(ShowAllDiscs, 0);
} else {
  document.addEventListener("DOMContentLoaded", ShowAllDiscs);
}

function saveDiscID(discToSave) {
  console.log(discToSave);
}

async function ShowAllDiscs() {
  console.log("loading all discs / users discs");
  const discData = await getAllDiscs();
  discData.forEach((disc) => {
    const button = document.createElement("button");
    button.textContent = "Save Disc";
    button.value = disc;

    button.addEventListener("click", () => {
      saveDiscID(disc);
    });

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
      saveDiscID(disc);
    });

    document.querySelector(".discList").appendChild(discElement);
  });
}
