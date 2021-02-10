import React from 'react';
import ReactDOM from 'react-dom';
import '../src/index.css';
import NoteDetector from './tunerUtil';
import guitarPic from '../src/1-front.jpg';//the picture of the guitar neck

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
        
        //creating a "Tuning Display" button from every element in the current tuning array
        //The onClick function gets "i", which is the id (aka index in the current tuning array) of the button clicked.
        const tuning_notes = this.state.current_tuning.tuning.map((value,index) => 
           <TuningDisplay key={index} note={value} id={index} onClick={(i) => this.handleTuningNoteClick(i)}/> 
        );
        //creating a "TuningOptions" button for all the tuning options in this state's tuning_options
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
                <div>
                    <NoteDetector></NoteDetector>  {/*refer to file tunerUtil.js in ./src for this component*/}
                </div>
            </div>
        );
    }
}

ReactDOM.render( <div><Tuning></Tuning></div>, document.getElementById("root") );