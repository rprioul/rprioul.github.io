import { setElementsHTML, setCryptoValues, initializeSearchAutoComplete, initializeUI, initializeSortable } from './ui.js';

/* eslint no-undef: 0 */

const initializeDashboard = () => {
  // Retrieve list of cryptocurrency symbols
  let savedCryptos = { data: [] };
  if (document.location.href.split('?q=')[0] !== document.location.href) {
    savedCryptos = JSON.parse(decodeURI(document.location.href.split('?q=')[1]));
  } else {
    window.history.pushState({}, '', `${ document.location.href }?q=${ JSON.stringify(savedCryptos) }`);
  }

  // Populate with cryptocurrencies found in URL
  fetch('https://api.coinmarketcap.com/v1/ticker/?limit=0&convert=EUR')
    .then((r) => {
      if (!r.ok) throw Error(r.statusText);
      return r.json();
    })
    .then((d) => {
      initializeSearchAutoComplete(d);

      const preSelectedCryptos = d.filter((elt) => {
        return savedCryptos.data.includes(elt.symbol);
      });

      return savedCryptos.data.map((symbol) => {
        const crypto = preSelectedCryptos.filter((elt) => {
          return elt.symbol === symbol;
        });
        setElementsHTML(crypto[0].id);
        return setCryptoValues(crypto[0]);
      }); // savedCryptos.data.map
    });

  initializeSortable();

  return initializeUI();
}; // initializeDashboard

initializeDashboard();
