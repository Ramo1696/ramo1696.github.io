async function fetchExchangeRate(crypto, fiat) {
  try {
    const response = await fetch(`https://api.coingecko.com/api/v3/simple/price?ids=${crypto}&vs_currencies=${fiat}`);
    const data = await response.json();
    return data[crypto][fiat];
  } catch (error) {
    console.error("Ошибка при получении курса:", error);
    return null;
  }
}

document.getElementById("autoRate").addEventListener("change", async function () {
  const isChecked = this.checked;
  const crypto = document.getElementById("crypto").value;
  const fiat = document.getElementById("fiat").value;

  if (isChecked) {
    const rate = await fetchExchangeRate(crypto, fiat);
    if (rate) {
      document.getElementById("buyRate").value = rate;
      document.getElementById("sellRate").value = rate;
    }
  } else {
    document.getElementById("buyRate").value = "";
    document.getElementById("sellRate").value = "";
  }
});

document.getElementById("calculateBtn").addEventListener("click", function () {
  const amount = parseFloat(document.getElementById("amount").value);
  const buyRate = parseFloat(document.getElementById("buyRate").value);
  const sellRate = parseFloat(document.getElementById("sellRate").value);
  const buyFee = parseFloat(document.getElementById("buyFee").value) || 0;
  const sellFee = parseFloat(document.getElementById("sellFee").value) || 0;

  if (isNaN(amount) || isNaN(buyRate) || isNaN(sellRate)) {
    alert("Пожалуйста, заполните все поля корректно.");
    return;
  }

  const spent = amount * buyRate;
  const received = amount * sellRate * (1 - sellFee / 100);
  const netProfit = received - spent;
  const spread = ((sellRate - buyRate) / buyRate) * 100;
  const spreadWithFees = ((received - spent) / spent) * 100;

  document.getElementById("result").innerHTML = `
    <p>Курс покупки: ${buyRate.toFixed(2)}</p>
    <p>Курс продажи: ${sellRate.toFixed(2)}</p>
    <p>Спред без комиссий: ${spread.toFixed(2)} %</p>
    <p>Спред с комиссией: ${spreadWithFees.toFixed(2)} %</p>
    <p>Потрачено: ${spent.toFixed(2)}</p>
    <p>Получено: ${received.toFixed(2)}</p>
    <p>Чистая прибыль: ${netProfit.toFixed(2)}</p>
  `;
});
