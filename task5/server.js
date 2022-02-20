const http = require('http');
const fs = require('fs');

http.createServer((request, response) => {
    if (request.url.endsWith('.css')) {
        fs.readFile('static' + request.url, (err, data) => {
            response.setHeader('Content-type', 'text/css');

            if (!err) {
                response.statusCode = 200;
                response.write(data);
            } else {
                response.statusCode = 404;
                response.write('File not found');
            }
            response.end();
        });
    } else {
        const page = request.url === '/' ? 'static/index.html' : 'static/' + request.url + '.html';

        fs.readFile(page, (err, data) => {
            response.setHeader('Content-type', 'text/html');
            if (!err) {
                response.statusCode = 200;
                response.write(data);
            } else {
                response.statusCode = 404;
                response.write('Page not found');
            }
            response.end();

        });
    }
}).listen(3000, () => console.log('Server is started at port 3000'));