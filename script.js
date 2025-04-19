const ROWS = 3;
const COLS = 3;

const SYMBOLS_COUNT = {
    A: 2,
    B: 4,
    C: 6,
    D: 8
};

const SYMBOLS_VALUES = {
    A: 5,
    B: 4,
    C: 3,
    D: 2
};

let balance = 0;

function deposit() {
    const depositAmount = parseFloat(document.getElementById("deposit").value);
    if (isNaN(depositAmount) || depositAmount <= 0) {
        showMessage("Invalid deposit amount.");
        return;
    }
    balance += depositAmount;
    updateBalance();
    showMessage("Deposit successful!");
}

function updateBalance() {
    document.getElementById("balance").innerText = balance.toFixed(2);
}

function spin() {
    const symbols = [];
    for (const [symbol, count] of Object.entries(SYMBOLS_COUNT)) {
        for (let i = 0; i < count; i++) {
            symbols.push(symbol);
        }
    }

    const reels = [[], [], []];
    for (let i = 0; i < COLS; i++) {
        const reelSymbols = [...symbols];
        for (let j = 0; j < ROWS; j++) {
            const randomIndex = Math.floor(Math.random() * reelSymbols.length);
            const selectedSymbol = reelSymbols[randomIndex];
            reels[i].push(selectedSymbol);
            reelSymbols.splice(randomIndex, 1);
        }
    }
    return reels;
}

function transpose(reels) {
    const rows = [];
    for (let i = 0; i < ROWS; i++) {
        rows.push([]);
        for (let j = 0; j < COLS; j++) {
            rows[i].push(reels[j][i]);
        }
    }
    return rows;
}

function displayRows(rows) {
    const slotOutput = document.getElementById("slot-output");
    slotOutput.innerHTML = "";
    for (const row of rows) {
        slotOutput.innerHTML += `<div>${row.join(" | ")}</div>`;
    }
}

function getWinnings(rows, bet, lines) {
    let winnings = 0;
    for (let i = 0; i < lines; i++) {
        const symbols = rows[i];
        const allSame = symbols.every(symbol => symbol === symbols[0]);
        if (allSame) {
            winnings += bet * SYMBOLS_VALUES[symbols[0]];
        }
    }
    return winnings;
}

function play() {
    const lines = parseInt(document.getElementById("lines").value);
    const bet = parseFloat(document.getElementById("bet").value);

    if (isNaN(lines) || lines < 1 || lines > 3) {
        showMessage("Invalid number of lines.");
        return;
    }

    if (isNaN(bet) || bet <= 0 || bet * lines > balance) {
        showMessage("Invalid bet or insufficient balance.");
        return;
    }

    balance -= bet * lines;

    const reels = spin();
    const rows = transpose(reels);
    displayRows(rows);

    const winnings = getWinnings(rows, bet, lines);
    balance += winnings;

    updateBalance();

    if (winnings > 0) {
        showMessage(`You won $${winnings.toFixed(2)}!`);
    } else {
        showMessage("No win this time. Try again!");
    }

    if (balance <= 0) {
        showMessage("You ran out of money. Reload to play again.");
    }
}

function showMessage(msg) {
    document.getElementById("message").innerText = msg;
}
