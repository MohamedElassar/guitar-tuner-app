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
            
            //this is done to handle the red dot that browsers display when recording audio. Later in the code, I will turn the red dot off when the user stops recording. Alternatively, we can just keep
            //the red light on as a way to inform the user that this website is recording their voice input
            window.streamReference = stream;

            //Once getUserMedia creates a media stream stored in "stream", we create a new MediaRecorder instance and pass it the stream directly. this will be my entry point to using the MediaRecorder API. The stream
            //is now ready to be captured into a Blob, in the default encoding format of the browser
            const mediaRecorder = new MediaRecorder(stream);

            //method to start recording the stream when the "Turn on tuner" button is pressed
            mediaRecorder.start(1000);
            //1000 IS A TIMESLICE PROPERTY. A ondataavailable EVENT IS FIRED every X ms AND A BLOB OF DATA IS PASSED TO THE EVENT HANDLER. 
 
            console.log(mediaRecorder.state)//mediarecorder.state should have a value of "recording" when we start recording

            let chunks = [];
            var AudioContext = new (window.AudioContext || window.webkitAudioContext)();
            var analyzer = AudioContext.createAnalyser();

            //creating an event handler to collect the audio data
            mediaRecorder.ondataavailable = function(e){

                chunks.push(e.data);                
                const blob = chunks[0];

                blob.arrayBuffer().then(array_buffer => {
                    let uint8view = new Uint8Array(array_buffer);
                    analyzer.getByteTimeDomainData(uint8view);
                    console.log(analyzer);
                }
            );

                // let audio_context = new AudioContext();

                // blob.arrayBuffer()
                //     .then(arrayBuffer => audio_context.decodeAudioData(arrayBuffer))
                //     .then(audio_buffer => console.log(audio_buffer));

                chunks = [];
            };

            //method to stop recording when the "Turn off the tuner" button is clicked
            document.getElementById("stop").onclick = function(){
                if(mediaRecorder.state !== "inactive"){//state should have a value of "inactive"
                    //when the stop method is called, a stop event is fired. See mediaRecorder.onstop
                    mediaRecorder.stop();
                    console.log(mediaRecorder.state);
                }
            }

            mediaRecorder.onstop = function(e){

                //This section is used to turn off the red light that browsers display when you start recording audio/video
                //I didn't like that it stayed on after recording stops, so the below code removes the red light ONLY after stopping
                //the recording. I'm not sure if this is good practice, and might just end up removing this section entirely
                if (!window.streamReference) return;

                window.streamReference.getAudioTracks().forEach(function(track) {
                    track.stop();
                });
            
                window.streamReference = null;

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
            </div>
        );
    }

}

export default NoteDetector;