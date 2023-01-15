import gameObject from "./helpers/constants.js";
import * as functions from "./helpers/functions.js";
import * as elements from "./helpers/elements.js";
import * as controllers from "./helpers/controllers.js";

document.addEventListener("keydown", async function(event) { 
    if (event.key === "Escape" && document.querySelector("#select-language-div") !== null) 
    {
        await functions.languageSelectionSkipped(); 
    } 
}); 

await functions.begin(); 

const enterButton = document.querySelector("#enter");
const deleteButton = document.querySelector("#delete");
const rows = document.querySelectorAll(".row"); 
const keys = document.querySelectorAll(".letter"); 

console.log(gameObject.word); 
console.log(gameObject.letters); 

keys.forEach(key => {
    key.onclick = () => { 
        if (!gameObject.isGameOver && functions.isLetterValid(key.textContent)) 
        {
            controllers.fill(key.textContent.toUpperCase());  
        } 
    }
});   

deleteButton.onclick = () => {
    if (!gameObject.isGameOver)
    {
        controllers.deleteDiv(gameObject.current.row); 
    }
} 

document.addEventListener("keydown", async function(event) { 
    if (!gameObject.isGameOver)
    { 
        const key = event.key; 
        if (key === "Enter") 
        {
            controllers.handleEnterPress(); 
        }
        else if (key === "Backspace") 
        {
            controllers.deleteDiv(); 
        } 
        else 
        { 
            if (functions.isLetterValid(key)) 
            {
                controllers.fill(key.toUpperCase()); 
            } 
        }
    }
}); 