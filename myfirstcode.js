import { createServer } from 'http';
import { readFile } from 'fs';

// Simple router?
class App {
    constructor() {
        this.map = new Map();
        this.server = createServer((req, res) => {
            var reqData = new URL(req.url, `http://${req.headers.host}`);
            console.log(`${reqData.host} : ${reqData.pathname}`);
            if (this.map.has(reqData.pathname))
                this.map.get(reqData.pathname)(res, reqData.searchParams);
        })
    }

    run(port, callback) {
        this.server.listen(port, callback);
    }

    route(path, callback) {
        this.map.set(path, callback);
    }
}

const PORT = process.env.PORT || 3000;

const app = new App();
app.route('/hello', (res, params) => { res.write('hello world'); res.end(); })
app.route('/htmltest', (res, params) => {
    readFile('./index.html', 'utf-8', (err, data) => {
        if (err) throw err; html = data;
        res.setHeader("Content-Type", "text/html");
        res.write(html);
        res.end();
    })
})
app.run(PORT, () => { console.log(`${PORT} 듣는중...`); })
