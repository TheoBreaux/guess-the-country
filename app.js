async function main() {
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

    //grab data from API call 
    const countryRequest = await fetch("https://restcountries.com/v3.1/all");
    //parse return JSON values
    data = await countryRequest.json();
    const countryDataArray = data.map((countryObj) => countryObj.name.common).sort();
    //loop through countryDataArray to create all country option elements in select
    for (let i = 0; i < countryDataArray.length; i++) {
        const currCountry = countryDataArray[i];
        const newOption = document.createElement("option");
        newOption.textContent = currCountry;
        newOption.value = currCountry;
        countryFlagSelect.append(newOption);
    }

    //generate API request for new flag image
    newFlagBtn.addEventListener("click", async function () {
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
    })

    //add event listener to submit answer button
    submitAnswerBtn.addEventListener("click", () => {
        checkAnswer(randomCountry);
    });

    //add event listener to reset button
    resetGameBtn.addEventListener("click", () => {
        correctScore.innerText = 0, incorrectScore.innerText = 0;
        correctAnswerOutput.innerHTML = "";
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
        }
    }
}
main();


//add game reset button DONE
//no new flag button until answer submitted, gray out disabled buttons DONE



//don't allow the same country to be seen more than once
    // once country has come up as flag, remove country data object from array 
//be able to click correct and incorrect and see which countrues you answered for each, disable select
    //create arrays holding incorrect flag names and correct flag names 
//practice incorrect flags

