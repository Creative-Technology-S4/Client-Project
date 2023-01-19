import React, { useEffect, useState } from 'react'
import { generateImage } from '../api'

const ImageView = ({ text, color, reveal = false }) => {
	const [image, setImage] = useState()

	useEffect(() => {
		if (text) {
			generateImage(text)
				.then(setImage)
				.catch(() => generateImage('error stop sign').then(setImage))
		} else {
			setImage(null)
		}
	}, [text])

	if (text) {
		return (
			<div
				className="image-view"
				style={{
					borderColor: reveal ? color : 'transparent'
				}}
			>
				{image ? <img className="image" src={image} /> : 'Processing...'}
			</div>
		)
	}
	return <div className="image-view inputs">No prompt</div>
}

export default ImageView
