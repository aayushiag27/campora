const username = document.getElementById("username");
const startBtn = document.getElementById("startBtn");
const login = document.getElementById("login");
const quiz = document.getElementById("quiz");
const result = document.getElementById("result");

const name = document.getElementById("name");
const question = document.getElementById("question");
const options = document.getElementById("options");
const number = document.getElementById("number");
const timer = document.getElementById("timer");

const review = document.getElementById("review");
const next = document.getElementById("next");
const endTest = document.getElementById("endTest");

const attempted = document.getElementById("attempted");
const unattempted = document.getElementById("unattempted");
const reviewed = document.getElementById("reviewed");

const progressBar = document.getElementById("progressBar");
const themeToggle = document.getElementById("themeToggle");

const finalScore = document.getElementById("finalScore");
const correctCount = document.getElementById("correctCount");
const incorrectCount = document.getElementById("incorrectCount");
const unattemptedCount = document.getElementById("unattemptedCount");
const resultMessage = document.getElementById("resultMessage");
const reattempt = document.getElementById("reattempt");

let questions = [];
let current = 0;
let score = 0;
let time = 600;
let answered = [];
let marked = [];
let selectedAnswers = [];

function saveProgress() {
    localStorage.setItem("camporaProgress", JSON.stringify({
        username: username.value,
        current,
        score,
        time,
        answered,
        marked,
        selectedAnswers
    }));
}

fetch("questions.json")
    .then(res => res.json())
    .then(data => {
        questions = data;

        answered = new Array(data.length).fill(false);
        marked = new Array(data.length).fill(false);
        selectedAnswers = new Array(data.length).fill("");
    })
    .catch(() => {
        alert("Unable to load questions.");
    });

startBtn.onclick = () => {
    if (!username.value.trim()) {
        alert("Please enter your name");
        return;
    }

    if (!questions.length) {
        alert("Questions are still loading. Please try again.");
        return;
    }

    name.textContent = username.value.trim();

    login.style.display = "none";
    quiz.style.display = "block";

    showQuestion();
};

function showQuestion() {
    let q = questions[current];

    if (!q) return;

    let done = answered.filter(Boolean).length;

    question.textContent = q.question;

    number.textContent =
        `Question ${current + 1} of ${questions.length}`;

    attempted.textContent = `Attempted: ${done}`;

    unattempted.textContent =
        `Unattempted: ${questions.length - done}`;

    reviewed.textContent =
        `Review: ${marked.filter(Boolean).length}`;

    progressBar.innerHTML = questions.map((_, i) => {
        let status = marked[i]
            ? "reviewed"
            : answered[i]
                ? "attempted"
                : "unattempted";

        return `<button class="${status}" data-index="${i}">
            ${i + 1}
        </button>`;
    }).join("");

    progressBar.querySelectorAll("button").forEach(btn => {
        btn.onclick = () => {
            current = Number(btn.dataset.index);
            showQuestion();
        };
    });

    options.innerHTML = q.options.map(opt =>
        `<button>${opt}</button>`
    ).join("");

    options.querySelectorAll("button").forEach(btn => {
        btn.onclick = () => selectAnswer(btn);
    });

    if (answered[current]) {
        options.querySelectorAll("button").forEach(btn => {
            btn.disabled = true;

            if (btn.textContent === q.answer) {
                btn.style.background = "#22c55e";
            }

            if (
                btn.textContent === selectedAnswers[current] &&
                btn.textContent !== q.answer
            ) {
                btn.style.background = "#ef4444";
            }
        });
    }

    review.textContent = marked[current]
        ? "Unmark Review"
        : "Mark for Review";

    next.textContent =
        current === questions.length - 1
            ? "Finish"
            : "Next";

    saveProgress();
}

function selectAnswer(btn) {
    if (answered[current]) return;

    let q = questions[current];

    if (!q) return;

    answered[current] = true;
    selectedAnswers[current] = btn.textContent;

    if (btn.textContent === q.answer) {
        score += 4;
        btn.style.background = "#22c55e";
    } else {
        score -= 1;
        btn.style.background = "#ef4444";
    }

    options.querySelectorAll("button").forEach(b => {
        b.disabled = true;

        if (b.textContent === q.answer) {
            b.style.background = "#22c55e";
        }
    });

    saveProgress();
    showQuestion();
}

review.onclick = () => {
    marked[current] = !marked[current];
    showQuestion();
};

next.onclick = () => {
    if (current < questions.length - 1) {
        current++;
        showQuestion();
    } else {
        endQuiz();
    }
};

endTest.onclick = endQuiz;

function endQuiz() {
    if (!questions.length) return;

    let correct = answered.filter((v, i) =>
        v && selectedAnswers[i] === questions[i].answer
    ).length;

    let incorrect = answered.filter((v, i) =>
        v && selectedAnswers[i] !== questions[i].answer
    ).length;

    let skipped =
        questions.length - answered.filter(Boolean).length;

    finalScore.textContent = `Score: ${score}`;

    correctCount.textContent = correct;
    incorrectCount.textContent = incorrect;
    unattemptedCount.textContent = skipped;

    resultMessage.textContent =
        correct >= 8
            ? "Outstanding! AKGEC Pro!"
            : correct >= 5
                ? "Good job! Keep learning!"
                : "Nice try! Give it another shot!";

    quiz.style.display = "none";
    result.style.display = "flex";

    localStorage.removeItem("camporaProgress");
}

setInterval(() => {
    if (time <= 0) return;

    time--;

    let min = Math.floor(time / 60);
    let sec = time % 60;

    timer.textContent =
        `${min}:${sec < 10 ? "0" : ""}${sec}`;

    saveProgress();

    if (time === 0) {
        endQuiz();
    }
}, 1000);

reattempt.onclick = () => {
    localStorage.removeItem("camporaProgress");

    current = 0;
    score = 0;
    time = 600;

    answered.fill(false);
    marked.fill(false);
    selectedAnswers.fill("");

    timer.textContent = "10:00";

    result.style.display = "none";
    quiz.style.display = "block";

    showQuestion();
};

themeToggle.onclick = () => {
    document.body.classList.toggle("light");

    themeToggle.textContent =
        document.body.classList.contains("light")
            ? "Dark Mode"
            : "Light Mode";
};