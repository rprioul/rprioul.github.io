import { htmlMoneyFormatter, setPercentages, getCurrentTime } from './util.js';
import { appendSparkline } from './graphic.js';

const refreshURL = () => {
  // retrieve all crypto currently displayed in mainHolder
  const data = Array.from(document.querySelector('.mainHolder').childNodes).reduce((accumulator, crypto) => {
    accumulator.push(crypto.firstChild.nextSibling.querySelector('.cryptoSymbol').firstChild.innerHTML);
    return accumulator;
  }, []); // reduce

  const baseURL = document.location.href.split('?q=')[0];
  return window.history.pushState({}, '', `${ baseURL }?q=${ JSON.stringify({ 'data': data }) }`);
}; // refreshURL

const getCryptoValues = (cryptoId) => {
  fetch(`https://api.coinmarketcap.com/v1/ticker/${ cryptoId }/?convert=EUR`)
    .then((r) => {
      if (!r.ok) throw Error(r.statusText);
      return r.json();
    }) // then
    .then((d) => {
      setElementsHTML(cryptoId);
      setCryptoValues(d[0]);
      return refreshURL();
    }); // then
}; // getCryptoValues

const setElementsHTML = (crypto) => {
  const appendElement = (container, elementTag, classNames) => {
    const element = document.createElement(elementTag);
    classNames.map((classElt) => {
      return element.classList.add(classElt);
    });
    element.setAttribute('id', crypto);
    return container.append(element);
  }; // appendElement

  const appendElementWithReturn = (container, elementTag, classNames) => {
    const element = document.createElement(elementTag);
    classNames.map((classElt) => {
      return element.classList.add(classElt);
    });
    element.setAttribute('id', crypto);
    container.append(element);
    return element;
  }; // appendElementWithReturn

  const appendCryptoMainInfo = (cryptoHolder) => {
    // append close Button and its event handler
    const button = document.createElement('button');
    button.type = 'submit';
    button.classList.add(...[ 'cryptoCloseButton' ]);
    cryptoHolder.append(button);
    button.addEventListener('click', (evt) => {
      evt.target.parentNode.parentNode.remove();
      return refreshURL();
    }); // addEventListener
    appendElement(button, 'i', [ 'fa', 'fa-times-circle' ]);

    // append upper part of cryptoHolder
    const cryptoMainInfo = appendElementWithReturn(cryptoHolder, 'div', [ 'cryptoMainInfo' ]);

    // Append logo, name, symbol and value
    appendElement(cryptoMainInfo, 'img', [ 'cryptoLogo' ]);
    appendElement(cryptoMainInfo, 'div', [ 'cryptoName' ]);
    appendElement(cryptoMainInfo, 'div', [ 'cryptoSymbol' ]);
    return appendElement(cryptoMainInfo, 'div', [ 'cryptoValue' ]);
  }; // appendCryptoMainInfo

  const appendCryptoVariation = (cryptoHolder) => {
    // rework expected
    const cryptoVariation = appendElementWithReturn(cryptoHolder, 'div', [ 'cryptoVariation' ]);
    const cryptoVar1hHolder = appendElementWithReturn(cryptoVariation, 'div', [ 'cryptoVar1hHolder' ]);
    appendElementWithReturn(cryptoVar1hHolder, 'div', [ 'cryptoVar1hLabel' ]).innerHTML = '1h :';
    appendElement(cryptoVar1hHolder, 'div', [ 'cryptoVar1h' ]);
    const cryptoVar24hHolder = appendElementWithReturn(cryptoVariation, 'div', [ 'cryptoVar24hHolder' ]);
    appendElementWithReturn(cryptoVar24hHolder, 'div', [ 'cryptoVar24hLabel' ]).innerHTML = '24h :';
    appendElement(cryptoVar24hHolder, 'div', [ 'cryptoVar24h' ]);
    const cryptoVar7dHolder = appendElementWithReturn(cryptoVariation, 'div', [ 'cryptoVar7dHolder' ]);
    appendElementWithReturn(cryptoVar7dHolder, 'div', [ 'cryptoVar7dLabel' ]).innerHTML = '7d :';
    appendElement(cryptoVar7dHolder, 'div', [ 'cryptoVar7d' ]);
    const cryptoGraphHolder = appendElementWithReturn(cryptoVariation, 'div', [ 'cryptoGraphHolder' ]);
    appendElementWithReturn(cryptoGraphHolder, 'div', [ 'cryptoGraphLabel' ]).innerHTML = 'Evolution over 10&nbsp;';
    appendElement(cryptoGraphHolder, 'div', [ 'graphHolder' ]);
  }; // appendCryptoMainInfo

  const cryptoHolder = appendElementWithReturn(document.querySelector('.mainHolder'), 'div', [ 'cryptoHolder' ]);
  cryptoHolder.classList.add('draggable-source');
  appendCryptoMainInfo(cryptoHolder);
  return appendCryptoVariation(cryptoHolder);
}; // setElementsHTML

