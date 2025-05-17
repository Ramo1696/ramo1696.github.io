
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
    return null;
  }
}

function updateAutoRate() {
  if (autoRateCheckbox.checked) {
    const crypto = cryptoSelect.value;
    const fiat = fiatSelect.value;

    fetchExchangeRate(crypto, fiat).then(rate => {
      if (rate) {
        buyRateInput.value = rate;
        sellRateInput.value = rate;
      }
    });
  }
}

function calculateProfit() {
  const amount = parseFloat(amountInput.value);
  const buyRate = parseFloat(buyRateInput.value);
  const sellRate = parseFloat(sellRateInput.value);
  const buyFee = parseFloat(buyFeeInput.value) || 0;
  const sellFee = parseFloat(sellFeeInput.value) || 0;

  if (isNaN(amount) || isNaN(buyRate) || isNaN(sellRate)) {
    resultsBox.innerHTML = "<p>Please fill in all fields correctly.</p>";
    return;
  }

  const spent = amount * buyRate * (1 + buyFee / 100);
  const received = amount * sellRate * (1 - sellFee / 100);
  const spreadNoFee = ((sellRate - buyRate) / buyRate) * 100;
  const spreadWithFee = ((received - spent) / spent) * 100;
  const netProfit = received - spent;

  resultsBox.innerHTML = `
    <p>Buy Rate: <span>${buyRate.toFixed(2)}</span></p>
    <p>Sell Rate: <span>${sellRate.toFixed(2)}</span></p>
    <p>Spread without Fee: <span>${spreadNoFee.toFixed(2)}%</span></p>
    <p>Spread with Fee: <span>${spreadWithFee.toFixed(2)}%</span></p>
    <p>Spent: <span>${spent.toFixed(2)}</span></p>
    <p>Received: <span>${received.toFixed(2)}</span></p>
    <p>Net Profit: <span>${netProfit.toFixed(2)}</span></p>
  `;
}

cryptoSelect.addEventListener('change', updateAutoRate);
fiatSelect.addEventListener('change', updateAutoRate);
autoRateCheckbox.addEventListener('change', updateAutoRate);
calculateBtn.addEventListener('click', calculateProfit);

window.addEventListener('load', updateAutoRate);
