import gameObject, * as constants from "./constants.js"; 
import {getRandomEnglishWord, doesThisEnglishWordExist} from "./api/functions.js"; 
import * as elements from "./elements.js";  

export function createLanguageModal() {
    const backdrop = document.createElement("div"); 
    backdrop.id = "select-language-div"; 
    backdrop.classList.add("backdrop"); 
    backdrop.onclick = async (event) => { 
        if (event.target.id === backdrop.id) 
        {
            await languageSelectionSkipped(); 
        } 
    }; 

    const modal = document.createElement("div"); 
    modal.id = "select-language-modal";
    modal.classList.add("modal");  

    const removeIcon = document.createElement("i"); 
    removeIcon.id = "select-language-remove-icon"; 
    removeIcon.classList = "fa fa-remove"; 
    removeIcon.style.fontSize = "24px"; 
    removeIcon.onclick = async () => { 
        await languageSelectionSkipped(); 
    }; 
    modal.appendChild(removeIcon); 

    const h1 = document.createElement("h1"); 
    h1.innerHTML = "Select language"; 
    modal.appendChild(h1); 

    for (let language in constants.languages) 
    {
        const languageButton = document.createElement("button"); 
        languageButton.type = "button"; 
        languageButton.classList.add("select-language-button"); 
        languageButton.innerHTML = capitalizeFirstLetter(constants.languages[language].nativeName); 
        languageButton.onclick = async () => {
            handleLanguageSelection(language); 
            removeLanguageModal(); 
            await setWord(); 
        };  
        modal.appendChild(languageButton); 
    } 

    backdrop.appendChild(modal); 
    elements.mainDiv.appendChild(backdrop); 
} 

export function removeLanguageModal() 
{
    const modal = document.querySelector("#select-language-div"); 
    
    if (modal !== null) 
    {
        modal.remove(); 
    } 
} 

function handleLanguageSelection(language) 
{ 
    const languageObject = constants.languages[language]; 
    gameObject.language = language; 
    saveLanguageToLocalStorage(language); 

    displaySelectedLanguage(languageObject); 
    removeLanguageModal();  
} 

export function saveLanguageToLocalStorage(language) 
{
    localStorage.setItem(constants.localStorageNames.language, language); 
} 

export function getLanguageFromLocalStorage() 
{
    const retrievedLanguage = localStorage.getItem(constants.localStorageNames.language); 

    if (retrievedLanguage === null) 
    { 
        return constants.defaultLanguage; 
    } 
    return retrievedLanguage; 
} 

export function isLanguageSavedToLocalStorage()
{ 
    const retrievedLanguage = localStorage.getItem(constants.localStorageNames.language); 
    
    if (retrievedLanguage === null) 
    { 
        return false; 
    } 
    return true; 
}

export async function getWord()
{ 
    const language = gameObject.language; 
    let word; 

    if (language === "en") 
    { 
        word = await getEnglishWord(); 
    } 
    else if (language === "tr")
    {
        word = getTurkishWord(); 
    } 
    return word || "ERROR"; 
} 
    
async function getEnglishWord()
{
    while (true) 
    {
        const word = await getRandomEnglishWord(); 

        if (word === null) 
        {
            continue; 
        } 

        const isValid = await doesThisEnglishWordExist(word); 

        if (!isValid)  
        {
            continue; 
        } 

        return word.toUpperCase(); 
    }
} 

function getTurkishWord()
{
    return "ABECE"; 
} 

