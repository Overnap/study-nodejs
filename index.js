const http = require('http');
const fs = require('fs');

const DB_URL = 'http://localhost:3000/posts';
const server = http.createServer((req, res) => {
    console.log(`${req.headers.host} : ${req.url}`);
    http.get(DB_URL + '/1', 'GET', (dbRes) => {
        rawData = '';
        dbRes.on('data', (chunk) => { rawData += chunk; });
        dbRes.on('end', () => {
            try {
                let parsedData = JSON.parse(rawData);
                console.log(parsedData);
            } catch (e) {
                console.log(e.message);
            }
        })
    }).on('error', (e) => { console.log(e.message); });

    const postData = JSON.stringify({
        title: 'Hello World!',
        author: 'testuser'
    });

    const dbReq = http.request({
        host: 'localhost',
        port: 3000,
        path: '/posts',
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Content-Length': Buffer.byteLength(postData)
        }
    }, (dbRes) => {
        if (dbRes.statusCode === 201) {
            console.log('posted post');
        } else {
            console.log('post failed!')
        }
    });

    dbReq.write(postData);
    dbReq.end();
});

const PORT = process.env.PORT || 3001;

server.listen(PORT, () => {
    console.log(`${PORT} 듣는중...`);
});