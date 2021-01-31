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

ReactDOM.render(<Tuning />, document.getElementById("root"));