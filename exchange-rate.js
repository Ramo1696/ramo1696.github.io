const cryptoSelect = document.getElementById('crypto');
const fiatSelect = document.getElementById('fiat');
const amountInput = document.getElementById('amount');
const buyRateInput = document.getElementById('buyRate');
const sellRateInput = document.getElementById('sellRate');
const buyFeeInput = document.getElementById('buyFee');
const sellFeeInput = document.getElementById('sellFee');
const autoRateCheckbox = document.getElementById('autoRate');
const calculateBtn = document.getElementById('calculateBtn');
const resultsBox = document.querySelector('.results-box');

async function fetchExchangeRate(crypto, fiat) {
  try {
    const response = await fetch(`https://api.coingecko.com/api/v3/simple/price?ids=${crypto}&vs_currencies=${fiat}`);
    const data = await response.json();
    return data[crypto][fiat];
  } catch (error) {
    console.error('Ошибка при получении курса:', error);
    return null;
  }
}

function updateAutoRate() {
  if (autoRateCheckbox.checked) {
    const crypto = cryptoSelect.value;
    const fiat = fiatSelect.value;

    fetchExchangeRate(crypto, fiat).then(rate => {
      if (rate) {
        buyRateInput.value = rate;
        sellRateInput.value = rate;
      }
    });
  }
}

function calculateProfit() {
  const amount = parseFloat(amountInput.value);
  const buyRate = parseFloat(buyRateInput.value);
  const sellRate = parseFloat(sellRateInput.value);
  const buyFee = parseFloat(buyFeeInput.value) || 0;
  const sellFee = parseFloat(sellFeeInput.value) || 0;

  if (isNaN(amount) || isNaN(buyRate) || isNaN(sellRate)) {
    resultsBox.innerHTML = "<p>Пожалуйста, заполните все поля правильно.</p>";
    return;
  }

  const spent = amount * buyRate * (1 + buyFee / 100);
  const received = amount * sellRate * (1 - sellFee / 100);
  const spreadNoFee = ((sellRate - buyRate) / buyRate) * 100;
  const spreadWithFee = ((received - spent) / spent) * 100;
  const netProfit = received - spent;

  resultsBox.innerHTML = `
    <p id="buyRateResult">Курс покупки: <span>${buyRate.toFixed(2)}</span></p>
    <p id="sellRateResult">Курс продажи: <span>${sellRate.toFixed(2)}</span></p>
    <p id="spreadNoFee">Спред без комиссии: <span>${spreadNoFee.toFixed(2)}%</span></p>
    <p id="spreadWithFee">Спред с комиссией: <span>${spreadWithFee.toFixed(2)}%</span></p>
    <p id="spent">Потрачено: <span>${spent.toFixed(2)}</span></p>
    <p id="received">Получено: <span>${received.toFixed(2)}</span></p>
    <p id="netProfit">Чистая прибыль: <span>${netProfit.toFixed(2)}</span></p>
  `;
}

// Слушатели событий
cryptoSelect.addEventListener('change', updateAutoRate);
fiatSelect.addEventListener('change', updateAutoRate);
autoRateCheckbox.addEventListener('change', updateAutoRate);
calculateBtn.addEventListener('click', calculateProfit);

// === ПЕРЕВОД ===
const translations = {
  ru: {
    button: "Рассчитать",
    labels: [
      "Криптовалюта",
      "Фиат",
      "Сумма (в криптовалюте)",
      "Курс покупки",
      "Курс продажи",
      "Комиссия покупки (%)",
      "Комиссия продажи (%)",
      "Автоматический курс",
      "Реклама от Google",
      "Благодаря рекламе приложение остаётся бесплатным"
    ]
  },
  en: {
    button: "Calculate",
    labels: [
      "Cryptocurrency",
      "Fiat",
      "Amount (in crypto)",
      "Buy Rate",
      "Sell Rate",
      "Buy Fee (%)",
      "Sell Fee (%)",
      "Automatic Rate",
      "Google Ads",
      "Thanks to ads, the app stays free"
    ]
  }
};

let currentLang = "ru";

function applyLanguage(lang) {
  currentLang = lang;

  const labels = document.querySelectorAll(".form-group label");
  labels.forEach((label, index) => {
    if (translations[lang].labels[index]) {
      label.textContent = translations[lang].labels[index];
    }
  });

  // Кнопка "Рассчитать"
  const calcBtn = document.getElementById("calculateBtn");
  if (calcBtn) {
    calcBtn.textContent = translations[lang].button;
  }

  // Рекламный блок
  const adBanner = document.querySelector(".ad-banner");
  if (adBanner) {
    adBanner.innerHTML = `
      ${translations[lang].labels[8]}<br>
      <small>${translations[lang].labels[9]}</small>
    `;
  }
}

// Кнопка смены языка
document.addEventListener("DOMContentLoaded", () => {
  const langToggle = document.createElement("button");
  langToggle.textContent = "ENG";
  langToggle.style.position = "fixed";
  langToggle.style.top = "10px";
  langToggle.style.right = "10px";
  langToggle.style.zIndex = "9999";
  langToggle.style.padding = "5px 10px";
  document.body.appendChild(langToggle);

  langToggle.addEventListener("click", () => {
    currentLang = currentLang === "ru" ? "en" : "ru";
    langToggle.textContent = currentLang === "ru" ? "ENG" : "РУС";
    applyLanguage(currentLang);
  });
});
