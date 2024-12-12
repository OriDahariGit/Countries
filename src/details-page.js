const loader = document.getElementsByClassName('loader')[0];
const detailsSlot = document.getElementById('details');

const searchStr = location.search.substring(1);
let [param, cca3Value] = searchStr.split('=');

convertToDetailsPage(cca3Value);





