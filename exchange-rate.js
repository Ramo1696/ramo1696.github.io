document.getElementById("themeToggle").addEventListener("click", () => {
  document.body.classList.toggle("light");
  document.body.classList.toggle("dark");
});

const langToggle = document.getElementById("langToggle");
const translations = {
  ru: {
    Eng: "Eng",
    h1: "P2P Profit",
    crypto: "Криптовалюта",
    fiat: "Фиат",
    amount: "Сумма (в криптовалюте)",
    buy: "Курс покупки",
    sell: "Курс продажи",
    buyFee: "Комиссия покупки (%)",
    sellFee: "Комиссия продажи (%)",
    auto: "Автоматический курс",
    calc: "Рассчитать",
    ad: "Реклама от Google<br>Благодаря рекламе приложение остаётся бесплатным"
  },
  en: {
    Eng: "Рус",
    h1: "P2P Profit",
    crypto: "Cryptocurrency",
    fiat: "Fiat",
    amount: "Amount (in crypto)",
    buy: "Buy Rate",
    sell: "Sell Rate",
    buyFee: "Buy Fee (%)",
    sellFee: "Sell Fee (%)",
    auto: "Automatic Rate",
    calc: "Calculate",
    ad: "Google Ads<br>This app stays free thanks to advertising"
  }
};

let currentLang = "ru";

langToggle.addEventListener("click", () => {
  currentLang = currentLang === "ru" ? "en" : "ru";
  updateLang();
});

function updateLang() {
  const t = translations[currentLang];
  document.getElementById("label-crypto").textContent = t.crypto;
  document.getElementById("label-fiat").textContent = t.fiat;
  document.getElementById("label-amount").textContent = t.amount;
  document.getElementById("label-buy").textContent = t.buy;
  document.getElementById("label-sell").textContent = t.sell;
  document.getElementById("label-buy-fee").textContent = t.buyFee;
  document.getElementById("label-sell-fee").textContent = t.sellFee;
  document.getElementById("label-auto").textContent = t.auto;
  document.getElementById("calculate").textContent = t.calc;
  document.getElementById("ad").innerHTML = t.ad;
  langToggle.textContent = t.Eng;
}
