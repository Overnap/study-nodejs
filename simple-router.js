const http = require('http');
const fs = require('fs');
const ejs = require('ejs');
const qs = require('qs');

// Simple router?
class App {
    constructor() {
        this.gets = new Map();
        this.posts = new Map();
        this.server = http.createServer((req, res) => {
            var reqData = new URL(req.url, `http://${req.headers.host}`);
            console.log(`${reqData.host} : ${reqData.pathname}`);
            if (req.method == 'GET' && this.gets.has(reqData.pathname)) {
                this.gets.get(reqData.pathname)(res, reqData.searchParams);
            } else if (req.method == 'POST' && this.posts.has(reqData.pathname)) {
                var body = '';
                req.on('data', (data) => { body += data; });
                req.on('end', () => { this.posts.get(reqData.pathname)(res, qs.parse(body)); });
            } else {
                fs.readFile('./404.html', (err, str) => {
                    res.writeHead(404, {'Content-Type': 'text/html'});
                    res.write(str);
                    res.end();
                });
            }
        });
    }

    run(port, callback) {
        this.server.listen(port, callback);
    }

    /**
     * 
     * @param {string} path path string
     * @param {function} callback (response, search-params) => void
     */
    get(path, callback) {
        this.gets.set(path, callback);
    }

    /**
     * 
     * @param {string} path path string
     * @param {function} callback (response, request-body) => void
     */
    post(path, callback) {
        this.posts.set(path, callback);
    }
}

const PORT = process.env.PORT || 3001;

const app = new App();
app.get('/hello', (res, params) => { res.write('hello world'); res.end(); })
app.get('/htmltest', (res, params) => {
    // readFile('./index.html', 'utf-8', (err, data) => {
    //     if (err) throw err; html = data;
    //     res.setHeader("Content-Type", "text/html");
    //     res.write(html);
    //     res.end();
    // })
    let people = ['Hello', 'Bounjour', '안녕하세요'];
    ejs.renderFile('./index.html', {people: people}, 'cache', function(err, str) {
        res.setHeader('Content-Type', 'text/html');
        res.writeHead(200);
        res.write(str);
        res.end();
    });
})
app.post('/htmltest', (res, body) => {
    console.log(body);
});
app.run(PORT, () => { console.log(`${PORT} 듣는중...`); })
