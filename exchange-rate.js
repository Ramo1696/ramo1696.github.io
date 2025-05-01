window.addEventListener("load", () => {
  const splash = document.getElementById("splash-screen");
  const container = document.getElementById("container");

  setTimeout(() => {
    splash.style.opacity = 0;
    setTimeout(() => {
      splash.style.display = "none";
      container.style.display = "block";
    }, 500);
  }, 2000);

  document.getElementById("calculate").addEventListener("click", () => {
    const amount = parseFloat(document.getElementById("amount").value);
    const buyRate = parseFloat(document.getElementById("buyRate").value);
    const sellRate = parseFloat(document.getElementById("sellRate").value);
    const buyFee = parseFloat(document.getElementById("buyFee").value || 0);
    const sellFee = parseFloat(document.getElementById("sellFee").value || 0);

    if (isNaN(amount) || isNaN(buyRate) || isNaN(sellRate)) return;

    const buyTotal = amount * buyRate * (1 + buyFee / 100);
    const sellTotal = amount * sellRate * (1 - sellFee / 100);
    const profit = sellTotal - buyTotal;

    document.getElementById("result").innerHTML = `
      <p>Потрачено: ${buyTotal.toFixed(2)}</p>
      <p>Получено: ${sellTotal.toFixed(2)}</p>
      <p>Чистая прибыль: ${profit.toFixed(2)}</p>
    `;
  });
});
