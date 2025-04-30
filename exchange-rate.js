
document.addEventListener("DOMContentLoaded", () => {
  const cryptoSelect = document.getElementById("crypto");
  const fiatSelect = document.getElementById("fiat");
  const autoRateCheckbox = document.getElementById("autoRate");
  const buyRateInput = document.getElementById("buyRate");
  const sellRateInput = document.getElementById("sellRate");

  const API_URL = "https://api.coingecko.com/api/v3/simple/price";

  const getPrice = async () => {
    const crypto = cryptoSelect.value;
    const fiat = fiatSelect.value;
    const url = `${API_URL}?ids=${crypto}&vs_currencies=${fiat}`;

    try {
      const response = await fetch(url);
      const data = await response.json();
      return data[crypto][fiat];
    } catch (error) {
      console.error("Ошибка при получении курса:", error);
      return null;
    }
  };

  autoRateCheckbox.addEventListener("change", async () => {
    if (autoRateCheckbox.checked) {
      const rate = await getPrice();
      if (rate !== null) {
        buyRateInput.value = rate;
        sellRateInput.value = rate;
      }
    }
  });
});
