import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition'
import { useEffect, useState } from 'react'
import { getSynonymAndAntonym } from './api'
import AudioSpectrum from './components/audio-spectrum'
import ImageView from './components/image-view'

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
		} else if (!transcript) {
			setPrompts([])
		}
	}, [listening, transcript])

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

	return (
		<div className="content">
			<div className="controls">
				{/* <div className="inputs"> */}
				{/* <div className="input">Prompt for image 1: {prompts[0] ?? '...'}</div> */}
				{/* <div className="input">Prompt for image 2: {prompts[1] ?? '...'}</div> */}
				{/* <div className="input">Prompt for image 3: {prompts[2] ?? '...'}</div> */}
				{/* </div> */}
				<div className="btns">
					<button className="btn" onClick={SpeechRecognition.startListening}>
						Start
					</button>
					<button className="btn" onClick={SpeechRecognition.stopListening}>
						Stop
					</button>
					<button className="btn" onClick={resetTranscript}>
						Clear
					</button>
					<button className="btn" onClick={() => setPrompts(['example', 'example', 'example'])}>
						Debug
					</button>
				</div>
			</div>
			<div>
				<div className="transcript">{transcript ?? 'No Prompt'}</div>
				<div className="images">
					{listening ? (
						<AudioSpectrum />
					) : (
						<>
							<ImageView prompt={prompts[0]} />
							<ImageView prompt={prompts[1]} />
							<ImageView prompt={prompts[2]} />
						</>
					)}
				</div>
			</div>
		</div>
	)
}

export default App
