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
						ctx.strokeStyle = 'white'
						ctx.fillStyle = 'white'

						ctx.beginPath()
						ctx.arc(210, 90, map(radius, 10, 50, 10, 30), 0, 2 * Math.PI)
						ctx.fill()

						ctx.beginPath()
						ctx.lineWidth = 30
						ctx.arc(150, 150, 45, 0, 2 * Math.PI)
						ctx.stroke()

						ctx.beginPath()
						ctx.lineWidth = 15
						ctx.arc(150, 250, 20, 0, 2 * Math.PI)
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

	return <canvas ref={analyserCanvas} width="300" height="300" />
}

export default AudioSpectrum
