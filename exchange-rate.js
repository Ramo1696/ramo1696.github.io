window.addEventListener("load", () => {
  // Заставка
  const splash = document.getElementById("splash-screen");
  const container = document.getElementById("container");
  setTimeout(() => {
    splash.style.opacity = 0;
    setTimeout(() => {
      splash.style.display = "none";
      container.style.display = "block";
    }, 500);
  }, 2000);

  // Перевод
  const langToggle = document.getElementById("lang-toggle");
  const texts = {
    ru: {
      title: "P2P Profit",
      crypto: "Криптовалюта",
      fiat: "Фиат",
      amount: "Сумма",
      "buy-rate": "Курс покупки",
      "sell-rate": "Курс продажи",
      "buy-fee": "Комиссия покупки (%)",
      "sell-fee": "Комиссия продажи (%)",
      auto: "Авто курс",
      calc: "Рассчитать"
    },
    en: {
      title: "P2P Profit",
      crypto: "Cryptocurrency",
      fiat: "Fiat",
      amount: "Amount",
      "buy-rate": "Buy rate",
      "sell-rate": "Sell rate",
      "buy-fee": "Buy fee (%)",
      "sell-fee": "Sell fee (%)",
      auto: "Auto rate",
      calc: "Calculate"
    }
  };

  let currentLang = "ru";
  langToggle.addEventListener("click", () => {
    currentLang = currentLang === "ru" ? "en" : "ru";
    langToggle.textContent = currentLang.toUpperCase() === "RU" ? "ENG" : "RU";
    document.querySelectorAll("[data-i18n]").forEach(el => {
      const key = el.getAttribute("data-i18n");
      el.textContent = texts[currentLang][key];
    });
  });

  // Калькулятор
  document.getElementById("calculate").addEventListener("click", () => {
    const amount = parseFloat(document.getElementById("amount").value);
    const buyRate = parseFloat(document.getElementById("buyRate").value);
    const sellRate = parseFloat(document.getElementById("sellRate").value);
    const buyFee = parseFloat(document.getElementById("buyFee").value || 0);
    const sellFee = parseFloat(document.getElementById("sellFee").value || 0);

    if (isNaN(amount) || isNaN(buyRate) || isNaN(sellRate)) return;

    const buyTotal = amount * buyRate * (1 + buyFee / 100);
    const sellTotal = amount * sellRate * (1 - sellFee / 100);
    const profit = sellTotal - buyTotal;

    document.getElementById("result").innerHTML = `
      <p>Потрачено: ${buyTotal.toFixed(2)}</p>
      <p>Получено: ${sellTotal.toFixed(2)}</p>
      <p>Чистая прибыль: ${profit.toFixed(2)}</p>
    `;
  });
});
