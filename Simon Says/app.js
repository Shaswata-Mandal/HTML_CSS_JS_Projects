let gameSeq=[];
let userSeq=[];
let boxes=["yellow", "red", "purple", "green"];

let started=false;
let level=0;
let maxScore=0;
let hearts=5;
let hints=5;
let previousScore=0;


//Start decting for the key press
start();

if(window.innerWidth<=1024){
    document.querySelector(".game_status").addEventListener("click", keyDetection);
    document.querySelector(".game_status").innerText="Press Here To Start The Game";
}

//Function to start decting for the key press
function start(){
    document.addEventListener("keypress", keyDetection);
}

function keyDetection(){
    let h1=document.querySelector(".game_status");
    h1.innerText="Game Started!";
    started=true;   
    
    if(window.innerWidth<=480 && h1.innerText.trim()==="Game Started!"){
        h1.classList.add("margin");
    }

    //stop detecting keypress after the game has started
    document.removeEventListener("keypress", keyDetection);
    document.querySelector(".game_status").removeEventListener("click", keyDetection);
    
    //Flashing the new box and Levleing up
    levelUp();
}


//Function to flash a random box when level gets updated
function levelUp(){
    console.log("--------------------");
    level++;
    let levelDisplay=document.querySelector(".level");
    levelDisplay.innerHTML=`Level: ${level}`;
    userSeq=[];

    //Updating current score
    let currentScore=document.querySelector(".current-score");
    currentScore.innerText=`Current Score: ${level-1}`;

    //Generating random game color and adding to the game sequence
    let rndIndx=Math.floor(Math.random()*3);
    let rndColor=boxes[rndIndx];
    gameSeq.push(rndColor);
    console.log("New gaem seq: ", gameSeq);
    
    //Selecting and flashing the random box that the game has generated
    let rndBox=document.querySelector(`.${rndColor}`);
    boxFlash(rndBox);
    activateBoxes();
};


//Function for flashing the boxes
function boxFlash(box){
    box.classList.add("flash");
    setTimeout(()=>{
        box.classList.remove("flash");
    }, 150);
};

//----------------------------------------------------------------------------------------------------------------
//Taking user inputs for the sequence
//Adding events to all the boxes to listen to the click
let allBoxes=document.querySelectorAll(".boxes");

function activateBoxes(){
    for(box of allBoxes){
        box.addEventListener("click", boxPress);
    }
}

function boxPress(){

    //Allowing the click and preform the relevant action after clicking any box only when game is started
    if(started){
        let box=this;
        boxFlash(box);
        let userColor=box.classList[1];
        //Adding the user clicked color to the user sequence
        userSeq.push(userColor);

        //After each pressing of any box, check if the user pressed the correct box or not
        checkAns();
    }
    
}

//Checking if the user choose the right color or not after each click
function checkAns(){

    if( (userSeq[userSeq.length-1]===gameSeq[userSeq.length-1]) && (userSeq.length==gameSeq.length)){
        setTimeout(()=>{
            levelUp();
        },1000);
    }
    else if(!(userSeq[userSeq.length-1]===gameSeq[userSeq.length-1])){
        wrongSeq();
        restart();
        if(hearts!=0){
            useHearts();
        }
        
    }
}

// ----------------------------------------------------------------------------------------------------------------
//Functioning after user hits any wrong color---------------------------------------
//If user chooses wrong box at any point of time
function wrongSeq(){
    //Giving a background color if user selects wrong box at any point of time
    let container=document.querySelector(".main_container");
    container.style.backgroundColor="rgba(255, 0, 0, 0.327)";
    setTimeout(()=>{
        container.style.backgroundColor="rgba(127, 255, 212, 0.327)";
    },100);

    //Updating the game status message
    let h1=document.querySelector(".game_status");
    h1.innerText="Wrong Choice! Use Hearts/Restart";
    if(window.innerWidth<=1024){
        h1.innerText="Wrong! Use Hearts/Press Here";
        h1.style.textAlign="center";
        h1.classList.remove("margin");
    }

    if(hearts==0){
        h1.innerText="Press any key to restart the game!";
        hintContainer.removeEventListener("click", hintFunctioning);
    }

    //Providing hint alert when wrong choice of box is made so that user uses heart or restarts the game
    hintContainer.addEventListener("click", hintFunctioning);

    for(box of allBoxes){
        box.removeEventListener("click", boxPress);
    }
    
}

