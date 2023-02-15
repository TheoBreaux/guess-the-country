async function main() {
    //grab gameHeading
    const gameHeading = document.getElementById("game-heading");
    //grab flagPractice Button
    const flagPracticeBtn = document.getElementById("flag-practice-btn");
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
    //grab correct answer output
    const correctAnswerOutput = document.getElementById("correct-answer-output");
    //declare return API data as local variable for future access
    let data;
    //declare random country variable to be updated later
    let randomCountry;
    //initialize empty array to store corrrect answers
    let flagsAnsweredCorrectly = [];
    //initialize empty array to store corrrect answers
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

    //generate API request for new flag image
    newFlagBtn.addEventListener("click", newFlagGenerator);

    async function newFlagGenerator() {
        // re-enable submit answer button
        submitAnswerBtn.disabled = false;
        submitAnswerBtn.style.opacity = "1";
        submitAnswerBtn.style.cursor = "pointer";
        //generate a random number between 0 and 249
        const random = Math.floor(Math.random() * 250);
        //generate a random country to pass into function later
        randomCountry = data[random];
        //generate a random flag
        const randomFlag = data[random].flags.png;

        //once new flag button is clicked, display new flag
        flagImage.style.display = "block";
        //update t0 new flag
        flagImage.src = randomFlag;
        newFlagBtn.disabled = true;
        newFlagBtn.style.opacity = "0.5";
        newFlagBtn.style.cursor = "not-allowed";
        //remove previouis answer
        correctAnswerOutput.innerHTML = "";
        //reset select options
        countryFlagSelect.value = "";
    };

    //add event listener to submit answer button
    submitAnswerBtn.addEventListener("click", () => {
        checkAnswer(randomCountry);
    });

    function checkAnswer(randomCountry) {
        const displayFlagCountry = randomCountry.name.common; //actual flag being displayed
        const playerSelectedCountry = countryFlagSelect.value; //player selected country

        if (displayFlagCountry === playerSelectedCountry) {
            //increment correctScoreTotal by 1 point
            correctScoreTotal++;
            correctScore.innerText = correctScoreTotal;
            correctAnswerOutput.innerHTML = `Great job! You are correct! This flag does belong to <p style="font-size:60px; font-family:GvTime">${displayFlagCountry}!<img id="tiny-flag" src="${randomCountry.flags.png}">`;
            submitAnswerBtn.disabled = true;
            submitAnswerBtn.style.opacity = "0.5";
            submitAnswerBtn.style.cursor = "not-allowed";
            newFlagBtn.disabled = false;
            newFlagBtn.style.opacity = "1";
            newFlagBtn.style.cursor = "pointer";
            //push name of flag into correct answers array
            flagsAnsweredCorrectly.push(displayFlagCountry);
            //remove flag from countryDataArray so it does not come up again
            countryDataArray.splice(countryDataArray.indexOf(displayFlagCountry), 1);
        } else {
            incorrectScoreTotal++;
            incorrectScore.innerText = incorrectScoreTotal;
            correctAnswerOutput.innerHTML = `I'm sorry, but the correct answer is <p style="font-size:60px; font-family:GvTime">${displayFlagCountry}! <img id="tiny-flag" src="${randomCountry.flags.png}">`;
            submitAnswerBtn.disabled = true;
            submitAnswerBtn.style.opacity = "0.6";
            submitAnswerBtn.style.cursor = "not-allowed";
            newFlagBtn.disabled = false;
            newFlagBtn.style.opacity = "1";
            newFlagBtn.style.cursor = "pointer";
            //push name of flag into incorrect answers array
            flagsAnsweredIncorrectly.push(displayFlagCountry);
            //remove flag from countryDataArray so it does not come up again
            countryDataArray.splice(countryDataArray.indexOf(displayFlagCountry), 1);
        }

        if (countryDataArray.length === 247) {
            gameHeading.innerText = "Game complete! Please reset the game or practice your missed guesses below!";
            gameHeading.style.fontSize = "50px";
            gameHeading.style.lineHeight = "1";
            newFlagBtn.disabled = true;
            newFlagBtn.style.opacity = "0.5";
            newFlagBtn.style.cursor = "not-allowed";
            flagPracticeBtn.style.display = "block";
        }
    }

    //add event listener to flag practice  button
    flagPracticeBtn.addEventListener("click", newPracticeFlagGenerator);

    //create remove all country options from previous game
    function removeAllOptions(selectBox) {
        while (selectBox.options.length > 0) {
            selectBox.remove(0);
        }
    }

    function newPracticeFlagGenerator() {
        //remove previous options from select
        removeAllOptions(countryFlagSelect);
        flagsAnsweredIncorrectly.sort();

        //loop through flagsAnsweredIncorrectly to create all country option elements in select
        for (let i = 0; i < flagsAnsweredIncorrectly.length; i++) {
            const currCountry = flagsAnsweredIncorrectly[i];
            const newOption = document.createElement("option");
            newOption.textContent = currCountry;
            newOption.value = currCountry;
            countryFlagSelect.append(newOption);
        }

        gameHeading.innerHTML = `Incorrect Flag <br> Practice Round`;
        gameHeading.style.fontSize = "60px";
        correctScore.innerText = 0, incorrectScore.innerText = 0;
        newFlagBtn.disabled = false;
        newFlagBtn.style.cursor = "pointer";
        newFlagBtn.style.opacity = "1";
        // enable all buttons
        submitAnswerBtn.disabled = false;
        submitAnswerBtn.style.opacity = "1";
        submitAnswerBtn.style.cursor = "pointer";
        flagImage.style.display = "none";
        flagPracticeBtn.style.display = "none";
        //remove previouis answer
        correctAnswerOutput.innerHTML = "";
        //reset select options
        countryFlagSelect.value = "";

        //remove previous eventlistener from newFlag button
        newFlagBtn.removeEventListener("click", newFlagGenerator);
        console.log(flagsAnsweredIncorrectly)
    }

    //add new event listener to newFlag button for wrong flag practice round
    newFlagBtn.addEventListener("click", wrongFlagPractice)


    //STILL TRYING TO FIGURE WHY THE ARRAY OF WRONG ANSWERS IS NOT WORKING 
    function wrongFlagPractice() {
        //generate a random number between 0 and number of flagsAnsweredIncorrectly
        const random = Math.floor(Math.random() * flagsAnsweredIncorrectly.length);

        //generate a random country to pass into function later
        const randomPracticeCountry = flagsAnsweredIncorrectly[random];
        // //generate a random flag
        // const randomFlag = data[random].flags.png;

        // //once new flag button is clicked, display new flag
        // flagImage.style.display = "block";
        // //update t0 new flag
        // flagImage.src = randomFlag;
        // newFlagBtn.disabled = true;
        // newFlagBtn.style.opacity = "0.5";
        // newFlagBtn.style.cursor = "not-allowed";
        // //remove previouis answer
        // correctAnswerOutput.innerHTML = "";
        // //reset select options
        // countryFlagSelect.value = "";
    }





    //add event listener to reset button to reset game
    resetGameBtn.addEventListener("click", () => {
        gameHeading.innerText = "Guess the country!";
        gameHeading.style.fontSize = "80px";
        incorrectScoreTotal = 0;
        correctScoreTotal = 0;
        correctScore.innerText = correctScoreTotal;
        incorrectScore.innerText = incorrectScoreTotal;
        correctAnswerOutput.innerHTML = "";
        flagImage.style.display = "none";
        //reset select options
        countryFlagSelect.value = "";
        flagPracticeBtn.style.display = "none";
        newFlagBtn.disabled = false;
        newFlagBtn.style.opacity = "1";
        newFlagBtn.style.cursor = "pointer";
        submitAnswerBtn.disabled = false;
        submitAnswerBtn.style.opacity = "1";
        submitAnswerBtn.style.cursor = "pointer";
        console.log(data.length)
        console.log(data)
    });

    // function repopulateGame() {
    //     console.log(flagsAnsweredIncorrectly)
    //     console.log(flagsAnsweredIncorrectly.length)

    //     //generate a random number between 0 and 249
    //     const random = Math.floor(Math.random() * flagsAnsweredIncorrectly.length);
    //     //generate a random country to pass into function later
    //     const randomCountry = flagsAnsweredIncorrectly[random];





    //     //generate a random flag
    //     const randomFlag = data[random].flags.png;

    //     //once new flag button is clicked, display new flag
    //     flagImage.style.display = "block";
    //     //update t0 new flag
    //     flagImage.src = randomFlag;
    //     newFlagBtn.disabled = true;
    //     newFlagBtn.style.opacity = "0.5";
    //     newFlagBtn.style.cursor = "not-allowed";
    //     //remove previouis answer
    //     correctAnswerOutput.innerHTML = "";
    //     //reset select options
    //     countryFlagSelect.value = "";


    // }



    //loop through flagsincorrect array and match country with flag url.
    // for (let i = 0; i < data.length; i++) {
    //     if (flagsAnsweredIncorrectly.includes(data[i].name.common)) {
    //         const randomFlag = data[i].flags.png;
    //         console.log(randomFlag)
    //         //update to new flag
    //         flagImage.src = randomFlag;
    //     }

    // }

    //     correctAnswerOutput.innerHTML = "";
    //     flagPracticeBtn.style.display = "none";
    //     flagImage.style.display = "none";
    //     resetGameBtn.style.display = "none";
    //     countryFlagSelect.value = "";
    //     submitAnswerBtn.disabled = false;
    //     submitAnswerBtn.style.cursor = "pointer";
    //     submitAnswerBtn.style.opacity = "1";



    //     console.log(flagsAnsweredIncorrectly)
    //     for (let i = 0; i < flagsAnsweredIncorrectly.length; i++) {
    //         const currCountry = flagsAnsweredIncorrectly[i];
    //         console.log(currCountry)
    //         const newOption = document.createElement("option");
    //         newOption.textContent = currCountry;
    //         newOption.value = currCountry;
    //         countryFlagSelect.append(newOption);
    //     }




}

main();


//add game reset button DONE
//no new flag button until answer submitted, gray out disabled buttons DONE
//don't allow the same country to be seen more than once (DONE)
    // once country has come up as flag, remove country data object from array (DONE)
    //create arrays holding incorrect flag names and correct flag names (DONE)


//practice incorrect flags

