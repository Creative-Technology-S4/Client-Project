import React, { useEffect, useRef } from 'react'

const map = (x, a, b, c, d) => Math.max(Math.min(((x - a) * (d - c)) / (b - a) + c, Math.max(a, b)), Math.min(a, b))

const AudioSpectrum = () => {
	const analyserCanvas = useRef(null)

	useEffect(() => {
		animateMicInput()
	}, [])

	const animateMicInput = async () => {
		if (navigator.mediaDevices.getUserMedia !== null) {
			try {
				const stream = await navigator.mediaDevices.getUserMedia({
					video: false,
					audio: true
				})

				const audioCtx = new AudioContext()
				const analyser = audioCtx.createAnalyser()
				analyser.fftSize = 512 // audio res
				// analyser.maxDecibels = 0
				// analyser.minDecibels = -20
				// analyser.smoothingTimeConstant = 0.95
				audioCtx.createMediaStreamSource(stream).connect(analyser)
				const data = new Uint8Array(analyser.frequencyBinCount)
				const ctx = analyserCanvas.current.getContext('2d')

				const draw = radius => {
					if (analyserCanvas.current) {
						ctx.clearRect(0, 0, analyserCanvas.current.width, analyserCanvas.current.height)
						ctx.beginPath()
						ctx.lineWidth = map(radius, 20, 50, 10, 50)
						ctx.strokeStyle = 'white' //color of candle/bar
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

	return <canvas className="centered" ref={analyserCanvas} width="200" height="200" />
}

export default AudioSpectrum
