import React from 'react';
import ReactDOM from 'react-dom';

class TuingOptions extends React.Component {
    render(){
        return(
            <button type="button" id={this.props.id} onClick={() => this.props.onClick(this.props.id)}>
                {this.props.tuning_name}
            </button>
        );
    }
}

class TuningDisplay extends React.Component {
    render(){
        return(
            <button type="button" id={this.props.id} onClick={() => this.props.onClick(this.props.id)}>
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

    handleTuningNoteClick(i){
        let current_tuning_name = this.state.current_tuning.name;
        let audio_source = "/audio-files/" + current_tuning_name + "/" + i.toString() + ".mp3";
        let audio = new Audio(audio_source);
        audio.play();
    }

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
           <TuningDisplay note={value} id={index} onClick={(i) => this.handleTuningNoteClick(i)}/> 
        );

        const tuning_options = this.state.tuning_options.map((value, index) =>
            <TuingOptions tuning_name={value.name} id={index} onClick={(i) => this.handleTuningOptionClick(i)}/>
        );

        return (
            <div>
                <div>
                    {tuning_notes}
                </div> 
                <div>
                    {tuning_options}
                </div> 
            </div>
        );
    }
}



class NoteDetector extends React.Component {

    async getAudioPermission(){
        let stream = null;
        try {
            stream = await navigator.mediaDevices.getUserMedia({audio: true, video: false});
            
            window.streamReference = stream;

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