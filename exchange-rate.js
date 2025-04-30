function calculate() {
  const amount = parseFloat(document.getElementById("amount").value);
  const buyRate = parseFloat(document.getElementById("buyRate").value);
  const sellRate = parseFloat(document.getElementById("sellRate").value);
  const buyFee = parseFloat(document.getElementById("buyFee").value) || 0;
  const sellFee = parseFloat(document.getElementById("sellFee").value) || 0;

  if (isNaN(amount) || isNaN(buyRate) || isNaN(sellRate)) {
    alert("Пожалуйста, введите корректные данные.");
    return;
  }

  const spent = amount * buyRate;
  const received = amount * sellRate * (1 - sellFee / 100);
  const profit = received - spent;
  const spread = ((sellRate - buyRate) / buyRate) * 100;
  const spreadNet = ((received - spent) / spent) * 100;

  document.getElementById("resultBuyRate").textContent = buyRate.toFixed(2);
  document.getElementById("resultSellRate").textContent = sellRate.toFixed(2);
  document.getElementById("resultSpread").textContent = spread.toFixed(2);
  document.getElementById("resultSpreadNet").textContent = spreadNet.toFixed(2);
  document.getElementById("resultSpent").textContent = spent.toFixed(2);
  document.getElementById("resultReceived").textContent = received.toFixed(2);
  document.getElementById("resultProfit").textContent = profit.toFixed(2);
}
