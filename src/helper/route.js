const mime       = require('./mime');
const compress   = require('./compress');
const range      = require('./range');
const isFresh    = require('./cache');
const Handlebars = require('handlebars');
const fs         = require('fs');
const path       = require('path');
const promisify  = require('util').promisify;
const stat       = promisify(fs.stat);
const readdir    = promisify(fs.readdir);

module.exports = async function (request, response, filePath, conf) {
    const source = fs.readFileSync(path.join(conf.tplPath, 'dir.tpl'));
    const template = Handlebars.compile(source.toString());
    try {
        const stats = await stat(filePath);
        if (stats.isFile()) {
            response.setHeader('Content-Type', mime(filePath));
            // 是否走浏览器缓存
            if (isFresh(stats, request, response)) {
                response.statusCode = 304;
                response.end();
                return;
            }

            let rs;
            // 读取部分内容
            const {code, start, end} = range(stats.size, request, response);
            response.statusCode = code;
            if (code === 200) {
                rs = fs.createReadStream(filePath);
            } else {
                rs = fs.createReadStream(filePath, {
                    start,
                    end
                });
            }
            // 压缩内容
            if (filePath.match(conf.compress)) {
                rs = compress(rs, request, response);
            }
            rs.pipe(response);
        } else if (stats.isDirectory()) {
            const files = await readdir(filePath);
            response.statusCode = 200;
            response.setHeader('Content-Type', 'text/html');
            const dir = path.relative(conf.root, filePath);
            const data = {
                title: path.basename(filePath),
                dir: dir ? `/${dir}` : '',
                files: files.map(file => {
                    return {
                        file,
                        mime: mime(file)
                    };
                })
            };
            response.end(template(data));
        }
    } catch (error) {
        console.error(error);
        response.statusCode = 404;
        response.setHeader('Content-Type', 'text/plain');
        response.end(`${filePath} is not a directory or file.`);
    }
};
