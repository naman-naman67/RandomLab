
const minimumInput = document.getElementById("minimum");
const maximumInput = document.getElementById("maximum");
const generateButton = document.getElementById("generate");
const copyButton = document.getElementById("copy");
const clearButton = document.getElementById("clear-history");
const resultOutput = document.getElementById("result");
const historyList = document.getElementById("history");
const message = document.getElementById("message");

let currentNumber = null;
let history = [];

generateButton.addEventListener("click", generateNumber);

function generateNumber() {
    const minText = minimumInput.value.trim();
    const maxText = maximumInput.value.trim();

    const min = Number(minText);
    const max = Number(maxText);

    if (minText === "" || maxText === "") {
        showError("Please enter both numbers.");
        return;
    }

    if (!Number.isSafeInteger(min) || !Number.isSafeInteger(max)) {
        showError("Please enter valid whole numbers.");
        return;
    }

    if (min > max) {
        showError("Minimum must not exceed maximum.");
        return;
    }

    message.textContent = "";

    // Generate an inclusive random integer.
    currentNumber = Math.floor(
        Math.random() * (max - min + 1)
    ) + min;

    resultOutput.textContent = currentNumber;
    copyButton.disabled = false;

    history.unshift({
        number: currentNumber,
        min: min,
        max: max
    });

    // Keep only the latest 10 results.
    history = history.slice(0, 10);

    renderHistory();
}

function showError(text) {
    message.textContent = text;
}

function renderHistory() {
    historyList.replaceChildren();

    if (history.length === 0) {
        const item = document.createElement("li");
        item.className = "empty-state";
        item.textContent = "Your results will appear here.";
        historyList.appendChild(item);
        return;
    }

    history.forEach((entry, index) => {
        const item = document.createElement("li");

        const number = document.createElement("span");
        number.className = "history-number";
        number.textContent = `#${history.length - index}  ${entry.number}`;

        const range = document.createElement("span");
        range.className = "history-range";
        range.textContent = `${entry.min} to ${entry.max}`;

        item.append(number, range);
        historyList.appendChild(item);
    });
}

copyButton.addEventListener("click", async () => {
    if (currentNumber === null) return;

    try {
        await navigator.clipboard.writeText(String(currentNumber));
        message.style.color = "#16803d";
        showError("Result copied to clipboard!");
    } catch {
        message.style.color = "#b42318";
        showError("Copy unavailable. Please copy the number manually.");
    }
});

clearButton.addEventListener("click", () => {
    history = [];
    renderHistory();
});

minimumInput.addEventListener("input", resetMessage);
maximumInput.addEventListener("input", resetMessage);

function resetMessage() {
    message.textContent = "";
    message.style.color = "";
}
