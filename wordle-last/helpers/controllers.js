import gameObject, * as constants from "./constants.js";
import { check, createAlert, tiltRow } from "./functions.js";

// fill divs in rows whenever user types something valid
export function fill(letter) {
  // edge case
  if (letter === "i") {
    if (gameObject.language === "tr") {
      letter = letter.toLocaleUpperCase();
    } else {
      letter = letter.toUpperCase();
    }
  } else {
    letter = letter.toUpperCase();
  }

  const row = gameObject.current.row;

  if (!row) {
    return;
  }

  const divs = row.querySelectorAll(".word-div");
  let emptyDiv;

  divs.forEach((div) => {
    if (!div.innerHTML && !emptyDiv) {
      emptyDiv = div;
    }
  });

  if (emptyDiv) {
    emptyDiv.innerHTML = letter;
  }
}

// delete letters in divs in rows
export function deleteDiv() {
  const row = gameObject.current.row;

  if (!row) {
    return undefined;
  }

  const divs = row.querySelectorAll(".word-div");
  let last_div;
  divs.forEach((div) => {
    if (div.innerHTML) {
      last_div = div;
    }
  });

  if (last_div) {
    last_div.innerHTML = "";
  }
}

// check if user enters a word whose length is sufficient
export function isAllRowsFull() {
  const row = gameObject.current.row;

  if (!row) {
    return false;
  }

  let full = true;
  const divs = row.querySelectorAll(".word-div");
  divs.forEach((div) => {
    if (!div.innerHTML) {
      full = false;
    }
  });
  return full;
}

// handle the process when user presses enter
export function handleEnterPress() {
  if (isAllRowsFull()) {
    if (gameObject.language === "tr") {
      check();
    } else if (gameObject.language === "en" && gameObject.isAlertAllowed) {
      gameObject.isAlertAllowed = false;
      setTimeout(() => {
        gameObject.isAlertAllowed = true;
      }, 2000);

      check();
    }
  } else {
    const message = constants.languages[gameObject.language].emptyRowMessage;
    createAlert(message);
    tiltRow();
  }
}
