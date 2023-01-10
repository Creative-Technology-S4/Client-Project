import axios from 'axios'

const URL = 'https://api.api-ninjas.com/v1/'
const API_KEY = ''

const useThesaurus = () => {
	const getSynonymAndAntonym = async word => {
		const headers = { 'X-Api-Key': API_KEY }
		const res = await axios.get(URL + 'thesaurus?word=' + word, { headers })
		const { synonyms, antonyms } = res.data
		return [synonyms[0], antonyms[0]]
	}

	return { getSynonymAndAntonym }
}

export default useThesaurus
