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
const finalScore = document.getElementById("finalScore");
const correctCount = document.getElementById("correctCount");
const incorrectCount = document.getElementById("incorrectCount");
const unattemptedCount = document.getElementById("unattemptedCount");
const resultMessage = document.getElementById("resultMessage");
const reattempt = document.getElementById("reattempt");
const themeToggle = document.getElementById("themeToggle");
let questions = [];
let current = 0;
let score = 0;
let time = 600;
let answered = [];
let marked = [];
let selected = [];
fetch("questions.json")
    .then(res => res.json())
    .then(data => {
        questions = data;
        for (let i = 0; i < questions.length; i++) {
            answered[i] = false;
            marked[i] = false;
            selected[i] = "";
        }

    })
    .catch(() => {
        alert("Unable to load questions.");
    });
startBtn.onclick = function () {
    if (username.value.trim() === "") {
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
    number.textContent =
        "Question " + (current + 1) +
        " of " + questions.length;
    let attemptedCount = 0;
    let reviewCount = 0;
    for (let i = 0; i < questions.length; i++) {
        if (answered[i]) {
            attemptedCount++;
        }
        if (marked[i]) {
            reviewCount++;
        }
    }
    attempted.textContent =
        "Attempted: " + attemptedCount;
    unattempted.textContent =
        "Unattempted: " +
        (questions.length - attemptedCount);
    reviewed.textContent =
        "Review: " + reviewCount;
    progressBar.innerHTML = "";
    for (let i = 0; i < questions.length; i++) {
        let button = document.createElement("button");
        button.textContent = i + 1;
        if (answered[i]) {
            button.className = "attempted";
        }
        if (marked[i]) {
            button.className = "reviewed";
        }
        if (i === current) {
            button.classList.add("active");
        }
        button.onclick = function () {
            current = i;
            showQuestion();
        };
        progressBar.appendChild(button);
    }
    options.innerHTML = "";
    for (let i = 0; i < q.options.length; i++) {
        let button = document.createElement("button");
        button.textContent = q.options[i];
        button.onclick = function () {
            selectAnswer(button);
        };
        if (answered[current]) {
            button.disabled = true;
            if (button.textContent === q.answer) {
                button.style.background = "#22c55e";
            }
            if (
                button.textContent === selected[current] &&
                selected[current] !== q.answer
            ) {
                button.style.background = "#ef4444";
            }
        }
        options.appendChild(button);
    }
    if (marked[current]) {
        review.textContent = "Unmark Review";
    } else {
        review.textContent = "Mark for Review";
    }
    if (current === questions.length - 1) {
        next.textContent = "Finish";
    } else {
        next.textContent = "Next";
    }
}
function selectAnswer(button) {
    if (answered[current]) {
        return;
    }
    let q = questions[current];
    answered[current] = true;
    selected[current] = button.textContent;
    if (button.textContent === q.answer) {
        score = score + 4;
    } else {
        score = score - 1;
    }
    showQuestion();
}
review.onclick = function () {
    marked[current] = !marked[current];
    showQuestion();
};
next.onclick = function () {
    if (current < questions.length - 1) {
        current++;
        showQuestion();
    } else {
        endQuiz();
    }
};
endTest.onclick = endQuiz;
function endQuiz() {
    let correct = 0;
    let incorrect = 0;
    let skipped = 0;
    for (let i = 0; i < questions.length; i++) {
        if (!answered[i]) {
            skipped++;
        } else if (selected[i] === questions[i].answer) {
            correct++;
        } else {
            incorrect++;
        }
    }
    finalScore.textContent =
        "Score: " + score;
    correctCount.textContent =
        correct;
    incorrectCount.textContent =
        incorrect;
    unattemptedCount.textContent =
        skipped;
    if (correct >= 8) {
        resultMessage.textContent =
            "Outstanding! AKGEC Pro!";
    }
    else if (correct >= 5) {
        resultMessage.textContent =
            "Good job! Keep learning!";

    } else {
        resultMessage.textContent =
            "Nice try! Give it another shot!";
    }
    quiz.style.display = "none";
    result.style.display = "flex";
}
setInterval(function () {
    if (time <= 0) {
        return;
    }
    time--;
    let minutes = Math.floor(time / 60);
    let seconds = time % 60;
    timer.textContent =
        minutes + ":" +
        (seconds < 10 ? "0" : "") +
        seconds;
    if (time === 0) {
        endQuiz();
    }

}, 1000);
reattempt.onclick = function () {
    current = 0;
    score = 0;
    time = 600;
    for (let i = 0; i < questions.length; i++) {
        answered[i] = false;
        marked[i] = false;
        selected[i] = "";
    }
    timer.textContent = "10:00";
    result.style.display = "none";
    quiz.style.display = "block";
    showQuestion();
};
themeToggle.onclick = function () {

    document.body.classList.toggle("light");
    if (document.body.classList.contains("light")) {
        themeToggle.textContent = "Dark Mode";
    } else {
        themeToggle.textContent = "Light Mode";
    }
};