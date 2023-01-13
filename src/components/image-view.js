import React, { useEffect, useState } from 'react'
import { generateImage } from '../api'

const ImageView = ({ prompt }) => {
	const [image, setImage] = useState()
	const [error, setError] = useState()

	useEffect(() => {
		if (prompt) {
			generateImage(prompt).then(setImage).catch(setError)
		} else {
			setImage(null)
			setError(null)
		}
	}, [prompt])

	if (error) {
		return (
			<div className="image-view" style={{ color: 'red' }}>
				{/* {error.message ?? error} */}
				Prompt provided contained unsafe words
			</div>
		)
	}
	if (prompt) {
		if (image) {
			return (
				<div className="image-view">
					<img src={image} />
				</div>
			)
		}
		return <div className="image-view inputs">Processing...</div>
	}
	return <div className="image-view inputs">No prompt</div>
}

export default ImageView
