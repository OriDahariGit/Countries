/* CLARIFICATIONS:
    This file is intended for DOM elements manipulation, for implementing the desireable logic for the app.
    Any logic related to communication with the API, should be implemented (exclusively!) at ./src/api-agent
*/

// >> DOM ELEMENTS
const countriesGrid = document.getElementById("countries-grid");
const dropDownHeader = document.getElementsByClassName('dropdown-header')[0]; 
const dropDownWrapper = document.getElementsByClassName('dropdown-wrapper')[0];
const dropDownOptions = document.querySelectorAll('[data-region]');
const searchBar = document.getElementsByClassName('search-input')[0];

const allCountriesJSON = new Array();

// >> Initializer - fetch all countries data
const init = async () => {
    allCountries = await getAllCountries();
    
    allCountries.forEach( country => {
        allCountriesJSON.push(country)

        const countryCard = convertToCardElem(country)
        countriesGrid.append(countryCard)
    })
}
init()

// -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- --
// >> Search and Filter Logic
let activeRegionFilters = new Set(); // stores all active filters based on 'data-region' attribute's value
let isFiltersAppear = true;

// get a snapshot of the current grid (returing an array of country cards dom elements)
const getCurrentGrid = () => {
    const children = countriesGrid.children;
    return Array.from(children);
}
// clears the country grid element from any child element
const clearCurrentGrid = () => {
    while (countriesGrid.firstChild) {
        countriesGrid.removeChild(countriesGrid.firstChild);
    }
}

// updates the current grid with a filtered grid, based on 'predicate'
const filterCurrentGrid = (predicate) => {
    if (!predicate) {
        clearCurrentGrid();
        allCountriesJSON.forEach(country => {
            countriesGrid.append(convertToCardElem(country));
        })
        return;
    }
    const temp = getCurrentGrid();
    const results = temp.filter((val) => {
        return predicate(val);
    })
    clearCurrentGrid();
    results.forEach( res => {
        countriesGrid.append(res);
    })
};

// input event handler for the search-bar
const doSearch = () => {
    const query = searchBar.value;
    let results = [];
    // search only after 2 char input
    if (query.length > 2) {
        filterCurrentGrid((country) => {
            return country.getAttribute('data-country-name').includes(query);
        })
    } else {
        clearCurrentGrid();
        allCountriesJSON.forEach(country => {
            countriesGrid.append(convertToCardElem(country));
        })
    }

    // consider active region filters
    const current = getCurrentGrid();

    console.log(activeRegionFilters)
    
    if (activeRegionFilters.size !== 0) {
        current.forEach(country => {
            const region = country.getAttribute('data-country-region').toLocaleLowerCase();
            if (activeRegionFilters.has(region)) {
                results.push(country);
            }
        })

        clearCurrentGrid();
        results.forEach( res => {
            countriesGrid.append(res);
        })
    }
}

searchBar.addEventListener('input', doSearch)

// manage showing and removing region fiter options
const showHideFilters = (event) => {
    if (isFiltersAppear) {
        dropDownWrapper.classList.add('open');
        isFiltersAppear = false;
    } else {
        dropDownWrapper.classList.remove('open');
        isFiltersAppear = true;
    }
}

// manage active region filters set and conditional styles
const handleFilterClick = (event) => {
    const dataRegion = event.target.getAttribute('data-region')
    const targetRegion = event.target;
    if (dataRegion === 'all') {
        dropDownOptions.forEach( filter => {
            filter.classList.remove('active');
            activeRegionFilters.clear();
        })
    } else {
        if (targetRegion.classList.contains('active')) {
            targetRegion.classList.remove('active');
            activeRegionFilters.delete(dataRegion);
        } else {
            targetRegion.classList.add('active')
            activeRegionFilters.add(dataRegion);
        }
    }
    // updateGrid
    doSearch();
}

// >> Region Filters Interactivity Implementation
dropDownHeader.addEventListener('click', showHideFilters);

dropDownOptions.forEach( region => {
    region.addEventListener('click', handleFilterClick)
})

// -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- --
// >> JSON <-> DOM CONVERSIONS

const convertToCardElem = (jsonObj) => {
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
    return countryDomElem;
}




