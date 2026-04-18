//========================
//SELECT ELEMENTS
//========================
//INPUT FIELDS
const amount1 = document.getElementById('amount1');
const amount2 = document.getElementById('amount2');
const amount3 = document.getElementById('amount3');

//ALL KEYPAD BUTTONS
const buttons = document.querySelectorAll('.keypad button');

//TRACK ACTIVE INPUT
let activeInput = amount1;

//SWITCH ACTIVE INPUT WHEN USER CLICKS
[amount1, amount2, amount3].forEach(input => {
  input.addEventListener('click', () => {
    activeInput = input
  });
});

//================================
//KEYPAD INPUT LOGIC
//================================
buttons.forEach(button => {
  button.addEventListener('click', () => {
    const value = button.textContent;

    if (button.classList.contains('clear')){
      clearAll();
  } else if (button.classList.contains('delete')) {
    deleteLast();
  } else {
    appendValue(value);
  }
});
});

//APPEND VALUE
function appendValue(value) {
  if (activeInput.value === '0') {
    activeInput.value = value;
  } else {
    activeInput.value += value;
  }

  convertCurrency();
}

//DELETE FUNCTION
function deleteLast() {
  activeInput.value = activeInput.value.slice(0, -1);

  if (activeInput.value === '0') {
    activeInput.value = '0';
  }

  convertCurrency();
}

//CLEAR FUNCTION
function clearAll() {
  amount1.value = '0';
  amount2.value = '0';
  amount3.value = '0';
}

//================================
//GET CURRENCY CODES
//================================
function getCurrencies() {
  const currencies = document.querySelectorAll('.currency-select span');

  return [
    currencies[0].dataset.currency,
    currencies[1].dataset.currency,
    currencies[2].dataset.currency
  ];
}

//===================================
//FETCH EXCHANGE RATES (API)
//===================================
async function convertCurrency() {
  const [cur1, cur2, cur3] = getCurrencies();

  let baseValue = parseFloat(activeInput.value) || 0;

  try {
    const response = await
    fetch(`https://api.exchangerate-api.com/v4/latest/${cur1}`);

    const data = await response.json();

    let rate2 =data.rates[cur2];
    let rate3 = data.rates[cur3];

    if (activeInput === amount1) {
      amount2.value = (baseValue * rate2).toFixed(2);
      amount3.value =(baseValue * rate3).toFixed(2);

    } else if (activeInput === amount2) {
      const response2 =await
      fetch(`https://api.exchangerate-api.com/v4/latest/${cur2}`);
      const data2 = await response2.json();

      amount1.value = (baseValue * data2.rates[cur1]).toFixed(2);
      amount3.value = (baseValue * data2.rates[cur3]).toFixed(2);

    } else if (activeInput === amount3) {
      const response3 =await
      fetch(`https://api.exchangerate-api.com/v4/latest/${cur3}`);
      const data3 = await response3.json();

      amount1.value = (baseValue * data3.rates[cur1]).toFixed(2);
      amount2.value = (baseValue * data3.rates[cur2]).toFixed(2);
    }
  } catch (error) {
    console.log('Error fetching rates', error);
  }
}

//BACK BUTTON FUNCTION
document.querySelector('.back-btn').addEventListener('click', () => {
  window.history.back();
});