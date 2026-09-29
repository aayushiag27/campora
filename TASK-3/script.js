const username = document.getElementById("username");
const startBtn = document.getElementById("startBtn");

let questions = [];

startBtn.addEventListener("click", function () {
    if (username.value.trim() === "") {
        alert("Please enter your name");
        return;
    }

    console.log("Welcome " + username.value);
});

fetch("questions.json")
    .then(response => response.json())
    .then(data => {
        questions = data;
        console.log(questions[0]);
    })
    .catch(error => {
        console.log("Error loading questions:", error);
    });