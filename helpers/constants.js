import * as elements from "./elements.js"; 
import * as functions from "./functions.js"; 

export const attempts = 6; 
export const wordLength = 5; 
export const defaultLanguage = "tr"; 
export const languages = { 
    "tr": {
        nativeName: "türkçe", 
        nativeSentence: "türkçe seçildi", 
        plugin: "# seçildi" 
    }, 
    "en": {
        nativeName: "english", 
        nativeSentence: "english selected", 
        plugin: "# selected"
    },  
};  

export const localStorageNames = {
    language: "wordle_game_language" 
}; 

const gameObject = { 
    current: { 
        "row":  elements.rows[0], 
        "index": 0 
    }, 
    didUserWin: false, 
    letters: [], 
    language: functions.getLanguageFromLocalStorage() 
}; 

export const random_word = functions.random(); 

export default gameObject; 