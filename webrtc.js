let localVideo = document.getElementById('localVideo');
let remoteVideo = document.getElementById('remoteVideo');
let startButton = document.getElementById('startButton');
let createOfferButton = document.getElementById('createOffer');
let setOfferButton = document.getElementById('setOffer');
let createAnswerButton = document.getElementById('createAnswer');
let setAnswerButton = document.getElementById('setAnswer');
let offerTextArea = document.getElementById('offer');
let answerTextArea = document.getElementById('answer');
let localStream;
let peerConnection;
const configuration = {'iceServers': [{'urls': 'stun:stun.l.google.com:19302'}]};

startButton.onclick = async () => {
    startButton.disabled = true;
    localStream = await navigator.mediaDevices.getUserMedia({video: true, audio: true});
    localVideo.srcObject = localStream;
    document.getElementById('chatRoom').style.display = 'block';
};

createOfferButton.onclick = async () => {
    peerConnection = new RTCPeerConnection(configuration);
    localStream.getTracks().forEach(track => peerConnection.addTrack(track, localStream));
    peerConnection.ontrack = event => {
        remoteVideo.srcObject = event.streams[0];
    };
    peerConnection.onicecandidate = event => {
        if (event.candidate) {
            console.log('New ICE candidate:', event.candidate);
        }
    };
    let offer = await peerConnection.createOffer();
    await peerConnection.setLocalDescription(offer);
    offerTextArea.value = JSON.stringify(offer);
};

setOfferButton.onclick = async () => {
    let offer = JSON.parse(offerTextArea.value);
    await peerConnection.setRemoteDescription(new RTCSessionDescription(offer));
};

createAnswerButton.onclick = async () => {
    let answer = await peerConnection.createAnswer();
    await peerConnection.setLocalDescription(answer);
    answerTextArea.value = JSON.stringify(answer);
};

setAnswerButton.onclick = async () => {
    let answer = JSON.parse(answerTextArea.value);
    await peerConnection.setRemoteDescription(new RTCSessionDescription(answer));
};

