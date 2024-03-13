import { createServer } from "node:http";
import { getCsv } from './../functions/getcsv.js';

createServer(async (req, res) => {
    const url = new URL(req.url, `http://${req.headers.host}`);
    const endpoint = `${req.method}:${url.pathname}`;
    switch (endpoint){
        case 'GET:/dataByDate':
            const date = res.body;
            //const data = await getCsv(date);
            console.log('req');
            break;
        default:
            res.writeHead(404);
    }

    res.end();
}).listen(3001)