//----------------------------------------------------------------------------------------------
//Heart Feature Functioning------------------------------------------
let heartContainer=document.querySelector(".hearts");
//If trying to access heart before starting the game
heartContainer.addEventListener("click", heartAlert);

function heartAlert(){
    if(hearts==0){
        customAlert("Your Hearts have exhausted!");
    }
    if(level==0){
        customAlert("Pleae start the game to start using the heart when needed");
    }
}

function useHearts(){
    heartContainer.addEventListener("click", heartFunctioning); 
}

function heartFunctioning(){
    //Removing the event from the document so that if heart is used then, it does not accepts any other keypress
    document.removeEventListener("keypress", reset);
    document.querySelector(".game_status").removeEventListener("click", reset);

    hearts--;

    heartContainer.removeEventListener("click", heartFunctioning);
    let h1=document.querySelector(".game_status");
    h1.innerText="Game Revived!";
    if(window.innerWidth<=480 && h1.innerText.trim()==="Game Revived!"){
        h1.classList.add("margin");
    }
    
    let heartCounter=document.querySelector(".hearts .count");
    heartCounter.innerText=`${hearts}`;

    //Re-providing the hint feature after user have used the heart
    hintContainer.addEventListener("click", hintFunctioning);

    userSeq=userSeq.slice(0, userSeq.length-1);
    activateBoxes();
}

//----------------------------------------------------------------------------------------------------------
//Restart Funcitoning----------------------------------------------------
//If not heart then restart after any key is pressed
function restart(){
    document.addEventListener("keypress", reset);
    if(window.innerWidth<=1024){
        document.querySelector(".game_status").addEventListener("click", reset);
    }
}

//Function for restarting the game
function reset(){

    //Removing the event from the document so that after pressing once, it does not accepts any other keypress
    document.removeEventListener("keypress", reset);
    document.querySelector(".game_status").removeEventListener("click", reset);
    
    //Updating the current score
    let currentScore=document.querySelector(".previousScore");
    currentScore.innerText=`Previous Score: ${level-1}`;
    previousScore=level-1;

    let heartCounter=document.querySelector(".hearts .count");
    heartCounter.innerText=`5`;

    let hintContainerFrontCounter=document.querySelector(".hint .count");
    hintContainerFrontCounter.innerText=`5`;
    hintContainer.addEventListener("click", hintFunctioning);

    //Updating the max score
    if(level-1>maxScore){
        maxScore=level-1;
        let maxScoreData=document.querySelector(".maxScore");
        maxScoreData.innerText=`Max Score: ${maxScore}`;
    }

    //Updating the level
    level=0;
    let levelDisplay=document.querySelector(".level");
    levelDisplay.innerHTML=`Level: ${level}`;

    //Updating the global variable to its initial values
    userSeq=[];
    gameSeq=[];
    // started=false;
    hearts=5;
    hints=5;
    keyDetection();
}

//-------------------------------------------------------------------------------------------------
//Hint feature code------------------------
//Getting the hint container and adding event (used chatGPT to generate the flipping effect)
let hintContainer=document.querySelector(".hint");
hintContainer.addEventListener("click", hintFunctioning);

function hintFunctioning(){

    if(gameSeq.length==userSeq.length){
        customAlert("First use the Heart and then take hints");
    }

    else if(gameSeq.length!=0 && hints!=0){

        //Updating hint count
        hints--;
        let hintContainerFrontCounter=document.querySelector(".hint .count");
        hintContainerFrontCounter.innerText=`${hints}`;

        //Flipping the hint container
        setTimeout(()=>{
            hintContainer.style.transform="rotateY(180deg)";
        },300);
        
        //index of the hint color to be given at any point of time
        let nextColorHintIndex= userSeq.length;
        //Updated the hint color to back div of the hint container 
        hintContainer.children[1].innerHTML=`Next Color ${gameSeq[nextColorHintIndex].toUpperCase()}`;
        //Updating the background color of the back div fo the hint container according to the hint color
        hintContainer.children[1].classList.add(`${gameSeq[nextColorHintIndex]}`);

        //Back div back flipping after 1 second
        setTimeout(()=>{
            hintContainer.style.transform="rotateY(360deg)";
            //Removing the hint color from the background after flipping
            setTimeout(()=>{
                hintContainer.children[1].classList.remove(`${gameSeq[nextColorHintIndex]}`);
            }, 1800);
        }, 1000);
    }

    else if(gameSeq.length==0){
        customAlert("You cannot get hint without starting the game");
    }

    else{
        customAlert("Your Hints have exhausted!");
    }
    
}

