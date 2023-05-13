const fs = require('fs');
const ffmpeg = require('fluent-ffmpeg');

function recordFLVStream(recordingDuration = 10, url) {
    const outputFilename = 'output.aac';
    ffmpeg(url)
        .noVideo()
        .audioChannels(1)
        .audioBitrate(128)
        .duration(recordingDuration)
        .on('end', function() { console.log('saved'); })
        .on('error', function(err) { console.log('error'); })
        .save(outputFilename);
}

recordFLVStream(10, "http://127.0.0.1:8080/live/livestream.aac")