const socket = io('/');

const videoGrid = document.getElementById('video-grid');
console.log(videoGrid);
const myVideo = document.createElement('video');
myVideo.muted = true;

var peer = new Peer(undefined,{
    path: '/peerjs',
    host: '/',
    port: '3030'
}); 




let myVideoStream
navigator.mediaDevices.getUserMedia({
    video: true,
    audio: true,
    
}).then(stream =>{
    myVideoStream = stream;
    addVideoStream(myVideo, stream);
    console.log("here");
    peer.on('call', call => {
        console.log("inside peer.on answer");
        call.answer(stream)
        const video = document.createElement('video')
        call.on('stream', userVideoStream =>{
            addVideoStream(video, userVideoStream)
        })
    })


    socket.on('user-connected',(userId) => {
        connecToNewUser(userId, stream);
    })
})

peer.on('open',id =>{
    socket.emit('join-room', ROOM_ID,id);
    console.log("inside peer.on");
})




const connecToNewUser = (userId, stream) => {
    const call = peer.call(userId, stream)
    const video = document.createElement('video')
    console.log("inside connecToNewUser");
    call.on('stream', userVideoStream => {
        addVideoStream(video, userVideoStream)
    })
}

const addVideoStream = (video,stream) => {
    console.log("inside addVideoStream");
    video.srcObject = stream;
    video.addEventListener('loadedmetadata',() => {
        video.play();
    })
    videoGrid.append(video);
}