const ytdl = require('ytdl-core');
const ffmpeg = require('fluent-ffmpeg');
const fs = require('fs');

module.exports = async (req, res) => {
    const { url, format } = req.query;

    const videoInfo = await ytdl.getInfo(url);
    const title = videoInfo.videoDetails.title;

    if (format !== 'mp4' && format !== 'mp3') {
        return res.status(400).send('Invalid format');
    }

    const mimeType = format === 'mp4' ? 'video/mp4' : 'audio/mpeg';

    const filename = `${title}.${format}`;

    const encodedFilename = encodeURIComponent(filename);
    res.setHeader('Content-Disposition', `attachment; filename="${encodedFilename}"`);
    res.setHeader('Content-Type', mimeType);


    if (format === 'mp3') {
        const tempFilePath = '/tmp/temp.mp4';
    
        const audioStream = ytdl(url, { quality: 'highest' });
    
        audioStream.pipe(fs.createWriteStream(tempFilePath))
            .on('finish', () => {
                ffmpeg()
                    .input(tempFilePath)
                    .audioCodec('libmp3lame')
                    .audioBitrate(192)
                    .format('mp3')
                    .pipe(res, { end: false }) // Set end to false here
                    .on('finish', () => {
                        fs.unlink(tempFilePath, (err) => {
                            if (err) {
                                console.error('Error deleting temporary file:', err);
                            }
                        });
                        res.end(); // End the response manually here
                    });
            });
    } else {
        const videoStream = ytdl(url, { quality: 'highest' });
        videoStream.pipe(res);
    }
};