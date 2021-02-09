import { render } from '@testing-library/react';
import React, { useRef, useEffect  } from 'react';
import '../src/index.css';
import Canvas from './Canvas';

//component to render the note detector section of the website
class NoteDetector extends React.Component {

    constructor(props){
        super(props);
        this.state = {
            dataArr: [],
        }
        this.getAudioPermission = this.getAudioPermission.bind(this);
    }

    //method to access user's microphone and obtain the audio file of them playing a note
    //credit to https://developer.mozilla.org/en-US/docs/Web/API/MediaStream_Recording_API/Using_the_MediaStream_Recording_API
    async getAudioPermission(){

        let stream = null;
        var instance = this;
        
        try {

            //getting the user's permission to record audio
            stream = await navigator.mediaDevices.getUserMedia({audio: true, video: false});
            
            const mediaRecorder = new MediaRecorder(stream);//Media Stream Recording API

            mediaRecorder.start(110);//ondataavailable to run every X milliseconds

            var audioCtx = new (window.AudioContext || window.webkitAudioContext)();//Web Audio API
            var analyzer = audioCtx.createAnalyser();//Analyzer node

            let source = audioCtx.createMediaStreamSource(stream);//setting the stream as the source or input to be analyzed
            source.connect(analyzer);//linking the analyzer to the sound stream
            
            analyzer.fftSize = 2048;//unsigned long, size of FFT to be used to find freq. domain
            let bufferLength = analyzer.frequencyBinCount;//half the fftSize property

            mediaRecorder.ondataavailable = function(e){
                console.log(audioCtx);
                /*********************************************************** */
                //FYI e.data holds the blob of audio data that was recorder in the X ms timeinterval specified in mediarecorder.start(XX)
                /*********************************************************** */
                let uint8view = new Uint8Array(bufferLength);//array in which the analyzer node's method will store data
                analyzer.getByteFrequencyData(uint8view);
                //getByteFrequency will fill in the array uint8view with frequency data 
                //Each item in the array represents the DECIBEL value for a specific frequency
                //Each item is an integer on a scale from 0 to 255
                //The frequencies are spread linearly from 0 to 1/2 of the sample rate
                console.log(uint8view);
            }

            document.getElementById("stop").onclick = function(){
                if(mediaRecorder.state !== "inactive"){
                    mediaRecorder.stop();
                    console.log(mediaRecorder.state);
                }
            }
        
        } catch(err){
            console.log("The following getUserMedia error occured: " + err);
        }

    }

    render(){
        return(
            <div id="listening">
                <button type="button" id="start" onClick={() => this.getAudioPermission()}>Turn on the tuner</button>
                <button type="button" id="stop">Turn off the tuner</button>
                {/* <canvas ref="canvas" width={300} height={300}></canvas> */}
                {/* <Canvas></Canvas> */}
            </div>
        );
    }
}

export default NoteDetector;