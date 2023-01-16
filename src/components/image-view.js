import React, { useEffect, useState } from 'react'
import { generateImage } from '../api'

const ImageView = ({ prompt }) => {
	const [image, setImage] = useState()

	useEffect(() => {
		if (prompt) {
			generateImage(prompt)
				.then(setImage)
				.catch(() => generateImage('error stop sign').then(setImage))
		} else {
			setImage(null)
		}
	}, [prompt])

	if (prompt) {
		return <div className="image-view inputs">{image ? <img src={image} /> : 'Processing...'}</div>
	}
	return <div className="image-view inputs">No prompt</div>
}

export default ImageView
