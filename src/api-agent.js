/* CLARIFICATIONS:
    This file is intended to implement the necessary logic for dealing with the REST api found at https://restcountries.com/.
    Any logic related to DOM manipulations, or designated app logic, should be implemented (exclusively!) at ./src/page-logic.js
*/

// This function fetches all the countries available through the main API's endpoint
// after recievieng 
const init = async () => {
    fetch('https://restcountries.com/v3.1/all')
    .then(response => { response.json()
        .then(response => {
            response.forEach(country => {
                allCountriesJSONList.push(country);
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

// This function is responsible for converting JSON objects (as comming from the API call's response),
// into a DOM elements that are in the suitable format for the app
const convertToCardElem = jsonObj => {
    // utility variable that pulls necessary data (for readability reasons)
    const countryName = jsonObj.name.common;
    const flagSrc = jsonObj.flags.svg || jsonObj.png; // prefer SVG over PNG
    const flagAltTxt = jsonObj.flags.alt;

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
    const countryDomElem = document.createElement('div'); // changed to div (instead of 'a')
    countryDomElem.classList.add('country', 'scale-effect');
    countryDomElem.setAttribute('data-country-name', countryName.toLowerCase());
    countryDomElem.setAttribute('data-country-region', region); // this addition enables filtering by region
    countryDomElem.setAttribute('data-country-region', region); // acts as the key data for the details query string  
                                                                // when redirecting to a details page template
    
    // add logic for redirecting to a details page based on the 'cca3' property which is unique and standardized
    const cca3QueryString = "?cca3=".concat(jsonObj.cca3) // used as the key data for transitioning into the details page
    countryDomElem.addEventListener('click', (event) => {
        const nextURL = '/Countries/details.html'.concat(cca3QueryString)
        window.location.replace(nextURL)
    })

    countryDomElem.append(countryFlag);
    countryDomElem.append(countryInfo);

    // push the element to the 'allCountriesDomElems' list (which acts as the database for the 'page-logic')
    allCountriesDomElems.push(countryDomElem);
    return countryDomElem;
}

// Get a specific country based on it's cca3 property
const convertToDetailsPage = async (cca3) => {
    cca3 = cca3.toLowerCase()
    fetch('https://restcountries.com/v3.1/alpha?codes='.concat(cca3))
    .then( (response) => response.json()
        .then(response => {
            loader.classList.add('hide')
            detailsSlot.append(convertToDetailPage(response[0]))
        }))
    .catch( err => {
        console.error("Couldn't fetch the country based on CCA3 value of:", cca3);
        console.error("Error has been thrown due to:\n")
        console.log(err)
    })
}

const dataNotFound = '<strong class=\'warning\'>none</strong>'

const convertToDetailPage = jsonObj => {
    const flagSrc = jsonObj.flags?.svg || jsonObj.flags.png || dataNotFound; // prefer SVG over PNG
    const flagAltTxt = jsonObj.flags.alt || '';
    const countryName = jsonObj.name.official || jsonObj.name.common || dataNotFound;
    const language = Object.keys(jsonObj.languages)?.[0] || undefined; // this is used to extract
    const nativeName = jsonObj.name.nativeName[language].common || jsonObj.name.common || dataNotFound;
    const population = jsonObj.population.toLocaleString() || dataNotFound;
    const region = jsonObj.region || dataNotFound;
    const subRegion = jsonObj.subregion || dataNotFound;
    const capitals = jsonObj.capital.join(', ') || dataNotFound;
    const tld = jsonObj.tld.join(' | ') || dataNotFound;
    const currency3Letters = Object.keys(jsonObj.currencies)[0] || dataNotFound;
    const currencies = jsonObj.currencies[currency3Letters].name || dataNotFound;
    const languages = Object.values(jsonObj.languages).join(', ') || dataNotFound;
    const borderCountriesList = jsonObj.borders || dataNotFound;

    console.log(borderCountriesList)


    // Creates a 'country-flag' class **div** element with an image as a child
    const flagImg = document.createElement('img');
    flagImg.setAttribute('src', flagSrc);
    flagImg.setAttribute('alt',flagAltTxt);

    const flagDiv = document.createElement('div');
    flagDiv.classList.add('country-flag');
    // add img to flagDiv
    flagDiv.append(flagImg);

    // Creates a 'country-info' **div** element
    // country heading
    const countryHeading = document.createElement('h1')
    countryHeading.innerText = countryName;

    // deails columns
    const detailsLeft = document.createElement('ul');
    detailsLeft.append(
        createLI('Native Name', nativeName),
        createLI("Population", population),
        createLI("Region", region),
        createLI("Sub Region", subRegion),
        createLI("Capitals", capitals),
    )

    const detailsRight = document.createElement('ul');
    detailsRight.append(
        createLI("Top Level Domain", tld),
        createLI("Currencies", currencies),
        createLI("Language", languages)
    )

    const details = document.createElement('div');
    details.classList.add('col-2');
    details.append(
        detailsLeft,
        detailsRight,
    )
    
    //border countries
    const bordersStrongTitle = document.createElement('strong')
    bordersStrongTitle.innerHTML = 'Border Countries:';

    const bordersUL = document.createElement('ul');
    bordersUL.classList.add('col-3');
    bordersUL.append(
        bordersStrongTitle
    );

    // TODO: implement logic for ccaToCountryName
    if (borderCountriesList === dataNotFound) {
        const nullLI = document.createElement('li')
        nullLI.innerHTML = 'None';
        bordersUL.append(
            nullLI
        )
    } else {
        borderCountriesList.forEach((cca3) => {
            bordersUL.append(createBorderLI(cca3));
        })
    }
    
    const countryInfo = document.createElement('div');
    countryInfo.classList.add('country-info');
    countryInfo.append(
        countryHeading,
        details,
        bordersUL,
    )

    // The final returned DOM element that gets loaded on each detail page redirection
    const outputSection = document.createElement('section');
    outputSection.classList.add('country-details');

    outputSection.append(flagDiv);
    outputSection.append(countryInfo)

    return outputSection;
}

// UTILITY FUNCTIONS
// Create **li** details element
const createLI = (title, data) => {
    const li = document.createElement('li');
    li.innerHTML = `<strong>${title}:</strong> ${data}`;
    return li;
}

const createBorderLI = (cca3) => {
    const btnLI = document.createElement('li');
    const btnBorder = document.createElement('button');
    btnBorder.classList.add('btn');
    btnBorder.innerHTML =  cca3;
    
    const cca3QueryString = "?cca3=".concat(cca3) // used as the key data for transitioning into the details page
    btnLI.addEventListener('click', (event) => {
        const nextURL = '/Countries/details.html'.concat(cca3QueryString)
        window.location.replace(nextURL)
    })

    btnLI.append(btnBorder)
    
    return btnLI;
}

const btnToDetailsPage = (event) => {
    event.target
}

const ccaToCountryName = async (cca3) => {
    fetch('https://restcountries.com/v3.1/alpha?codes='.concat(cca3))
    .then( (response) => response.json()
        .then(response => {
            console.log(response[0].name.common);
        }))
    .catch( err => {
        console.error("Couldn't fetch the country based on CCA3 value of:", cca3);
        console.error("Error has been thrown due to:\n")
        console.log(err)
    })
}


