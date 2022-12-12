import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition'
import { useEffect, useState } from 'react'
import AudioSpectrum from './components/audio-spectrum'

const { Configuration, OpenAIApi } = require('openai')
const configuration = new Configuration({
	apiKey: window.env.OPENAI_KEY
})
const openai = new OpenAIApi(configuration)

function App() {
	const [image, setImage] = useState()
	const { transcript, listening, resetTranscript } = useSpeechRecognition()

	useEffect(() => {
		if (transcript && !listening) {
			generateImage()
		}
	}, [listening])

	const generateImage = async () => {
		console.log(transcript)
		const response = await openai.createImage({
			prompt: transcript,
			n: 1,
			size: '512x512'
		})
		const url = response.data.data[0].url
		console.log(url)
		setImage(url)
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
			{image ? (
				<img src={image} className="centered" />
			) : (
				transcript ?? <p style={{ color: 'white' }}>loading...</p>
			)}
			<button className="btn start-btn" onClick={onReset}>
				{transcript ? 'Restart' : 'Start'}
			</button>
		</div>
	)
}

export default App
