const video = document.querySelector("video#video")

const startVideo = () => {
	navigator.getUserMedia(
		{ video: {} },
		stream => video.srcObject = stream,
		err => console.error(err)
	)
}

Promise.all([
	faceapi.nets.tinyFaceDetector.loadFromUri("/models"),
	faceapi.nets.faceLandmark68Net.loadFromUri("/models"),
	faceapi.nets.faceRecognitionNet.loadFromUri("/models"),
	faceapi.nets.faceExpressionNet.loadFromUri("/models")
]).then(startVideo)

video.addEventListener("play", () => {
	const canvas = faceapi.createCanvasFromMedia(video)
	document.body.append(canvas)
	const displaySize = {
		width: video.width,
		height: video.height
	}
	faceapi.matchDimensions(canvas, displaySize)
	setInterval(async () => {
		const detections = await faceapi.detectAllFaces(video, new faceapi.TinyFaceDetectorOptions()).withFaceLandmarks().withFaceExpressions()
		console.log(detections, canvas.width, canvas.height)
		const resizedDetections = faceapi.resizeResults(detections, displaySize)

		const ctx = canvas.getContext("2d")
		ctx.clearRect(0, 0, canvas.width, canvas.height)

		faceapi.draw.drawDetections(canvas, resizedDetections)
		faceapi.draw.drawFaceLandmarks(canvas, resizedDetections)
		faceapi.draw.drawFaceExpresions(canvas, resizedDetections)
	}, 100)
})
