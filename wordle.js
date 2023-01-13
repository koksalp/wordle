import gameObject, * as constants from "./helpers/constants.js"; 
import * as functions from "./helpers/functions.js"; 
import * as elements from "./helpers/elements.js"; 
import * as controllers from "./helpers/controllers.js"; 

document.querySelectorAll(".letter").forEach(letter => gameObject.letters.push(letter.innerHTML)); 

elements.keys.forEach(key => {
    key.onclick = () => {
        if (!gameObject.didUserWin)
        {
            controllers.fill(key.innerHTML);  
        } 
    }
});   

elements.deleteButton.onclick = () => {
    if (!gameObject.didUserWin)
    {
        controllers.deleteDiv(gameObject.current.row); 
    }
}

elements.enterButton.onclick = () => { 
    if (!gameObject.didUserWin)
    {
        controllers.enterPressed(); 
    }
}

document.addEventListener("keydown", function(event) { 
    if (!gameObject.didUserWin)
    { 
        const key = event.key; 
        if (key === "Enter") 
        {
            controllers.enterPressed(); 
        }
        else if (key === "Backspace") 
        {
            controllers.deleteDiv(gameObject.current.row); 
        } 
        else if (key === "Escape") 
        {
            if (document.querySelector("#select-language-backdrop") !== null) 
            { 
                functions.removeLanguageModal(); 
                functions.displaySelectedLanguage(constants.languages[constants.defaultLanguage]); 
            } 
        }
        else 
        { 
            const letter = key.toLocaleUpperCase(); 
            let include = false;                       
            for (let i=0; i<gameObject.letters.length; i++)
            {
                if (letter === gameObject.letters[i])
                {
                    include = true; 
                    break;  
                }
            } 
        
            if (include) 
            {
                controllers.fill(letter);        
            }
        }
    }
}); 

document.onclick = event => { 
    if (event.target.id === "select-language-backdrop") 
    {
        functions.removeLanguageModal(); 
    } 
}; 


