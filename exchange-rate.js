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
// Перевод интерфейса (RU / EN)
const translations = {
  ru: {
    labels: [
      "Криптовалюта",
      "Фиат",
      "Сумма (в криптовалюте)",
      "Курс покупки",
      "Курс продажи",
      "Комиссия покупки (%)",
      "Комиссия продажи (%)",
      "Автоматический курс"
    ],
    button: "Рассчитать",
    ad: "Реклама от Google<br><small>Благодаря рекламе приложение остаётся бесплатным</small>"
  },
  en: {
    labels: [
      "Cryptocurrency",
      "Fiat",
      "Amount (in crypto)",
      "Buy Rate",
      "Sell Rate",
      "Buy Fee (%)",
      "Sell Fee (%)",
      "Automatic Rate"
    ],
    button: "Calculate",
    ad: "Google Ads<br><small>Thanks to ads, the app stays free</small>"
  }
};

let currentLang = "ru";

function applyLanguage(lang) {
  currentLang = lang;
  const labelElements = document.querySelectorAll("label");
  translations[lang].labels.forEach((text, index) => {
    if (labelElements[index]) labelElements[index].textContent = text;
  });

  // Автокурс — отдельный checkbox внутри label
  if (labelElements[7]) {
    labelElements[7].innerHTML = `<input type="checkbox" id="autoRate"> ${translations[lang].labels[7]}`;
  }

  // Кнопка
  const btn = document.querySelector("button");
  if (btn) btn.textContent = translations[lang].button;

  // Реклама
  const ad = document.querySelector(".ad-banner");
  if (ad) ad.innerHTML = translations[lang].ad;
}

// Создание кнопки переключения языка
document.addEventListener("DOMContentLoaded", () => {
  const langToggle = document.createElement("button");
  langToggle.textContent = "ENG";
  langToggle.style.position = "fixed";
  langToggle.style.top = "10px";
  langToggle.style.right = "10px";
  langToggle.style.zIndex = "1000";
  langToggle.style.padding = "6px 10px";
  langToggle.style.border = "none";
  langToggle.style.background = "#444";
  langToggle.style.color = "#fff";
  langToggle.style.cursor = "pointer";
  document.body.appendChild(langToggle);

  langToggle.addEventListener("click", () => {
    currentLang = currentLang === "ru" ? "en" : "ru";
    langToggle.textContent = currentLang === "ru" ? "ENG" : "РУС";
    applyLanguage(currentLang);
  });

  applyLanguage(currentLang); // начальный перевод
});
