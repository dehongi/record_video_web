const preview = document.getElementById('preview');
const startButton = document.getElementById('start');
const stopButton = document.getElementById('stop');
const recordedVideo = document.getElementById('recorded');

let mediaRecorder;
let recordedChunks = [];

// Access the user's camera
async function startCamera() {
    try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
        preview.srcObject = stream;
        return stream;
    } catch (err) {
        console.error('Error accessing the camera:', err);
        alert('Could not access the camera. Please check your permissions.');
    }
}

startCamera();

startButton.addEventListener('click', async () => {
    const stream = await startCamera();

    mediaRecorder = new MediaRecorder(stream);
    recordedChunks = [];

    mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
            recordedChunks.push(event.data);
        }
    };

    mediaRecorder.onstop = () => {
        const blob = new Blob(recordedChunks, { type: 'video/webm' });
        const url = URL.createObjectURL(blob);
        recordedVideo.src = url;
    };

    mediaRecorder.start();
    startButton.disabled = true;
    stopButton.disabled = false;
});

stopButton.addEventListener('click', () => {
    mediaRecorder.stop();
    startButton.disabled = false;
    stopButton.disabled = true;
});

const downloadButton = document.createElement('button');
downloadButton.textContent = 'Download Video';
document.body.appendChild(downloadButton);

downloadButton.addEventListener('click', () => {
    const blob = new Blob(recordedChunks, { type: 'video/webm' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.style.display = 'none';
    a.href = url;
    a.download = 'recorded-video.webm';
    document.body.appendChild(a);
    a.click();
    URL.revokeObjectURL(url);
});