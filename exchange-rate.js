async function fetchRates(crypto, fiat) {
  const url = `https://api.coingecko.com/api/v3/simple/price?ids=${crypto}&vs_currencies=${fiat}`;
  const res = await fetch(url);
  const data = await res.json();
  return data[crypto][fiat];
}

async function calculate() {
  const crypto = document.getElementById("crypto").value;
  const fiat = document.getElementById("fiat").value;
  const amount = parseFloat(document.getElementById("amount").value);
  const auto = document.getElementById("autoRate").checked;

  let buyRate = parseFloat(document.getElementById("buyRate").value);
  let sellRate = parseFloat(document.getElementById("sellRate").value);
  const buyFee = parseFloat(document.getElementById("buyFee").value) || 0;
  const sellFee = parseFloat(document.getElementById("sellFee").value) || 0;

  if (auto) {
    const rate = await fetchRates(crypto, fiat);
    buyRate = rate;
    sellRate = rate;
    document.getElementById("buyRate").value = rate;
    document.getElementById("sellRate").value = rate;
  }

  const spent = amount * buyRate;
  const received = amount * sellRate * (1 - sellFee / 100);
  const profit = received - spent;

  const spread = ((sellRate - buyRate) / buyRate * 100).toFixed(2);
  const spreadWithFee = (((sellRate * (1 - sellFee / 100)) - (buyRate * (1 + buyFee / 100))) / (buyRate * (1 + buyFee / 100)) * 100).toFixed(2);

  document.getElementById("r-buy").innerText = buyRate.toFixed(2);
  document.getElementById("r-sell").innerText = sellRate.toFixed(2);
  document.getElementById("r-spread").innerText = spread + " %";
  document.getElementById("r-spread-fee").innerText = spreadWithFee + " %";
  document.getElementById("r-spent").innerText = spent.toFixed(2);
  document.getElementById("r-received").innerText = received.toFixed(2);
  document.getElementById("r-profit").innerText = profit.toFixed(2);
}
