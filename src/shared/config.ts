export const config = {
  maxFileSize: 500 * 1024 * 1024, // 500MB
  allowedTypes: ['video/mp4', 'video/quicktime', 'video/x-msvideo'],
  corsHeaders: {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  },
  r2: {
    videosPrefix: 'videos/',
    thumbnailsPrefix: 'thumbnails/',
    hlsPrefix: 'hls/',
  }
};
