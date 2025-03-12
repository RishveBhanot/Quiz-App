const progressBar = document.querySelector('.progress-bar');
const progressText = document.querySelector('.progress-text');
    const progress = (value) => {
        let percentage = (value/ time) * 100;
        progressBar.style.width =`${percentage}%`;
        progressText.textContent = `${value}`;
    }

    const startBtn = document.querySelector('.start');
    const numQuestions = document.querySelector('#num-questions');
    const category = document.querySelector('#category');
    const difficulty = document.querySelector('#difficulty');
    const timePerQuestion = document.querySelector('#time');
    const quiz = document.querySelector('.quiz');
    const startScreen = document.querySelector('.start-screen');

    let questions =[];
    time = 30;
    score = 0;
    currentQuestion = 0,
    timer = 0;

//START QUIZ

    const startQuiz = () =>{
        console.log('this function is working');
        const num = numQuestions.value;
        const cat = category.value;
        const diff = difficulty.value;

        loadingAnimation();
        
        const url = `https://opentdb.com/api.php?amount=${num}&category=${cat}&difficulty=${diff}&type=multiple`;

        
    
        

        fetch(url)
        .then((res) => res.json())
        .then((data) => {
            questions = data.results;   
            console.log(questions);
            
                setTimeout(() => {
                startScreen.classList.add('hide');
                quiz.classList.remove('hide');
                currentQuestion = 1;
                showQuestion(questions[0]);
            },1000)
        
            
        })   
    };

    startBtn.addEventListener("click", startQuiz);

//SHOW QUESTION

    const showQuestion = (question) =>{
        const questionText = document.querySelector('.question');
        const answersWrapper = document.querySelector('.answer-wrapper');
        const questionElement = document.querySelector('.number');

        questionText.innerHTML = question.question;

        const answers = [
            ...question.incorrect_answers,
        question.correct_answer.toString(),
        ];

        answersWrapper.innerHTML = "";

        answers.sort(() => Math.random() - 1);

        answers.forEach((answer) => {
            answersWrapper.innerHTML += `<div class="answer ">
            <span class="text">${answer}</span>
            <span class="checkbox">
            <i class="fas fa-check"></i>
            </span>
        </div>`
        });

        questionElement.innerHTML = `
        Question <span class="current">${questions.indexOf(question) + 1}</span> 
        <span class="total">/${questions.length}</span>`;


        //Add event listener to each answer
        const answersDiv = document.querySelectorAll('.answer');

        answersDiv.forEach((answer) =>{
            answer.addEventListener("click", ()=>{
                if(!answer.classList.contains('checked')){
                    answersDiv.forEach((answer) =>{
                    answer.classList.remove('selected'); })
                    answer.classList.add("selected");
                    submitButton.disabled = false;
                }
            })
        })
        time = timePerQuestion.value;
        startTimer(time);

    }

    //START TIMER
    
    const countDown = 'countdown.mp3'
    const startTimer = (time) =>{
        timer = setInterval(()=> {
            if(time === 3){
                playAudio(countDown);
            } if(time >= 0){
                progress(time);
                time--;
            } if(time === 0){
                // checkAnswer();
                clearInterval(timer);

                
                
                showCorrectAnswer();
                
                submitButton.style.display = 'none';
                nextButton.style.display = 'block';
            }
            // checkAnswer();
        }, 1000);
        
    }

//SHOW CORRECT ANSWER

    const showCorrectAnswer = () => {
        const correctAnswer = questions[currentQuestion - 1].correct_answer;
    
        const answerDivs = document.querySelectorAll('.answer');
        answerDivs.forEach((answer) => {
            const answerText = answer.querySelector('.text').innerHTML;
    
            if (answerText === correctAnswer) {
                answer.classList.add('correct'); // Highlight the correct answer
            }
    
            // Disable further interaction for all options
            answer.classList.add('checked');
        });
    };
    
    
    //LOADING ANIMATION

    function loadingAnimation  (){
        startBtn.innerHTML = 'Loading';
        const loadingInterval = setInterval(() => {
            if(startBtn.innerHTML.length === 10){
                startBtn.innerHTML = "Loading";
            } else {
                startBtn.innerHTML += '.';
            }
        },500);
    }

    const submitButton = document.querySelector('.btn.submit');
    const nextButton = document.querySelector(".btn.next")

    submitButton.addEventListener('click', () =>{
        checkAnswer();
    });

//NEXT BUTTON

    const nxtButton = () => {
        submitButton.style.display = block;
        nextButton.style.display = none;
        checkAnswer();

    };

//NEXT QUESTION

    const nextQuestion = () => {
        if(currentQuestion< questions.length){
            currentQuestion++;
            showQuestion(questions[currentQuestion - 1]);

            submitButton.style.display = "block"; 
        nextButton.style.display = "none";  
        submitButton.disabled = true;
        } else{
            showScore();
        }
    }

    nextButton.addEventListener('click', nextQuestion);

//CHECK ANSWER

    const checkAnswer = () => {
        clearInterval(timer);
        const selectedAnswer = document.querySelector(".answer.selected");

        const userAnswer =selectedAnswer.querySelector('.text').innerHTML;

        const correctAnswer = questions[currentQuestion - 1].correctAnswer;
    
        if(userAnswer === correctAnswer){
            score++;
            selectedAnswer.classList.add('correct');
        } else{
            selectedAnswer.classList.add('wrong');
        }
        
    
        const answerDivs = document.querySelectorAll('.answer');

        answerDivs.forEach((answer) =>{
            const answerText = answer.querySelector('.text').innerHTML;
            if(answerText === correctAnswer){
                answer.classList.add('correct');
            } 
            answer.classList.add('checked');
            
        });

        submitButton.style.display = "none";
        nextButton.style.display = "block";
    };

    const endScreen = document.querySelector('.end-screen');
    const finalScore = document.querySelector('.final-score');
    const totalScore = document.querySelector('.total-score');

//SHOW SCORE

    const showScore = () =>{
        endScreen.classList.remove('hide');
        quiz.classList.add("hide");
        finalScore.innerHTML = score;
        totalScore.innerHTML = `/ ${questions.length}`;
    }

//RESTART BUTTON

    const restartBtn = document.querySelector(".restart");
    restartBtn.addEventListener("click", () => {
    window.location.reload();
    });

    const playAudio = (src) => {
        const audio = new Audio(src);
        audio.play();
        };

        // console.log(questions);
        