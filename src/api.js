import axios from 'axios'

export const generateImage = async prompt => {
	const options = { prompt, size: '512x512', n: 1 }
	const headers = {
		Authorization: 'Bearer ' + process.env.REACT_APP_OPENAI_KEY
	}
	const response = await axios.post('https://api.openai.com/v1/images/generations', options, { headers })
	return response.data.data[0].url
}

export const getSynonymAndAntonym = async word => {
	const headers = { 'X-Api-Key': process.env.REACT_APP_NINJA_KEY }
	const res = await axios.get('https://api.api-ninjas.com/v1/thesaurus?word=' + word, { headers })
	const { synonyms, antonyms } = res.data

	return [
		synonyms[Math.floor(Math.random() * synonyms.length)],
		antonyms[Math.floor(Math.random() * antonyms.length)]
	]
}
