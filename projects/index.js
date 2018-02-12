/* eslint no-undef: 0 */

const moneyFormatter = (amount, currency = '&euro;') => {
  return `${ currency }${ amount }`;
}; // moneyFormatter

const percentFormatter = (value) => {
  return `${ value }%`;
}; // percentFormatter

const setPercentages = (element, data) => {
  // clean out positive or negative class if present
  element.classList.remove(...[ 'positive', 'negtive' ]);

  element.innerHTML = `<p>${ percentFormatter(data) }</p>`;
  return data > 0 ? element.classList.add('positive') : element.classList.add('negative');
}; // setPercentages

const insertNewCryptoURL = (cryptoSymbol) => {
  const cryptos = JSON.parse(decodeURI(document.location.href.split('?q=')[1]));
  const baseURL = document.location.href.split('?q=')[0];
  cryptos.data.push(cryptoSymbol);

  return window.history.pushState({}, '', `${ baseURL }?q=${ JSON.stringify(cryptos) }`);
}; // insertNewCryptoURL

const getCurrentTime = () => {
  const d = new Date();
  const hours = `0${ d.getHours() }`.slice(-2);
  const minutes = `0${ d.getMinutes() }`.slice(-2);
  const seconds = `0${ d.getSeconds() }`.slice(-2);
  return `<p>${ hours }:${ minutes }:${ seconds }</p>`;
};

const updateCryptoValues = (data) => {
  document.querySelector(`#${ data.id }.cryptoValue`).firstChild.innerHTML = moneyFormatter(parseFloat(data.price_eur).toFixed(4));
  setPercentages(document.querySelector(`#${ data.id }.cryptoVar1h`), data.percent_change_1h);
  setPercentages(document.querySelector(`#${ data.id }.cryptoVar24h`), data.percent_change_24h);
  return setPercentages(document.querySelector(`#${ data.id }.cryptoVar7d`), data.percent_change_7d);
}; // updateCryptoValues

const refreshInformation = () => {
  // Retrieve list of cryptocurrency symbols
  const savedCryptos = JSON.parse(decodeURI(document.location.href.split('?q=')[1]));

  fetch('https://api.coinmarketcap.com/v1/ticker/?limit=0&convert=EUR')
    .then((r) => {
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

const refreshURL = () => {
  // retrieve all crypto currently displayed in mainHolder
  const data = Array.from(document.querySelector('.mainHolder').childNodes).reduce((accumulator, crypto) => {
    accumulator.push(crypto.firstChild.querySelector('.cryptoSymbol').firstChild.innerHTML);
    return accumulator;
  }, []); // reduce

  const baseURL = document.location.href.split('?q=')[0];
  return window.history.pushState({}, '', `${ baseURL }?q=${ JSON.stringify({ 'data': data }) }`);
}; // refreshURL

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
    // append upper part of cryptoHolder
    const cryptoMainInfo = appendElementWithReturn(cryptoHolder, 'div', [ 'cryptoMainInfo' ]);

    // append close Button and its event handler
    const button = document.createElement('button');// type="submit" id="cryptoSearchButton">
    button.type = 'submit';
    button.classList.add(...[ 'cryptoCloseButton', 'hidden' ]);
    cryptoMainInfo.append(button);
    button.addEventListener('click', (evt) => {
      evt.target.parentNode.parentNode.parentNode.remove();
      return refreshURL();
    }); // addEventListener
    appendElement(button, 'i', [ 'fa', 'fa-times-circle' ]);

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
    return appendElement(cryptoVar7dHolder, 'div', [ 'cryptoVar7d' ]);
  }; // appendCryptoMainInfo

  const cryptoHolder = appendElementWithReturn(document.querySelector('.mainHolder'), 'div', [ 'cryptoHolder' ]);
  cryptoHolder.classList.add('sortable');
  appendCryptoMainInfo(cryptoHolder);
  return appendCryptoVariation(cryptoHolder);
}; // setElementsHTML

const setCryptoValues = (data) => {
  const imgURL = `https://files.coinmarketcap.com/static/img/coins/64x64/${ data.id }.png`;
  document.querySelector(`#${ data.id }.cryptoLogo`).src = imgURL;
  document.querySelector(`#${ data.id }.cryptoName`).innerHTML = `<p>${ data.name }</p>`;
  document.querySelector(`#${ data.id }.cryptoSymbol`).innerHTML = `<p>${ data.symbol }</p>`;
  document.querySelector(`#${ data.id }.cryptoValue`).innerHTML = `<p>${ moneyFormatter(parseFloat(data.price_eur).toFixed(4)) }</p>`;
  setPercentages(document.querySelector(`#${ data.id }.cryptoVar1h`), data.percent_change_1h);
  setPercentages(document.querySelector(`#${ data.id }.cryptoVar24h`), data.percent_change_24h);
  setPercentages(document.querySelector(`#${ data.id }.cryptoVar7d`), data.percent_change_7d);
}; // getCryptoValues

const getCryptoValues = (cryptoId) => {
  fetch(`https://api.coinmarketcap.com/v1/ticker/${ cryptoId }/?convert=EUR`)
    .then((r) => {
      return r.json();
    })
    .then((d) => {
      setCryptoValues(d[0]);
      return insertNewCryptoURL(d[0].symbol);
    });
}; // getCryptoValues

insertCrypto = (cryptoId) => {
  setElementsHTML(cryptoId);
  return getCryptoValues(cryptoId);
}; // insertCrypto

const intializeSearchAutoComplete = (data) => {
  return $(() => {
    const availableTags = data.map((elt) => {
      return elt.id;
    });
    return $('.cryptoSearch').autocomplete({ source: availableTags });
  });
}; // intializeSearchAutoComplete

const initializeDashboard = () => {
  // Retrieve list of cryptocurrency symbols
  const savedCryptos = JSON.parse(decodeURI(document.location.href.split('?q=')[1]));

  // Populate with cryptocurrencies found in URL
  fetch('https://api.coinmarketcap.com/v1/ticker/?limit=0&convert=EUR')
    .then((r) => {
      return r.json();
    })
    .then((d) => {
      intializeSearchAutoComplete(d);

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

  // add possibility to drag elements
  $('.mainHolder').sortable({
    appendTo: document.body,
    stop: () => {
      return refreshURL();
    },
  });

  document.getElementById('lastRefreshed').innerHTML = getCurrentTime();

  // add event listener to insert new cryptos
  document.getElementById('cryptoSearchButton').addEventListener('click', () => {
    return insertCrypto(document.getElementById('cryptoSearchField').value);
  }); // addEventListener

  // add event lsitener to refresh the displayed information
  return document.getElementById('cryptoRefreshButton').addEventListener('click', () => {
    return refreshInformation();
  }); // addEventListener
}; // initializeDashboard

initializeDashboard();
