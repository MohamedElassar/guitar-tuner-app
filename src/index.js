import React from 'react';
import ReactDOM from 'react-dom';
import '../src/index.css';
import guitarPic from '../src/1-front.jpg';

//component to render the buttons for the different tuning options
class TuingOptions extends React.Component {
    render(){
        return(
            <button type="button" id={this.props.id} onClick={() => this.props.onClick(this.props.id)}>
                {this.props.tuning_name}
            </button>
        );
    }
}

//component to render the notes in the selected tuning; starts with the default standard tuning
class TuningDisplay extends React.Component {
    render(){
        return(
            <button className="notes" type="button" id={"note-" + this.props.id} onClick={() => this.props.onClick(this.props.id)}>
                {this.props.note}
            </button>
        );
    }
}

class Tuning extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            current_tuning: { name: "Standard", tuning: ["E","A","D","G","B","E"] },
            tuning_options: [
                //tuning is for strings, starting with string 6 and ending with string 1
                { name: "Standard", tuning: ["E","A","D","G","B","E"] } ,
                { name: "Drop D", tuning: ["D","A","D","G","B","E"] } ,
                { name: "Drop C", tuning: ["C","G","C","F","A","D"] } ,
                { name: "Open D", tuning: ["D","A","D","F#","A","D"] } ,
                { name: "Open C", tuning: ["C","G","C","G","C","E"] }
            ]
        }
    }

    //method to play the audio file when a certain note is clicked on. audio files are stored in the public folder
    handleTuningNoteClick(i){
        let current_tuning_name = this.state.current_tuning.name;
        let audio_source = "/audio-files/" + current_tuning_name + "/" + i.toString() + ".mp3";
        let audio = new Audio(audio_source);
        audio.play();
    }

    //method to handle the selection of a tuning option
    handleTuningOptionClick(i){
        let new_tuning = this.state.tuning_options[i].name;
        let new_notes = this.state.tuning_options[i].tuning;
        this.setState(
            {
                current_tuning: { name: new_tuning, tuning: new_notes}
            }
        );
    }

    render(){
        const tuning_notes = this.state.current_tuning.tuning.map((value,index) => 
           <TuningDisplay key={index} note={value} id={index} onClick={(i) => this.handleTuningNoteClick(i)}/> 
        );

        const tuning_options = this.state.tuning_options.map((value, index) =>
            <TuingOptions key={index} tuning_name={value.name} id={index} onClick={(i) => this.handleTuningOptionClick(i)}/>
        );

        return (
            <div>
                <div id="container-strings">
                    <img src={guitarPic} alt="Guitar Strings" id="guitar-string-picture"></img>
                    {tuning_notes}
                </div> 
                <div>
                    {tuning_options}
                </div> 
            </div>
        );
    }
}


//component to render the note detector section of the website
class NoteDetector extends React.Component {

    //method to access user's microphone and obtain the audio file of them playing a note
    async getAudioPermission(){
        let stream = null;
        try {
            stream = await navigator.mediaDevices.getUserMedia({audio: true, video: false});
            
            window.streamReference = stream;//this is done to handle the red dot that browsers display when recording audio

            const mediaRecorder = new MediaRecorder(stream);

            mediaRecorder.start();
            console.log(mediaRecorder.state)

            let chunks = [];
            mediaRecorder.ondataavailable = function(e){
                chunks.push(e.data);
            };

            document.getElementById("stop").onclick = function(){
                if(mediaRecorder.state !== "inactive"){
                    mediaRecorder.stop();
                    console.log(mediaRecorder.state);
                }
            }

            mediaRecorder.onstop = function(e){

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

ReactDOM.render(
<div>
    <Tuning></Tuning>
    <NoteDetector></NoteDetector>    
</div>, 
document.getElementById("root"));