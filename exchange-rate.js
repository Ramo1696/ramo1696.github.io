const translations = {
  ru: {
    "Cryptocurrency": "Криптовалюта",
    "Fiat": "Фиат",
    "Amount (in crypto)": "Сумма (в криптовалюте)",
    "Buy Rate": "Курс покупки",
    "Sell Rate": "Курс продажи",
    "Buy Fee (%)": "Комиссия покупки (%)",
    "Sell Fee (%)": "Комиссия продажи (%)",
    "Automatic Rate": "Автоматический курс",
    "Calculate": "Рассчитать"
  },
  en: {
    "Криптовалюта": "Cryptocurrency",
    "Фиат": "Fiat",
    "Сумма (в криптовалюте)": "Amount (in crypto)",
    "Курс покупки": "Buy Rate",
    "Курс продажи": "Sell Rate",
    "Комиссия покупки (%)": "Buy Fee (%)",
    "Комиссия продажи (%)": "Sell Fee (%)",
    "Автоматический курс": "Automatic Rate",
    "Рассчитать": "Calculate"
  }
};

document.getElementById("theme-toggle").addEventListener("click", () => {
  document.body.classList.toggle("dark-mode");
  document.getElementById("theme-toggle").textContent =
    document.body.classList.contains("dark-mode") ? "🌞" : "🌜";
});

document.getElementById("lang-toggle").addEventListener("click", () => {
  const langBtn = document.getElementById("lang-toggle");
  const newLang = langBtn.textContent === "Eng" ? "Рус" : "Eng";
  langBtn.textContent = newLang;

  const labels = document.querySelectorAll("label, button");

  labels.forEach(el => {
    const translation =
      translations[newLang === "Eng" ? "en" : "ru"][el.textContent.trim()];
    if (translation) el.textContent = translation;
  });
});

document.getElementById("calculate-button").addEventListener("click", () => {
  const amount = parseFloat(document.getElementById("amount").value);
  const buy = parseFloat(document.getElementById("buy-rate").value);
  const sell = parseFloat(document.getElementById("sell-rate").value);
  const buyFee = parseFloat(document.getElementById("buy-fee").value) || 0;
  const sellFee = parseFloat(document.getElementById("sell-fee").value) || 0;

  if (isNaN(amount) || isNaN(buy) || isNaN(sell)) return;

  const spent = amount * buy * (1 + buyFee / 100);
  const received = amount * sell * (1 - sellFee / 100);
  const profit = received - spent;

  document.getElementById("results").innerHTML = `
    <p>Потрачено: ${spent.toFixed(2)}</p>
    <p>Получено: ${received.toFixed(2)}</p>
    <p>Чистая прибыль: ${profit.toFixed(2)}</p>
  `;
});

document.getElementById("auto-rate").addEventListener("change", async (e) => {
  if (!e.target.checked) return;

  const crypto = document.getElementById("crypto").value;
  const fiat = document.getElementById("fiat").value;

  const res = await fetch(`https://api.coingecko.com/api/v3/simple/price?ids=${crypto}&vs_currencies=${fiat}`);
  const data = await res.json();
  const rate = data[crypto][fiat];

  document.getElementById("buy-rate").value = rate;
  document.getElementById("sell-rate").value = rate;
});
