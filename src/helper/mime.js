const path = require('path');

const mimeTypes = {
    'css' : 'text/css',
    'xml' : 'text/xml',
    'html': 'text/html',
    'js'  : 'text/javascript',
    'txt' : 'text/plain',
    'gif' : 'image/gif',
    'ico' : 'image/x-icon',
    'jpeg': 'image/jpeg',
    'jpg' : 'image/jpeg',
    'png' : 'image/png',
    'tiff': 'image/tiff',
    'svg' : 'image/svg+xml',
    'json': 'application/json',
    'pdf' : 'application/pdf',
    'swf' : 'application/x-shockwave-flash',
    'wav' : 'audio/x-wav',
    'wma' : 'audio/x-ms-wma',
    'wmv' : 'video/x-ms-wmv',
};

module.exports = (filePath) => {
    let ext = path.extname(filePath).split('.').pop().toLowerCase();
    if (!ext) {
        ext = filePath;
    }
    return mimeTypes[ext] || mimeTypes['txt'];
};
