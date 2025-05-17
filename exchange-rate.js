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
    resultsBox.innerHTML = "<p>Пожалуйста, заполните все поля правильно.</p>";
    return;
  }

  const spent = amount * buyRate * (1 + buyFee / 100);
  const received = amount * sellRate * (1 - sellFee / 100);
  const spreadNoFee = ((sellRate - buyRate) / buyRate) * 100;
  const spreadWithFee = ((received - spent) / spent) * 100;
  const netProfit = received - spent;

  resultsBox.innerHTML = `
    <p>Курс покупки: <span>${buyRate.toFixed(2)}</span></p>
    <p>Курс продажи: <span>${sellRate.toFixed(2)}</span></p>
    <p>Спред без комиссии: <span>${spreadNoFee.toFixed(2)}%</span></p>
    <p>Спред с комиссией: <span>${spreadWithFee.toFixed(2)}%</span></p>
    <p>Потрачено: <span>${spent.toFixed(2)}</span></p>
    <p>Получено: <span>${received.toFixed(2)}</span></p>
    <p>Чистая прибыль: <span>${netProfit.toFixed(2)}</span></p>
  `;
}

// Обновляем курс при изменении крипты, фиата, чекбокса
cryptoSelect.addEventListener('change', updateAutoRate);
fiatSelect.addEventListener('change', updateAutoRate);
autoRateCheckbox.addEventListener('change', updateAutoRate);

// Кнопка расчета
calculateBtn.addEventListener('click', calculateProfit);
