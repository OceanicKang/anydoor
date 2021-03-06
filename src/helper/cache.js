const {cache} = require('../config/defaultConfig');

function refreshRes(stats, response) {
    const {maxAge, expires, cacheControl, lastModified, etag} = cache;
    if (expires) {
        response.setHeader('Expires', (new Date(Date.now() + maxAge * 1000)).toUTCString());
    }
    if (cacheControl) {
        response.setHeader('Cache-Control', `public, max-age=${maxAge}`);
    }
    if (lastModified) {
        response.setHeader('Last-Modified', stats.mtime.toUTCString());
    }
    if (etag) {
        response.setHeader('ETag', `${stats.size}-${stats.mtime}`);
    }
}

module.exports = function isFresh(stats, request, response) {
    refreshRes(stats, response);
    const lastModified = request.headers['if-modified-since'];
    const etag = request.headers['if-none-match'];

    if (!lastModified && !etag) {
        return false;
    }
    if (lastModified && lastModified !== response.getHeader('Last-Modified')) {
        return false;
    }
    if (etag && etag !== response.getHeader('ETag')) {
        return false;
    }
    return true;
};
