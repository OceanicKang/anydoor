
module.exports = (totalSize, request, response) => {
    const range = request.headers['range'];
    if (!range) {
        return {code: 200};
    }
    const sizes = range.match(/bytes=(\d*)-(\d*)/);
    const end = sizes[2] || totalSize - 1;
    const start = sizes[1] || totalSize - end;
    if (start > end || start < 0 || end > totalSize) {
        return {code: 200};
    }
    response.setHeader('Accept-Ranges', 'bytes');
    response.setHeader('Content-Range', `bytes ${start}-${end}/${totalSize}`);
    response.setHeader('Content-Length', end - start);
    return {
        code: 206,
        start: parseInt(start),
        end: parseInt(end)
    };
};
