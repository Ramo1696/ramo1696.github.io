// Смена темы
const savedTheme = localStorage.getItem("theme") || "dark";
document.body.classList.add(savedTheme + "-theme");

document.getElementById("themeToggle").onclick = () => {
  const isDark = document.body.classList.contains("dark-theme");
  document.body.classList.toggle("dark-theme", !isDark);
  document.body.classList.toggle("light-theme", isDark);
  localStorage.setItem("theme", isDark ? "light" : "dark");
};

// Смена языка
let savedLang = localStorage.getItem("lang") || "ru";
applyLanguage(savedLang);

document.getElementById("langToggle").onclick = () => {
  savedLang = savedLang === "ru" ? "en" : "ru";
  localStorage.setItem("lang", savedLang);
  applyLanguage(savedLang);
};

function applyLanguage(lang) {
  const translations = {
    ru: {
      crypto: "Криптовалюта",
      fiat: "Фиат",
      sum: "Сумма (в криптовалюте)",
      buyRate: "Курс покупки",
      sellRate: "Курс продажи",
      buyFee: "Комиссия покупки (%)",
      sellFee: "Комиссия продажи (%)",
      autoRate: "Автоматический курс",
      calculate: "Рассчитать"
    },
    en: {
      crypto: "Cryptocurrency",
      fiat: "Fiat",
      sum: "Amount (in crypto)",
      buyRate: "Buy rate",
      sellRate: "Sell rate",
      buyFee: "Buy fee (%)",
      sellFee: "Sell fee (%)",
      autoRate: "Automatic rate",
      calculate: "Calculate"
    }
  };

  document.getElementById("crypto").textContent = translations[lang].crypto;
  document.getElementById("fiat").textContent = translations[lang].fiat;
  document.getElementById("sum").textContent = translations[lang].sum;
  document.getElementById("buyRate").textContent = translations[lang].buyRate;
  document.getElementById("sellRate").textContent = translations[lang].sellRate;
  document.getElementById("buyFee").textContent = translations[lang].buyFee;
  document.getElementById("sellFee").textContent = translations[lang].sellFee;
  document.getElementById("autoRateText").textContent = translations[lang].autoRate;
  document.getElementById("calculate").textContent = translations[lang].calculate;
  document.getElementById("langToggle").textContent = lang === "ru" ? "Eng" : "Рус";
}
