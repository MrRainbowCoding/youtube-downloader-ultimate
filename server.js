const express = require('express');
const cors = require('cors');
const ytdl = require('ytdl-core');
const ffmpeg = require('fluent-ffmpeg');
const fs = require('fs');

const app = express();
app.use(cors());

// Import serverless functions
const getInfo = require('./api/get-info');
const download = require('./api/download');

// Define routes for serverless functions
app.get('/api/get-info', getInfo);
app.get('/api/download', download);

// Serve your front-end files
app.use(express.static('public'));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
