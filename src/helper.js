import { findRenderedComponentWithType } from "react-dom/test-utils";

//Just a helper function to find the maximum value and its index in the frequency data array
function MaxAndIndexOfMax(arr) {
    if (arr.length === 0) {
        return -1;
    }

    var max = arr[0];
    var maxIndex = 0;

    for (var i = 1; i < arr.length; i++) {
        if (arr[i] > max) {
            maxIndex = i;
            max = arr[i];
        }
    }
    return [maxIndex, max];
}

/*****************************************************************************************************/
/*****************************************************************************************************/
/*****************************************************************************************************/

//function that updates the canvas based on the data that is obtained by the analyser node through getByteTimeDomainData and stored in dataArray
function updateCanvas(canvas, analyser, dataArray, bufferLength, sampleRate){

    let canvasCtx = canvas.getContext("2d");

    // getByteFrequency will fill in the array uint8view with frequency data 
    // Each item in the array represents the DECIBEL value for a specific frequency
    // Each item is an integer on a scale from 0 to 255
    // The frequencies are spread linearly from 0 to 1/2 of the sample rate: e.g. for a 48000 sample rate, the last item in the array represents the decibel value at 24000 Hz
    /****************************************************************** */
    let frequencyDataArray = new Uint8Array(bufferLength);
    analyser.getByteFrequencyData(frequencyDataArray);

    let [max_frequency_index, max_decibel_value] = MaxAndIndexOfMax(frequencyDataArray);
    let max_frequency = max_frequency_index*(sampleRate/2)/bufferLength;

    let note = document.getElementById("note");
    note.innerHTML = max_frequency;
    /***************************************************************** */

    analyser.getByteTimeDomainData(dataArray);

    //drawing a graph respreseting the time domain data (waveform) stored in the dataArray variable
    canvasCtx.fillStyle = "rgb(200, 200, 200)";
    canvasCtx.fillRect(0, 0, canvas.width, canvas.height);

    canvasCtx.lineWidth = 2;
    canvasCtx.strokeStyle = "rgb(0, 0, 0)";

    canvasCtx.beginPath();

    var sliceWidth = canvas.width * 1.0 / bufferLength;
    var x = 0;

    for (var i = 0; i < bufferLength; i++) {

        var v = dataArray[i] / 128.0;
        var y = v * canvas.height / 2;

        if (i === 0) {
            canvasCtx.moveTo(x, y);
        } else {
            canvasCtx.lineTo(x, y);
        }

        x += sliceWidth;
    }
    canvasCtx.lineTo(canvas.width, canvas.height / 2);
    canvasCtx.stroke();
}

/*****************************************************************************************************/
/*****************************************************************************************************/
/*****************************************************************************************************/

//function to clear the canvas by removing any graphs and just drawing a horizontal black line along the center
function clearCanvas(canvas){
    let canvasCtx = canvas.getContext("2d");
    canvasCtx.fillStyle = "rgb(200, 200, 200)";
    canvasCtx.fillRect(0, 0, canvas.width, canvas.height);

    canvasCtx.lineWidth = 2;
    canvasCtx.strokeStyle = "rgb(0, 0, 0)";
    
    canvasCtx.beginPath();
    canvasCtx.moveTo(0, canvas.height/2);    
    canvasCtx.lineTo(canvas.width, canvas.height / 2);
    canvasCtx.stroke();
}

export {MaxAndIndexOfMax, updateCanvas, clearCanvas};