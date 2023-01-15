// api to check whether a word is valid 
export const englishDictApiUrl = "https://dictionary-by-api-ninjas.p.rapidapi.com/v1/dictionary"; 

export const englishDictApiOptions = {
	method: 'GET',
	headers: {
		'X-RapidAPI-Key': '5ac9df7cc7msh3c70aba07df2b47p16ed73jsn136f950af8b0',
		'X-RapidAPI-Host': 'dictionary-by-api-ninjas.p.rapidapi.com'
	}
}; 

// api to generate random english words 
export const randomEnglishWordApiUrl = "https://random-word-api.herokuapp.com/word"; 