const setCryptoValues = (data) => {
  const imgURL = `https://files.coinmarketcap.com/static/img/coins/64x64/${ data.id }.png`;
  document.querySelector(`#${ data.id }.cryptoLogo`).src = imgURL;
  document.querySelector(`#${ data.id }.cryptoName`).innerHTML = `<p>${ data.name }</p>`;
  document.querySelector(`#${ data.id }.cryptoSymbol`).innerHTML = `<p>${ data.symbol }</p>`;
  document.querySelector(`#${ data.id }.cryptoValue`).innerHTML = `<p>${ htmlMoneyFormatter(parseFloat(data.price_eur).toFixed(4)) }</p>`;
  setPercentages(document.querySelector(`#${ data.id }.cryptoVar1h`), data.percent_change_1h);
  setPercentages(document.querySelector(`#${ data.id }.cryptoVar24h`), data.percent_change_24h);
  setPercentages(document.querySelector(`#${ data.id }.cryptoVar7d`), data.percent_change_7d);

  // fetch graph data from another API
  return fetch(`https://min-api.cryptocompare.com/data/histohour?aggregate=1&e=CCCAGG&extraParams=CryptoCompare&fsym=${ 
    data.symbol 
  }&limit=240&tryConversion=false&tsym=EUR`)
    .then((r) => {
      return r.json();
    })
    .then((d) => {
      if (d.Response !== 'Success') {
        return document.querySelector(`.graphHolder#${ data.id }`).innerHTML = `<p>Data non available for ${ data.name }<p>`;
      }
      return appendSparkline(`.graphHolder#${ data.id }`, d.Data);
    });
}; // getCryptoValues

const initializeSearchAutoComplete = (data) => {
  const availableCryptos = [];

  data.map((elt) => {
    return availableCryptos.push(elt.id);
  }); // data.map

  document.getElementById('cryptoSearchField').addEventListener('keyup', (evt) => {
    // check if search area is not empty
    if (evt.target.value !== '') {
      const suggestions = availableCryptos
        .filter((crypto) => {
          return crypto.includes(evt.target.value.toLowerCase());
        })
        .slice(0,10);

      Array.from(document.getElementsByClassName('dropdownResult')).map((result, index) => {
        result.innerHTML = suggestions[index] ? suggestions[index] : '';
        return result.style.display = suggestions[index] ? 'block' : '';
      });
    } else {
      return hideSuggestions();
    }
  });
}; // intializeSearchAutoComplete

const initializeUI = () => {
  const refreshInformation = () => {
    // Retrieve list of cryptocurrency symbols
    const savedCryptos = JSON.parse(decodeURI(document.location.href.split('?q=')[1]));

    fetch('https://api.coinmarketcap.com/v1/ticker/?limit=0&convert=EUR')
      .then((r) => {
        if (!r.ok) throw Error(r.statusText);
        return r.json();
      })
      .then((d) => {
        const preSelectedCryptos = d.filter((elt) => {
          return savedCryptos.data.includes(elt.symbol);
        });

        return savedCryptos.data.map((symbol) => {
          const crypto = preSelectedCryptos.filter((elt) => {
            return elt.symbol === symbol;
          });
          return updateCryptoValues(crypto[0]);
        }); // savedCryptos.data.map
      });

    return document.getElementById('lastRefreshed').innerHTML = getCurrentTime();
  }; // refreshInformation

  document.getElementById('lastRefreshed').innerHTML = getCurrentTime();

  // add event listener to insert new cryptos
  document.getElementById('cryptoSearchButton').addEventListener('click', () => {
    getCryptoValues(document.getElementById('cryptoSearchField').value);
    hideSuggestions();
    return document.getElementById('cryptoSearchField').value = '';
  }); // addEventListener

  // add event listener to refresh the displayed information
  document.getElementById('cryptoRefreshButton').addEventListener('click', () => {
    return refreshInformation();
  }); // addEventListener

  // add event listener to each suggestion link
  Array.from(document.getElementsByClassName('dropdownResult')).map((res) => {
    return res.addEventListener('click', (evt) => {
      getCryptoValues(evt.target.innerHTML);
      document.getElementById('cryptoSearchField').value = '';
      return hideSuggestions();
    });
  }); // addEventListener

  // add event listener to display information about the dashboard
  return document.getElementById('cryptoInfoButton').addEventListener('click', () => {
    if ([ ...document.getElementsByClassName('infoBubble') ][0].style.display === '') {
      return [ ...document.getElementsByClassName('infoBubble') ][0].style.display = 'block';
    } else {
      return [ ...document.getElementsByClassName('infoBubble') ][0].style.display = '';
    }
  }); // addEventListener
}; // initializeUI

const updateCryptoValues = (data) => {
  document.querySelector(`#${ data.id }.cryptoValue`).firstChild.innerHTML = htmlMoneyFormatter(parseFloat(data.price_eur).toFixed(4));
  setPercentages(document.querySelector(`#${ data.id }.cryptoVar1h`), data.percent_change_1h);
  setPercentages(document.querySelector(`#${ data.id }.cryptoVar24h`), data.percent_change_24h);
  return setPercentages(document.querySelector(`#${ data.id }.cryptoVar7d`), data.percent_change_7d);
}; // updateCryptoValues

const hideSuggestions = () => {
  return Array.from(document.getElementsByClassName('dropdownResult')).map((result) => {
    return result.style.display = '';
  });
}; // hideSuggestions

const initializeSortable = () => {
  // add possibility to drag elements
  const sortable = new window.Draggable.Sortable(document.querySelectorAll('.mainHolder'), {
    handle: '.cryptoMainInfo',
  });

  sortable.on('sortable:stop', () => {
    // need to set a small timeout before refreshing URLs otherwise, it appears twice in data ...
    // Maybe find a more appropriated workaround later, but for now it's doing its job
    return setTimeout(() => {
      return refreshURL();
    }, 10);
  });
}; // initializeSortable

export {
  setElementsHTML,
  setCryptoValues,
  initializeSearchAutoComplete,
  initializeUI,
  updateCryptoValues,
  hideSuggestions,
  initializeSortable,
};
