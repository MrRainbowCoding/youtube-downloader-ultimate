document.addEventListener('DOMContentLoaded', () => {
    const downloadBtn = document.getElementById('downloadBtn');
    const urlInput = document.getElementById('url');
    const formatSelect = document.getElementById('format');
    const downloadLink = document.getElementById('downloadLink');
    const statusDiv = document.getElementById('status');

    downloadBtn.addEventListener('click', async () => {
        const url = urlInput.value;
        const format = formatSelect.value;

        statusDiv.textContent = 'Checking...';

        try {
            const infoResponse = await fetch(`/api/getInfo?url=${encodeURIComponent(url)}`);
            const infoData = await infoResponse.json();

            statusDiv.textContent = `Title: ${infoData.title}`;
            statusDiv.textContent += '\nDownloading...';

            // Construct the download link
            const downloadUrl = `/api/download?url=${encodeURIComponent(url)}&format=${format}`;
            downloadLink.href = downloadUrl;
            downloadLink.style.display = 'block';

            statusDiv.textContent = 'Download link is ready. Click to download.';
        } catch (error) {
            console.error('An error occurred:', error);
            statusDiv.textContent = 'An error occurred. Please try again.';
        }
    });
});
