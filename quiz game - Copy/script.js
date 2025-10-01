let allQuestions = [];
let quizQuestions = [];
let current = 0;
let score = 0;

const setupBox = document.getElementById("setup-box");
const quizBox = document.getElementById("quiz-box");
const scoreBox = document.getElementById("score-box");
const leaderboardBox = document.getElementById("leaderboard-box");

const questionEl = document.getElementById("question");
const choicesEl = document.getElementById("choices");
const feedbackEl = document.getElementById("feedback");
const submitBtn = document.getElementById("submit-btn");
const startBtn = document.getElementById("start-btn");
const restartBtn = document.getElementById("restart-btn");
const saveScoreBtn = document.getElementById("save-score-btn");
const resetLeaderboardBtn = document.getElementById("reset-leaderboard-btn");

const scoreEl = document.getElementById("score");
const usernameInput = document.getElementById("username");
const leaderboardEl = document.getElementById("leaderboard");

startBtn.addEventListener("click", startQuiz);
submitBtn.addEventListener("click", checkAnswer);
restartBtn.addEventListener("click", resetQuiz);
saveScoreBtn.addEventListener("click", saveScore);
resetLeaderboardBtn.addEventListener("click", resetLeaderboard);

async function loadQuestions() {
    const res = await fetch("chemistry_questions.json");
    const data = await res.json();
    allQuestions = data.questions;
    renderLeaderboard();
}

function startQuiz() {
    const count = parseInt(document.getElementById("question-count").value);
    const selectedCategory = document.getElementById("category-select").value;

    let filtered = selectedCategory === "All"
        ? [...allQuestions]
        : allQuestions.filter(q => q.category === selectedCategory);

    // If not enough questions in selected category, fill from others
    if (filtered.length < count) {
        const extras = allQuestions
            .filter(q => selectedCategory === "All" || q.category !== selectedCategory)
            .filter(q => !filtered.includes(q)); // avoid duplicates

        const needed = count - filtered.length;
        const filler = shuffle(extras).slice(0, needed);
        filtered = [...filtered, ...filler];
    }

    quizQuestions = shuffle(filtered).slice(0, count);
    current = 0;
    score = 0;

    setupBox.classList.add("hidden");
    quizBox.classList.remove("hidden");
    loadQuestion();
}



function loadQuestion() {
    const q = quizQuestions[current];
    questionEl.innerHTML = `<strong>Category:</strong> ${q.category}<br>Q${current + 1}: ${q.question}`;
    choicesEl.innerHTML = "";
    feedbackEl.textContent = "";

    q.options.forEach((opt, i) => {
        const li = document.createElement("li");
        li.innerHTML = `<label><input type="radio" name="choice" value="${i}" /> ${opt}</label>`;
        choicesEl.appendChild(li);
    });
}

function checkAnswer() {
    const selected = document.querySelector('input[name="choice"]:checked');
    if (!selected) {
        feedbackEl.textContent = "Please select an answer.";
        return;
    }

    const chosen = parseInt(selected.value);
    const correct = quizQuestions[current].answer;

    if (chosen === correct) {
        score++;
        feedbackEl.textContent = "✅ Correct!";
    } else {
        feedbackEl.textContent = "❌ Incorrect.";
    }

    submitBtn.disabled = true;

    setTimeout(() => {
        current++;
        submitBtn.disabled = false;

        if (current < quizQuestions.length) {
            loadQuestion();
        } else {
            showScore();
        }
    }, 1000);
}

function showScore() {
    quizBox.classList.add("hidden");
    scoreBox.classList.remove("hidden");
    scoreEl.textContent = `You scored ${score} out of ${quizQuestions.length}`;
}

function saveScore() {
    const name = usernameInput.value.trim();
    if (!name) return;

    const scores = JSON.parse(localStorage.getItem("chemistryLeaderboard") || "[]");
    scores.push({ name, score, total: quizQuestions.length });
    localStorage.setItem("chemistryLeaderboard", JSON.stringify(scores));
    renderLeaderboard();
    resetQuiz();
}

function resetQuiz() {
    current = 0;
    score = 0;
    quizQuestions = [];
    scoreBox.classList.add("hidden");
    setupBox.classList.remove("hidden");
}

function renderLeaderboard() {
    const scores = JSON.parse(localStorage.getItem("chemistryLeaderboard") || "[]");
    leaderboardEl.innerHTML = scores
        .sort((a, b) => b.score - a.score)
        .map(s => `<li>${s.name}: ${s.score}/${s.total}</li>`)
        .join("");
}

function resetLeaderboard() {
    localStorage.removeItem("chemistryLeaderboard");
    renderLeaderboard();
}

function shuffle(arr) {
    for (let i = arr.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
}

loadQuestions();


