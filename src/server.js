/**
 * 本地WEB服务
 */

const http = require('http');
const fs = require('fs');
const path = require('path');

const hostname = '127.0.0.1';
const port = 8080;

const server = http.createServer((req, res) => {
    const dist = path.resolve('dist');
    res.statusCode = 200;
    res.setHeader('Content-Type', 'text/html');

    //url route
    switch(req.url) {
        case '/':
            res.write(fs.readFileSync(path.resolve(dist, 'example-01.html'), 'utf-8'));
            res.end();
            break;
        case '/example-01.html':
            res.write(fs.readFileSync(path.resolve(dist, 'example-01.html'), 'utf-8'));
            res.end();
            break;
        case '/example-02.html':
            res.write(fs.readFileSync(path.resolve(dist, 'example-02.html'), 'utf-8'));
            res.end();
            break;
        case '/example-03.html':
            res.write(fs.readFileSync(path.resolve(dist, 'example-03.html'), 'utf-8'));
            res.end();
            break;
        case '/rain.min.js':
            res.setHeader('Content-Type', 'text/javascript');
            res.write(fs.readFileSync(path.resolve(dist, 'rain.min.js'), 'utf-8'));
            res.end();
            break;
        default:
            res.statusCode = 404;
            res.setHeader('Content-Type', 'text/plain');
            res.end('404 Not Found');
    }
});

server.listen(port, hostname, () => {
    console.log(`Server running at http://${hostname}:${port}/`);
});