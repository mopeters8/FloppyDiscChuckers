console.log("tag scripts loading...");

async function startLeaderGeneration() {
  console.log("Starting creation of leaderboard.");
  const data = await readCSV();
  createLeaderboard(data);
}

// TODO: Need to add target instead of having it inside this method.
async function readCSV() {
  try {
    //read .csv file on a server
    const target = `https://docs.google.com/spreadsheets/d/1Q8KLVfFvSyCmub30Q9fwPu-waUk78qZVIl2KhPXf1Po/gviz/tq?tqx=out:csv&sheet=tags`;

    const res = await fetch(target, {
      method: "get",
      headers: {
        "content-type": "text/csv;charset=UTF-8",
      },
    });

    if (res.status === 200) {
      const data = await res.text();
      console.log(data);
      return data;
    } else {
      console.log(`Error code ${res.status}`);
    }
  } catch (err) {
    console.log(err);
  }
}

async function createLeaderboard(tagCSV) {
  const board = document.querySelector("#tagBoard");
  let counter = 1;

  namesList = tagCSV.split("\n");
  namesList.forEach((element) => {
    let name = element.replaceAll('"', "");
    console.log(name);

    let tableRow = `
    <tr>
        <td>${name}</td>
        <td>${ordinal_suffix_of(counter++)}</td>
    </tr>
    `;
    board.innerHTML += tableRow;
  });
}

function ordinal_suffix_of(i) {
  let j = i % 10,
    k = i % 100;
  if (j === 1 && k !== 11) {
    return i + "st";
  }
  if (j === 2 && k !== 12) {
    return i + "nd";
  }
  if (j === 3 && k !== 13) {
    return i + "rd";
  }
  return i + "th";
}

startLeaderGeneration();
