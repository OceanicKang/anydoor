const path = require('path');

module.exports = {
    root     : process.cwd(),
    tplPath  : path.join(__dirname, '../template'),
    hostname : '127.0.0.1',
    port     : 9127,
    compress : /\.(html|js|css|md)/,
    cache: {
        maxAge: 10,
        expires: true,
        cacheControl: true,
        lastModified: true,
        etag: true
    }
};
