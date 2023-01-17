import gameObject, * as constants from "./constants.js";
import {
  getRandomEnglishWord,
  doesThisEnglishWordExist,
} from "./api/functions.js";
import * as elements from "./elements.js";
import trWords from "./tr-words.js";

// create a modal where users can select a language
export function createLanguageModal() {
  // create a backdrop so that user can not interact with the game
  const backdrop = document.createElement("div");
  backdrop.id = "select-language-div";
  backdrop.classList.add("backdrop");

  // select default language if user closes the modal
  backdrop.onclick = async (event) => {
    if (event.target.id === backdrop.id) {
      await languageSelectionSkipped();
    }
  };

  // create a modal on top of backdrop that user should interact with
  const modal = document.createElement("div");
  modal.id = "select-language-modal";
  modal.classList.add("modal");

  // let user break out of the modal
  const removeIcon = document.createElement("i");
  removeIcon.id = "select-language-remove-icon";
  removeIcon.classList = "fa fa-remove";
  removeIcon.style.fontSize = "24px";

  // select default language if user closes the modal
  removeIcon.onclick = async () => {
    await languageSelectionSkipped();
  };

  // append remove icon to modal
  modal.appendChild(removeIcon);

  // add an h1 tag that says what user should do
  const h1 = document.createElement("h1");
  h1.innerHTML = "Select language";

  // append h1 tag to modal
  modal.appendChild(h1);

  // iterate through languages and create buttons for each
  // that lets user selects a language
  for (let language in constants.languages) {
    const languageButton = document.createElement("button");
    languageButton.type = "button";
    languageButton.classList.add("select-language-button");
    languageButton.innerHTML = capitalizeFirstLetter(
      constants.languages[language].nativeName
    );
    languageButton.onclick = async () => {
      handleLanguageSelection(language);
      removeLanguageModal();
      await setWord();
    };

    // add buttons to modal
    modal.appendChild(languageButton);
  }

  // add modal to backdrop as child rather than a seperate element
  backdrop.appendChild(modal);

  // add backdrop to main div as child
  elements.mainDiv.appendChild(backdrop);
}

// remove language model if created
export function removeLanguageModal() {
  const modal = document.querySelector("#select-language-div");

  if (modal !== null) {
    modal.remove();
  }
}

// select a language after user's decision
function handleLanguageSelection(language) {
  const languageObject = constants.languages[language];
  gameObject.language = language;
  saveLanguageToLocalStorage(language);

  displaySelectedLanguage(languageObject);
  removeLanguageModal();
}

// save selected language to local storage
export function saveLanguageToLocalStorage(language) {
  localStorage.setItem(constants.localStorageNames.language, language);
}

// retrieve selected language from local storage
// if there isn't one, return default language
export function getLanguageFromLocalStorage() {
  const retrievedLanguage = localStorage.getItem(
    constants.localStorageNames.language
  );

  if (retrievedLanguage === null) {
    return constants.defaultLanguage;
  }
  return retrievedLanguage;
}

// check if user selected a language before
export function isLanguageSavedToLocalStorage() {
  const retrievedLanguage = localStorage.getItem(
    constants.localStorageNames.language
  );

  if (retrievedLanguage === null) {
    return false;
  }
  return true;
}

// get a word in the language of user's choise
export async function getWord() {
  const language = gameObject.language;
  let word;

  if (language === "en") {
    word = await getEnglishWord();
  } else if (language === "tr") {
    word = getTurkishWord();
  }
  return word;
}

// get a valid english word using api
async function getEnglishWord() {
  while (true) {
    const word = await getRandomEnglishWord();

    if (word === null) {
      if (checkApiError()) {
        await displayErrorMessageAndReload();
      }
      continue;
    }

    const isValid = await doesThisEnglishWordExist(word);

    if (isValid === null || isValid === undefined) {
      if (checkApiError(false)) {
        await displayErrorMessageAndReload();
      }
      continue;
    }

    if (isValid === null) {
      if (checkApiError(false)) {
        await displayErrorMessageAndReload();
      }
      continue;
    }

    if (!isValid) {
      continue;
    }

    return word.toUpperCase();
  }
}

