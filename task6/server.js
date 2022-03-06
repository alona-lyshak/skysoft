const http = require('http');
const fs = require('fs');
const bcrypt = require('bcrypt');

http.createServer((request, response) => {

    switch (request.method) {
        case 'GET':
            processGetRequests(request, response);
            break;

        case 'POST':
            processPostRequests(request, response);
            break;

        default:
            break;
    }
}).listen(3000, () => console.log('Server is started at port 3000'));


function processGetRequests(request, response) {
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
}

async function processPostRequests(request, response) {
    const buffers = [];
    for await (const chunk of request) {
        buffers.push(chunk);
    }

    const data = JSON.parse(Buffer.concat(buffers).toString());

    const strUsers = fs.readFileSync("users.txt", "utf8");

    const usersList = strUsers.split('\n');
    const logins = usersList.map((str) => {
        const user = str.split(', ');
        return user[0];
    });

    if (logins.includes(data.login)) {
        response.statusCode = 400;
    } else {
        const salt = await bcrypt.genSalt(10);
        const hash = await bcrypt.hash(data.password, salt);

        fs.appendFile("users.txt", data.login + ', ' + hash + '\n', (err) => {
            if (err) {
                response.statusCode = 400;
            } else {
                response.statusCode = 200;
            }
        });
    }
    response.end();
}