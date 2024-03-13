const Papa = import ("papaparse");
const axios = import ("axios");

function getUrl(inputDate){
    const date = new Date(inputDate);
    const annee = date.getFullYear();

    let dateDuJourActuel = date.toLocaleDateString("en-CA");
    const urlDeBase = "https://files.data.gouv.fr/lcsqa/concentrations-de-polluants-atmospheriques-reglementes/temps-reel/";
    return urlDeBase + annee + '/FR_E2_' + dateDuJourActuel + '.csv';
}

export async function getCsv(inputDate) {
    const url = getUrl(inputDate);

    // Utilisez axios pour récupérer le contenu du fichier CSV depuis l'URL
    const response = await axios.get(url);
    const csv = response.data;

    // Utilisez Papa.parse pour convertir le CSV en JSON
    return Papa.parse(csv, {encoding: "utf-8"});
}

//getCsv('2024-03-12').then(r => console.log(r));