questionsAPI = 'https://maithiyenlinh.github.io/quiz-app/questions.json';

const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);

const main = $('.quiz-container');
const quizQuestion = $('.quiz__heading');

const quizAnswer = $('.quiz__answers');

const btnSubmit = $('.btn--submit');
const btnNext = $('.btn--next');


//make the filter() for Nodelist
NodeList.prototype.filter = function(callback) {
    'use strict';

    if (this == null) {
        throw new TypeError('NodeList.prototype.some called on null or undefined');
    }
    if (typeof callback !== 'function') {
        throw new TypeError();
    }
    var filtered = [];
    var t = Object(this);
    var len = t.length >>> 0;

    for(var i = 0; i < len; i++) {
        if (callback(t[i])) {
            filtered.push(t[i]);
        }
    }

    return filtered;
}

//make some() for Nodelist
NodeList.prototype.some = function(callback, thisArg) {
    'use strict';
    if (this == null) {
        throw new TypeError('NodeList.prototype.some called on null or undefined');
    }
    if (typeof callback !== 'function') {
        throw new TypeError();
    }
    var t = Object(this);
    var len = t.length >>> 0;

    for(var i = 0; i < len; i++) {
        if (i in t && callback.call(thisArg, t[i], i, t)) {
            return true;
        }
    }
    return false;
};

async function app() {
    //get data from json file
    const response = await fetch(questionsAPI);
    const questions = await response.json();

    function shuffed(arr) {
        const arrLength = arr.length;
        const newArr = arr.slice();
        for(let i = arrLength - 1; i > 0; i--) {
            var rand = Math.floor(Math.random() * (i + 1));
            [newArr[i], newArr[rand]] = [newArr[rand], newArr[i]];
        }
        return newArr;
    };

    const randomQuest = shuffed(questions);

    const handleApp = {

        questions: randomQuest,

        currQuest: 0,

        score: 0,

        renderQuestions() {
            quizQuestion.innerHTML = this.questions[this.currQuest]['question'];
            const answerList = shuffed(this.questions[this.currQuest]['answer']);
            let i = 0;
            const html = answerList.map((answer) => {
                i++;
                return `
                    <li>
                        <input type="radio" name="answers" id="answer--${i}">
                        <label for="answer--${i}">${answer}</label>
                        <i class="icon icon--correct fas fa-check"></i>
                        <i class="icon icon--wrong fas fa-times"></i>
                    </li>
                `
            });
            quizAnswer.innerHTML = html.join('');
        },

        nextQuest() {
            const amountQuestions = this.questions.length;
            this.currQuest++;

            this.currQuest < amountQuestions
                ? this.renderQuestions()
                : main.innerHTML = `
                <div class="quiz__heading">You answered correctly at ${this.score} / ${amountQuestions} questions</div>
                <button class="btn" onclick="location.reload()">Reload</button>
                `
        },

        handleEvent() {

            btnSubmit.onclick = () => {
                const answerElements = $$('[name="answers"]');
                
                //submit when you already choose answer 
                if (answerElements.some(answerItem => answerItem.checked)) {

                    btnSubmit.style.display = 'none';
                    btnNext.style.display = 'block';

                    const correctAnswer = this.questions[this.currQuest]['correctAnswer'];
                    const rightAnswer = answerElements.filter(answerItem => {
                        const content = $(`#${answerItem.id}+label`).innerText;
                        return correctAnswer.includes(content);
                    });

                    const answers = answerElements.filter(answerItem => answerItem.checked);

                    //check the answer user choose
                    answers.forEach((answer) => {
                        const answerContent = $(`#${answer.id}+label`).innerText;

                        //when correct
                        if (correctAnswer.includes(answerContent)) {
                            answer.parentElement.classList.add('correct')
                            $(`#${answer.id}~.icon--correct`).style.display = 'block';
                            this.score++;
                        }
                        //when wrong 
                        else {
                            rightAnswer.forEach(answer => answer.parentElement.classList.add('warning'));
                            answer.parentElement.classList.add('wrong');
                            $(`#${answer.id}~.icon--wrong`).style.display = 'block';
                        }
                    });
                };
            };

            btnNext.onclick = () => {
                this.nextQuest();
                btnNext.style.display = 'none';
                btnSubmit.style.display = 'block';
            };
        },

        start() {
            this.renderQuestions();
            this.handleEvent();
        }
    };
    
    handleApp.start();
}

app();