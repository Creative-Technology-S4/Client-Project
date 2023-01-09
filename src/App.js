import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition'
import { Configuration, OpenAIApi } from 'openai'
import { useEffect, useState } from 'react'
import AudioSpectrum from './components/audio-spectrum'

const openai = new OpenAIApi(new Configuration({ apiKey: window.env.OPENAI_KEY }))

function App() {
	const [expectedImage, setExpectedImage] = useState()
	const [alternativeImage, setAlternativeImage] = useState()
	const [disruptiveImage, setDisruptiveImage] = useState()
	const { transcript, listening, resetTranscript } = useSpeechRecognition()

	useEffect(() => {
		if (transcript && !listening) {
			generateImages(transcript)
		}
	}, [listening])

	const generateImages = async prompt => {
		const options = { prompt, size: '512x512', n: 3 }
		const response = await openai.createImage(options)
		const { data: images } = response.data
		setExpectedImage(images[0].url)
		setAlternativeImage(images[1].url) // TODO
		setDisruptiveImage(images[2].url) // TODO
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
				{transcript ?? <p style={{ color: 'white' }}>loading...</p>}
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
