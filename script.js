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

fetch("questions.json")
    .then(res => res.json())
    .then(data => {
        questions = data;
        answered = new Array(questions.length).fill(false);
        marked = new Array(questions.length).fill(false);
        selectedAnswers = new Array(questions.length).fill("");
        showQuestion();
    });

startBtn.onclick = () => {

    if (!username.value.trim()) {
        alert("Please enter your name");
        return;
    }

    name.textContent = username.value;
    login.style.display = "none";
    quiz.style.display = "block";

    showQuestion();
};

function showQuestion() {

    let q = questions[current];

    question.textContent = q.question;
    number.textContent = `Question ${current + 1} of ${questions.length}`;

    let attemptedCount = answered.filter(value => value).length;
    let reviewCount = marked.filter(value => value).length;

    attempted.textContent = `Attempted: ${attemptedCount}`;
    unattempted.textContent =
        `Unattempted: ${questions.length - attemptedCount}`;
    reviewed.textContent = `Review: ${reviewCount}`;

    progressBar.innerHTML = questions.map((_, i) => {

        let status = marked[i]
            ? "reviewed"
            : answered[i]
            ? "attempted"
            : "unattempted";

        return `<button class="${status}" data-index="${i}"
            aria-label="Go to question ${i + 1}"
            tabindex="0">${i + 1}</button>`;

    }).join("");

    progressBar.querySelectorAll("button").forEach(button => {

        button.onclick = () => {
            current = Number(button.dataset.index);
            showQuestion();
        };

    });

    options.innerHTML = q.options.map(option =>
        `<button tabindex="0">${option}</button>`
    ).join("");

    document.querySelectorAll("#options button").forEach(button => {
        button.onclick = () => selectAnswer(button);
    });

    if (answered[current]) {

        document.querySelectorAll("#options button").forEach(button => {

            button.disabled = true;

            if (button.textContent === q.answer) {
                button.style.background = "#22c55e";
            }

            if (
                button.textContent === selectedAnswers[current] &&
                button.textContent !== q.answer
            ) {
                button.style.background = "#ef4444";
            }

        });
    }

    review.textContent =
        marked[current] ? "Unmark Review" : "Mark for Review";

    next.textContent =
        current === questions.length - 1 ? "Finish" : "Next";
}

function selectAnswer(button) {

    if (answered[current]) return;

    let q = questions[current];

    answered[current] = true;
    selectedAnswers[current] = button.textContent;

    if (button.textContent === q.answer) {
        score += 4;
        button.style.background = "#22c55e";
    } else {
        score -= 1;
        button.style.background = "#ef4444";
    }

    document.querySelectorAll("#options button").forEach(btn => {
        btn.disabled = true;

        if (btn.textContent === q.answer) {
            btn.style.background = "#22c55e";
        }
    });

    showQuestion();
}

review.onclick = () => {

    marked[current] = !marked[current];

    review.textContent =
        marked[current] ? "Unmark Review" : "Mark for Review";

    showQuestion();
};

next.onclick = () => {

    if (current === questions.length - 1) {
        endQuiz();
    } else {
        current++;
        showQuestion();
    }
};

endTest.onclick = () => {
    endQuiz();
};

function endQuiz() {

    let correctAnswers = answered.filter(
        (value, i) => value && selectedAnswers[i] === questions[i].answer
    ).length;

    let incorrectAnswers = answered.filter(
        (value, i) => value && selectedAnswers[i] !== questions[i].answer
    ).length;

    let unattemptedAnswers =
        questions.length - answered.filter(value => value).length;

    finalScore.textContent = `Score: ${score}`;

    correctCount.textContent = correctAnswers;
    incorrectCount.textContent = incorrectAnswers;
    unattemptedCount.textContent = unattemptedAnswers;

    resultMessage.textContent =
        `You answered ${correctAnswers} correctly out of ${questions.length}.`;

    quiz.style.display = "none";
    result.style.display = "flex";
}

setInterval(() => {

    if (time <= 0) return;

    time--;

    let minutes = Math.floor(time / 60);
    let seconds = time % 60;

    timer.textContent =
        `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;

    if (time === 0) {
        endQuiz();
    }

}, 1000);

reattempt.onclick = () => {

    current = 0;
    score = 0;
    time = 600;

    answered = new Array(questions.length).fill(false);
    marked = new Array(questions.length).fill(false);
    selectedAnswers = new Array(questions.length).fill("");

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