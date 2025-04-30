
const apiURL = 'https://api.coingecko.com/api/v3/simple/price?ids=tether,usd-coin,bitcoin,ethereum&vs_currencies=usd,eur,gel,rub';

async function fetchRates() {
  try {
    const response = await fetch(apiURL);
    return await response.json();
  } catch (error) {
    console.error('Ошибка загрузки курсов:', error);
    return null;
  }
}

function round(value) {
  return Math.round(value * 100) / 100;
}

async function calculateProfit() {
  const amount = parseFloat(document.getElementById('amount').value);
  const buyRateInput = document.getElementById('buyRate');
  const sellRateInput = document.getElementById('sellRate');
  const buyFee = parseFloat(document.getElementById('buyFee').value);
  const sellFee = parseFloat(document.getElementById('sellFee').value);
  const autoRate = document.getElementById('autoRate').checked;

  const crypto = document.getElementById('crypto').value;
  const fiat = document.getElementById('fiat').value;

  if (autoRate) {
    const rates = await fetchRates();
    if (!rates || !rates[crypto] || !rates[crypto][fiat]) {
      alert('Не удалось загрузить курсы.');
      return;
    }
    const rate = rates[crypto][fiat];
    buyRateInput.value = rate;
    sellRateInput.value = rate;
  }

  const buyRate = parseFloat(buyRateInput.value);
  const sellRate = parseFloat(sellRateInput.value);

  const spent = round(amount * buyRate * (1 + buyFee / 100));
  const received = round(amount * sellRate * (1 - sellFee / 100));
  const profit = round(received - spent);
  const spreadNoFee = round(((sellRate - buyRate) / buyRate) * 100);
  const spreadWithFee = round((profit / spent) * 100);

  document.getElementById('buyRateResult').innerHTML = 'Курс покупки: <span>' + buyRate + '</span>';
  document.getElementById('sellRateResult').innerHTML = 'Курс продажи: <span>' + sellRate + '</span>';
  document.getElementById('spreadNoFee').innerHTML = 'Спред без комиссии: <span>' + spreadNoFee + '%</span>';
  document.getElementById('spreadWithFee').innerHTML = 'Спред с комиссией: <span>' + spreadWithFee + '%</span>';
  document.getElementById('spent').innerHTML = 'Потрачено: <span>' + spent + '</span>';
  document.getElementById('received').innerHTML = 'Получено: <span>' + received + '</span>';
  document.getElementById('netProfit').innerHTML = 'Чистая прибыль: <span>' + profit + '</span>';
}
