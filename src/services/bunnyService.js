const axios = require("axios");

const libraryId = process.env.BUNNY_LIBRARY_ID;
const apiKey = process.env.BUNNY_API_KEY;
const cdnHost = process.env.BUNNY_CDN_HOSTNAME;
const embedBase = process.env.BUNNY_EMBED_BASE;

// Lấy link embed
const getEmbedLink = (videoId) => {
  return `${embedBase}/${libraryId}/${videoId}`;
};

// Lấy link direct (mp4/hls)
const getDirectLink = (videoId) => {
  return `https://${cdnHost}/${videoId}/play.mp4`;
};

// Upload video (nếu bạn cần)
const uploadVideo = async (videoId, filePath) => {
  const url = `https://video.bunnycdn.com/library/${libraryId}/videos/${videoId}`;
  const fs = require("fs");
  const stream = fs.createReadStream(filePath);

  await axios.put(url, stream, {
    headers: {
      "Content-Type": "application/octet-stream",
      "AccessKey": apiKey,
    },
    maxContentLength: Infinity,
    maxBodyLength: Infinity,
  });

  return true;
};

module.exports = {
  getEmbedLink,
  getDirectLink,
  uploadVideo,
};
