const video = document.querySelector("video#video")

const startVideo = () => {
	navigator.getUserMedia(
		{ video: {} },
		stream => video.srcObject = stream,
		err => console.error(err)
	)
}

// NOTE: YOU NEED TO CHANGE `modelPath` prefix
const modelPath = "/FaceDetectionJS/models"; // Only for GitHub pages hosting
// const modelPath = "/models"; // Good if you want to host on your (local) server/system

Promise.all([
	faceapi.nets.tinyFaceDetector.loadFromUri(modelPath),
	faceapi.nets.faceLandmark68Net.loadFromUri(modelPath),
	faceapi.nets.faceRecognitionNet.loadFromUri(modelPath),
	faceapi.nets.faceExpressionNet.loadFromUri(modelPath)
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
		faceapi.draw.drawFaceExpressions(canvas, resizedDetections)
	}, 100)
})
