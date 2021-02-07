import React from 'react';
import '../src/index.css';

//component to render the note detector section of the website
class NoteDetector extends React.Component {

    //method to access user's microphone and obtain the audio file of them playing a note
    //credit to https://developer.mozilla.org/en-US/docs/Web/API/MediaStream_Recording_API/Using_the_MediaStream_Recording_API
    async getAudioPermission(){

            let stream = await navigator.mediaDevices.getUserMedia({audio:true});

            var audioCtx = new (window.AudioContext || window.webkitAudioContext)();
            var analyser = audioCtx.createAnalyser();
            let source = audioCtx.createMediaStreamSource(stream);

            source.connect(analyser);

            var bufferLength = analyser.fftsize;
            var dataArray = new Uint8Array(bufferLength);

            analyser.getByteTimeDomainData(dataArray);
            console.log(dataArray);

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