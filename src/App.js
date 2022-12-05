import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition'
import { useState } from 'react'

const { Configuration, OpenAIApi } = require('openai')
const configuration = new Configuration({
	// apiKey: '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'
})
const openai = new OpenAIApi(configuration)

function App() {
	const [image, setImage] = useState()
	const { transcript, listening, resetTranscript } = useSpeechRecognition()

	const generateImage = async () => {
		const response = await openai.createImage({
			prompt: transcript,
			n: 1,
			size: '256x256'
		})
		const url = response.data.data[0].url
		console.log(url)
		setImage(url)
	}

	return (
		<div className="App">
			<div>
				<p>Microphone: {listening ? 'on' : 'off'}</p>
				<button onClick={SpeechRecognition.startListening}>Start</button>
				<button onClick={SpeechRecognition.stopListening}>Stop</button>
				<button onClick={resetTranscript}>Reset</button>
				<p>{transcript}</p>
			</div>
			<button onClick={generateImage}>Generate</button>
			{image ? <img src={image} /> : null}
		</div>
	)
}

export default App
