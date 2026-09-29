const username = document.getElementById("username");
const startBtn = document.getElementById("startBtn");
const login = document.getElementById("login");
const quiz = document.getElementById("quiz");
const name = document.getElementById("name");
const question = document.getElementById("question");
const options = document.getElementById("options");

let questions = [], current = 0;

fetch("questions.json")
    .then(res => res.json())
    .then(data => questions = data);

startBtn.onclick = () => {
    if (!username.value.trim()) return alert("Please enter your name");
    name.textContent = username.value;
    login.style.display = "none";
    quiz.style.display = "block";
    showQuestion();
};

function showQuestion() {
    let q = questions[current];
    question.textContent = q.question;
    options.innerHTML = q.options.map(option =>
        `<button tabindex="0">${option}</button>`
    ).join("");
    document.getElementById("number").textContent =
        `Question ${current + 1} of ${questions.length}`;
}