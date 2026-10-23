const display = document.getElementById('display');
let currentInput = '0';
let firstValue = null;
let operator = null;
let waitingForSecondValue = false;

function updateDisplay() {
  display.textContent = currentInput;
}

function inputNumber(value) {
  if (waitingForSecondValue) {
    currentInput = value;
    waitingForSecondValue = false;
  } else {
    currentInput = currentInput === '0' ? value : currentInput + value;
  }
  updateDisplay();
}

function inputDecimal() {
  if (waitingForSecondValue) {
    currentInput = '0.';
    waitingForSecondValue = false;
    updateDisplay();
    return;
  }

  if (!currentInput.includes('.')) {
    currentInput += '.';
    updateDisplay();
  }
}

function chooseOperator(nextOperator) {
  const inputValue = parseFloat(currentInput);

  if (firstValue === null) {
    firstValue = inputValue;
  } else if (operator) {
    const result = calculate(firstValue, inputValue, operator);
    currentInput = `${parseFloat(result.toFixed(12))}`;
    firstValue = result;
  }

  waitingForSecondValue = true;
  operator = nextOperator;
  updateDisplay();
}

function calculate(first, second, op) {
  switch (op) {
    case '+':
      return first + second;
    case '-':
      return first - second;
    case '*':
      return first * second;
    case '/':
      return second === 0 ? 'Error' : first / second;
    case '%':
      return (first * second) / 100;
    default:
      return second;
  }
}

function performEquals() {
  if (operator === null || waitingForSecondValue) return;

  const inputValue = parseFloat(currentInput);
  const result = calculate(firstValue, inputValue, operator);

  if (result === 'Error') {
    currentInput = 'Error';
    firstValue = null;
    operator = null;
    waitingForSecondValue = false;
  } else {
    currentInput = `${parseFloat(result.toFixed(12))}`;
    firstValue = null;
    operator = null;
    waitingForSecondValue = false;
  }

  updateDisplay();
}

function clearDisplay() {
  currentInput = '0';
  firstValue = null;
  operator = null;
  waitingForSecondValue = false;
  updateDisplay();
}

function deleteLast() {
  if (waitingForSecondValue) return;

  currentInput = currentInput.length > 1 ? currentInput.slice(0, -1) : '0';
  updateDisplay();
}

function handlePercent() {
  const value = parseFloat(currentInput);
  currentInput = `${value / 100}`;
  updateDisplay();
}

document.querySelectorAll('.number').forEach((button) => {
  button.addEventListener('click', () => {
    const value = button.dataset.value;
    if (value === '.') {
      inputDecimal();
    } else {
      inputNumber(value);
    }
  });
});

document.querySelectorAll('.operator').forEach((button) => {
  button.addEventListener('click', () => {
    chooseOperator(button.dataset.value);
  });
});

document.querySelector('[data-action="equals"]').addEventListener('click', performEquals);
document.querySelector('[data-action="clear"]').addEventListener('click', clearDisplay);
document.querySelector('[data-action="delete"]').addEventListener('click', deleteLast);
document.querySelector('[data-action="percent"]').addEventListener('click', handlePercent);

updateDisplay();