function capitalizeFirstLetter(string) 
{
    return string.charAt(0).toUpperCase() + string.slice(1); 
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

export function displaySelectedLanguage(languageObject)
{ 
    if (languageObject!== undefined) 
    { 
        const elementId = "p-selected-language"; 
        const previousElement = document.querySelector(`#${elementId}`); 
        if (previousElement !== null) 
        {
            previousElement.remove(); 
        } 
        
        const selectedLanguage = document.createElement("p"); 
        selectedLanguage.onclick = changeLanguage; 
        selectedLanguage.innerHTML = languageObject.plugin.replace("#", `<b>${capitalizeFirstLetter(languageObject.nativeName)}</b>`); 
        selectedLanguage.id = elementId; 
        main.appendChild(selectedLanguage); 
    } 
} 

async function setWord() 
{ 
    loadingModal(); 
    gameObject.word = await getWord(); 
    removeLoadingModal(); 
}

const sleep = ms => new Promise(r => setTimeout(r, ms));

export async function begin() 
{
    if (!isLanguageSavedToLocalStorage()) 
    { 
        createLanguageModal(); 
    } 

    else 
    { 
        const languageObject = constants.languages[gameObject.language]; 
        displaySelectedLanguage(languageObject); 
        await setWord(); 
    } 
    while (true) 
    {
        if (gameObject.word === undefined) 
        { 
            console.log("here"); 
            await sleep(100); 
            continue; 
        } 
        
        break; 
    } 
    setLetters(); 
    handleGameDisplay(); 
} 

function setLetters() 
{
    const letters = constants.languages[gameObject.language].alphabet; 
    gameObject.letters = [...letters]; 
}

export async function loadingModal()
{ 
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

function removeLoadingModal() 
{
    const loadingModal = document.querySelector("#loading-div"); 

    if (loadingModal !== null) 
    {
        loadingModal.remove(); 
    }
} 

function changeLanguage() 
{
    const language = gameObject.language === "tr" ? "en" : "tr"; 

    handleLanguageSelection(language); 
    location.reload(); 
} 

function createRows() 
{
    for (let i=0; i<constants.attempts; i++) 
    { 
        const row = document.createElement("div"); 
        row.classList.add("row"); 

        for (let j=0; j<constants.wordLength; j++) 
        {
            const column= document.createElement("div"); 
            column.classList.add("word-div"); 
            row.appendChild(column); 
        } 
        elements.mainDiv.appendChild(row); 
    }
} 

function createKeyboard() 
{
    const keyboardDiv = document.createElement("div"); 
    keyboardDiv.id = "keyboard"; 

    gameObject.letters.forEach(letter=> {
        const key = document.createElement("div"); 
        key.className = "key letter"; 
        key.textContent = letter; 
        keyboardDiv.appendChild(key); 
    }); 

    const enterKey = document.createElement("div"); 
    enterKey.classList.add("key"); 
    enterKey.id = "enter"; 
    enterKey.textContent = "ENTER"; 
    keyboardDiv.appendChild(enterKey); 

    const deleteKey = document.createElement("div"); 
    deleteKey.classList.add("key"); 
    deleteKey.id = "delete"; 
    deleteKey.textContent = "DELETE"; 
    keyboardDiv.appendChild(deleteKey); 

    elements.mainDiv.appendChild(keyboardDiv); 
} 

function handleGameDisplay() 
{
    createRows(); 
    createKeyboard(); 

    gameObject.current.row = document.querySelectorAll(".row")[0]; 
} 

async function doesWordExist(word) 
{ 
    if (gameObject.language === "en") 
    {
        const response = await doesThisEnglishWordExist(word); 
        
        // response might be null indicating some error 
        return response ? true : false; 
    } 
    else if (gameObject.language === "tr") 
    {
        // check 
        return true; 
    }
} 

export async function languageSelectionSkipped() 
{
    handleLanguageSelection(gameObject.language); 
    removeLanguageModal(); 
    await setWord(); 
} 

export function isLetterValid(letter) 
{ 
    if (gameObject.letters.length !== 0) 
    {
        if ((gameObject.language === "en" && letter === "ı") || letter === undefined || typeof(letter) !== "string" || letter.length !== 1 || !isNaN(letter))  
        {
            return false; 
        } 
    
        return gameObject.letters.includes(letter.toUpperCase()); 
    } 
    return; 
} 

export async function check() 
{
    const row = gameObject.current.row; 
    
    const divs = row.querySelectorAll(".word-div"); 
    let word = "";
    divs.forEach(div => word += div.innerHTML); 
    createMessage(); 
    const checkIfWordExists = await doesWordExist(word); 
    deleteMessage(); 
    
    if (checkIfWordExists) 
    { 
        let count = 0; 
        let randomWordCopy = gameObject.word.slice(); 
        const specialChar = "."; 

        divs.forEach((div, index) => { 
            if (div.innerHTML === gameObject.word[index]) 
            { 
                div.style.backgroundColor = constants.letterCorrectPlaceColor; 
                colorKeyboard(div.innerHTML, constants.letterCorrectPlaceColor); 
                randomWordCopy = removeChar(randomWordCopy, index, specialChar); 
                count++; 
            } 
        }); 
        
        divs.forEach((div, index) => { 
            if (randomWordCopy[index] !== specialChar) 
            { 
                if (randomWordCopy.includes(div.innerHTML))
                { 
                    div.style.backgroundColor = constants.letterFoundColor; 
                    colorKeyboard(div.innerHTML, constants.letterFoundColor); 
                } 
                else 
                {
                    div.style.backgroundColor = constants.letterNotFoundColor; 
                    colorKeyboard(div.innerHTML, constants.letterNotFoundColor); 
                } 

            } 
        }); 
        if (count === constants.wordLength)
        { 
            winner(); 
            return; 
        } 
        gameObject.current.row = document.querySelectorAll(".row")[++gameObject.current.index]; 
        if (gameObject.current.row === undefined) 
        {
            loser(); 
            return; 
        }
    }
    else 
    { 
        alert(`${word} does not exist`); 
    }
    
}

export function colorKeyboard(letter, color)
{
    document.querySelectorAll(".letter").forEach(key => {
        if (key.innerHTML === letter) 
        {
            key.style.backgroundColor = color; 
        }
    });
} 

export function winner()
{   
    elements.winnerElement.innerHTML = constants.languages[gameObject.language].winnerStatus[gameObject.current.index]; 
    elements.winnerElement.style.display = "inline-block"; 
    elements.answerElement.innerHTML = "YOU WIN" 
    elements.hrElement.style.marginBottom = "0px";   
    
    gameObject.isGameOver = true; 
} 

export function loser()
{ 
    gameObject.isGameOver = true; 
    elements.answerElement.innerHTML = constants.languages[gameObject.language].loserMessage(gameObject.word); 
    elements.hrElement.style.marginBottom = "0px";  
} 

function createMessage(color, message="We are checking your answer. This may take a while.") 
{ 
    elements.messageElement.innerHTML = message; 
    
    elements.messageElement.style.color = color || "black"; 
}

function deleteMessage()
{
    elements.messageElement.innerHTML = ""; 
}

























































