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

export { htmlMoneyFormatter, setPercentages, getCurrentTime };