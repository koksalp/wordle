import gameObject from "./helpers/constants.js";
import * as functions from "./helpers/functions.js";
import * as controllers from "./helpers/controllers.js";

// let user dismiss language selection
document.addEventListener("keydown", async function (event) {
  if (
    event.key === "Escape" &&
    document.querySelector("#select-language-div") !== null
  ) {
    await functions.languageSelectionSkipped();
  }
});

// begin game
await functions.begin();

// get necessary elements
// they are declared here because they do not exist until begin function ends
const enterButton = document.querySelector("#enter");
const deleteButton = document.querySelector("#delete");
const keys = document.querySelectorAll(".letter");

// let user type something using the keyboard created for the game
keys.forEach((key) => {
  key.onclick = () => {
    if (!gameObject.isGameOver && functions.isLetterValid(key.textContent)) {
      controllers.fill(key.textContent.toUpperCase());
    }
  };
});

// let user interact with enter button on the keyboard created for the game
enterButton.onclick = () => {
  if (!gameObject.isGameOver) {
    controllers.handleEnterPress();
  }
};

// let user interact with delete button on the keyboard created for the game
deleteButton.onclick = () => {
  if (!gameObject.isGameOver) {
    controllers.deleteDiv(gameObject.current.row);
  }
};

// listen for keydown event
document.addEventListener("keydown", async function (event) {
  if (!gameObject.isGameOver) {
    const key = event.key;
    if (key === "Enter") {
      controllers.handleEnterPress();
    } else if (key === "Backspace") {
      controllers.deleteDiv();
    } else {
      if (functions.isLetterValid(key)) {
        controllers.fill(key);
      } else if (!isNaN(key)) {
        functions.numberPressed(key);
      }
    }
  }
}); 