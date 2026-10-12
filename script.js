
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
const questionPalette = document.getElementById("questionPalette");
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
let visited = [];
let timerInterval = null;
let quizEnded = false;
fetch("questions.json")
    .then(res => {
        if (!res.ok) {
            throw new Error("Questions could not be loaded");
        }
        return res.json();
    })
    .then(data => {
        questions = data;
        for (let i = 0; i < questions.length; i++) {
            answered[i] = false;
            marked[i] = false;
            selected[i] = "";
            visited[i] = false;
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
    if (questions.length === 0) {
        alert("Questions are still loading. Please try again.");
        return;
    }
    name.textContent = username.value.trim();
    login.style.display = "none";
    result.style.display = "none";
    quiz.style.display = "block";
    current = 0;
    visited[current] = true;
    quizEnded = false;
    showQuestion();
    startTimer();
};
function showQuestion() {
    if (questions.length === 0) {
        return;
    }
    let q = questions[current];
    visited[current] = true;
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
    attempted.textContent = "Attempted: " + attemptedCount;
    unattempted.textContent =
        "Unattempted: " + (questions.length - attemptedCount);
    reviewed.textContent = "For Review: " + reviewCount;
    progressBar.innerHTML = "";
    for (let i = 0; i < questions.length; i++) {
        let button = document.createElement("button");
        button.textContent = i + 1;
        if (answered[i]) {
            button.classList.add("attempted");
        }
        if (marked[i]) {
            button.classList.add("reviewed");
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
    questionPalette.innerHTML = "";
    for (let i = 0; i < questions.length; i++) {
        let button = document.createElement("button");
        button.textContent = i + 1;
        button.className = "palette-btn";
        if (marked[i]) {
            button.classList.add("reviewed");
        } else if (answered[i]) {
            button.classList.add("answered");
        } else if (visited[i]) {
            button.classList.add("unanswered");
        } else {
            button.classList.add("not-visited");
        }
        if (i === current) {
            button.classList.add("current");
        }
        button.setAttribute(
            "aria-label",
            "Question " + (i + 1)
        );
        button.onclick = function () {
            current = i;
            showQuestion();
        };
        questionPalette.appendChild(button);
    }
    options.innerHTML = "";
    for (let i = 0; i < q.options.length; i++) {
        let button = document.createElement("button");
        button.textContent = q.options[i];
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
        } else {
            button.onclick = function () {
                selectAnswer(button);
            };
        }
        options.appendChild(button);
    }
    review.textContent = marked[current]
        ? "Unmark Review"
        : "Mark for Review";
    next.textContent =
        current === questions.length - 1
            ? "Finish"
            : "Next Question";
}
function selectAnswer(button) {
    if (answered[current] || quizEnded) {
        return;
    }
    let q = questions[current];
    answered[current] = true;
    selected[current] = button.textContent;
    if (button.textContent === q.answer) {
        score += 4;
    } else {
        score -= 1;
    }
    showQuestion();
}
review.onclick = function () {
    if (quizEnded) {
        return;
    }
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
function startTimer() {
    clearInterval(timerInterval);
    timerInterval = setInterval(function () {
        if (quizEnded) {
            clearInterval(timerInterval);
            return;
        }
        if (time > 0) {
            time--;
        }
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
}
function endQuiz() {
    if (quizEnded) {
        return;
    }
    quizEnded = true;
    clearInterval(timerInterval);
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
    finalScore.textContent = "Score: " + score;
    correctCount.textContent = correct;
    incorrectCount.textContent = incorrect;
    unattemptedCount.textContent = skipped;
    if (correct >= 8) {
        resultMessage.textContent = "Outstanding! AKGEC Pro!";
    } else if (correct >= 5) {
        resultMessage.textContent = "Good job! Keep learning!";
    } else {
        resultMessage.textContent = "Nice try! Give it another shot!";
    }
    quiz.style.display = "none";
    result.style.display = "flex";
}
reattempt.onclick = function () {
    clearInterval(timerInterval);
    current = 0;
    score = 0;
    time = 600;
    quizEnded = false;
    for (let i = 0; i < questions.length; i++) {
        answered[i] = false;
        marked[i] = false;
        selected[i] = "";
        visited[i] = false;
    }
    timer.textContent = "10:00";
    result.style.display = "none";
    quiz.style.display = "block";
    showQuestion();
    startTimer();
};
themeToggle.onclick = function () {
    document.body.classList.toggle("light");
    themeToggle.textContent =
        document.body.classList.contains("light")
            ? "Dark Mode"
            : "Light Mode";
};
