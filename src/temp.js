                // mediaRecorder.ondataavailable = function(e){
                    
                //     // let blob = new Blob([e.data], { 'type' : 'audio/ogg; codecs=opus' });
                //     // let readableStream = blob.stream();
                //     // let objectToRead = readableStream.getReader();
                //     // objectToRead.read().then(text => console.log(text));
                
    
                //     console.log(audioCtx);
                    
                //     /*********************************************************** */
                //     //FYI e.data holds the blob of audio data that was recorder in the X ms timeinterval specified in mediarecorder.start(XX)
                //     /*********************************************************** */
                    
                //     analyzer.getByteFrequencyData(uint8view);
                    
                //     //getByteFrequency will fill in the array uint8view with frequency data 
                //     //Each item in the array represents the DECIBEL value for a specific frequency
                //     //Each item is an integer on a scale from 0 to 255
                //     //The frequencies are spread linearly from 0 to 1/2 of the sample rate
                    
                //     //finding max value in the decibel array and its index
                    
                //     let [max_index, max_value] = MaxAndIndexOfMax(uint8view);
                    
                //     //calculating the maximum frequency based on the index of the highest dB
                //     //Note: the first index in the array uint8view is the dB at 0 Hz, and at any given index in the array, 
                //     //the frequency corresponding to the value can be calculated as (index * SampleRate / FFT_Size) 
                    
                //     let max_frequency = max_index * sampleRate / analyzer.fftSize;
                    
                //     console.log(max_frequency + " Hz with " + max_value + " dB" );
                // }
    