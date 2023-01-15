import gameObject, * as constants from "./constants.js"; 
import {check} from "./functions.js"; 
export function fill(letter) 
{
    const row = gameObject.current.row; 
    
    if (!row)
    {
        return; 
    }
    
    const divs = row.querySelectorAll(".word-div"); 
    let emptyDiv; 

    divs.forEach(div => {
        if (!div.innerHTML && !emptyDiv)
        {
            emptyDiv = div; 
        }
    }); 
    
    if (emptyDiv)
    {
        emptyDiv.innerHTML = letter;     
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

export function isAllRowsFull()
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
/* 
export function handleEnterPress()
{ 
    if (gameObject.current.index < constants.attempts) 
    {
        if (isAllRowsFull())
        {
            check(); 
            if (gameObject.didUserWin)
            { 
                winner();  
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
                winner(); 
            }
            else 
            {
                document.querySelector("#answer").innerHTML = `GAME OVER! The answer was: ${gameObject.word}`;
                document.querySelector("hr").style.marginBottom = "0px";   
            }
        }
    }
} */ 

export function handleEnterPress()
{ 
    if (isAllRowsFull())
    {
        check(); 
    } 
    else 
    {
        alert("All rows must be full."); 
    } 
} 