import React from 'react';
import '../src/index.css';

class Canvas extends React.Component {
    render(){
        return(
            <canvas ref="canvas" width={300} height={300}></canvas>
        );
    }
}


export default Canvas;