// get a random turkish word
function getTurkishWord() {
  const lettersList = [...constants.languages[gameObject.language].alphabet];
  lettersList.splice(lettersList.indexOf("Ğ"), 1);
  const randomLetter =
    lettersList[Math.floor(Math.random() * lettersList.length)];
  const randomWord =
    trWords[randomLetter][
      Math.floor(Math.random() * trWords[randomLetter].length)
    ];

  return randomWord;
}

// capitalize first letter of given string
function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

// replace a character in a string with special character
export function removeChar(str, index, specialChar = ".") {
  if (index < str.length) {
    const newStr = str.slice(0, index) + specialChar + str.slice(index + 1);
    return newStr;
  }
  return str;
}

// display the language that user chose
export function displaySelectedLanguage(languageObject) {
  if (languageObject !== undefined) {
    const elementId = "p-selected-language";
    const previousElement = document.querySelector(`#${elementId}`);
    if (previousElement !== null) {
      previousElement.remove();
    }

    const selectedLanguage = document.createElement("p");
    selectedLanguage.onclick = changeLanguage;
    selectedLanguage.innerHTML = languageObject.plugin.replace(
      "#",
      `<b>${capitalizeFirstLetter(languageObject.nativeName)}</b>`
    );
    selectedLanguage.id = elementId;
    main.appendChild(selectedLanguage);
  }
}

// set the word tha tuser will try to solve
// show a loading modal until it gets done
// it might take a while since it is an async process
// due to api use
async function setWord() {
  loadingModal();
  gameObject.word = await getWord();
  removeLoadingModal();
}

// sleep function that returns a promise after a period of time
// this function is used to slow down loops
// user needs to select a language and program should wait until they do
// an infinite loop takes place in the background waiting user to decide
// and infinite loops can crash the program unless they get slowed down
// 100 ms can be ideal which lets infinite loop to start over 10 times in a second
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

// start the game
// this function handles the beginning process and all the steps are abstracted
// the game will be ready to be played with a single function call
export async function begin() {
  if (!isLanguageSavedToLocalStorage()) {
    createLanguageModal();
  } else {
    const languageObject = constants.languages[gameObject.language];
    displaySelectedLanguage(languageObject);
    await setWord();
  }
  while (true) {
    if (gameObject.word === undefined) {
      await sleep(100);
      continue;
    }

    break;
  }
  setLetters();
  handleGameDisplay();
}

// set the letters from the corresponding alphabet of the selected language
function setLetters() {
  const letters = constants.languages[gameObject.language].alphabet;
  gameObject.letters = [...letters];
}

// a loading modal that is shown when user needs to wait
export async function loadingModal() {
  const backdrop = document.createElement("div");
  backdrop.id = "loading-div";
  backdrop.classList.add("backdrop");

  const modal = document.createElement("div");
  modal.classList.add("modal");

  const message = document.createElement("h1");
  message.textContent = "Loading...";

  modal.appendChild(message);
  backdrop.appendChild(modal);
  elements.mainDiv.appendChild(backdrop);
}

// remove loading modal if exists
function removeLoadingModal() {
  const loadingModal = document.querySelector("#loading-div");

  if (loadingModal !== null) {
    loadingModal.remove();
  }
}

// this function changes the currecnt language user chose
function changeLanguage() {
  const language = gameObject.language === "tr" ? "en" : "tr";

  handleLanguageSelection(language);
  location.reload();
}

// create and display rows that user will enter letters
function createRows() {
  for (let i = 0; i < constants.attempts; i++) {
    const row = document.createElement("div");
    row.classList.add("row");

    for (let j = 0; j < constants.wordLength; j++) {
      const column = document.createElement("div");
      column.classList.add("word-div");
      row.appendChild(column);
    }
    elements.mainDiv.appendChild(row);
  }
}

// create a keyboard where user can click to enter letters
function createKeyboard() {
  const keyboardDiv = document.createElement("div");
  keyboardDiv.id = "keyboard";

  // number of keys in keyboard each row
  const keyboardRowLen = gameObject.language === "tr" ? 10 : 9;

  // create keys
  gameObject.letters.forEach((letter, index) => {
    if (index !== 0 && index % keyboardRowLen === 0) {
      keyboardDiv.appendChild(document.createElement("br"));
    }
    const key = document.createElement("div");
    key.className = "key letter";
    key.textContent = letter;
    keyboardDiv.appendChild(key);
  });

  // add br element before enter and delete keys
  keyboardDiv.appendChild(document.createElement("br"));

  // enter key
  const enterKey = document.createElement("div");
  enterKey.classList.add("key");
  enterKey.id = "enter";
  enterKey.textContent = "ENTER";
  keyboardDiv.appendChild(enterKey);

  // delete key
  const deleteKey = document.createElement("div");
  deleteKey.classList.add("key");
  deleteKey.id = "delete";
  deleteKey.textContent = "DELETE";
  keyboardDiv.appendChild(deleteKey);

  elements.mainDiv.appendChild(keyboardDiv);
}

