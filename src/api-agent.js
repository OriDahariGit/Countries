/* CLARIFICATIONS:
    This file is intended to implement the necessary logic for dealing with the REST api found at https://restcountries.com/.
    Any logic related to DOM manipulations, or designated app logic, should be implemented (exclusively!) at ./src/page-logic.js
*/

// This is the main grid display element
const countriesGrid = document.getElementById("countries-grid");


// This function fetches all the countries available through the main API's endpoint
// after recievieng 
const init = async () => {
    fetch('https://restcountries.com/v3.1/all')
    .then(response => { response.json()
        .then(response => {
            let num = 0;
            response.forEach(country => {
                countriesGrid.append(convertToCardElem(country))
            })
        })
    }).catch(err => {
        // TODO: implement logic for fetching error (consider laying on a static database)

        // Print errors
        console.error("Couldn't fetch any data from: 'https://restcountries.com/v3.1/all'!")
        console.error("Error has been thrown due to:\n")
        console.log(err)
    })
}
// It is executed only once(!) in the loading of the page!
init();


// This function is responsible for converting JSON objects (as comming from the API call's response),
// into a DOM elements that are in the suitable format for the app
const convertToCardElem = jsonObj => {
    // utility variable that pulls necessary data (for readability reasons)
    const countryName = jsonObj.name.common;
    const flagSrc = jsonObj.flags.svg || jsonObj.png; // prefer SVG over PNG
    const flagAltTxt = jsonObj.flags.alt;
    const fifa = jsonObj.fifa; // used as the key data for transitioning into the details page

    // Create a 'country-flag' class **div** element
    const flagImg = document.createElement('img');
    flagImg.setAttribute('src', flagSrc);
    flagImg.setAttribute('alt', flagAltTxt);

    const countryFlag = document.createElement('div');
    countryFlag.classList.add('country-flag');
    countryFlag.append(flagImg);


    // Creates a 'country-title' class **h2** element
    const countryTitle = document.createElement('h2');
    countryTitle.classList.add('country-title');
    countryTitle.innerHTML = countryName;


    // utility variable that pulls necessary data (for readability reasons)
    const population = jsonObj.population.toLocaleString();
    const region = jsonObj.region;
    const counrtyCapitals = jsonObj?.capital?.join(', ') ?? ''; // use optional chaining for proper dereferencing


    // Creates a 'country-brief' class **ul** element
    const populationLI = document.createElement('li');
    populationLI.innerHTML = `<strong>Population:</strong> ${population}`;

    const regionLI = document.createElement('li');
    regionLI.innerHTML = `<strong>Region:</strong> ${region}`;

    const capitalLI = document.createElement('li');
    capitalLI.innerHTML = `<strong>Capital:</strong> ${counrtyCapitals}`;

    const countryBriefUL = document.createElement('ul');
    countryBriefUL.classList.add('country-brief');

    countryBriefUL.append(populationLI);
    countryBriefUL.append(regionLI);
    countryBriefUL.append(capitalLI);

    // Creates a complete 'contry-info' class **div** element with the title & brief as children
    const countryInfo = document.createElement('div');
    countryInfo.classList.add('country-info');

    countryInfo.append(countryTitle);
    countryInfo.append(countryBriefUL);

    
    // Creates a 'country' class **anchor** element with countryFlag& countryInfo as children
    // this is the final returning element that represent the FINAL HTMLElement for the app
    const countryDomElem = document.createElement('a');
    countryDomElem.classList.add('country', 'scale-effect');
    countryDomElem.setAttribute('data-country-name', countryName.toLowerCase());
    countryDomElem.setAttribute('data-country-region', region); // this addition enables filtering by region
    countryDomElem.setAttribute('href', '#')

    countryDomElem.append(countryFlag);
    countryDomElem.append(countryInfo);

    // push the element to the 'allCountriesDomElems' list (which acts as the database for the 'page-logic')
    allCountriesDomElems.push(countryDomElem);
    return countryDomElem;
}






