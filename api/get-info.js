const ytdl = require('ytdl-core');

module.exports = async (req, res) => {
    const { url } = req.query;

    try {
        const videoInfo = await ytdl.getInfo(url);
        const response = {
            title: videoInfo.videoDetails.title,
            length: videoInfo.videoDetails.lengthSeconds,
            author: videoInfo.videoDetails.author.name,
        };
        res.status(200).json(response);
    } catch (error) {
        console.error('An error occurred:', error);
        res.status(500).json({ error: 'An error occurred' });
    }
};
