const loader = document.getElementsByClassName('loader')[0];
const detailsSlot = document.getElementById('details');

// Extract CCA3 country code from current window's url params and remove loader
const searchStr = location.search.substring(1);
let [param, cca3] = searchStr.split('=', 2);
const loadDetails = async () => {
    const country = await getCountryByCCA3(cca3);
    detailsSlot.append( await convertToDetailPage(country));
}
loadDetails()
.then( () => { loader.classList.add('hide') })

// Global Data Not Found object
const DNF = '<strong class=\'warning\'>none</strong>';

const convertToDetailPage = async jsonObj => {
    const flagSrc = jsonObj.flags.svg || jsonObj.flags.png || DNF; // prefer SVG over PNG
    const flagAltTxt = jsonObj.flags.alt || '';
    const countryName = jsonObj.name.official || jsonObj.name.common || DNF;
    const language = Object.keys(jsonObj.languages)?.[0] || undefined; // this is used to extract
    const nativeName = jsonObj.name.nativeName[language].common || jsonObj.name.common || DNF;
    const population = jsonObj.population.toLocaleString() || DNF;
    const region = jsonObj.region || DNF;
    const subRegion = jsonObj.subregion || DNF;
    const capitals = jsonObj.capital.join(', ') || DNF;
    const tld = jsonObj.tld.join(' | ') || DNF;
    const currency3Letters = Object.keys(jsonObj.currencies)[0] || DNF;
    const currencies = jsonObj.currencies[currency3Letters].name || DNF;
    const languages = Object.values(jsonObj.languages).join(', ') || DNF;
    const borderCountriesList = jsonObj.borders || DNF;

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
    if (borderCountriesList === DNF) {
        const nullLI = document.createElement('li')
        nullLI.innerHTML = 'None';
        bordersUL.append(
            nullLI
        )
    } else {
        borderCountriesList.forEach(async (cca3) => {
            bordersUL.append(await createBorderLI(cca3));
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

const createBorderLI = async (cca3) => {
    const btnLI = document.createElement('li');
    const btnBorder = document.createElement('button');
    btnBorder.classList.add('btn');
    const country = await getCountryByCCA3(cca3)
    .then(response => {
        btnBorder.innerHTML = getCountryField('name.common', response);
    })
    
    
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

// const ccaToCountryName = async (cca3) => {
//     fetch('https://restcountries.com/v3.1/alpha?codes='.concat(cca3))
//     .then( (response) => response.json()
//         .then(response => {
//             console.log(response[0].name.common);
//         }))
//     .catch( err => {
//         console.error("Couldn't fetch the country based on CCA3 value of:", cca3);
//         console.error("Error has been thrown due to:\n")
//         console.log(err)
//     })
// }





