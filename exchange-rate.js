const cryptoSelect = document.getElementById('crypto');
const fiatSelect = document.getElementById('fiat');
const amountInput = document.getElementById('amount');
const buyRateInput = document.getElementById('buyRate');
const sellRateInput = document.getElementById('sellRate');
const buyFeeInput = document.getElementById('buyFee');
const sellFeeInput = document.getElementById('sellFee');
const autoRateCheckbox = document.getElementById('autoRate');
const calculateBtn = document.querySelector('button');
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
    <p>Курс покупки: <span>${buyRate.toFixed(2)}</span></p>
    <p>Курс продажи: <span>${sellRate.toFixed(2)}</span></p>
    <p>Спред без комиссии: <span>${spreadNoFee.toFixed(2)}%</span></p>
    <p>Спред с комиссией: <span>${spreadWithFee.toFixed(2)}%</span></p>
    <p>Потрачено: <span>${spent.toFixed(2)}</span></p>
    <p>Получено: <span>${received.toFixed(2)}</span></p>
    <p>Чистая прибыль: <span>${netProfit.toFixed(2)}</span></p>
  `;
}

// Обновляем курс при изменении крипты, фиата, чекбокса
cryptoSelect.addEventListener('change', updateAutoRate);
fiatSelect.addEventListener('change', updateAutoRate);
autoRateCheckbox.addEventListener('change', updateAutoRate);

// Кнопка расчета
calculateBtn.addEventListener('click', calculateProfit);
// Перевод интерфейса (ENG / RU)
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

  const labels = document.querySelectorAll("label");
  labels.forEach((label, index) => {
    if (translations[lang].labels[index]) {
      label.textContent = translations[lang].labels[index];
    }
  });

  // Перевод кнопки
  const calcBtn = document.querySelector("button");
  if (calcBtn) {
    calcBtn.textContent = translations[lang].button;
  }

  // Перевод рекламы (если есть)
  const adBanner = document.querySelector(".ad-banner");
  if (adBanner) {
    const [main, sub] = adBanner.querySelectorAll("small, br");
    adBanner.innerHTML = `<div>${translations[lang].labels[8]}<br><small>${translations[lang].labels[9]}</small></div>`;
  }
}

// Пример использования — можешь повесить на кнопку:
document.addEventListener("DOMContentLoaded", () => {
  const langToggle = document.createElement("button");
  langToggle.textContent = "ENG";
  langToggle.style.position = "fixed";
  langToggle.style.top = "10px";
  langToggle.style.right = "10px";
  langToggle.style.zIndex = "1000";
  document.body.appendChild(langToggle);

  langToggle.addEventListener("click", () => {
    currentLang = currentLang === "ru" ? "en" : "ru";
    langToggle.textContent = currentLang === "ru" ? "ENG" : "РУС";
    applyLanguage(currentLang);
  });
});
