document.addEventListener('DOMContentLoaded', () => {
  const cryptoSelect = document.getElementById('crypto');
  const fiatSelect = document.getElementById('fiat');
  const amountInput = document.getElementById('amount');
  const buyRateInput = document.getElementById('buyRate');
  const sellRateInput = document.getElementById('sellRate');
  const buyFeeInput = document.getElementById('buyFee');
  const sellFeeInput = document.getElementById('sellFee');
  const autoRateCheckbox = document.getElementById('autoRate');
  const resultDiv = document.getElementById('result');
  const calculateBtn = document.getElementById('calculateBtn');

  async function fetchRate(crypto, fiat) {
    try {
      const url = `https://api.coingecko.com/api/v3/simple/price?ids=${crypto}&vs_currencies=${fiat}`;
      const res = await fetch(url);
      const data = await res.json();
      return data[crypto][fiat];
    } catch (error) {
      alert('Ошибка загрузки курса. Попробуйте позже.');
      return null;
    }
  }

  async function updateRates() {
    const crypto = cryptoSelect.value;
    const fiat = fiatSelect.value;

    const rate = await fetchRate(crypto, fiat);
    if (rate) {
      buyRateInput.value = rate;
      sellRateInput.value = rate;
    }
  }

  autoRateCheckbox.addEventListener('change', () => {
    if (autoRateCheckbox.checked) {
      updateRates();
      buyRateInput.disabled = true;
      sellRateInput.disabled = true;
    } else {
      buyRateInput.disabled = false;
      sellRateInput.disabled = false;
    }
  });

  calculateBtn.addEventListener('click', () => {
    const amount = parseFloat(amountInput.value);
    const buyRate = parseFloat(buyRateInput.value);
    const sellRate = parseFloat(sellRateInput.value);
    const buyFee = parseFloat(buyFeeInput.value) || 0;
    const sellFee = parseFloat(sellFeeInput.value) || 0;

    if (isNaN(amount) || isNaN(buyRate) || isNaN(sellRate)) {
      resultDiv.innerHTML = "<span>Пожалуйста, заполните все поля.</span>";
      return;
    }

    const spent = amount * buyRate * (1 + buyFee / 100);
    const received = amount * sellRate * (1 - sellFee / 100);
    const spread = ((sellRate - buyRate) / buyRate) * 100;
    const netSpread = ((received - spent) / spent) * 100;
    const profit = received - spent;

    resultDiv.innerHTML = `
      Курс покупки: <span>${buyRate.toFixed(2)}</span><br>
      Курс продажи: <span>${sellRate.toFixed(2)}</span><br>
      Спред без комиссии: <span>${spread.toFixed(2)}%</span><br>
      Спред с комиссией: <span>${netSpread.toFixed(2)}%</span><br>
      Потрачено: <span>${spent.toFixed(2)}</span><br>
      Получено: <span>${received.toFixed(2)}</span><br>
      Чистая прибыль: <span>${profit.toFixed(2)}</span>
    `;
  });
});