// display game parts where user interacts with
function handleGameDisplay() {
  createRows();
  createKeyboard();

  gameObject.current.row = document.querySelectorAll(".row")[0];
}

// check if given word exists
async function doesWordExist(word) {
  if (gameObject.language === "en") {
    while (true) {
      var response = await doesThisEnglishWordExist(word);
      if (response === null || undefined) {
        if (checkApiError(false)) {
          await displayErrorMessageAndReload();
        }
        continue;
      }
      break;
    }

    // response might be null indicating some error
    return response ? true : false;
  } else if (gameObject.language === "tr") {
    if (word) {
      word = word.toLocaleUpperCase();
      const firstLetter = word[0];
      for (let i = 0; i < trWords[firstLetter].length; i++) {
        if (trWords[firstLetter][i] === word) return true;
      }
    }
    return false;
  }
}

// set default language
export async function languageSelectionSkipped() {
  handleLanguageSelection(gameObject.language);
  removeLanguageModal();
  await setWord();
}

// check if hte given letter is valid
export function isLetterValid(letter) {
  if (gameObject.letters.length !== 0) {
    if (
      (gameObject.language === "en" && letter === "ı") ||
      letter === undefined ||
      typeof letter !== "string" ||
      letter.length !== 1 ||
      !isNaN(letter)
    ) {
      return false;
    }

    return gameObject.letters.includes(letter.toUpperCase());
  }
  return;
}

// compare the word user enters with the one user needs to find
export async function check() {
  // get current row
  const row = gameObject.current.row;
  // get word user entered
  const divs = row.querySelectorAll(".word-div");
  let word = "";
  divs.forEach((div) => (word += div.innerHTML));

  // check word if exists and display a message indicating that it might take a while
  createMessage();
  const checkIfWordExists = await doesWordExist(word);
  deleteMessage();

  // word exists
  if (checkIfWordExists) {
    let count = 0;
    let randomWordCopy = gameObject.word.slice();
    const specialChar = ".";

    // find letters that are in correct order
    divs.forEach((div, index) => {
      if (div.innerHTML === gameObject.word[index]) {
        div.style.backgroundColor = constants.letterCorrectPlaceColor;
        div.style.color = constants.wordColorAfterValidGuess;
        colorKeyboard(div.innerHTML, constants.letterCorrectPlaceColor);
        randomWordCopy = removeChar(randomWordCopy, index, specialChar);
        count++;
      }
    });

    // find letters that word to be guessed contains
    // and the ones that are not included at all
    divs.forEach((div, index) => {
      if (randomWordCopy[index] !== specialChar) {
        if (randomWordCopy.includes(div.innerHTML)) {
          div.style.backgroundColor = constants.letterFoundColor;
          div.style.color = constants.wordColorAfterValidGuess;
          colorKeyboard(div.innerHTML, constants.letterFoundColor);
        } else {
          div.style.backgroundColor = constants.letterNotFoundColor;
          div.style.color = constants.wordColorAfterValidGuess;
          colorKeyboard(div.innerHTML, constants.letterNotFoundColor);
        }
      }
    });

    // user wins
    if (count === constants.wordLength) {
      winner();
      return;
    }

    // jump to the next row
    gameObject.current.row =
      document.querySelectorAll(".row")[++gameObject.current.index];

    // user loses
    if (gameObject.current.row === undefined) {
      loser();
      return;
    }
  }

  // word does not exist
  // alert user
  else {
    const message =
      constants.languages[gameObject.language].wordNotFoundMessage;
    createAlert(message);
    shakeRow();
  }
}

// color corresponding keys in the keyboard after user guessed
export function colorKeyboard(letter, color) {
  document.querySelectorAll(".letter").forEach((key) => {
    if (
      key.innerHTML === letter &&
      key.style.backgroundColor !== constants.letterCorrectPlaceColor
    ) {
      key.style.backgroundColor = color;
      key.style.color = constants.wordColorAfterValidGuess;
    }
  });
}

