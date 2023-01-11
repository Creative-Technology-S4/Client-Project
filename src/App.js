import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition'
import { useEffect, useState } from 'react'
import AudioSpectrum from './components/audio-spectrum'
import ImageView from './components/image-view'
import { getSynonymAndAntonym } from './api'

function App() {
	const { transcript, listening, resetTranscript } = useSpeechRecognition()

	const [expectedPrompt, setExpectedPrompt] = useState()
	const [alternativePrompt, setAlternativePrompt] = useState()
	const [disruptivePrompt, setDisruptivePrompt] = useState()

	const [expectedImages, setExpectedImages] = useState([])
	const [alternativeImages, setAlternativeImages] = useState([])
	const [disruptiveImages, setDisruptiveImages] = useState([])

	useEffect(() => {
		if (transcript && !listening) {
			generateImages(transcript).catch(console.error)
		}
	}, [listening])

	const generateImages = async prompt => {
		setExpectedPrompt(null)
		setAlternativePrompt(null)
		setDisruptivePrompt(null)

		const similarPrompt = []
		const oppositePrompt = []
		for (const word of prompt.split(' ')) {
			const words = await getSynonymAndAntonym(word)
			similarPrompt.push(words[0] ?? word)
			oppositePrompt.push(words[1] ?? word)
		}

		setExpectedPrompt(prompt)
		setAlternativePrompt(similarPrompt.join(' '))
		setDisruptivePrompt(oppositePrompt.join(' '))

		setExpectedImages(arr => [...arr, prompt])
		setAlternativeImages(arr => [...arr, prompt])
		setDisruptiveImages(arr => [...arr, prompt])
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
				<ImageView prompt={expectedPrompt} />
				<ImageView prompt={alternativePrompt} />
				<ImageView prompt={disruptivePrompt} />
			</div>
			<button className="btn start-btn" onClick={onReset}>
				{transcript ? 'Restart' : 'Start'}
			</button>
		</div>
	)
}

export default App
