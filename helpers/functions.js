import words from "./words.js"; 
import gameObject, * as constants from "./constants.js"; 
import * as elements from "./elements.js"; 

export function createLanguageModal() 
{
    const backdrop = document.createElement("div"); 
    backdrop.id = "select-language-backdrop"; 

    const modal = document.createElement("div"); 
    modal.id = "modal"; 

    const removeIcon = document.createElement("i"); 
    removeIcon.id = "remove-icon"; 
    removeIcon.classList = "fa fa-remove"; 
    removeIcon.style.fontSize = "24px"; 
    removeIcon.onclick = removeLanguageModal; 
    modal.appendChild(removeIcon); 

    const h1 = document.createElement("h1"); 
    h1.innerHTML = "Select language"; 
    modal.appendChild(h1); 

    for (let language in constants.languages) 
    {
        const languageButton = document.createElement("button"); 
        languageButton.type = "button"; 
        languageButton.classList.add("language-button"); 
        languageButton.dataset.lang = language; 
        languageButton.innerHTML = capitalizeFirstLetter(constants.languages[language].nativeName); 
        languageButton.onclick = () => handleLanguageSelection(language, constants.languages[language]); 
        modal.appendChild(languageButton); 
    } 

    backdrop.appendChild(modal); 
    elements.mainDiv.appendChild(backdrop); 
} 

export function removeLanguageModal() 
{
    const modal = document.querySelector("#select-language-backdrop"); 
    
    if (modal !== null) 
    {
        modal.remove(); 
    } 
} 

function handleLanguageSelection(language, languageObject) 
{ 
    gameObject.language = language; 

    displaySelectedLanguage(languageObject); 
    saveLanguageToLocalStorage(language); 
    removeLanguageModal();  
} 

export function displaySelectedLanguage(languageObject)
{
    const selectedLanguage = document.createElement("p"); 
    selectedLanguage.innerHTML = languageObject.plugin.replace("#", `<b>${capitalizeFirstLetter(languageObject.nativeName)}</b>`); 
    selectedLanguage.id = "p-selected-language"; 
    main.appendChild(selectedLanguage); 
} 

function capitalizeFirstLetter(string) 
{
    return string.charAt(0).toUpperCase() + string.slice(1); 
} 
       
function saveLanguageToLocalStorage(language) 
{
    localStorage.setItem(constants.localStorageNames.language, language); 
} 

export function getLanguageFromLocalStorage() 
{
    const retrievedLanguage = localStorage.getItem(constants.localStorageNames); 

    if (retrievedLanguage === null) 
    { 
        saveLanguageToLocalStorage(constants.defaultLanguage); 
        return constants.defaultLanguage; 
        
    } 
    return retrievedLanguage; 
} 

export function removeChar(str, index, specialChar=".") 
{ 
    if (index < str.length) 
    {
        const newStr= str.slice(0, index) + specialChar + str.slice(index+1); 
        return newStr; 
    } 
    return str; 
} 

export function colorKeyboard(letter, color)
{
    elements.keys.forEach(key => {
        if (key.innerHTML === letter) 
        {
            key.style.backgroundColor = color; 
        }
    });
} 

export function winner()
{
    const winner_element = document.querySelector("#winner-status");    
    const winner_status = {
        "1": "Genius",   
        "2": "Magnificent", 
        "3": "Impressive", 
        "4": "Splendid", 
        "5": "Great", 
        "6": "Phew"  
    }
    document.querySelector("#answer").innerHTML = "YOU WIN" // `you win at your ${gameObject.current.index}. move ${winner_status[gameObject.current.index]}`; 
    winner_element.innerHTML = winner_status[gameObject.current.index]; 
    winner_element.style.display = "inline-block"; 
    document.querySelector("hr").style.marginBottom = "0px";   
} 

export function random()
{ 
    const letters_list = ["A", "B", "C", "Ç", "D", "E", "F", "G", "H", "I", "İ", "J", "K", "L", "M", "N", "O", "Ö", "P", "R", "S", "Ş", "T", "U", "Ü", "V", "Y", "Z"]; 
    const random_letter = letters_list[Math.floor(Math.random() * letters_list.length)]; 
    const random_word = words[random_letter][Math.floor(Math.random() * words[random_letter].length)];  
    // console.log("word: ", random_word); 
    return random_word; 
} 
