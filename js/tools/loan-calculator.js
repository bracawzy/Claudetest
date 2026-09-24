/**
 * Wires the loan calculator form on tools/loan-calculator.html to the
 * pure math in js/lib/loan.js.
 */
import { calculateLoan } from "../lib/loan.js";
import { formatCurrency } from "../lib/format.js";

const form = document.getElementById("loan-form");
const results = document.getElementById("loan-results");
const error = document.getElementById("loan-error");

const output = {
  monthlyPayment: document.getElementById("loan-monthly"),
  totalPaid: document.getElementById("loan-total"),
  totalInterest: document.getElementById("loan-interest"),
};

function update() {
  const data = new FormData(form);

  try {
    const result = calculateLoan(
      Number(data.get("principal")),
      Number(data.get("rate")),
      Number(data.get("years")),
    );
    for (const [key, el] of Object.entries(output)) {
      el.textContent = formatCurrency(result[key]);
    }
    results.hidden = false;
    error.hidden = true;
  } catch (err) {
    results.hidden = true;
    error.textContent = err.message;
    error.hidden = false;
  }
}

form.addEventListener("input", update);
form.addEventListener("submit", (event) => event.preventDefault());
update();
