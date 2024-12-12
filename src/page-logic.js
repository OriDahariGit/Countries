/* CLARIFICATIONS:
    This file is intended for DOM elements manipulation, for implementing the desireable logic for the app.
    Any logic related to communication with the API, should be implemented (exclusively!) at ./src/api-agent
*/

// INITIALIZE 'allCountriesDomElems' & 'allCountriesJSONList through THE API-AGENT 
init();

// DOM ELEMENTS
// This is the main grid display element
const countriesGrid = document.getElementById("countries-grid");
const dropDownHeader = document.getElementsByClassName('dropdown-header')[0]; //
const dropDownWrapper = document.getElementsByClassName('dropdown-wrapper')[0];
const dropDownOptions = document.querySelectorAll('[data-region]')
const searchBar = document.getElementsByClassName('search-input')[0];

// UTILITY VARIABLES FOR SEARCH & OPERATION PURPOSES
let isDropDownOpen = false; // inidactes the region dropdown filtering menu (open = true; closed = false)
const activeRegionFilters = new Set(); // holds the selected regions filters
const allCountriesDomElems = []; // holds all countries as DOM elements (after being converted from JSON - happen on ./src/api-agent.js)
let serachQuery = ""; // holds the serach bar input query


// UTILITY FUNCTIONS
// Clears the current grid from any children
const clearCountryGrid = () => {
    while (countriesGrid.firstChild) {
        countriesGrid.removeChild(countriesGrid.firstChild);
    }
}

// -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- --

// Get an Array of the current working countries grid
const getCurrentGrid = () => {
    return Array.from(countriesGrid.children)
}


// MAIN SEARCH OPERATION
// executes on each search typing, as well as with each region filtering change
const doSearch = () => {
    // take action only after two characters has been entered
    if (serachQuery.length > 2) {
        clearCountryGrid();
    
        // compute countries that contain (at least) a substring of the search
        let results = allCountriesDomElems.filter( country => { 
            return String(country.getAttribute('data-country-name')).includes(serachQuery);
        })
        
        // append results to the countries grid
        results.forEach( res => {
            countriesGrid.append(res);
        })

    } else { // if less than 2 chars in search input -> display all!
        clearCountryGrid()
        allCountriesDomElems.forEach( elem => {
            countriesGrid.append(elem);
        })
    }

    // take a sample of the current grid for filtering
    const currentGrid = getCurrentGrid(); 
    
    // Consider which filter is acive
    // if 'All' or none of them is active -> do nothing
    if (activeRegionFilters.size === 0) { 
        return;

    } else { // If there's an active region filter:
        clearCountryGrid()

        // filter based on the current grid (after search input conideration)
        /* NEEDS FURTHER CLARIFICATION:
            why wouldn't the code run if instead of the former initialization of 'currentGrid = getCurrentGrid()',
            the next line of code would be just: 'const afterRegionFiltering = getCurrentGrid().filter(...)' ??
        */
        const afterRegionFiltering = currentGrid.filter( country => {
            const region = country.getAttribute('data-country-region')
            return activeRegionFilters.has(region)
        })
        // append results (after filtering) to the countries grid
        afterRegionFiltering.forEach( country => {
            countriesGrid.append(country)
            console.log(country)
        })
    }
}

// -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- --

// EVENT HANDLERS
// Handle openning/closing dropdown filters
dropDownHeader.addEventListener('click', (event) => {
    if (isDropDownOpen) {
        dropDownWrapper.classList.remove('open');
        isDropDownOpen = false;
    } else {
        dropDownWrapper.classList.add('open');
        isDropDownOpen = true;
    }
})

/* Handle active region filters 
NOTE: 'active-filter' class is added to each active region filter for styling purposes (denoted with *)
*/
const manageRegionFilter = event => {
    // utility variable for enhanced readability
    const regionElem = event.target;
    const regionName = regionElem.innerHTML;

    // if 'All' is selected -> clear all region filters
    if (regionName == 'All') {
        // delete all existing elements in 'activeRegionFilters'
        for (let option of activeRegionFilters) {
            console.log(option)
            activeRegionFilters.delete(option);
        }
        // removes all selection styling from each (previously) selected filter
        dropDownOptions.forEach( option => {
            option.classList.remove("active-filter") // (*)
        })
        // update the country grid and return (i.e. no further processing is required)
        doSearch();
        return;
    }
    // if other than 'All' is being selected -> mark/unmark selected region filter:
    if (activeRegionFilters.has(regionName)) {  // unmark 
        activeRegionFilters.delete(regionName)
        regionElem.classList.remove('active-filter');

    } else {                                    // mark 
        activeRegionFilters.add(regionName);
        regionElem.classList.add('active-filter');
    }
    // do a search after each filtering settings change
    doSearch();  
}

// add selection logic for each dropdown **li* element
dropDownOptions.forEach( option => {
    option.addEventListener('click', manageRegionFilter)
})

// add searching logic for the input search bar
const searchHandler = (event) => {
    serachQuery = event.target.value.toLowerCase(); // NOTE: underlying search queries happens in lower-case
    doSearch()
}
searchBar.addEventListener('input', searchHandler);

// -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- --
