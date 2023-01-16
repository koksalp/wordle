import * as functions from "./functions.js";

export const attempts = 6;
export const wordLength = 5;
export const defaultLanguage = "tr";

export const letterCorrectPlaceColor = "rgb(106, 170, 100)";
export const letterFoundColor = "rgb(201, 180, 88)";
export const letterNotFoundColor = "rgb(120, 124, 126)";
export const wordColorAfterValidGuess = "rgb(255, 255, 255)"; 

export const languages = {
  tr: {
    nativeName: "türkçe",
    nativeSentence: "türkçe seçildi",
    plugin: "# seçildi",
    alphabet: [
      "A",
      "B",
      "C",
      "Ç",
      "D",
      "E",
      "F",
      "G",
      "Ğ",
      "H",
      "İ",
      "I",
      "J",
      "K",
      "L",
      "M",
      "N",
      "O",
      "Ö",
      "P",
      "R",
      "S",
      "Ş",
      "T",
      "U",
      "Ü",
      "V",
      "Y",
      "Z",
    ],
    winnerStatus: [
      "Dahisin!",
      "Harika!",
      "Etkileyici!",
      "Parlak zeka!",
      "Çok iyi!",
      "Ehh...",
    ],
    wordNotFoundMessage: "Kelime listesinde yok",
    emptyRowMessage: "Yetersiz harf",
    loserMessage: (answer) => `OYUN BİTTİ! CEVAP: ${answer}`,
  },
  en: {
    nativeName: "english",
    nativeSentence: "english selected",
    plugin: "# selected",
    alphabet: [
      "A",
      "B",
      "C",
      "D",
      "E",
      "F",
      "G",
      "H",
      "I",
      "J",
      "K",
      "L",
      "M",
      "N",
      "O",
      "P",
      "Q",
      "R",
      "S",
      "T",
      "U",
      "V",
      "W",
      "X",
      "Y",
      "Z",
    ],
    winnerStatus: [
      "Genius!",
      "Magnificent!",
      "Impressive!",
      "Splendid!",
      "Great!",
      "Phew...",
    ],
    wordNotFoundMessage: "Not in word list",
    emptyRowMessage: "Not enough letters",
    loserMessage: (answer) => `GAME OVER! The answer was: ${answer}`,
  },
};

export const localStorageNames = {
  language: "wordle_game_language",
};

const gameObject = {
  current: {
    row: null,
    index: 0,
  },
  isGameOver: false,
  letters: [],
  isAlertAllowed: true,
  language: functions.getLanguageFromLocalStorage(),
  word: undefined, 
  apiError: { 
    getWord: {
      numberOfErrors: 0, 
      errorLimit: 3 
    }, 
    checkWord: {
      numberOfErrors: 0, 
      errorLimit: 3 
    }, 
  }
};

export const showAnswer= {
  keys: "", 
  password: "152468" 
} 

export default gameObject; 