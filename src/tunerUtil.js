import { render } from '@testing-library/react';
import React from 'react';
import '../src/index.css';

//component to render the note detector section of the website
class NoteDetector extends React.Component {

    //method to access user's microphone and obtain the audio file of them playing a note
    //credit to https://developer.mozilla.org/en-US/docs/Web/API/MediaStream_Recording_API/Using_the_MediaStream_Recording_API
    async getAudioPermission(){
        let stream = null;
        try {
            // passing the constraint that we only need to record audio to the getUserMedia method of the mediaDevices object. getUserMedia prompts the user for permission to use a 
            // input which produces a MediaStream with tracks containing the specified types of media. A Promise is returned that resolves to a MediaStream object 
            stream = await navigator.mediaDevices.getUserMedia({audio: true, video: false});
            
            //Once getUserMedia creates a media stream stored in "stream", we create a new MediaRecorder instance and pass it the stream directly. this will be my entry point to using the MediaRecorder API. The stream
            //is now ready to be captured into a Blob, in the default encoding format of the browser
            
            const mediaRecorder = new MediaRecorder(stream);

            //method to start recording the stream when the "Turn on tuner" button is pressed
            mediaRecorder.start();
            //1000 IS A TIMESLICE PROPERTY. A ondataavailable EVENT IS FIRED every X ms AND A BLOB OF DATA IS PASSED TO THE EVENT HANDLER. 

            var audioCtx = new (window.AudioContext || window.webkitAudioContext)();
            var analyzer = audioCtx.createAnalyser();

            //SUS
            let source = audioCtx.createMediaStreamSource(stream);
            source.connect(analyzer);
            

            //creating an event handler to collect the audio data
            mediaRecorder.ondataavailable = function(e){

                let uint8view = new Uint8Array(2048);
                analyzer.getByteTimeDomainData(uint8view);
                console.log(uint8view);

            //     chunks.push(e.data);                
            //     const blob = chunks[0];

            //     blob.arrayBuffer().then(array_buffer => {
            //         let uint8view = new Uint8Array(2048);
            //         analyzer.getByteTimeDomainData(uint8view);
            //         console.log(uint8view);
            //     }
            // );

            //     chunks = [];

                // blob.arrayBuffer()
                //     .then(arrayBuffer => audio_context.decodeAudioData(arrayBuffer))
                //     .then(audio_buffer => console.log(audio_buffer));
                
            //};

            //method to stop recording when the "Turn off the tuner" button is clicked

            // document.getElementById("stop").onclick = function(){
            //     if(mediaRecorder.state !== "inactive"){
            //         mediaRecorder.stop();
            //         console.log(mediaRecorder.state);
            //     }
            // }

        
        } catch(err){
            console.log("The following getUserMedia error occured: " + err);
        }

    }

    render(){
        return(
            <div id="listening">
                <button type="button" id="start" onClick={() => this.getAudioPermission()}>Turn on the tuner</button>
                <button type="button" id="stop">Turn off the tuner</button>
            </div>
        );
    }

}

export default NoteDetector;