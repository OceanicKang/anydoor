const conf  = require('./config/defaultConfig');
const route = require('./helper/route');
const openUrl = require('./helper/openUrl');
const http  = require('http');
const chalk = require('chalk');
const path  = require('path');

class Server {
    constructor (config) {
        this.conf = Object.assign({}, conf, config);
    }
    start () {
        const server = http.createServer((request, response) => {
            const filePath = path.join(this.conf.root, request.url);
            route(request, response, filePath, this.conf);
        });

        server.listen(this.conf.port, this,conf.hostname, () => {
            const addr = `http://${this.conf.hostname}:${this.conf.port}/`;
            console.info(`Server running at ${chalk.green(addr)}`);
            openUrl(addr);
        });
    }
}

module.exports = Server;
