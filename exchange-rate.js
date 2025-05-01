document.addEventListener("DOMContentLoaded", () => {
  const themeToggle = document.getElementById("theme-toggle");
  const langToggle = document.getElementById("lang-toggle");
  const body = document.body;

  // Theme toggle
  themeToggle.addEventListener("click", () => {
    const isDark = body.classList.contains("dark");
    body.classList.toggle("dark", !isDark);
    body.classList.toggle("light", isDark);
    themeToggle.textContent = isDark ? "🌙" : "☀️";
  });

  // Language toggle
  const translations = {
    ru: {
      "crypto-label": "Криптовалюта",
      "fiat-label": "Фиат",
      "amount-label": "Сумма (в криптовалюте)",
      "buy-rate-label": "Курс покупки",
      "sell-rate-label": "Курс продажи",
      "buy-fee-label": "Комиссия покупки (%)",
      "sell-fee-label": "Комиссия продажи (%)",
      "auto-rate-label": "Автоматический курс",
      "calculate-button": "Рассчитать"
    },
    en: {
      "crypto-label": "Cryptocurrency",
      "fiat-label": "Fiat",
      "amount-label": "Amount (in crypto)",
      "buy-rate-label": "Buy Rate",
      "sell-rate-label": "Sell Rate",
      "buy-fee-label": "Buy Fee (%)",
      "sell-fee-label": "Sell Fee (%)",
      "auto-rate-label": "Automatic Rate",
      "calculate-button": "Calculate"
    }
  };

  let currentLang = "ru";
  langToggle.addEventListener("click", () => {
    currentLang = currentLang === "ru" ? "en" : "ru";
    langToggle.textContent = currentLang === "ru" ? "Eng" : "Рус";
    for (const id in translations[currentLang]) {
      const element = document.getElementById(id);
      if (element) element.textContent = translations[currentLang][id];
    }
  });

  // Calculate
  document.getElementById("calculate-button").addEventListener("click", () => {
    const amount = parseFloat(document.getElementById("amount").value);
    const buyRate = parseFloat(document.getElementById("buy-rate").value);
    const sellRate = parseFloat(document.getElementById("sell-rate").value);
    const buyFee = parseFloat(document.getElementById("buy-fee").value) || 0;
    const sellFee = parseFloat(document.getElementById("sell-fee").value) || 0;

    if (isNaN(amount) || isNaN(buyRate) || isNaN(sellRate)) return;

    const spent = amount * buyRate * (1 + buyFee / 100);
    const received = amount * sellRate * (1 - sellFee / 100);
    const profit = received - spent;

    document.getElementById("results").innerHTML = `
      Потрачено: ${spent.toFixed(2)}<br>
      Получено: ${received.toFixed(2)}<br>
      Чистая прибыль: ${profit.toFixed(2)}
    `;
  });

  // Auto rate
  document.getElementById("auto-rate").addEventListener("change", async (e) => {
    if (!e.target.checked) return;
    const crypto = document.getElementById("crypto").value;
    const fiat = document.getElementById("fiat").value;

    try {
      const res = await fetch(`https://api.coingecko.com/api/v3/simple/price?ids=${crypto}&vs_currencies=${fiat}`);
      const data = await res.json();
      const rate = data[crypto][fiat];
      document.getElementById("buy-rate").value = rate;
      document.getElementById("sell-rate").value = rate;
    } catch (err) {
      alert("Ошибка загрузки курса");
    }
  });
});
