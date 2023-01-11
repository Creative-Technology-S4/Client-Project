import axios from 'axios'

const OPENAI_API_KEY = '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'
const THESAURUS_API_KEY = 'uzjOVKNnDQ/5NZMMT0VAAg==ge0KcRxrybl4yPDl'

export const generateImage = async prompt => {
	const options = { prompt, size: '512x512', n: 1 }
	const headers = {
		Authorization: 'Bearer ' + OPENAI_API_KEY
	}
	const response = await axios.post('https://api.openai.com/v1/images/generations', options, { headers })
	return response.data.data[0].url
}

export const getSynonymAndAntonym = async word => {
	const headers = { 'X-Api-Key': THESAURUS_API_KEY }
	const res = await axios.get('https://api.api-ninjas.com/v1/thesaurus?word=' + word, { headers })
	const { synonyms, antonyms } = res.data

	return [
		synonyms[Math.floor(Math.random() * synonyms.length)],
		antonyms[Math.floor(Math.random() * antonyms.length)]
	]
}
