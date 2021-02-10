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
function updateCanvas(canvas, analyser, dataArray, bufferLength){

    let canvasCtx = canvas.getContext("2d");

    analyser.getByteTimeDomainData(dataArray);

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