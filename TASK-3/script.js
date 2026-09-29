const username = document.getElementById("username");
const startBtn = document.getElementById("startBtn");
const login = document.getElementById("login");
const quiz = document.getElementById("quiz");
const result = document.getElementById("result");
const name = document.getElementById("name");
const question = document.getElementById("question");
const options = document.getElementById("options");
const review = document.getElementById("review");
const next = document.getElementById("next");
const number = document.getElementById("number");
const timer = document.getElementById("timer");
const finalScore = document.getElementById("finalScore");
const resultMessage = document.getElementById("resultMessage");
const correctCount = document.getElementById("correctCount");
const incorrectCount = document.getElementById("incorrectCount");
const unattemptedCount = document.getElementById("unattemptedCount");
const reattempt = document.getElementById("reattempt");

const attempted = document.getElementById("attempted");
const unattempted = document.getElementById("unattempted");
const reviewed = document.getElementById("reviewed");

let questions = [];
let current = 0;
let time = 600;
let score = 0;
let answered = [];
let marked = [];
let correct = [];
let submitted = false;

fetch("questions.json")
    .then(res => res.json())
    .then(data => {
        questions = data;
        answered = new Array(questions.length).fill(false);
        marked = new Array(questions.length).fill(false);
        correct = new Array(questions.length).fill(false);
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

    let attemptedCount = answered.filter(value => value).length;
    let unattemptedCount = questions.length - attemptedCount;
    let reviewCount = marked.filter(value => value).length;

    attempted.textContent = `Attempted: ${attemptedCount}`;
    unattempted.textContent = `Unattempted: ${unattemptedCount}`;
    reviewed.textContent = `Review: ${reviewCount}`;

    question.textContent = q.question;
    number.textContent = `Question ${current + 1} of ${questions.length}`;

    options.innerHTML = q.options.map(option =>
        `<button tabindex="0">${option}</button>`
    ).join("");

    document.querySelectorAll("#options button").forEach(button => {
        button.onclick = () => selectAnswer(button);
    });

    if (marked[current]) {
        review.textContent = "Unmark Review";
        review.style.background = "#9333ea";
    } else {
        review.textContent = "Mark for Review";
        review.style.background = "#8b5cf6";
    }

    next.textContent = current === questions.length - 1 ? "Finish" : "Next";
}

function selectAnswer(button) {
    if (answered[current]) return;
 let q = questions[current];
 answered[current] = true;
    correct[current] = button.textContent === q.answer;
   document.querySelectorAll("#options button").forEach(btn => {
        btn.disabled = true;
 if (btn.textContent === q.answer) {
            btn.style.background = "#22c55e";
        }
    });
if (correct[current]) {
        score += 4;
    } else {
        score -= 1;
        button.style.background = "#ef4444";
    }
 let attemptedCount = answered.filter(value => value).length;
    let unattemptedCount = questions.length - attemptedCount;
attempted.textContent = `Attempted: ${attemptedCount}`;
    unattempted.textContent = `Unattempted: ${unattemptedCount}`;
}
review.onclick = () => {
    marked[current] = !marked[current];
 if (marked[current]) {
        review.textContent = "Unmark Review";
        review.style.background = "#9333ea";
    } else {
        review.textContent = "Mark for Review";
        review.style.background = "#8b5cf6";
    }
 let reviewCount = marked.filter(value => value).length;
    reviewed.textContent = `Review: ${reviewCount}`;
};
next.onclick = () => {
    if (current === questions.length - 1) {
        endQuiz();
        return;
    }
 current++;
    showQuestion();
};
setInterval(() => {
    if (time <= 0 || submitted) return;
 time--;
  let min = Math.floor(time / 60);
    let sec = time % 60;
 timer.textContent =
        `${min}:${sec < 10 ? "0" : ""}${sec}`;
if (time === 0) {
        endQuiz();
    }
}, 1000);
function endQuiz() {
    if (submitted) return;
     submitted = true;
 let correctAnswers = correct.filter(value => value).length;
    let incorrectAnswers = answered.filter((value, i) => value && !correct[i]).length;
    let unattemptedAnswers = answered.filter(value => !value).length;
 finalScore.textContent = `Score: ${score}`;
    correctCount.textContent = correctAnswers;
    incorrectCount.textContent = incorrectAnswers;
    unattemptedCount.textContent = unattemptedAnswers;
    resultMessage.textContent = `You answered ${correctAnswers} correctly out of ${questions.length}.`;
  quiz.style.display = "none";
    result.style.display = "flex";
}
attempted.onclick = () => {
    let index = answered.findIndex((value, i) => value && i > current);

    if (index === -1) {
        index = answered.findIndex(value => value);
    }

    if (index !== -1) {
        current = index;
        showQuestion();
    }
};

unattempted.onclick = () => {
    let index = answered.findIndex((value, i) => !value && i > current);

    if (index === -1) {
        index = answered.findIndex(value => !value);
    }

    if (index !== -1) {
        current = index;
        showQuestion();
    }
};

reviewed.onclick = () => {
    let index = marked.findIndex((value, i) => value && i > current);

    if (index === -1) {
        index = marked.findIndex(value => value);
    }

    if (index !== -1) {
        current = index;
        showQuestion();
    }
};
reattempt.onclick = () => {
    current = 0;
    time = 600;
    score = 0;
    submitted = false;
 answered = new Array(questions.length).fill(false);
    marked = new Array(questions.length).fill(false);
    correct = new Array(questions.length).fill(false);
  timer.textContent = "10:00";
    attempted.textContent = "Attempted: 0";
    unattempted.textContent = `Unattempted: ${questions.length}`;
    reviewed.textContent = "Review: 0";
result.style.display = "none";
    quiz.style.display = "block";
 showQuestion();
};