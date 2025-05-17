function calculateProfit() {
  const crypto = document.getElementById("crypto").value;
  const fiat = document.getElementById("fiat").value;
  const amount = parseFloat(document.getElementById("amount").value);
  const buyRate = parseFloat(document.getElementById("buyRate").value);
  const sellRate = parseFloat(document.getElementById("sellRate").value);
  const buyFee = parseFloat(document.getElementById("buyFee").value) || 0;
  const sellFee = parseFloat(document.getElementById("sellFee").value) || 0;

  if (isNaN(amount) || isNaN(buyRate) || isNaN(sellRate)) {
    alert("Please fill in all fields correctly.");
    return;
  }

  const realBuyRate = buyRate * (1 + buyFee / 100);
  const realSellRate = sellRate * (1 - sellFee / 100);

  const spent = amount * realBuyRate;
  const received = amount * realSellRate;
  const netProfit = received - spent;

  document.getElementById("buyRateResult").textContent = `Buy rate with fee: ${realBuyRate.toFixed(4)} ${fiat.toUpperCase()}`;
  document.getElementById("sellRateResult").textContent = `Sell rate with fee: ${realSellRate.toFixed(4)} ${fiat.toUpperCase()}`;
  document.getElementById("spreadNoFee").textContent = `Spread without fee: ${(sellRate - buyRate).toFixed(4)} ${fiat.toUpperCase()}`;
  document.getElementById("spreadWithFee").textContent = `Spread with fee: ${(realSellRate - realBuyRate).toFixed(4)} ${fiat.toUpperCase()}`;
  document.getElementById("spent").textContent = `You spent: ${spent.toFixed(2)} ${fiat.toUpperCase()}`;
  document.getElementById("received").textContent = `You received: ${received.toFixed(2)} ${fiat.toUpperCase()}`;
  document.getElementById("netProfit").textContent = `Net profit: ${netProfit.toFixed(2)} ${fiat.toUpperCase()}`;
}

document.addEventListener("DOMContentLoaded", () => {
  const autoRateCheckbox = document.getElementById("autoRate");
  autoRateCheckbox.addEventListener("change", async () => {
    if (autoRateCheckbox.checked) {
      const crypto = document.getElementById("crypto").value;
      const fiat = document.getElementById("fiat").value;
      try {
        const response = await fetch(`https://api.coingecko.com/api/v3/simple/price?ids=${crypto}&vs_currencies=${fiat}`);
        const data = await response.json();
        const rate = data[crypto][fiat];
        if (rate) {
          document.getElementById("buyRate").value = rate;
          document.getElementById("sellRate").value = rate;
        } else {
          alert("Exchange rate not found.");
        }
      } catch (error) {
        alert("Error fetching exchange rate. Please try again later.");
        console.error("Exchange rate fetch error:", error);
      }
    }
  });
});
