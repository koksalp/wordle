import words from "./words.js"; 
import gameObject, * as constants from "./constants.js"; 
import * as elements from "./elements.js"; 
import * as functions from "./functions.js"; 

export function enterPressed()
{ 
    if (gameObject.current.index < constants.attempts) 
    {
        if (isAllRowsFull())
        {
            check(); 
            if (gameObject.didUserWin)
            { 
                functions.winner();  
            }
        } 
        else 
        {
            alert("All rows must be full."); 
        } 
        if (gameObject.current.index === constants.attempts) 
        {
            if (gameObject.didUserWin)
            { 
                functions.winner(); 
            }
            else 
            {
                document.querySelector("#answer").innerHTML = `GAME OVER! The answer was: ${constants.random_word}`;
                document.querySelector("hr").style.marginBottom = "0px";   
            }
        }
    }
} 

export function fill(letter) 
{
    const row = gameObject.current.row; 
    
    if (!row)
    {
        return; 
    }
    
    const divs = row.querySelectorAll(".word-div"); 
    let empty_div; 

    divs.forEach(div => {
        if (!div.innerHTML && !empty_div)
        {
            empty_div = div; 
        }
    }); 
    
    if (empty_div)
    {
        empty_div.innerHTML = letter;     
    } 
} 

export function deleteDiv()
{
    const row = gameObject.current.row; 
    
    if (!row)
    {
        return undefined; 
    } 
    
    const divs = row.querySelectorAll(".word-div"); 
    let last_div; 
    divs.forEach(div => {
        if (div.innerHTML) 
        {
            last_div = div; 
        }
    });
    
    if (last_div)
    {
        last_div.innerHTML = ""; 
    } 
} 

function isAllRowsFull()
{
    const row = gameObject.current.row; 
    
    if (!row)
    {
        return false; 
    }
    
    let full = true;   
    const divs = row.querySelectorAll(".word-div"); 
    divs.forEach(div => {
        if (!div.innerHTML) 
        {
            full = false;     
        }
    });
    return full; 
}

function check() 
{
    const row = gameObject.current.row; 
    
    if (!row)
    {
        return; 
    }
    
    const divs = row.querySelectorAll(".word-div"); 
    let count = 0; 
    let word = "";
    let randomWordCopy = constants.random_word.slice(); 
    const specialChar = "."; 
    divs.forEach(div => word += div.innerHTML); 
    
    if (isExist(word))
    {
        divs.forEach((div, index) => { 
            if (div.innerHTML === constants.random_word[index])
            { 
                div.style.backgroundColor = "hotpink"; 
                functions.colorKeyboard(div.innerHTML, "hotpink"); 
                randomWordCopy = functions.removeChar(randomWordCopy, index, specialChar); 
                count++; 
            } 
        }); 
        
        divs.forEach((div, index) => { 
            if (randomWordCopy[index] !== specialChar) 
            { 
                if (randomWordCopy.includes(div.innerHTML))
                { 
                    div.style.backgroundColor = "yellow"; 
                    functions.colorKeyboard(div.innerHTML, "yellow"); 
                } 
                else 
                {
                    div.style.backgroundColor = "grey"; 
                    functions.colorKeyboard(div.innerHTML, "grey"); 
                } 

            } 
        }); 
        if (count === constants.wordLength)
        { 
            gameObject.didUserWin = true; 
        }
        gameObject.current.row = elements.rows[++gameObject.current.index]; 
    }
    else 
    {
        alert(`${word} does not exist`); 
    }
    
}

function isExist(word) 
{
    if (word)
    {
        word = word.toUpperCase(); 
        const first_letter = word[0];   
        for (let i=0; i<words[first_letter].length; i++)
        {
            if (words[first_letter][i] === word) 
            return true; 
        }
    }
    return false; 
} 
