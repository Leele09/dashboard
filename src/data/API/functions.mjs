import axios from 'axios';
import Papa from 'papaparse';
import fs from 'fs/promises';

import {IndexNotFound} from './errors.mjs';

const indexTags = [
    'Date de début',         'Date de fin',
    'Organisme',             'code zas',
    'Zas',                   'code site',
    'nom site',              "type d'implantation",
    'Polluant',              "type d'influence",
    'discriminant',          'Réglementaire',
    "type d'évaluation",     'procédure de mesure',
    'type de valeur',        'valeur',
    'valeur brute',          'unité de mesure',
    'taux de saisie',        'couverture temporelle',
    'couverture de données', 'code qualité',
    'validité'
]

const indicesToKeep = [0, 3, 5, 8, 15, 21];

const path = "../data.json";

/**
 * Création de l'url pour le CSV en fonction de la date rentré
 * @param inputDate date des données voulu
 * @returns {string}
 */
function getUrl(inputDate){
    const date = new Date(inputDate);
    const annee = date.getFullYear();

    let dateDuJourActuel = date.toLocaleDateString("en-CA");
    const urlDeBase = "https://files.data.gouv.fr/lcsqa/concentrations-de-polluants-atmospheriques-reglementes/temps-reel/";
    return urlDeBase + annee + '/FR_E2_' + dateDuJourActuel + '.csv';
}

/**
 * Fonction qui renvoi le fichier CSV parsé
 * @param inputDate date des données voulu
 * @returns {Promise<*>}
 */
export async function getCsv(inputDate) {
    const url = getUrl(inputDate);
    const response = await axios.get(url);
    let result = [];
    let csv = Papa.parse(response.data, {
        encoding: "utf-8",
        complete: function(results) {
            results.data = results.data.map(row => {
                let selectedRow = [];
                indicesToKeep.forEach(index => {
                    selectedRow.push(row[index]);
                });
                result.push(selectedRow);
            });
        }
    });
    return result;
}

/**
 * Fonction qui filtre les données en fonction un paramatre en particulier choisi
 * @param inputDate date des données voulu
 * @param indexTag nom de la collone des données
 * @param input valeur de la collone
 * @returns {Promise<*[]>}
 */
export async function getDataByParam(indexTag, input){
    if(!indexTags.includes(indexTag)){
        throw IndexNotFound;
    }
    const jsonData = require('../data.json');
    console.log(jsonData);
}

export async function getDataInRangeOfDate(inputDate, range){
    const date = new Date(inputDate);
    let result = [];
    // Nombre de jours en fonction de la range donnée
    const rangeMap = {
        "Daily": 1,
        "Weekly": 7,
        "Monthly": 30
    };
    const days = rangeMap[range];
    // Gestion d'erreur si le range n'est pas daily, weekly ou monthly
    if (!days) {
        throw new Error(`Invalid range: ${range}`);
    }
    // On récupere les données en fonctions du range
    for(let i = 0; i < days; i++){
        result.push(await getCsv(date));
        date.setDate(date.getDate() - 1);
    }

    return result;
}

export async function writeJson(data, path) {
    const jsonData = {};

    data.forEach(sublist => {
        sublist.slice(1).forEach(row => {
            const obj = sublist[0].reduce((acc, key, index) => {
                acc[key] = row[index];
                return acc;
            }, {});
            if (!jsonData[obj['code zas']]) {
                jsonData[obj['code zas']] = {};
            }
            if (!jsonData[obj['code zas']][obj['code site']]) {
                jsonData[obj['code zas']][obj['code site']] = {};
            }
            if (!jsonData[obj['code zas']][obj['code site']][obj['Polluant']]) {
                jsonData[obj['code zas']][obj['code site']][obj['Polluant']] = [];
            }
            jsonData[obj['code zas']][obj['code site']][obj['Polluant']].push([obj['Date de début'], obj['valeur'], obj['code qualité']]);
        });
    });

    const jsonString = JSON.stringify(jsonData, null, 4);

    await fs.writeFile(path, jsonString, (err) => {
        if (err) throw err;
    });
}

//getCsv('2024-03-12').then(r=>console.log(r));
getDataByParam('code site', 'FR01064');
//const start = performance.now();
//await getDataInRangeOfDate('2024-03-12', 'Daily').then(r=>writeJson(r, path));
//const end = performance.now();
//console.log(`Execution time: ${end - start} ms`);
