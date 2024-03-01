// All starts here
export async function LoadRandomDiscData() {
  console.log("fetching random disc data..");
  await fetchDiscData();
  const markup = `
            <div class="discData">
              <a href="${discData.link}" target="_blank">
                  <img src="${discData.pic}">
                  <p class="name">${discData.name}</p>
                  <p class="type">${discData.category}</p>
                  <span class="specs">${discData.speed}|${discData.glide}|${discData.turn}|${discData.fade}</span>
                  <p class="brand">${discData.brand}</p>
                </a>
            </div>`;
  document
    .querySelector(".thisVisitDisc")
    .insertAdjacentHTML("beforeend", markup);
}

let discData; //leaving it here for the scope. Is this unsafe, or dumb?
async function fetchDiscData() {
  if (!localStorage.getItem("discID")) {
    console.log("No current random disc found... Generating new one!");
    await getRandomDisc();
    await getSpecificDiscbyID(getWithExpiry("discID"));
  } else {
    console.log("Disc found in localStorage!");
    let discID = getWithExpiry("discID");
    console.log("DiscID found: " + discID);
    if (!discID) {
      await getRandomDisc();
      await getSpecificDiscbyID(getWithExpiry("discID"));
    } else {
      await getSpecificDiscbyID(discID);
    }
  }
}

async function getRandomDisc() {
  console.log("Generating random disc!");
  await fetch("https://discit-api.fly.dev/disc")
    .then((res) => {
      return res.json();
    })
    .then((data) => {
      const ran = Math.floor(Math.random() * data.length) + 1;
      setWithExpiry("discID", data[ran].id, 20 * 60 * 60 * 1000);
    })
    .catch((error) => {
      console.log(error);
    });
}

async function getSpecificDiscbyID(discID) {
  await fetch(`https://discit-api.fly.dev/disc/${discID}`)
    .then((res) => {
      return res.json();
    })
    .then((data) => {
      discData = data;
      console.log(discData);
    })
    .catch((error) => {
      console.log(error);
    });
}

// Token Stuff for timed LocalStorage
function setWithExpiry(key, value, ttl) {
  console.log(
    "setting " + key + " with a value of: " + value + "  [time: " + ttl + "]"
  );
  const now = new Date();
  const item = {
    value: value,
    expiry: now.getTime() + ttl,
  };
  localStorage.setItem(key, JSON.stringify(item));
}

function getWithExpiry(key) {
  const itemStr = localStorage.getItem(key);
  if (!itemStr) {
    return null;
  }
  const item = JSON.parse(itemStr);
  const now = new Date();
  if (now.getTime() > item.expiry) {
    console.log(key + " in local storage has EXPIRED!");
    localStorage.removeItem(key);
    return null;
  }
  return item.value;
}

export async function getAllDiscs() {
  try {
    console.log("Getting ALL Discs...");
    const response = await fetch("https://discit-api.fly.dev/disc");
    if (!response.ok) {
      throw new Error("failed to fetch discs!");
    }
    let data = await response.json();
    return data;
  } catch (error) {
    console.error(error);
    return null;
  }
}
