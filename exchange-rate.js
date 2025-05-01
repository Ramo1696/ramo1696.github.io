const cryptoSelect = document.getElementById('crypto');
const fiatSelect = document.getElementById('fiat');
const amountInput = document.getElementById('amount');
const buyRateInput = document.getElementById('buyRate');
const sellRateInput = document.getElementById('sellRate');
const buyFeeInput = document.getElementById('buyFee');
const sellFeeInput = document.getElementById('sellFee');
const autoRateCheckbox = document.getElementById('autoRate');
const calculateBtn = document.querySelector('button');
const resultsBox = document.querySelector('.results-box');

async function fetchExchangeRate(crypto, fiat) {
  try {
    const response = await fetch(`https://api.coingecko.com/api/v3/simple/price?ids=${crypto}&vs_currencies=${fiat}`);
    const data = await response.json();
    return data[crypto][fiat];
  } catch (error) {
    console.error('Ошибка при получении курса:', error);
    return null;
  }
}

function updateAutoRate() {
  if (autoRateCheckbox.checked) {
    const crypto = cryptoSelect.value;