//----------------------------------------------------------------------------------------------------------------
//Alert Functioning

function customAlert(message){
    let overlay=document.querySelector(".overlay");
    overlay.style.display="flex";

    let alert=document.querySelector(".overlay .custom-alert");
    alert.children[1].innerText=`${message}`;
    console.log();

    let cross=document.querySelector(".cross");
    cross.addEventListener("click", ()=>{
        overlay.style.display="none";
    });
}

//----------------------------------------------------------------------------------
//Dark theme Functionality (Done with chatGPT)
document.addEventListener("DOMContentLoaded", () => {
    const lightMode = document.getElementById("light");
    const darkMode = document.getElementById("dark");

    // Event Listener for Light Mode
    lightMode.addEventListener("change", () => {
        if (lightMode.checked) {
            document.body.classList.remove("dark-theme");
        }
    });

    // Event Listener for Dark Mode
    darkMode.addEventListener("change", () => {
        if (darkMode.checked) {
            document.body.classList.add("dark-theme");
        }
    });
});

// --------------------------------------------------------------------------------------------------
//Code for dynamic changing of website title 
document.addEventListener("visibilitychange", function() {
    if (document.hidden) {
        document.title = "Come back! 😢";
    } else {
        document.title = "Glad you're back! 😊";
        setTimeout(()=>{
            document.title = "Simon Says";
        }, 2000);
    }
});

// ----------------------------------------------------------------------------------------------------
//Scorecard sharing functionality-----------used chatGPT
let message;

function handleShare() {
    if (!started) {
        customAlert("You can use the Share button only when the game is Started!");
    } else {
        //Updating score on scorecard
        let scoreDetailParent=document.querySelector(".score-details");
        scoreDetailParent.children[1].innerText=`Level: ${level}`;
        scoreDetailParent.children[2].innerText=`Current Score: ${level-1}`;
        scoreDetailParent.children[3].innerText=`Previous Score: ${previousScore}`;
        scoreDetailParent.children[4].innerText=`Max Score: ${maxScore}`;
        scoreDetailParent.children[5].innerText=`Lives Left: ❤️ ${hearts}`;
        scoreDetailParent.children[6].innerText=`Hints Left: 😊 ${hints}`;

        //Updating message
        const playerName = document.getElementById("playerName")?.value || "Player";
        message= `🎮 ${playerName} just scored!\nLevel: ${level}\nCurrent Score: ${level-1}\nPrevious Score: ${previousScore}\nMax Score: ${maxScore}\nLives Left: ❤️ ${hearts}\nHints Left: 😊 ${hints}\nPlay Now: https://shaswata-mandal.github.io/HTML_CSS_JS_Projects/Simon%20Says/`;
       
        // Show Bootstrap Modal
        var myModal = new bootstrap.Modal(document.getElementById('scoreCard'));
        myModal.show();
    }
}

//Function to copy the message to the clipboard
function copyToClipboard() {
    navigator.clipboard.writeText(message).then(() => {
        alert("✅ Score copied to clipboard!");
    }).catch(err => {
        alert("❌ Failed to copy score. Try again!");
    });
}


//-------------------------------------------------------------------------------------------------------------------------------------------------
// Loading styling(using chatGPT)-----------------

let load = 0;
let loadingText = document.getElementById('loading-text');

function updateLoading() {
    if (load < 100) {
        load++;
        loadingText.innerText = load + "%";
        setTimeout(updateLoading, 20); // Adjust speed of loading
    } else {
        // Ensure splash screen disappears only after reaching 100%
        setTimeout(() => {
            document.getElementById('splash').style.animation = "fadeOut 1s ease-out forwards";
            setTimeout(() => {
                document.getElementById('splash').style.display = 'none';
            }, 1100); // Matches fade-out duration
        }, 500); // Extra delay to let 100% stay visible for a moment
    }
}

updateLoading();