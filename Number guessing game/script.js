let secretNumber;
let maxRange = 100;
let guessCount = 0;
let playerName = "";

const playerNameInput = document.getElementById("playerName");
const guessInput = document.getElementById("guessInput");
const submitButton = document.getElementById("submitGuess");
const feedback = document.getElementById("feedback");
const playAgainButton = document.getElementById("playAgain");
const difficultySelect = document.getElementById("difficulty");
const rangeText = document.getElementById("rangeText");
const leaderboardList = document.getElementById("leaderboard");
const clearButton = document.getElementById("clearLeaderboard");



// 🎮 Start or reset the game
function startGame() {
    maxRange = Number(difficultySelect.value);
    secretNumber = Math.floor(Math.random() * maxRange) + 1;
    guessCount = 0;
    playerName = playerNameInput.value.trim() || "Player";

    rangeText.innerHTML = `I'm thinking of a number between <strong>1 and ${maxRange}</strong>.`;
    feedback.textContent = "";
    guessInput.value = "";
    guessInput.disabled = false;
    submitButton.disabled = false;
    playAgainButton.style.display = "none";
    guessInput.focus();
}

// ✅ Check the user's guess
function checkGuess() {
    const guess = Number(guessInput.value);
    if (!guess || guess < 1 || guess > maxRange) {
        feedback.textContent = `⛔ Enter a number between 1 and ${maxRange}.`;
        return;
    }

    guessCount++;

    if (guess < secretNumber) {
        feedback.textContent = "📉 Too low. Try again!";
    } else if (guess > secretNumber) {
        feedback.textContent = "📈 Too high. Try again!";
    } else {
        feedback.innerHTML = `🎉 Congratulations, <strong>${playerName}</strong>!<br>You guessed it in <strong>${guessCount}</strong> tries.`;
        guessInput.disabled = true;
        submitButton.disabled = true;
        playAgainButton.style.display = "inline-block";

        saveScore(playerName, guessCount);
        renderLeaderboard();
    }

    guessInput.value = "";
    guessInput.focus();
}

// 💾 Save score to localStorage
function saveScore(name, score) {
    const scores = JSON.parse(localStorage.getItem("leaderboard")) || [];
    scores.push({ name, score });
    localStorage.setItem("leaderboard", JSON.stringify(scores));
}

// 📋 Display leaderboard
function renderLeaderboard() {
    const scores = JSON.parse(localStorage.getItem("leaderboard")) || [];
    leaderboardList.innerHTML = "";

    scores
        .sort((a, b) => a.score - b.score) // fewest guesses first
        .forEach(entry => {
            const li = document.createElement("li");
            li.textContent = `${entry.name} – ${entry.score} guesses`;
            leaderboardList.appendChild(li);
        });
}


function clearLeaderboard() {
    localStorage.removeItem("leaderboard");
    leaderboardList.innerHTML = "";
}


// 🔁 Event listeners
submitButton.addEventListener("click", checkGuess);
playAgainButton.addEventListener("click", startGame);
difficultySelect.addEventListener("change", startGame);
clearButton.addEventListener("click", clearLeaderboard);

// 🚀 Initialize game
startGame();
renderLeaderboard();
