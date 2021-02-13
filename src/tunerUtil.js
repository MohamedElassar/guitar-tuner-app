import React from 'react';
import '../src/index.css';
import {updateCanvas, clearCanvas} from './helper';

//variable to control the setInterval method that will update the canvas by calling the updateCanvas function in ./helper to reflect audio data
//needs to be a global variable so it can be used to turn off the audio recording if the user turns off the tuner
var intervalID; 

//component to render the note detector section of the website
class NoteDetector extends React.Component {

    constructor(props){
        super(props);
        this.state = {
            canvas: "",
            button_text: "Turn On The Tuner",
            audioContextState: "suspended",
            audioContext: new (window.AudioContext || window.webkitAudioContext)()
        }
        this.getAudioPermission = this.getAudioPermission.bind(this);
    }

    //method to access user's microphone and obtain the audio file of them playing a note. Utilizes the Web Audio API to collect and analyze audio data in real time
    //Documentation can be found at https://developer.mozilla.org/en-US/docs/Web/API/MediaStream_Recording_API/Using_the_MediaStream_Recording_API
    async getAudioPermission(){

        let audioCtx = this.state.audioContext;
        let audioCtx_state = this.state.audioContextState;

        // console.log(audioCtx);

        if(audioCtx_state === "suspended"){ //if true, we will resume our audio context. Will also work the first time we press "Turn on tuner"

            let stream = null;
    
            try {
                //getting the user's permission to record audio
                stream = await navigator.mediaDevices.getUserMedia({audio: true, video: false});
                    
                await audioCtx.resume();//resume the audio context, returns a Promise that resolves to void
                var analyzer = audioCtx.createAnalyser();//create an Analyzer node - refer to Web Audio APIs documentation
    
                let source = audioCtx.createMediaStreamSource(stream);//setting the stream as the source or input to be analyzed
                source.connect(analyzer);//linking the analyzer to the sound stream
                
                analyzer.fftSize = 2048;//unsigned long, size of FFT to be used to find freq. domain
                let bufferLength = analyzer.frequencyBinCount;//half the fftSize property. A property required for the Fast Fourier Transform analysis
                let uint8view = new Uint8Array(bufferLength);//array in which the analyzer node's method will store data
    
                let sampleRate = audioCtx.sampleRate;//storing the audio context's sample rate
        
                this.setState({
                    audioContextState: "running",
                    button_text: "Turn Off The Tuner"
                });
                
                //update the canvas every X ms with the new audio data. Refer to ./helper.js for implementation of the updateCanvas function
                //intervalID stores the setInterval ID so that the interval can be cleared later (using clearInterval(intervalID) method) when the user stops the tuner. Otherwise, this will be called forever
                intervalID = setInterval(updateCanvas, 1, this.state.canvas, analyzer, uint8view, bufferLength, sampleRate);
            
            } catch(err){
                console.log("The following getUserMedia error occured: " + err);//catching any errors that may have been generated due to a failure in gaining permission to record audio, etc.
            }

        } else if(audioCtx_state === "running"){
            
            //stop the "setInterval" method that was being called every X ms to update the canvas with audio data
            clearInterval(intervalID);

            //clear the canvas and just draw a horizontal black line
            clearCanvas(this.state.canvas);

            //suspend the audio context. It will be resumed if the user clicks the button again
            await this.state.audioContext.suspend();

            this.setState({
                audioContextState: "suspended",
                button_text: "Turn On The Tuner"
            });
        }
              
    }

    //Creating the canvas look I want and storing a reference to the canvas that was rendered to the DOM in the state to be able to update it later
    componentDidMount(){
        //getting the canvas we rendered with the id "canvas"
        let temp_canvas = document.getElementById("canvas");
        
        //calling the helper function that's meant to clear the canvas after the user turns off the tuner. I want to do the same to the canvas when it first renders
        clearCanvas(temp_canvas);
        
        this.setState({
            canvas: temp_canvas
        });
    }

    render(){
        return(
            <div id="listening">
                <button type="button" id="start" onClick={() => this.getAudioPermission()}>{this.state.button_text}</button>
                <canvas id="canvas" width={300} height={300}></canvas>
                <p id="note"></p>
            </div>
        );
    }
}

export default NoteDetector;