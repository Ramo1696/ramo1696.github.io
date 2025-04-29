
document.getElementById('autoToggle').addEventListener('change', () => {
  const auto = document.getElementById('autoToggle').checked;
  document.getElementById('buyRate').disabled = auto;
  document.getElementById('sellRate').disabled = auto;
  if (auto) updateRates();
});

document.getElementById('crypto').addEventListener('change', () => {
  if (document.getElementById('autoToggle').checked) updateRates();
});
document.getElementById('fiat').addEventListener('change', () => {
  if (document.getElementById('autoToggle').checked) updateRates();
});

function updateRates() {
  const crypto = document.getElementById('crypto').value;
  const fiat = document.getElementById('fiat').value;
  const url = `https://api.coingecko.com/api/v3/simple/price?ids=${crypto}&vs_currencies=${fiat}`;
  fetch(url)
    .then(res => res.json())
    .then(data => {
      const rate = data[crypto][fiat];
      document.getElementById('buyRate').value = rate;
      document.getElementById('sellRate').value = (rate * 1.005).toFixed(2); // 0.5% markup
    });
}

function calculate() {
  const buyRate = parseFloat(document.getElementById('buyRate').value);
  const sellRate = parseFloat(document.getElementById('sellRate').value);
  const amount = parseFloat(document.getElementById('amount').value);
  const buyFee = parseFloat(document.getElementById('buyFee').value) / 100;
  const sellFee = parseFloat(document.getElementById('sellFee').value) / 100;

  if (isNaN(buyRate) || isNaN(sellRate) || isNaN(amount)) {
    alert("Пожалуйста, заполните все поля корректно.");
    return;
  }

  const spent = amount * buyRate * (1 + buyFee);
  const received = amount * sellRate * (1 - sellFee);
  const netProfit = received - spent;

  const spreadRaw = ((sellRate - buyRate) / buyRate) * 100;
  const spreadNet = ((received - spent) / spent) * 100;

  document.getElementById('resBuyRate').textContent = buyRate.toFixed(2);
  document.getElementById('resSellRate').textContent = sellRate.toFixed(2);
  document.getElementById('spreadRaw').textContent = spreadRaw.toFixed(2) + " %";
  document.getElementById('spreadNet').textContent = spreadNet.toFixed(2) + " %";
  document.getElementById('spent').textContent = spent.toFixed(2);
  document.getElementById('received').textContent = received.toFixed(2);
  document.getElementById('netProfit').textContent = netProfit.toFixed(2);
}
