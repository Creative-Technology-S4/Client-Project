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
	const [reveal, setReveal] = useState(false)

	useEffect(() => {
		// when the speech recognition lib is not listening anymore
		// and theres is some input, generate new images
		if (transcript && !listening) {
			generateImages(transcript).catch(console.error)
		} else if (!transcript) {
			setPrompts([])
			setReveal(false)
		}
	}, [listening, transcript])

	const clear = () => {
		setPrompts([])
		setReveal(false)
		resetTranscript()
	}

	const generateImages = async prompt => {
		clear() // clear prompts

		// generate similar & opposite prompts
		const similarPrompt = []
		const oppositePrompt = []
		for (const word of prompt.split(' ')) {
			const words = await getSynonymAndAntonym(word)
			similarPrompt.push(words[0] ?? word)
			oppositePrompt.push(words[1] ?? word)
		}

		const data = [
			{
				text: prompt,
				color: 'blue'
			},
			{
				text: similarPrompt.join(' '),
				color: 'green'
			},
			{
				text: oppositePrompt.join(' '),
				color: 'red'
			}
		]

		// shuffle prompts
		setPrompts(shuffle(data))
	}

	return (
		<div className="content">
			<div className="controls">
				<div className="inputs">
					<div className="input">Prompt for image 1: {prompts[0]?.text ?? '...'}</div>
					<div className="input">Prompt for image 2: {prompts[1]?.text ?? '...'}</div>
					<div className="input">Prompt for image 3: {prompts[2]?.text ?? '...'}</div>
				</div>
				<div className="btns">
					<button className="btn" onClick={SpeechRecognition.startListening}>
						Start
					</button>
					<button className="btn" onClick={SpeechRecognition.stopListening}>
						Stop
					</button>
					<button className="btn" onClick={() => setReveal(!reveal)}>
						{reveal ? 'Hide' : 'Reveal'}
					</button>
					<button className="btn" onClick={clear}>
						Clear
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
							{prompts.map((prompt, key) => {
								const props = { ...prompt, reveal, key }
								return <ImageView {...props} />
							})}
						</>
					)}
				</div>
			</div>
		</div>
	)
}

export default App
