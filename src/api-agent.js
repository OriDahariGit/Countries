/* CLARIFICATIONS:
    This file is intended to implement the necessary logic for dealing with the REST api found at https://restcountries.com/.
    It also implements logic for converting JSON objects that are being returned from API calls into customized 
    Any logic related to DOM manipulations, or designated app logic, should be implemented (exclusively!) at ./src/page-logic.js
*/

// >> API CALLS

// Return an Array containing all countries as JSON objects
const getAllCountries = async () => {
    const response = await fetch('https://restcountries.com/v3.1/all');
    if (!response.ok) {
        throw new Error(`[HTTP Error] >> Status: ${response.status}`)
    }
    const data = await response.json();
    return data;
}

// Return a JSON of a country according to CCA3 country code
const getCountryByCCA3 = async (cca3) => {
    const response = await fetch(`https://restcountries.com/v3.1/alpha/${cca3}`);
    if (!response.ok) {
        throw new Error(`HTTP Error!\nstatus - ${response.status}`);
    }
    const data = await response.json();
    return data?.[0] ?? null;
}

// >> DATA MANIPULATION 

const getCountryField = (field, countryJSON) => {
    const hierarchy = String(field).split('.');
    let current = countryJSON;
    for (let prop of hierarchy) {
        current = current[prop];
    }
    return current
}


// Get a specific country based on it's cca3 property



