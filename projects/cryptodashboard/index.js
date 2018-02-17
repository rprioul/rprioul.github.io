/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 1);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "b", function() { return htmlMoneyFormatter; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "c", function() { return setPercentages; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return getCurrentTime; });
const htmlMoneyFormatter = (amount, currency = '&euro;') => {
  return `${ currency }${ amount }`;
}; // moneyFormatter

const setPercentages = (element, data) => {
  const percentFormatter = (value) => {
    return `${ value }%`;
  }; // percentFormatter

  // clean out positive or negative class if present
  element.classList.remove(...[ 'positive', 'negtive' ]);

  element.innerHTML = `<p>${ percentFormatter(data) }</p>`;
  return data > 0 ? element.classList.add('positive') : element.classList.add('negative');
}; // setPercentages

const getCurrentTime = () => {
  const d = new Date();
  const hours = `0${ d.getHours() }`.slice(-2);
  const minutes = `0${ d.getMinutes() }`.slice(-2);
  const seconds = `0${ d.getSeconds() }`.slice(-2);

  return `<p>${ hours }:${ minutes }:${ seconds }</p>`;
}; // getCurrentTime



/***/ }),
/* 1 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__ui_js__ = __webpack_require__(2);


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
      Object(__WEBPACK_IMPORTED_MODULE_0__ui_js__["a" /* initializeSearchAutoComplete */])(d);

      const preSelectedCryptos = d.filter((elt) => {
        return savedCryptos.data.includes(elt.symbol);
      });

      return savedCryptos.data.map((symbol) => {
        const crypto = preSelectedCryptos.filter((elt) => {
          return elt.symbol === symbol;
        });
        Object(__WEBPACK_IMPORTED_MODULE_0__ui_js__["e" /* setElementsHTML */])(crypto[0].id);
        return Object(__WEBPACK_IMPORTED_MODULE_0__ui_js__["d" /* setCryptoValues */])(crypto[0]);
      }); // savedCryptos.data.map
    });

  Object(__WEBPACK_IMPORTED_MODULE_0__ui_js__["b" /* initializeSortable */])();

  return Object(__WEBPACK_IMPORTED_MODULE_0__ui_js__["c" /* initializeUI */])();
}; // initializeDashboard

initializeDashboard();


/***/ }),
/* 2 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "e", function() { return setElementsHTML; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "d", function() { return setCryptoValues; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return initializeSearchAutoComplete; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "c", function() { return initializeUI; });
/* unused harmony export updateCryptoValues */
/* unused harmony export hideSuggestions */
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "b", function() { return initializeSortable; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__util_js__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__graphic_js__ = __webpack_require__(3);



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
  document.querySelector(`#${ data.id }.cryptoValue`).innerHTML = `<p>${ Object(__WEBPACK_IMPORTED_MODULE_0__util_js__["b" /* htmlMoneyFormatter */])(parseFloat(data.price_eur).toFixed(4)) }</p>`;
  Object(__WEBPACK_IMPORTED_MODULE_0__util_js__["c" /* setPercentages */])(document.querySelector(`#${ data.id }.cryptoVar1h`), data.percent_change_1h);
  Object(__WEBPACK_IMPORTED_MODULE_0__util_js__["c" /* setPercentages */])(document.querySelector(`#${ data.id }.cryptoVar24h`), data.percent_change_24h);
  Object(__WEBPACK_IMPORTED_MODULE_0__util_js__["c" /* setPercentages */])(document.querySelector(`#${ data.id }.cryptoVar7d`), data.percent_change_7d);

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
      return Object(__WEBPACK_IMPORTED_MODULE_1__graphic_js__["a" /* appendSparkline */])(`.graphHolder#${ data.id }`, d.Data);
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

    return document.getElementById('lastRefreshed').innerHTML = Object(__WEBPACK_IMPORTED_MODULE_0__util_js__["a" /* getCurrentTime */])();
  }; // refreshInformation

  document.getElementById('lastRefreshed').innerHTML = Object(__WEBPACK_IMPORTED_MODULE_0__util_js__["a" /* getCurrentTime */])();

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
  document.querySelector(`#${ data.id }.cryptoValue`).firstChild.innerHTML = Object(__WEBPACK_IMPORTED_MODULE_0__util_js__["b" /* htmlMoneyFormatter */])(parseFloat(data.price_eur).toFixed(4));
  Object(__WEBPACK_IMPORTED_MODULE_0__util_js__["c" /* setPercentages */])(document.querySelector(`#${ data.id }.cryptoVar1h`), data.percent_change_1h);
  Object(__WEBPACK_IMPORTED_MODULE_0__util_js__["c" /* setPercentages */])(document.querySelector(`#${ data.id }.cryptoVar24h`), data.percent_change_24h);
  return Object(__WEBPACK_IMPORTED_MODULE_0__util_js__["c" /* setPercentages */])(document.querySelector(`#${ data.id }.cryptoVar7d`), data.percent_change_7d);
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




/***/ }),
/* 3 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return appendSparkline; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__util_js__ = __webpack_require__(0);


const appendSparkline = (elemId, data) => {

  const width = 200;
  const height = 60;
  const x = d3.scale.linear().range([0.02 * width, 0.98 * width]);
  const y = d3.scale.linear().range([0.98 * height, 0.02 * height]);
  const line = d3.svg
    .line()
    .interpolate("bundle")
    .x((d) => {
      return x(d.time);
    })
    .y((d) => {
      return y(d.close);
    });

  const drawSparkline = (elemId, data) => {
    data.forEach((d) => {
      d.time = +d.time;
      return d.close = +d.close;
    });
    x.domain(d3.extent(data, (d) => {
      return d.time;
    }));
    y.domain(d3.extent(data, (d) => {
      return d.close;
    }));

    const svg = d3.select(elemId)
      .append('svg')
      .attr('width', width)
      .attr('height', height)
      .append('g')
      .attr('transform', 'translate(0, 2)');
    svg.append('path')
      .datum(data)
      .attr('class', 'sparkline')
      .attr('d', line);
    svg.append('circle')
      .attr('class', 'sparkcircleEnd')
      .attr('cx', x(data[data.length - 1].time))
      .attr('cy', y(data[data.length - 1].close))
      .attr('r', 3);
    svg.append('circle')
      .attr('class', 'sparkcircleStart')
      .attr('cx', x(data[0].time))
      .attr('cy', y(data[0].close))
      .attr('r', 3);
    svg.append('text')
      .attr('class', 'graphValueLabel')
      .attr('x', x(data[data.length - 1].time))
      .attr('y', height / 2)
      .attr('text-anchor', 'end')
      .text(Object(__WEBPACK_IMPORTED_MODULE_0__util_js__["b" /* htmlMoneyFormatter */])(data[data.length - 1].close, '\u20AC'));
    svg.append('text')
      .attr('class', 'graphValueLabel')
      .attr('x', x(data[0].time))
      .attr('y', height / 2)
      .attr('text-anchor', 'start')
      .text(Object(__WEBPACK_IMPORTED_MODULE_0__util_js__["b" /* htmlMoneyFormatter */])(data[0].close, '\u20AC'));
  }; // drawSparkline

  return drawSparkline(elemId, data);
}; // appendSparkline



/***/ })
/******/ ]);