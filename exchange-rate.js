const cryptoSelect = document.getElementById('crypto');
const fiatSelect = document.getElementById('fiat');
const amountInput = document.getElementById('amount');
const buyRateInput = document.getElementById('buyRate');
const sellRateInput = document.getElementById('sellRate');
const buyFeeInput = document.getElementById('buyFee');
const sellFeeInput = document.getElementById('sellFee');
let autoRateCheckbox = document.getElementById('autoRate');
const calculateBtn = document.getElementsByTagName('button')[1];
const resultsBox = document.querySelector('.results-box');

const translations = {
  ru: {
    buyRate: "Курс покупки:",
    sellRate: "Курс продажи:",
    spreadNoFee: "Спред без комиссии:",
    spreadWithFee: "Спред с комиссией:",
    spent: "Потрачено:",
    received: "Получено:",
    netProfit: "Чистая прибыль:",
    error: "Пожалуйста, заполните все поля правильно.",
    crypto: "Криптовалюта",
    fiat: "Фиат",
    amount: "Сумма (в криптовалюте)",
    buy: "Курс покупки",
    sell: "Курс продажи",
    buyFee: "Комиссия покупки (%)",
    sellFee: "Комиссия продажи (%)",
    auto: "Автоматический курс",
    calculate: "Рассчитать"
  },
  en: {
    buyRate: "Buy Rate:",
    sellRate: "Sell Rate:",
    spreadNoFee: "Spread (no fee):",
    spreadWithFee: "Spread (with fee):",
    spent: "Spent:",
    received: "Received:",
    netProfit: "Net Profit:",
    error: "Please fill in all fields correctly.",
    crypto: "Cryptocurrency",
    fiat: "Fiat",
    amount: "Amount (in crypto)",
    buy: "Buy Rate",
    sell: "Sell Rate",
    buyFee: "Buy Fee (%)",
    sellFee: "Sell Fee (%)",
    auto: "Auto Rate",
    calculate: "Calculate"
  }
};

let currentLang = "ru";

function switchLanguage() {
  currentLang = currentLang === "ru" ? "en" : "ru";
  document.getElementById("language-toggle").textContent = currentLang === "ru" ? "EN" : "RU";
  updateLanguage();
}

function updateLanguage() {
  const t = translations[currentLang];
  const labels = document.getElementsByTagName("label");

  labels[0].textContent = t.crypto;
  labels[1].textContent = t.fiat;
  labels[2].textContent = t.amount;
  labels[3].textContent = t.buy;
  labels[4].textContent = t.sell;
  labels[5].textContent = t.buyFee;
  labels[6].textContent = t.sellFee;
  labels[7].innerHTML = `<input type="checkbox" id="autoRate" /> ${t.auto}`;

  document.getElementsByTagName("button")[1].textContent = t.calculate;
}

async function fetchExchangeRate(crypto, fiat) {
  try {
    const response = await fetch(`https://api.coingecko.com/api/v3/simple/price?ids=${crypto}&vs_currencies=${fiat}&include_24hr_change=true`);
    const data = await response.json();
    return {
      rate: data[crypto][fiat],
      change: data[crypto][`${fiat}_24h_change`]
    };
  } catch (error) {
    console.error('Ошибка при получении курса:', error);
    return null;
  }
}

function updateAutoRate() {
  if (document.getElementById('autoRate').checked) {
    const crypto = cryptoSelect.value;
    const fiat = fiatSelect.value;

    fetchExchangeRate(crypto, fiat).then(data => {
      if (data) {
        buyRateInput.value = data.rate;
        sellRateInput.value = data.rate;

        const changeElement = document.getElementById("changeIndicator");
        if (changeElement) {
          changeElement.innerHTML = `Изменение за 24ч: <strong>${data.change.toFixed(2)}%</strong>`;
        }
      }
    });
  }
}

function calculateProfit() {
  const t = translations[currentLang];
  const amount = parseFloat(amountInput.value);
  const buyRate = parseFloat(buyRateInput.value);
  const sellRate = parseFloat(sellRateInput.value);
  const buyFee = parseFloat(buyFeeInput.value) || 0;
  const sellFee = parseFloat(sellFeeInput.value) || 0;

  if (isNaN(amount) || isNaN(buyRate) || isNaN(sellRate)) {
    resultsBox.innerHTML = `<p style='color: red;'>${t.error}</p>`;
    return;
  }

  const spent = amount * buyRate * (1 + buyFee / 100);
  const received = amount * sellRate * (1 - sellFee / 100);
  const spreadNoFee = ((sellRate - buyRate) / buyRate) * 100;
  const spreadWithFee = ((received - spent) / spent) * 100;
  const netProfit = received - spent;

  resultsBox.innerHTML = `
    <p>${t.buyRate} <span>${buyRate.toFixed(2)}</span></p>
    <p>${t.sellRate} <span>${sellRate.toFixed(2)}</span></p>
    <p>${t.spreadNoFee} <span>${spreadNoFee.toFixed(2)}%</span></p>
    <p>${t.spreadWithFee} <span>${spreadWithFee.toFixed(2)}%</span></p>
    <p>${t.spent} <span>${spent.toFixed(2)}</span></p>
    <p>${t.received} <span>${received.toFixed(2)}</span></p>
    <p>${t.netProfit} <span>${netProfit.toFixed(2)}</span></p>
  `;
}

function populateDropdowns() {
  const cryptos = [
    { id: 'tether', name: 'USDT' },
    { id: 'usd-coin', name: 'USDC' },
    { id: 'bitcoin', name: 'BTC' },
    { id: 'ethereum', name: 'ETH' },
    { id: 'the-open-network', name: 'TON' }
  ];

  const fiats = [
    { id: 'usd', name: 'USD' },
    { id: 'eur', name: 'EUR' },
    { id: 'rub', name: 'RUB' },
    { id: 'gel', name: 'GEL' },
    { id: 'ngn', name: 'NGN' },
    { id: 'try', name: 'TRY' }
  ];

  cryptos.forEach(crypto => {
    const option = document.createElement("option");
    option.value = crypto.id;
    option.text = crypto.name;
    cryptoSelect.appendChild(option);
  });

  fiats.forEach(fiat => {
    const option = document.createElement("option");
    option.value = fiat.id;
    option.text = fiat.name;
    fiatSelect.appendChild(option);
  });

  cryptoSelect.value = 'tether';
  fiatSelect.value = 'gel';
}

document.addEventListener("DOMContentLoaded", () => {
  populateDropdowns();
  updateLanguage();
  updateAutoRate();

  cryptoSelect.addEventListener('change', updateAutoRate);
  fiatSelect.addEventListener('change', updateAutoRate);

  document.body.addEventListener('change', (e) => {
    if (e.target.id === 'autoRate') {
      autoRateCheckbox = document.getElementById('autoRate');
      updateAutoRate();
    }
  });

  calculateBtn.addEventListener('click', calculateProfit);
});
