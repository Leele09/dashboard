import express from 'express';
import cors from 'cors';
import * as API from './functions.mjs';
import { csvToJson } from "./functions.mjs";

const app = express();
app.use(cors());
app.use(express.json()); // Make sure this line comes before your routes

let data = await API.getDataInRangeOfDate(Date.now(), "Daily");
const jsonOfData = await csvToJson(data);

app.post('/dataSite', async (req, res) => {
    const siteToKeep = req.body.siteToKeep;
    const result = API.getDataBySite(siteToKeep, jsonOfData);
    const results = JSON.stringify(result);
    res.status(200).json(results);
});

app.post('/dataPolluant', async (req, res) => {
    const polluantsToKeep = req.body.polluantsToKeep;
    const result = API.getDataByPolluant(polluantsToKeep, jsonOfData);
    const results = JSON.stringify(result);
    console.log(result);
    res.status(200).json(results);
});

app.use((req, res) => {
    res.status(404).end();
});

app.use((err, req, res, next) => {
    console.error(err);
    res.status(500).end();
});

app.listen(3001);