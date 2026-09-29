const username = document.getElementById("username");
const startBtn = document.getElementById("startBtn");
const login = document.getElementById("login");
const quiz = document.getElementById("quiz");
const name = document.getElementById("name");
const question = document.getElementById("question");
const options = document.getElementById("options");
const review = document.getElementById("review");
const next = document.getElementById("next");
const number = document.getElementById("number");
const timer = document.getElementById("timer");

let questions = [];
let current = 0;
let time = 600;
let score = 0;
let answered = [];
let marked = [];

fetch("questions.json")
    .then(res => res.json())
    .then(data => {
        questions = data;
        answered = new Array(questions.length).fill(false);
        marked = new Array(questions.length).fill(false);
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

    if (current === questions.length - 1) {
        next.textContent = "Finish";
    } else {
        next.textContent = "Next";
    }
}

function selectAnswer(button) {
    if (answered[current]) return;

    let q = questions[current];

    answered[current] = true;

    document.querySelectorAll("#options button").forEach(btn => {
        btn.disabled = true;

        if (btn.textContent === q.answer) {
            btn.style.background = "#22c55e";
        }
    });

    if (button.textContent === q.answer) {
        score += 4;
    } else {
        score -= 1;
        button.style.background = "#ef4444";
    }
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
    if (time <= 0) return;

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
    alert(`Quiz submitted! Your score is ${score}`);
}