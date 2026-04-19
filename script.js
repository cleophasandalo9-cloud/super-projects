// ================= GLOBAL STATE =================
let baseCurrency = "USD";
let amount = "1";
let rates = {};

// ================= ELEMENTS =================
const usdValue = document.getElementById("usdValue");
const eurValue = document.getElementById("eurValue");
const kesValue = document.getElementById("kesValue");

const buttons = document.querySelectorAll(".keys button");
const acBtn = document.querySelector(".ac");
const backspaceBtn = document.querySelector(".backspace");

const updateTime = document.getElementById("updateTime");
const toast = document.getElementById("toast");


// ================= FETCH EXCHANGE RATES =================
async function fetchRates() {
  try {
    const response = await fetch(`https://open.er-api.com/v6/latest/${baseCurrency}`);
    const data = await response.json();

    rates = data.rates;

    updateConversions();
    updateTimestamp();

  } catch (error) {
    console.error("Error fetching rates:", error);
  }
}


// ================= UPDATE CONVERSIONS =================
function updateConversions() {
  const numAmount = parseFloat(amount) || 0;

  usdValue.textContent = (numAmount * (baseCurrency === "USD" ? 1 : 1 / rates[baseCurrency])).toFixed(2);
  eurValue.textContent = (numAmount * rates["EUR"]).toFixed(2);
  kesValue.textContent = (numAmount * rates["KES"]).toFixed(2);
}


// ================= UPDATE TIME =================
function updateTimestamp() {
  const now = new Date();
  updateTime.textContent = `xCurrency • Last updated: ${now.toLocaleString()}`;
}


// ================= INPUT HANDLING =================
buttons.forEach(btn => {
  btn.addEventListener("click", () => {
    const value = btn.textContent;

    // Prevent multiple dots
    if (value === "." && amount.includes(".")) return;

    // Limit length (optional safety)
    if (amount.length > 10) return;

    // Replace initial 0
    if (amount === "0") {
      amount = value;
    } else {
      amount += value;
    }

    updateMainDisplay();
    updateConversions();
  });
});


// ================= AC BUTTON =================
acBtn.addEventListener("click", () => {
  amount = "0";
  updateMainDisplay();
  updateConversions();
});


// ================= BACKSPACE =================
backspaceBtn.addEventListener("click", () => {
  amount = amount.slice(0, -1);

  if (amount === "") amount = "0";

  updateMainDisplay();
  updateConversions();
});


// ================= UPDATE MAIN DISPLAY =================
function updateMainDisplay() {
  usdValue.textContent = amount;
}


// ================= MENU (UPDATE RATES) =================
const updateRatesBtn = document.getElementById("updateRates");

updateRatesBtn.addEventListener("click", () => {
  fetchRates();

  // Show toast
  toast.style.display = "block";

  setTimeout(() => {
    toast.style.display = "none";
  }, 2000);
});


// ================= INITIAL LOAD =================
fetchRates();