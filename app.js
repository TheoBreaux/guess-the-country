//grab the score nodes
const correctScore = document.getElementById("correct-score");
const incorrectScore = document.getElementById("incorrect-score");
//grab new flag button node
const newFlagBtn = document.getElementById("new-flag-btn");
// grab updated flag image
const flagImage = document.getElementById("flag-image");
//grab flag country selector
const countryFlagSelect = document.getElementById("country-flag-select");
//grab submit answer button
const submitAnswerBtn = document.getElementById("submit-answer-btn");
//grab correct answer output
const correctAnswer = document.getElementById("correct-answer-output");

//generate API request for new flag image
newFlagBtn.addEventListener("click", async function (e) {
    e.preventDefault();
    //grab data from API call 
    const countryRequest = await fetch("https://restcountries.com/v3.1/all");
    //parse return JSON values
    countryRequest.json().then((data) => {
        //generate a random number between 0 and 249
        const random = Math.floor(Math.random() * 250);
        //generate a random flag
        const randomFlag = data[random].flags.png;
        //once new flag button is clicked, display new flag
        flagImage.style.display = "block";
        //update t0 new flag
        flagImage.src = randomFlag;
        // loop through data to get country names populated in select options
        for (let i = 0; i < data.length; i++) {
            const currCountry = data[i].name.common;
            const newOption = document.createElement("option");
            newOption.textContent = currCountry;
            newOption.value = currCountry;
            countryFlagSelect.append(newOption);
        }

        //add submit event listener to submit anser button
        submitAnswerBtn.addEventListener("click", checkSubmission);

        function checkSubmission() {
            checkAnswer(data);
        }
    })
})


function checkAnswer(data) {
    //test
}