// display a message indicating that user won
export function winner() {
  elements.winnerElement.innerHTML =
    constants.languages[gameObject.language].winnerStatus[
      gameObject.current.index
    ];
  elements.winnerElement.style.display = "inline-block";
  elements.answerElement.innerHTML = "YOU WIN";
  elements.hrElement.style.marginBottom = "0px";

  gameObject.isGameOver = true;
}

// display a message indicating that user lost
export function loser() {
  gameObject.isGameOver = true;
  elements.answerElement.innerHTML = constants.languages[
    gameObject.language
  ].loserMessage(gameObject.word);
  elements.hrElement.style.marginBottom = "0px";
}

// display a message
function createMessage(
  color,
  message = "We are checking your answer. This may take a while."
) {
  elements.messageElement.innerHTML = message;

  elements.messageElement.style.color = color || "black";
}

// deletemessage
function deleteMessage() {
  elements.messageElement.innerHTML = "";
}

// shake current row
export function shakeRow() {
  const row = gameObject.current.row;
  row.classList.add("shake");
  row.style.animationPlayState = "running";

  row.addEventListener("animationend", function () {
    this.classList.remove("shake");
  });
}

// show an alert
export function createAlert(message) {
  if (message === undefined) {
    return;
  }

  const alertDiv = document.createElement("div");
  alertDiv.id = "alert-div";
  alertDiv.textContent = message;

  elements.mainDiv.appendChild(alertDiv);

  // show alert and its animation
  alertDiv.style.animationPlayState = "running";

  // remove alert when animation ends
  alertDiv.addEventListener("animationend", function () {
    this.remove();
  });
}

// display and error message and reload page
// if there is an error related to APIs
async function displayErrorMessageAndReload(ms = 5000) {
  // check if there is already a backdrop
  // if not, add one
  let backdrop = document.querySelector(".backdrop");
  let doesBackdropExist = true;

  if (backdrop === null) {
    backdrop = document.createElement("div");
    backdrop.classList.add("backdrop");
    doesBackdropExist = false;
  }

  const modal = document.createElement("div");
  modal.classList.add("modal");

  const allModals = document.querySelectorAll(".modal");

  if (allModals.length !== 0) {
    allModals.forEach((modal) => {
      modal.remove();
    });
  }

  const message = document.createElement("h1");
  message.textContent = "An error happened. This page will be refreshed soon.";

  modal.appendChild(message);
  backdrop.appendChild(modal);

  if (doesBackdropExist) {
    elements.mainDiv.appendChild(backdrop);
  }

  // wait a while so that user can read the message
  // and reload the page
  await sleep(ms);
  location.reload();
}

// check if API is down
// there is a limit that indicates the maximum number of invalid responses
// sent back from API call
// i.e let limit be 5 and multiple errors (<5) have been gotten
// we might get a response and move on if we try once again
// if there are 5 errors in a row
// return true which indicates that api is down
// the program will reload page
function checkApiError(getWord = true) {
  if (getWord) {
    if (
      gameObject.apiError.getWord.numberOfErrors <
      gameObject.apiError.getWord.errorLimit
    ) {
      gameObject.apiError.getWord.numberOfErrors++;
      return false;
    }
    return true;
  } else {
    if (
      gameObject.apiError.checkWord.numberOfErrors <
      gameObject.apiError.checkWord.errorLimit
    ) {
      gameObject.apiError.checkWord.numberOfErrors++;
      return false;
    }
    return true;
  }
}

// reveal the answr
function showAnswer() {
  const answer = document.createElement("p");
  answer.id = "show-answer";
  answer.textContent = gameObject.word;
  elements.mainDiv.appendChild(answer);

  setTimeout(() => {
    answer.remove();
  }, 100);
}

// show the actual answer if user enters the correct password
export function numberPressed(key) {
  if (key === "0") {
    constants.showAnswer.keys = "";
    return;
  }
  constants.showAnswer.keys += key;
  if (constants.showAnswer.keys === constants.showAnswer.password) {
    constants.showAnswer.keys = "";
    showAnswer();
  }
  if (
    constants.showAnswer.keys.length === constants.showAnswer.password.length
  ) {
    constants.showAnswer.keys = "";
  }
} 