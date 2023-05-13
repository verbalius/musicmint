async function recordAudio(recordingDurationSeconds = 10, sourceURL) {
    const ffmpeg = require('fluent-ffmpeg');
    const uuid = require('uuid');
    const outputFilePath = 'records/' + uuid.v4() + '.aac';
    ffmpeg(url)
        .noVideo()
        .audioChannels(2)
        .audioBitrate(128)
        .duration(recordingDuration)
        .on('end', function () { console.log('saved!'); })
        .on('error', function (err) { console.log('error: ', err); })
        .save(outputFilePath);
    return outputFilePath;
}