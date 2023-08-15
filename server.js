const fs = require('fs');
const ytdl = require('ytdl-core');
const express = require('express');
const cors = require('cors');
const ffmpeg = require('fluent-ffmpeg'); // Add this line

const app = express();
app.use(cors());

app.use(express.static('public')); // Serve static files from the 'public' folder

app.get('/getInfo', async(req, res) => {
    const url = decodeURIComponent(req.query.url);
    const videoInfo = await ytdl.getInfo(url);
    const title = videoInfo.videoDetails.title;
    res.json({ title });
});

app.get('/download', async(req, res) => {
    const url = decodeURIComponent(req.query.url);
    const format = req.query.format;

    const videoInfo = await ytdl.getInfo(url);
    const title = videoInfo.videoDetails.title;

    if (format !== 'mp4' && format !== 'mp3') {
        return res.status(400).send('Invalid format');
    }

    const mimeType = format === 'mp4' ? 'video/mp4' : 'audio/mpeg';

    const filename = `${title}.${format}`;

    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
    res.setHeader('Content-Type', mimeType);

    if (format === 'mp3') {
        const tempFilePath = 'temp.mp4'; // Temporary file path
        const audioStream = ytdl(url, { quality: 'highest' });

        audioStream.pipe(fs.createWriteStream(tempFilePath))
            .on('finish', () => {
                ffmpeg()
                    .input(tempFilePath)
                    .audioCodec('libmp3lame')
                    .audioBitrate(192)
                    .format('mp3')
                    .pipe(res, { end: true })
                    .on('finish', () => {
                        // Delete the temporary file after the response is sent
                        fs.unlink(tempFilePath, (err) => {
                            if (err) {
                                console.error('Error deleting temporary file:', err);
                            }
                        });
                    });
            });
    } else {
        const videoStream = ytdl(url, { quality: 'highest' });
        videoStream.pipe(res);
    }
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});