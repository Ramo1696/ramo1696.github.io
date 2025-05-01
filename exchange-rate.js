document.addEventListener("DOMContentLoaded", () => {
  const themeToggle = document.getElementById("theme-toggle");
  const langToggle = document.getElementById("lang-toggle");
  const autoRateCheckbox = document.getElementById("autoRate");
  const buyRate = document.getElementById("buyRate");
  const sellRate = document.getElementById("sellRate");
  const calculateBtn = document.getElementById("calculate");

  const translations = {
    ru: {
      Eng: "Eng",
      title: "P2P Profit",
      crypto: "Криптовалюта",
      fiat: "Фиат",
      amount: "Сумма (в криптовалюте)",
      buy: "Курс покупки",
      sell: "Курс продажи",
      buyFee: "Комиссия покупки (%)",
      sellFee: "Комиссия продажи (%)",
      auto: "Автоматический курс",
      calc: "Рассчитать",
      ad: "Благодаря рекламе приложение остаётся бесплатным"
    },
    en: {
      Eng: "Рус",
      title: "P2P Profit",
      crypto: "Cryptocurrency",
      fiat: "Fiat",
      amount: "Amount (in crypto)",
      buy: "Buy Rate",
      sell: "Sell Rate",
      buyFee: "Buy Fee (%)",
      sellFee: "Sell Fee (%)",
      auto: "Automatic rate",
      calc: "Calculate",
      ad: "This app stays free thanks to ads"
    }
  };

  let lang = "ru";

  langToggle.addEventListener("click", () => {
    lang = lang === "ru" ? "en" : "ru";
    const t = translations[lang];
    langToggle.textContent = t.Eng;
    document.getElementById("title").textContent = t.title;
    document.getElementById("label-crypto").textContent = t.crypto;
    document.getElementById("label-fiat").textContent = t.fiat;
    document.getElementById("label-amount").textContent = t.amount;
    document.getElementById("label-buy").textContent = t.buy;
    document.getElementById("label-sell").textContent = t.sell;
    document.getElementById("label-buy-fee").textContent = t.buyFee;
    document.getElementById("label-sell-fee").textContent = t.sellFee;
    document.getElementById("label-auto").textContent = t.auto;
    calculateBtn.textContent = t.calc;
    document.getElementById("ad-sub").textContent = t.ad;
  });

  themeToggle.addEventListener("click", () => {
    const isDark = document.body.classList.contains("dark");
    document.body.classList.toggle("dark", !isDark);
    document.body.classList.toggle("light", isDark);
    themeToggle.textContent = isDark ? "🌙" : "☀️";
  });

  async function getExchangeRate(crypto, fiat) {
    try {
      const response = await fetch(`https://api.coingecko.com/api/v3/simple/price?ids=${crypto}&vs_currencies=${fiat}`);
      const data = await response.json();
      return data[crypto][fiat];
    } catch (error) {
      alert("Ошибка загрузки курса");
      return null;
    }
  }

  autoRateCheckbox.addEventListener("change", async () => {
    if (autoRateCheckbox.checked) {
      const crypto = document.getElementById("crypto").value;
      const fiat = document.getElementById("fiat").value;
      const rate = await getExchangeRate(crypto, fiat);
      if (rate) {
        buyRate.value = rate;
        sellRate.value = rate;
      }
    }
  });

  calculateBtn.addEventListener("click", () => {
    const amount = parseFloat(document.getElementById("amount").value);
    const buy = parseFloat(buyRate.value);
    const sell = parseFloat(sellRate.value);
    const buyFee = parseFloat(document.getElementById("buyFee").value) || 0;
    const sellFee = parseFloat(document.getElementById("sellFee").value) || 0;

    if (!amount || !buy || !sell) return;

    const spent = amount * buy * (1 + buyFee / 100);
    const received = amount * sell * (1 - sellFee / 100);
    const profit = received - spent;
    const spread = ((sell - buy) / buy) * 100;
    const spreadNet = ((received - spent) / spent) * 100;

    document.getElementById("results").innerHTML = `
      Спред до комиссии: ${spread.toFixed(2)}%<br>
      Спред после комиссии: ${spreadNet.toFixed(2)}%<br>
      Потрачено: ${spent.toFixed(2)}<br>
      Получено: ${received.toFixed(2)}<br>
      Чистая прибыль: ${profit.toFixed(2)}
    `;
  });
});
