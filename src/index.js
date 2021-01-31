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
            <button type="button" id={this.props.id}>{this.props.note}</button>
        );
    }
}

class Tuning extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            tuning: ["E","A","D","G","B","E"],
            tuning_options: [
                { name: "Standard", tuning: ["E","A","D","G","B","E"] } ,
                { name: "Drop D", tuning: ["D","A","D","G","B","E"] } ,
                { name: "Drop C", tuning: ["C","G","C","F","A","D"] } ,
                { name: "Open D", tuning: ["D","A","D","F#","A","D"] } ,
                { name: "Open C", tuning: ["C","G","C","G","C","E"] }
            ]
        }
    }

    handleTuningOptionClick(i){
        let selected_tuning = this.state.tuning_options[i];
        this.setState(
            {
                tuning: selected_tuning.tuning
            }
        );
    }

    render(){
        const tuning_notes = this.state.tuning.map((value,index) => 
           <TuningDisplay note={value} id={index} /> 
        );

        const tuning_options = this.state.tuning_options.map((value, index) =>
            <TuingOptions tuning_name={value.name} id={index} onClick={(i) => this.handleTuningOptionClick(i)}/>
        );

        console.log(tuning_notes);

        return (
            <div>
                {tuning_notes}
                <br></br>
                {tuning_options}
            </div>
        );
    }
}

ReactDOM.render(<Tuning></Tuning>, document.getElementById("root"));