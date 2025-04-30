document.addEventListener("DOMContentLoaded", function () {
  const calculateBtn = document.getElementById("calculate");
  const resetBtn = document.getElementById("reset");
  const autoRateCheckbox = document.getElementById("autoRate");

  function parseValue(input) {
    const value = parseFloat(input.value.replace(",", "."));
    return isNaN(value) ? null : value;
  }

  function updateResult(content) {
    document.getElementById("result").innerHTML = content;
  }

  calculateBtn.addEventListener("click", async function () {
    const crypto = document.getElementById("crypto").value;
    const fiat = document.getElementById("fiat").value;
    const amount = parseValue(document.getElementById("amount"));
    const buyRateInput = document.getElementById("buyRate");
    const sellRateInput = document.getElementById("sellRate");
    const buyFee = parseValue(document.getElementById("buyFee")) || 0;
    const sellFee = parseValue(document.getElementById("sellFee")) || 0;

    let buyRate = parseValue(buyRateInput);
    let sellRate = parseValue(sellRateInput);

    if (autoRateCheckbox.checked) {
      try {
        const res = await fetch(`https://api.coingecko.com/api/v3/simple/price?ids=${crypto}&vs_currencies=${fiat}`);
        const data = await res.json();
        const rate = data[crypto][fiat];
        buyRate = sellRate = rate;
        buyRateInput.value = rate;
        sellRateInput.value = rate;
      } catch (e) {
        updateResult("<span style='color:red;'>Ошибка загрузки курса</span>");
        return;
      }
    }

    if (amount === null || buyRate === null || sellRate === null) {
      updateResult("<span style='color:red;'>Пожалуйста, введите корректные значения</span>");
      return;
    }

    const spent = amount * buyRate * (1 + buyFee / 100);
    const received = amount * sellRate * (1 - sellFee / 100);
    const profit = received - spent;

    const spreadNoFee = ((sellRate - buyRate) / buyRate) * 100;
    const spreadWithFee = ((received - spent) / spent) * 100;

    updateResult(`
      <p>Курс покупки: <span class="value">${buyRate.toFixed(2)}</span></p>
      <p>Курс продажи: <span class="value">${sellRate.toFixed(2)}</span></p>
      <p>Спред без комиссии: <span class="value">${spreadNoFee.toFixed(2)}%</span></p>
      <p>Спред с комиссией: <span class="value">${spreadWithFee.toFixed(2)}%</span></p>
      <p>Потрачено: <span class="value">${spent.toFixed(2)}</span></p>
      <p>Получено: <span class="value">${received.toFixed(2)}</span></p>
      <p>Чистая прибыль: <span class="value">${profit.toFixed(2)}</span></p>
    `);
  });

  resetBtn?.addEventListener("click", () => {
    document.querySelectorAll("input").forEach((input) => (input.value = ""));
    updateResult("");
  });
});
