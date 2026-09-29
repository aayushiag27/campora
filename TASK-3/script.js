let questions = [];

fetch("questions.json")
  .then(response => response.json())
  .then(data => {
    questions = data;
    console.log(questions);
  })
  .catch(error => {
    console.log("Error loading questions:", error);
  });