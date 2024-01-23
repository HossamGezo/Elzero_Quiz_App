// ! ------------------------------------------- Variables

let url = "assets/json/html_questions.json";
let quesCount = document.querySelector(".questions-count");
let quesHead = document.querySelector(".question-head");
let answers = document.querySelector(".answers");
let tabs = document.querySelector(".tabs");
let submit = document.querySelector(".quiz-app__submit");
let quizResult = document.querySelector(".quiz-app__result");

// ! ------------------------------------------- Functions

// --------------------------- Get Data Function

let currentQuestion = 0, cnt = 0, countDownInterval;

async function getData(url) {
  let myData = await (await fetch(url)).json();

  // Create Bullets Function
  let numOfBullets = myData.length;
  createBullets(numOfBullets);

  // Show Data Function
  let currentQues = myData[currentQuestion];
  showData(currentQues, numOfBullets);

  // Count Down Function 
  countDown(5, numOfBullets);
  // Submit Button Event
  submit.addEventListener("click", function () {
    // The Right Answer
    let rightAnswer = myData[currentQuestion].right_answer;

    ++currentQuestion;

    // Check Answer Function
    checkAnswer(rightAnswer, numOfBullets);

    // Remove Previous Question
    quesHead.innerHTMl = "";
    answers.innerHTML = "";

    showData(myData[currentQuestion], numOfBullets);

    // Handle Bullets Function
    handleBullets(currentQuestion, numOfBullets);

    // Show Results Function
    showResults(currentQuestion, numOfBullets);

    // Count Down Function
    clearInterval(countDownInterval);
    countDown(5, numOfBullets);
  });
}

getData(url);

// --------------------------- Create Bullets Function

function createBullets(numOfBullets) {
  // Number Of Questions
  quesCount.textContent = numOfBullets < 10 ? "0" + numOfBullets : numOfBullets;

  // Create Bullets
  for (let i = 0; i < numOfBullets; ++i) {
    tabs.innerHTML += `
      <span class="${i === 0 ? "active" : ""}"></span>
    `;
  }
}

// --------------------------- Show Data Function

function showData(obj, numOfQuestions) {
  if (currentQuestion < numOfQuestions) {
    quesHead.textContent = obj.title;
    let choose;
    for (let i = 1; i <= 4; ++i) {
      // Choose Div
      choose = document.createElement("div");
      choose.className = "choose";
      // Input Radio
      let myInput = document.createElement("input");
      myInput.className = "choose-input";
      myInput.type = "radio";
      myInput.name = "question";
      myInput.id = `ques${i}`;
      myInput.dataset.answer = obj[`answer_${i}`];
      if (i === 1) {
        myInput.setAttribute("checked", "");
      }
      // Label Tag
      let myLabel = document.createElement("label");
      myLabel.className = "choose-text";
      myLabel.htmlFor = `ques${i}`;
      myLabel.innerText = obj[`answer_${i}`];
      // Append To Choose Div
      choose.append(myInput);
      choose.append(myLabel);
      answers.append(choose);
    }
  }
}

// --------------------------- Handle Bullets Function

function handleBullets(cnt, count) {
  if (cnt < count) {
    let bullets = document.querySelectorAll(".tabs span");
    for (let i = 0; i <= cnt; ++i) {
      bullets[i].className = "active";
    }
  }
}

// --------------------------- Check Answer Function

function checkAnswer(rightAnswer, count) {
  let currentAnswer;

  // The User Answer
  let userAnswer = document.querySelectorAll(".answers .choose input");
  for (let i = 0; i < 4; ++i) {
    if (userAnswer[i].checked) {
      currentAnswer = userAnswer[i].dataset.answer;
      break;
    }
  }
  if (currentAnswer === rightAnswer) ++cnt;
}

// --------------------------- Show Results Function

function showResults(currntQues, count) {
  if (currntQues === count) {
    document.querySelector(".quiz-app__body").remove();
    document.querySelector(".quiz-app__time").remove();
    submit.remove();

    let result;
    if (cnt >= (count / 2) && cnt < count) {
      result = `<span class="good">Good</span> You Answered ${cnt} From ${count}`;
    } else if (cnt === count) {
      result = `<span class="perfect">Perfect</span> You Answered ${cnt} From ${count}`;
    } else {
      result = `<span class="bad">Bad</span> You Answered ${cnt} From ${count}`;
    }
    document.querySelector(".quiz-app__result").innerHTML = result;
  }
}

// --------------------------- Count Down Function

function countDown(duration, count) {
  if (currentQuestion < count) {
    let minutes, seconds;
    countDownInterval = setInterval(function () {
      minutes = Math.trunc(duration / 60);
      seconds = duration % 60;
      document.querySelector(".time").innerText = `${minutes < 10 ? "0" + minutes : minutes} : ${seconds < 10 ? "0" + seconds : seconds}`;
      --duration;
      if (duration < 0) {
        clearInterval(countDownInterval);
        submit.click();
      }
    }, 1000);
  }
}