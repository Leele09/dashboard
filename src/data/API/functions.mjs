import axios from 'axios';
import Papa from 'papaparse';
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

    // Utilisez axios pour récupérer le contenu du fichier CSV depuis l'URL
    const response = await axios.get(url);
    const csv = response.data;

    // Utilisez Papa.parse pour convertir le CSV en JSON
    return Papa.parse(csv, {encoding: "utf-8"});
}

/**
 * Fonction qui filtre les données en fonction un paramatre en particulier choisi
 * @param inputDate date des données voulu
 * @param indexTag nom de la collone des données
 * @param input valeur de la collone
 * @returns {Promise<*[]>}
 */
export async function getDataByParam(inputDate, indexTag, input){
    if(!indexTags.includes(indexTag)){
        throw IndexNotFound;
    }
    let response = [];
    let data = await getCsv(inputDate);
    data = data['data'];
    const index = data[0].indexOf(indexTag);
    for (let i= 0; i<data.length; i++){
        if(data[i][index] === input){
            response.push(data[i]);
        }
    }
    return response
}


//getCsv('2024-03-12').then(r => console.log(r));
//getDataByParam('2024-03-12', 'codcse site', 'FR01064').then(r => console.log(r));