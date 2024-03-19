import { createServer } from "node:http";
import * as API from '../API/functions.mjs';

createServer(async (req, res) => {
    try {
        let url = new URL(req.url, `http://${req.headers.host}`);
        const endpoint = `${req.method}:${url.pathname}`;
        let results;
        let params;
        switch (endpoint){
            case 'GET:/dataByDate':
                url = new URL(req.url, `http://${req.headers.host}`);
                params = url.searchParams;
                results = await API.getCsv(params.get('trip-start'));
                break;
            case 'GET:/dataByPolluant':
                url = new URL(req.url, `http://${req.headers.host}`);
                params = url.searchParams;
                results = await API.getDataByParam(params.get('trip-start'));
                break;
            default:
                res.writeHead(404);
        }
        if (results) {
            res.write(JSON.stringify(results));
        }
    } catch (e) {
        throw e;
    }
    res.end();
}).listen(3001)