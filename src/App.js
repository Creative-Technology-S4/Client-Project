import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition'
import { useEffect, useState } from 'react'
import AudioSpectrum from './components/audio-spectrum'
import ImageView from './components/image-view'
import { getSynonymAndAntonym } from './api'

function shuffle(array) {
	for (var i = array.length - 1; i > 0; i--) {
		var j = Math.floor(Math.random() * (i + 1))
		var temp = array[i]
		array[i] = array[j]
		array[j] = temp
	}
	return array
}

function App() {
	const { transcript, listening, resetTranscript } = useSpeechRecognition()

	const [prompts, setPrompts] = useState([])

	useEffect(() => {
		// when the speech recognition lib is not listening anymore
		// and theres is some input, generate new images
		if (transcript && !listening) {
			generateImages(transcript).catch(console.error)
		}
	}, [listening])

	const generateImages = async prompt => {
		setPrompts([]) // rest image prompts

		// generate similar & opposite prompts
		const similarPrompt = []
		const oppositePrompt = []
		for (const word of prompt.split(' ')) {
			const words = await getSynonymAndAntonym(word)
			similarPrompt.push(words[0] ?? word)
			oppositePrompt.push(words[1] ?? word)
		}

		// shuffle prompts
		setPrompts(shuffle([prompt, similarPrompt.join(' '), oppositePrompt.join(' ')]))
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
			{transcript ?? <p className="transcript">{transcript}</p>}
			<div className="image-stack">
				<ImageView prompt={prompts[0]} />
				<ImageView prompt={prompts[1]} />
				<ImageView prompt={prompts[2]} />
			</div>
			<button className="btn start-btn" onClick={onReset}>
				{transcript ? 'Restart' : 'Start'}
			</button>
		</div>
	)
}

export default App
