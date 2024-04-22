import axios from 'axios';
import Papa from 'papaparse';

import {IndexNotFound} from '../API/errors.mjs';

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

const path = "../stations.json";

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
 * Fonction qui fait la requête à l'url et renvoi la réponse de la recherche
 * @param inputDate date des données voulues
 * @returns {Promise<*>}
 */
export async function fetchData(inputDate) {
    const url = getUrl(inputDate);
    const response = await axios.get(url);
    return response.data;
}

/**
 * Fonction pour parser la réponse de l'url en un format csv plus lisible
 * @param responseData data
 * @returns {*[]}
 */
export function parseCsvData(responseData) {
    return Papa.parse(responseData, {encoding: "utf-8"});
}

/**
 * Fonction qui va nettoyer le csv parsé en gardant que les données nécessairent
 * @param parsedData data
 * @returns {*[]}
 */
export function filterCsvData(parsedData) {
    let result = [];
    parsedData.data.forEach(row => {
        let selectedRow = [];
        indicesToKeep.forEach(index => {
            selectedRow.push(row[index]);
        });
        result.push(selectedRow);
    });
    // Enlever la dernière ligne de la liste car elle contient que des données undifiend
    result.pop();
    return result;
}

/**
 * Fonction qui filtre les données en fonction d'une zas en particulier choisi
 * @param zasToKeep[] liste de/des zas à garder
 * @param data data à modifier pour avoir que les paramatres qu'on veut
 * @returns {{[p: string]: unknown}}
 */
export function getDataByZas(zasToKeep, data){
    return Object.fromEntries(
        Object.entries(data).filter(
            ([zas]) => zasToKeep.includes(zas)
        )
    );
}

/**
 * Fonction qui filtre les données en fonction d'un site en particulier choisi
 * @param siteToKeep[] liste de/des sites à garder
 * @param data data à modifier pour avoir que les paramatres qu'on veut
 * @returns {{[p: string]: {[p: string]: unknown}}}
 */
export function getDataBySite(siteToKeep, data){
    return Object.fromEntries(
        Object.entries(data).map(([zas, sites]) =>
            [zas, Object.fromEntries(Object.entries(sites).filter(
                ([site]) => siteToKeep.includes(site))
            )]
        )
    );
}

/**
 * Fonction qui filtre les données en fonction d'un polluant en particulier choisi
 * @param polluantsToKeep[] liste du/des polluants à garder
 * @param data data à modifier pour avoir que les paramatres qu'on veut
 * @returns {{[p: string]: {[p: string]: {[p: string]: unknown}}}}
 */
export function getDataByPolluant(polluantsToKeep, data){
    return Object.fromEntries(
        Object.entries(data).map(([zas, sites]) => [
            zas,
            Object.fromEntries(
                Object.entries(sites).map(([site, polluants]) => [
                    site,
                    Object.fromEntries(
                        Object.entries(polluants).filter(
                            ([polluant]) => polluantsToKeep.includes(polluant)
                        )
                    )
                ])
            )
        ])
    );
}

/**
 * Fonction pour choisir des données dans une intervalle
 * @param inputDate date à partir de laquelle commencer l'intervalle
 * @param range intervalle de temps
 * @returns {Promise<>}
 */
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
        result.push(filterCsvData(parseCsvData(await fetchData(date))));
        date.setDate(date.getDate() - 1);
    }

    return result;
}

/*export async function writeJson(data, path) {
    const jsonString = JSON.stringify(data, null, 4);

    await fs.writeFile(path, jsonString, (err) => {
        if (err) throw err;
    });
}*/

export async function csvToJson(data) {
    let jsonData = {};
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
    return jsonData;
}

const data = await getDataInRangeOfDate(Date.now(), "Daily");
const jsonOfData = await csvToJson(data);
console.log(jsonOfData);
//const jsonByParam = getDataBySite(["FR82010"], jsonOfData);
//console.log(jsonByParam);


const start = performance.now();
const jsonByParam = getDataByPolluant([""], jsonOfData);
//console.log(jsonByParam);
const end = performance.now();
console.log(`Execution time: ${end - start} ms`);
