import { wordLength } from "../constants.js"; 
import * as constants from "./constants.js"; 

export async function getRandomEnglishWord(length=wordLength) 
{ 
    try {
        const response = await fetch(`${constants.randomEnglishWordApiUrl}?length=${length}`); 
        var [word] = await response.json(); 
    } catch(error) {
        return null; 
    }
    return word; 
} 

export async function doesThisEnglishWordExist(word) 
{ 
    if (word === undefined || word.length !== wordLength) 
    {
        return false; 
    } 

    try {
        const response = await fetch(`${constants.englishDictApiUrl}?word=${word}`, constants.englishDictApiOptions); 
        var wordInfo = await response.json(); 
    } catch(error) { 
        return null; 
    } 
    
    return wordInfo.valid; 
} 
      