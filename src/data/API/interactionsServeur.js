const xhr = new XMLHttpRequest();
const urlBase = "http://localhost:3001";

function callback() {
    console.log(xhr);
}

function sendData(endpoint, data) {
    const url = `${urlBase}/${endpoint}`;
    xhr.open("POST", url, true);
    xhr.addEventListener("load", callback);
    xhr.setRequestHeader("Content-type", "application/json");
    xhr.send(JSON.stringify(data));
}

function getCheckedValues(idPrefix) {
    const checkboxes = document.querySelectorAll(`[id^="${idPrefix}"]`);
    return Array.from(checkboxes)
        .filter(checkbox => checkbox.checked)
        .map(checkbox => checkbox.value);
}

export function dataBySite() {
    const checkedValues = getCheckedValues('site-checkbox');
    sendData('dataSite', { siteToKeep: checkedValues });
}

export function dataByPolluant() {
    const checkedValues = getCheckedValues('polluant-checkbox');
    sendData('dataPolluant', { polluantsToKeep: checkedValues });
}