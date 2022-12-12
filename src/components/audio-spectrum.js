import React, { useEffect, useRef } from 'react'

const map = (x, a, b, c, d) => {
	const mapResult = ((x - a) * (d - c)) / (b - a) + c
	return Math.max(Math.min(mapResult, Math.max(a, b)), Math.min(a, b))
}

const AudioSpectrum = ({ doAnimation }) => {
	const analyserCanvas = useRef(null)

	useEffect(() => {
		animateMicInput()
	}, [doAnimation])

	const animateMicInput = async () => {
		if (navigator.mediaDevices.getUserMedia !== null) {
			try {
				const stream = await navigator.mediaDevices.getUserMedia({
					video: false,
					audio: true
				})

				const audioCtx = new AudioContext()
				const analyser = audioCtx.createAnalyser()
				analyser.fftSize = 1024 // audio res
				// analyser.maxDecibels = 0
				// analyser.minDecibels = -20
				// analyser.smoothingTimeConstant = 0.95
				audioCtx.createMediaStreamSource(stream).connect(analyser)
				const data = new Uint8Array(analyser.frequencyBinCount)
				const ctx = analyserCanvas.current.getContext('2d')

				const draw = radius => {
					ctx.clearRect(0, 0, analyserCanvas.current.width, analyserCanvas.current.height)

					if (doAnimation) {
						ctx.beginPath()
						ctx.lineWidth = 10
						ctx.strokeStyle = 'red' //color of candle/bar
						ctx.arc(100, 100, radius, 0, 2 * Math.PI)
						ctx.stroke()
					}
				}

				const loopingFunction = () => {
					requestAnimationFrame(loopingFunction)
					analyser.getByteFrequencyData(data)
					const radius = data.reduce((p, c) => p + c, 0) / data.length
					draw(map(radius, 0, 100, 20, 50, true))
				}

				requestAnimationFrame(loopingFunction)
			} catch (err) {
				console.error(err)
			}
		}
	}

	return <canvas ref={analyserCanvas} />
}

export default AudioSpectrum