const translations = {
  ru: {
    cryptoLabel: "Криптовалюта",
    fiatLabel: "Фиат",
    amountLabel: "Сумма (в криптовалюте)",
    buyRateLabel: "Курс покупки",
    sellRateLabel: "Курс продажи",
    buyFeeLabel: "Комиссия покупки (%)",
    sellFeeLabel: "Комиссия продажи (%)",
    autoRateLabel: "Автоматический курс",
    calculateBtn: "Рассчитать"
  },
  en: {
    cryptoLabel: "Crypto",
    fiatLabel: "Fiat",
    amountLabel: "Amount (in crypto)",
    buyRateLabel: "Buy rate",
    sellRateLabel: "Sell rate",
    buyFeeLabel: "Buy fee (%)",
    sellFeeLabel: "Sell fee (%)",
    autoRateLabel: "Automatic rate",
    calculateBtn: "Calculate"
  }
};

let currentLang = "ru";

document.getElementById("themeToggle").addEventListener("click", () => {
  document.body.classList.toggle("light");
});

document.getElementById("langToggle").addEventListener("click", () => {
  currentLang = currentLang === "ru" ? "en" : "ru";
  updateLanguage();
});

function updateLanguage() {
  const t = translations[currentLang];
  for (const key in t) {
    const el = document.getElementById(key);
    if (el) el.innerText = t[key];
  }
  document.getElementById("langToggle").innerText = currentLang === "ru" ? "Eng" : "Рус";
}

document.getElementById("calculateBtn").addEventListener("click", () => {
  const amount = parseFloat(document.getElementById("amount").value);
  const buyRate = parseFloat(document.getElementById("buyRate").value);
  const sellRate = parseFloat(document.getElementById("sellRate").value);
  const buyFee = parseFloat(document.getElementById("buyFee").value) || 0;
  const sellFee = parseFloat(document.getElementById("sellFee").value) || 0;

  if (isNaN(amount) || isNaN(buyRate) || isNaN(sellRate)) return;

  const buyCost = amount * buyRate * (1 + buyFee / 100);
  const sellValue = amount * sellRate * (1 - sellFee / 100);
  const profit = sellValue - buyCost;
  const spread = ((sellRate - buyRate) / buyRate) * 100;

  const result = `
    ${translations[currentLang].buyRateLabel}: ${buyRate}<br>
    ${translations[currentLang].sellRateLabel}: ${sellRate}<br>
    Спред: ${spread.toFixed(2)}%<br>
    Потрачено: ${buyCost.toFixed(2)}<br>
    Получено: ${sellValue.toFixed(2)}<br>
    Чистая прибыль: ${profit.toFixed(2)}
  `;
  document.getElementById("result").innerHTML = result;
});
