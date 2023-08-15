// api/get-info.js
const ytdl = require('ytdl-core');
const { send } = require('micro');

module.exports = async (req, res) => {
    const { url } = req.query;

    try {
        const videoInfo = await ytdl.getInfo(url);
        send(res, 200, videoInfo.videoDetails);
    } catch (error) {
        send(res, 500, { error: 'An error occurred.' });
    }
};
