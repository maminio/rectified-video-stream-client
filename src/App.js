import React from 'react';
import logo from './logo.svg';
import './App.css';
import { w3cwebsocket as W3CWebSocket } from "websocket";
import Webcam from "react-webcam";
import RecordRTC from 'recordrtc';
import axios from 'axios';
import io from 'socket.io-client'
//
// const socket = io('http://0.0.0.0:8090')
//
// socket.on('connect',function(data) {
//   console.log('connected to socket');
// });


// const client = new W3CWebSocket('ws://localhost:8090/ws');
const client = new W3CWebSocket('wss://rectified.ai/pose/ws');

class App extends React.Component {
  state = {
    img: '',
  }
  constructor(props){
    super(props);
    this.websocker();
  }


  componentDidMount(){
  //   navigator.mediaDevices.getUserMedia({
  //     video: true,
  //     audio: true
  //   }).then(async function(stream) {
  //     let recorder = RecordRTC(stream, {
  //         type: 'video',
  //         timeSlice: 6000,
  //         ondataavailable: (blob)=>{
  //           var fd = new FormData();
  //           fd.append('video', blob, 'video.mp4');
  //           // axios.post('http://localhost:5000/file', fd)
  //           // axios.post('http://192.168.99.100:31112/function/open-faas-pose', fd)
  //           // client.send(blob)
  //         },
  //     });
  //     recorder.startRecording();
  // });

  }

  getFrame(){
    if(!this.webcam){
      return null;
    }
    const { video } = this.webcam;
    const canvas = document.createElement('canvas');
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    canvas.getContext('2d').drawImage(video, 0, 0);
    const data = canvas.toDataURL('image/png');
    return data;
  }

  websocker(){
    // socket.on('message', (data) => {
    //   console.log(data.message)
    // })
    const fps = 1;
    client.onopen = () => {
      console.log(`Connected to Di`)
      setInterval(() => {
        const data = this.getFrame()
        // console.log({ data });
        if(data.length > 20){
          console.log('SENT ', new Date().getTime());
          client.send(data)
        }
      }, 1000/fps);



    };
    client.onmessage = message => {
        console.log('RECIEVED ', new Date().getTime());
        const img = document.getElementById('webi');
        img.src = message.data;
    }
  }

  render(){
    return (
      <div className="App">

          <Webcam
            ref={(ref)=>{
              console.log({ ref });

              this.webcam = ref;
            }}
          />
          <img id={'webi'} />
      </div>
    );
  }
}

// <video id={'video'} autoplay></video>
export default App;

/* <video id={'video'} autoplay></video>
          <img id={'webi'} /> */
