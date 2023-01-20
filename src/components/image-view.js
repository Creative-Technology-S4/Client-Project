import React, { useEffect, useState } from 'react'
import { generateImage } from '../api'

const ImageView = ({ prompt }) => {
	const [image, setImage] = useState()
	const [error, setError] = useState()

	useEffect(() => {
		if (prompt) {
			generateImage(prompt).then(setImage).catch(setError)
		}
	}, [prompt])

	if (error) {
		return <div className="image-view error">{error.message ?? error}</div>
	} else if (prompt) {
		return <div className="image-view">{image ? <img src={image} /> : <p>Loading...</p>}</div>
	}
	return <div className="image-view">No prompt</div>
}

export default ImageView
