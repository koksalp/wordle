import * as functions from "./functions.js"; 

export const attempts = 6; 
export const wordLength = 5; 
export const defaultLanguage = "tr";                                                                                             

export const letterCorrectPlaceColor = "hotpink"; 
export const letterFoundColor = "yellow"; 
export const letterNotFoundColor = "grey"; 

export const languages = { 
    "tr": { 
        nativeName: "türkçe", 
        nativeSentence: "türkçe seçildi", 
        plugin: "# seçildi", 
        alphabet: ['A', 'B', 'C', 'Ç', 'D', 'E', 'F', 'G', 'Ğ', 'H', 'İ', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'Ö', 'P', 'R', 'S', 'Ş', 'T', 'U', 'Ü', 'V', 'Y', 'Z'], 
        winnerStatus: ['Dahisin!', 'Harika!', 'Etkileyici!', 'Parlak zeka!', 'Çok iyi!', 'Ehh...'], 
        wordNotFoundMessage: "Kelime listesinde yok", 
        emptyRowMessage: "Yetersiz harf", 
        loserMessage: answer=> `OYUN BİTTİ! CEVAP: ${answer}` 
    }, 
    "en": {
        nativeName: "english", 
        nativeSentence: "english selected", 
        plugin: "# selected", 
        alphabet: ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'], 
        winnerStatus: ['Genius', 'Magnificent', 'Impressive', 'Splendid', 'Great', 'Phew'],  
        wordNotFoundMessage: "Not in word list", 
        emptyRowMessage: "Not enough letters", 
        loserMessage: answer=> `GAME OVER! The answer was: ${answer}` 
    },  
};  
     
export const localStorageNames = {
    language: "wordle_game_language" 
}; 

const gameObject = { 
    current: { 
        "row":  null, 
        "index": 0 
    }, 
    isGameOver: false, 
    letters: [], 
    isAlertAllowed: true, 
    language: functions.getLanguageFromLocalStorage(), 
    word: undefined 
}; 

export default gameObject; 

