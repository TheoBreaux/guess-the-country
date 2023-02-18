//wrapping entire program in main async function 
async function main() {
    //grab gameHeading
    const gameHeading = document.getElementById("game-heading");
    //grab the score nodes then convert from strings to numbers
    const correctScore = document.getElementById("correct-score");
    let correctScoreTotal = Number(correctScore.innerText);

    const incorrectScore = document.getElementById("incorrect-score");
    let incorrectScoreTotal = Number(incorrectScore.innerText);

    //grab new flag button node
    const newFlagBtn = document.getElementById("new-flag-btn");
    //grab updated flag image
    const flagImage = document.getElementById("flag-image");
    //grab flag country selector
    const countryFlagSelect = document.getElementById("country-flag-select");
    //grab submit answer button
    const submitAnswerBtn = document.getElementById("submit-answer-btn");
    //grab reset game button
    const resetGameBtn = document.getElementById("reset-game-btn");
    //grab flagPractice Button
    const practiceIncorrectFlagsBtn = document.getElementById("practice-incorrect-flags-btn");
    //grab correct answer output
    const correctAnswerOutput = document.getElementById("correct-answer-output");
    //declare return API data as global variable for future access
    let data;
    //declare random country variable to be updated later
    let randomCountry;

    let randomWrongCountry;

    //initialize empty array to store corrrect answers
    let flagsAnsweredCorrectly = [];
    //initialize empty array to store incorrrect answers
    let flagsAnsweredIncorrectly = [];

    //grab data from API call 
    const countryRequest = await fetch("https://restcountries.com/v3.1/all");
    //parse return JSON values
    data = await countryRequest.json();

    let countryDataArray = data.map((countryObj) => countryObj.name.common).sort();

    //loop through countryDataArray to create all country option elements in select
    for (let i = 0; i < countryDataArray.length; i++) {
        const currCountry = countryDataArray[i];
        const newOption = document.createElement("option");
        newOption.textContent = currCountry;
        newOption.value = currCountry;
        countryFlagSelect.append(newOption);
    }

    //disable submit and reset game button upon game load
    function enableNewFlagBtn() {
        newFlagBtn.disabled = false;
        newFlagBtn.style.opacity = "1";
        newFlagBtn.style.cursor = "pointer";
    }

    function disableNewFlagBtn() {
        newFlagBtn.disabled = true;
        newFlagBtn.style.opacity = "0.5";
        newFlagBtn.style.cursor = "not-allowed";
    }

    function enableSubmitBtn() {
        submitAnswerBtn.disabled = false;
        submitAnswerBtn.style.opacity = "1";
        submitAnswerBtn.style.cursor = "pointer";
    }

    function disableSubmitBtn() {
        submitAnswerBtn.disabled = true;
        submitAnswerBtn.style.opacity = "0.5";
        submitAnswerBtn.style.cursor = "not-allowed";
    }

    function enableResetGameBtn() {
        resetGameBtn.disabled = false;
        resetGameBtn.style.opacity = "1";
        resetGameBtn.style.cursor = "pointer";
    }

    function disableResetGameBtn() {
        resetGameBtn.disabled = true;
        resetGameBtn.style.opacity = "0.5";
        resetGameBtn.style.cursor = "not-allowed";
    }

    function resetScore() {
        incorrectScoreTotal = 0;
        correctScoreTotal = 0;
        correctScore.innerText = correctScoreTotal;
        incorrectScore.innerText = incorrectScoreTotal;
    }

    //generate API request for new flag image
    newFlagBtn.addEventListener("click", newFlag);

    //disable submit button
    disableSubmitBtn();
    // disable reset button
    disableResetGameBtn();
    //reset flag select
    countryFlagSelect.value = "";

    function newFlag() {
        //generate a random number between 0 and 249
        const random = Math.floor(Math.random() * 250);
        //update random Country variable to generate random country
        randomCountry = data[random];
        //generate a random flag
        const randomFlag = data[random].flags.png;
        //once new flag button is clicked, display new flag
        flagImage.style.display = "block";
        flagImage.src = randomFlag;
        //remove previous answer
        correctAnswerOutput.innerHTML = "";
        //reset select options
        countryFlagSelect.value = "";
        //enable submit answer button
        enableSubmitBtn();
        //disable newFlag button until submission is made for current flag 
        disableNewFlagBtn();
        //enable game reset button
        enableResetGameBtn();
    };

    //define submit annswer function
    function submitAnswer() {
        checkAnswer(randomCountry);
    };

    //add event listener to submit answer button
    submitAnswerBtn.addEventListener("click", submitAnswer);

    function checkAnswer(randomCountry) {
        console.log(countryDataArray)
        //actual flag being displayed
        const displayFlagCountry = randomCountry.name.common;
        //player selected country
        const playerSelectedCountry = countryFlagSelect.value;

        if (displayFlagCountry === playerSelectedCountry) {
            //increment correctScoreTotal by 1 point
            correctScoreTotal++;
            correctScore.innerText = correctScoreTotal;
            correctAnswerOutput.innerHTML = `Great job! You are correct! This flag does belong to <p style="font-size:60px; font-family:GvTime">${displayFlagCountry}!<img id="tiny-flag" src="${randomCountry.flags.png}">`;
            //disable submit button
            disableSubmitBtn();
            //enable new flag button to generate a new flag
            enableNewFlagBtn();
            //push name of flag into correct answers array
            flagsAnsweredCorrectly.push(displayFlagCountry);
            //remove flag from countryDataArray so it does not come up again
            countryDataArray.splice(countryDataArray.indexOf(displayFlagCountry), 1);
        } else {
            incorrectScoreTotal++;
            incorrectScore.innerText = incorrectScoreTotal;
            correctAnswerOutput.innerHTML = `I'm sorry, but the correct answer is <p style="font-size:60px; font-family:GvTime">${displayFlagCountry}! <img id="tiny-flag" src="${randomCountry.flags.png}">`;
            //disable submit button
            disableSubmitBtn();
            //enable new flag button for next flag to guess
            enableNewFlagBtn();
            //push name of flag into incorrect answers array
            flagsAnsweredIncorrectly.push(displayFlagCountry);
            //remove flag from countryDataArray so it does not come up again
            countryDataArray.splice(countryDataArray.indexOf(displayFlagCountry), 1);
        }

        // after all flags have been guessed in the countryDataArray
        if (countryDataArray.length === 245) {
            gameHeading.innerText = "Game complete! Please reset the game or practice your missed guesses below!";
            gameHeading.style.fontSize = "50px";
            gameHeading.style.lineHeight = "1";
            disableNewFlagBtn();
            practiceIncorrectFlagsBtn.style.display = "block";
            //remove previous eventlistener from newFlag button
            newFlagBtn.removeEventListener("click", newFlag);
            //remove the event listener for checkAnswer 
            submitAnswerBtn.removeEventListener("click", submitAnswer);
        }
    }

    function resetGame() {
        gameHeading.innerText = "Guess the country!";
        gameHeading.style.fontSize = "70px";
        gameHeading.style.color = "-webkit-text-stroke: .5px #04AA6D";
        //reset score
        resetScore()
        correctAnswerOutput.innerHTML = "";
        flagImage.style.display = "none";
        //reset select options
        countryFlagSelect.value = "";
        practiceIncorrectFlagsBtn.style.display = "none";
        //enable newflag button
        enableNewFlagBtn()
        //disable submit answer button
        disableSubmitBtn()
        //confirms data in countryDataArray is reset for fresh game with all flags
        // reset coutry data array to original data array
        countryDataArray = data;
        console.log(data.length)
        console.log(countryDataArray.length)
        console.log(data)
    }

    //add event listener to reset button to reset game
    resetGameBtn.addEventListener("click", resetGame);

    //add event listener to flag practice button
    practiceIncorrectFlagsBtn.addEventListener("click", wrongFlagsGenerator);

    //create function that removes all previous country options from previous game select
    function removeAllOptions(selectBox) {
        while (selectBox.options.length > 0) {
            selectBox.remove(0);
        }
    }

    function testMeAgain() {
        //enable new flag from incorrect array
        enableNewFlagBtn()
        //disable submit buttons
        disableSubmitBtn()
        flagImage.style.display = "none";
        practiceIncorrectFlagsBtn.style.display = "none";
        //remove previous answer
        correctAnswerOutput.innerHTML = "";
        //reset select options
        countryFlagSelect.value = "";
    }

    function wrongFlagsGenerator() {
        countryFlagSelect.value = "";
        gameHeading.innerHTML = `Incorrect Flag <br> Practice Round`;
        gameHeading.style.fontSize = "60px";
        testMeAgain();
        //reset score
        resetScore();
        console.log(flagsAnsweredIncorrectly)
        //add new event listener to newFlag button for wrong flag practice round
        newFlagBtn.addEventListener("click", practiceIncorrectFlags);
        //remove previous options from select
        removeAllOptions(countryFlagSelect);
        //sort flags options alphabetically
        flagsAnsweredIncorrectly.sort();
        console.log(flagsAnsweredIncorrectly)

        //loop through flagsAnsweredIncorrectly to create all country option elements in select
        for (let i = 0; i < flagsAnsweredIncorrectly.length; i++) {
            const currPracticeCountry = flagsAnsweredIncorrectly[i];
            const newPracticeOption = document.createElement("option");
            newPracticeOption.textContent = currPracticeCountry;
            newPracticeOption.value = currPracticeCountry;
            countryFlagSelect.append(newPracticeOption);
        }
    }

    //begin practice of incorrect flags
    function practiceIncorrectFlags() {
        countryFlagSelect.value = "";
        //add event listener to submit button
        submitAnswerBtn.addEventListener("click", submitPracticeAnswer);
        //enable submit button
        enableSubmitBtn();
        //generate a random number between 0 and length of wrong flags array
        const random = Math.floor(Math.random() * flagsAnsweredIncorrectly.length);
        //generate a random country from the wrong country array
        randomWrongCountry = flagsAnsweredIncorrectly[random];
        console.log(randomWrongCountry)

        //loop through data array to grab flag urls to generate random wrong flags
        for (let i = 0; i < data.length; i++) {
            //update random Country variable to generate random country
            if (data[i].name.common === randomWrongCountry) {
                const wrongRandomFlag = data[i].flags.png;
                //display new flag
                flagImage.style.display = "block";
                flagImage.src = wrongRandomFlag;
            }
        }

        function submitPracticeAnswer() {
            if (randomWrongCountry === countryFlagSelect.value) {
                //increment correctScoreTotal by 1 point
                correctScoreTotal++;
                correctScore.innerText = correctScoreTotal;
                correctAnswerOutput.style.display = "block";
                correctAnswerOutput.innerHTML = `Great job! You are correct! This flag does belong to <p style="font-size:60px; font-family:GvTime">${randomWrongCountry}!`;
                //enable new flag button to generate a new flag
                enableNewFlagBtn();
                //remove flag from array so it does not come up again
                flagsAnsweredIncorrectly.splice(flagsAnsweredIncorrectly.indexOf(randomWrongCountry), 1);
                console.log(flagsAnsweredIncorrectly)
            } else {
                incorrectScoreTotal++;
                incorrectScore.innerText = incorrectScoreTotal;
                correctAnswerOutput.innerHTML = `I'm sorry, but the correct answer is <p style="font-size:60px; font-family:GvTime">${randomWrongCountry}!`;
                //enable new flag button for next flag to guess
                enableNewFlagBtn()
                //remove flag from array so it does not come up again
                flagsAnsweredIncorrectly.splice(flagsAnsweredIncorrectly.indexOf(randomWrongCountry), 1);
                console.log(flagsAnsweredIncorrectly)
            }

            //remove event listener to submit button
            submitAnswerBtn.removeEventListener("click", submitPracticeAnswer);

            if (flagsAnsweredIncorrectly.length === 0) {
                gameHeading.innerText = "Game over! Keep practicing!"
                gameHeading.style.fontSize = "60px";
                gameHeading.style.lineHeight = "1";
                gameHeading.style.color = "red";
                disableNewFlagBtn();
                resetGameBtn.style.display = "none";
                countryFlagSelect.style.display = "none";
                submitAnswerBtn.style.display = "none";
            }
        }
    }
}

main();


//add game reset button DONE
//no new flag button until answer submitted, gray out disabled buttons DONE
//don't allow the same country to be seen more than once (DONE)
    // once country has come up as flag, remove country data object from array (DONE)
    //create arrays holding incorrect flag names and correct flag names (DONE)


//practice incorrect flags (DONE)