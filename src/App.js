import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition'
import { useEffect, useState } from 'react'
import AudioSpectrum from './components/audio-spectrum'
import useThesaurus from './hooks/useThesaurus'
import axios from 'axios'

function App() {
	const thesaurus = useThesaurus()

	const [expectedImage, setExpectedImage] = useState()
	const [alternativeImage, setAlternativeImage] = useState()
	const [disruptiveImage, setDisruptiveImage] = useState()
	const { transcript, listening, resetTranscript } = useSpeechRecognition()

	useEffect(() => {
		if (transcript && !listening) {
			generateImages(transcript).catch(console.error)
		}
	}, [listening])

	const generateImages = async prompt => {
		let similarPrompt = [],
			oppositePrompt = []

		for (const word of prompt.split(' ')) {
			const words = await thesaurus.getSynonymAndAntonym(word)
			similarPrompt.push(words[0] ?? word)
			oppositePrompt.push(words[1] ?? word)
		}

		similarPrompt = similarPrompt.join(' ')
		oppositePrompt = oppositePrompt.join(' ')
		// console.log(prompt, similarPrompt, oppositePrompt)

		generateImage(prompt).then(setExpectedImage)
		generateImage(similarPrompt).then(setAlternativeImage)
		generateImage(oppositePrompt).then(setDisruptiveImage)
	}

	const generateImage = async prompt => {
		const options = { prompt, size: '512x512', n: 1 }
		const headers = {
			Authorization: 'Bearer ' + ''
		}
		const response = await axios.post('https://api.openai.com/v1/images/generations', options, { headers })
		return response.data.data[0].url
	}

	const onReset = () => {
		SpeechRecognition.stopListening()
		resetTranscript()
		SpeechRecognition.startListening()
	}

	if (listening) {
		return <AudioSpectrum />
	}
	return (
		<div>
			<p className="transcript">{transcript}</p>
			<div className="image-stack">
				{expectedImage ?? <img src={expectedImage} />}
				{alternativeImage ?? <img src={alternativeImage} />}
				{disruptiveImage ?? <img src={disruptiveImage} />}
			</div>
			<button className="btn start-btn" onClick={onReset}>
				{transcript ? 'Restart' : 'Start'}
			</button>
		</div>
	)
}

export default App
