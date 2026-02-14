let started=false;
let playerX=true;
let xWinCount=0;
let oWinCount=0;
let drawCount=0;
const patterns=[[1,2,3],[4,5,6],[7,8,9],[1,4,7],[2,5,8],[3,6,9],[1,5,9],[3,5,7]];
let boxes=document.querySelectorAll(".boxes");
let gameStatus=document.querySelector(".game_status");
let gameMode=document.querySelector("#game-mode");

start();

if(window.innerWidth<=1024){
    document.querySelector(".game_status").addEventListener("click", restart);
    document.querySelector(".game_status").innerText="Press Here To Start The Game";
}

function start(){
    document.addEventListener("keypress", restart); 
}

//Starting the game when any key is pressed
function restart(){

    gameStatus.innerText="Game Started";
    boxes.forEach(box=>{
        box.innerText="";
        box.classList.remove("purple", "green");
    });

    started =true;
    updatePlayerTurnIndicator();
    document.removeEventListener("keypress", restart);
    document.querySelector(".game_status").removeEventListener("click", restart);
    // console.log(started);
    boxClickable();
}

//Making the box clickable once the game has started and removing the click event from the box which is once clicked.
function handleClick(event) {
    updateBox(event.target);
    event.target.removeEventListener("click", handleClick);
}

function boxClickable() {
    boxes.forEach(box => {
        box.addEventListener("click", handleClick);
    });
}

function removeAllClickEvents() {
    boxes.forEach(box => {
        box.removeEventListener("click", handleClick);
    });
}


//Updating the clicked box with the player by which the box was clicked
function updateBox(box){

    if(playerX){
        box.innerText="X";
        box.classList.add("purple");
        playerX=false;

        setTimeout(()=>{
            if(gameMode.value==="1-player-easy" && playerX===false){
                easyComputerMove();
            }
        }, 500); 

        setTimeout(()=>{
            if(gameMode.value==="1-player-hard" && playerX===false){
                hardComputerMove();
            }
        }, 500); 
    }
    else if(gameMode.value!="1-player-easy"){
        box.innerText="O";
        box.classList.add("green");
        playerX=true;
    }

    updatePlayerTurnIndicator();

    //Once a box is clicked check if any winning pattern is formed or not
    checkPattern();
}


//Checking for winning patterns
function checkPattern(){

    //checking the inner text of boxes for each pattern
    patterns.forEach(pattern=>{
        const element1 = document.getElementById(`${pattern[0]}`);
        const element2 = document.getElementById(`${pattern[1]}`);
        const element3 = document.getElementById(`${pattern[2]}`);
        const val1 = element1.innerText.trim();
        const val2 = element2.innerText.trim();
        const val3 = element3.innerText.trim();

        //if the inner text of boxes of all the indices in a patter are same then that player has won
        if(val1!="" && val2!="" && val3!=""){
            if(val1 === val2 && val2 === val3){
                let winner=document.getElementById(`${pattern[0]}`).innerText;
                gameStatus.innerText=`Player ${winner} has won! Press Any Key To Restart`;
                if(window.innerWidth<=1024){
                    gameStatus.innerText=`Player ${winner} has won! Press Here To Restart`;
                }

                //Updating score
                if(winner==="X"){
                    xWinCount++;
                    let xWinCountBox=document.querySelector(".xWinCount");
                    xWinCountBox.innerText=`Player X: ${xWinCount} Wins`;
                }
                else{
                    oWinCount++;
                    let oWinCountBox=document.querySelector(".oWinCount");
                    oWinCountBox.innerText=`Player O: ${oWinCount} Wins`;
                }
                // console.log(`Player ${document.getElementById(`${pattern[0]}`).innerText} has won`);
                removeAllClickEvents();
                flicker(element1, element2, element3, winner);
                started=false;
                playerX=true;
                updatePlayerTurnIndicator();
                // console.log("game stoped")
                setTimeout(()=>{
                    start();
                    if(window.innerWidth<=1024){
                        document.querySelector(".game_status").addEventListener("click", restart);
                    }
                }, 900);
            }

        }
    }); 

    //checking if the game is draw
    let boxNumber=0;
    boxes.forEach(box=>{
        if(box.innerText!=""){
            boxNumber++;
        }  
    });

    if(boxNumber==9 && started){
        gameStatus.innerText="Draw! Press Any Key To Restart";
        let h1=document.querySelector(".game_status");
        if(window.innerWidth<=1024){
            gameStatus.innerText="Draw! Press Here To Restart";
        }

        //Updating draw count
        drawCount++;
        let drawCountBox=document.querySelector(".drawCount");
        drawCountBox.innerText=`Draws: ${drawCount}`;

        started=false;
        playerX=true;

        drawFlicker();
        updatePlayerTurnIndicator();
        // console.log("game stoped")
        setTimeout(()=>{
            start();
            if(window.innerWidth<=1024){
                document.querySelector(".game_status").addEventListener("click", restart);
            }
        }, 900)
    } 
}


function drawFlicker(){
    const flickerInterval= setInterval(()=>{
        boxes.forEach(box=>{
            box.classList.toggle("yellow");
        })
    }, 150);

    setTimeout(()=>{
        clearInterval(flickerInterval);
    }, 900);
}


//Flicker the background color of the winning patter
function flicker(e1, e2, e3, winner){
    const flickerInterval= setInterval(()=>{
        if(winner==="X"){
            e1.classList.toggle("purple");
            e2.classList.toggle("purple");
            e3.classList.toggle("purple");
        }
        else{
            e1.classList.toggle("green");
            e2.classList.toggle("green");
            e3.classList.toggle("green");
        }
        
    }, 150);

    setTimeout(()=>{
        clearInterval(flickerInterval);
    }, 900);

}


//Player turn indicator boxes
let cross=document.querySelector("#cross");
let circle=document.querySelector("#circle");

function updatePlayerTurnIndicator(){
    if(playerX && started){
        cross.classList.add("red");
        circle.classList.remove("red");
    }
    else if(!started){
        cross.classList.remove("red");
        circle.classList.remove("red");
    }
    else{
        circle.classList.toggle("red");
        cross.classList.remove("red");
    }
}



//----------------------------------------------------------------------------------------------------------------
//for computer to play this game, you need to apply some adaptive algorithm instead of the following generalized code which runs as expected in certain situations only
//One player mode
//cons: cannot track opponents move and cannot get the winning move for itself

function randomIndexGenerator(){
    return Math.floor(Math.random()*9)+1;
}

function easyComputerMove(){
    let count=0;
    boxes.forEach(box=>{
        if(box.innerText!=""){
            count++;
        }
    });

    if(count<8){
        let randomIndex = randomIndexGenerator();
        let box = document.getElementById(`${randomIndex}`);
        while (true) {
            if (box.innerText!="") {
                randomIndex = randomIndexGenerator();
                box = document.getElementById(`${randomIndex}`);
            }
            else {
                break;
            }
        }
        box.removeEventListener("click", handleClick);
        box.innerText = "O";
        box.classList.add("green");
        playerX = true;
    }

    updatePlayerTurnIndicator();
    checkPattern();   
}




//----------------------------------------------------------------------------------------------------------------
//One player mode hard
//Pros: tracks opponents move and if winning then stops it
//Cons: Cannot always find the winning move and cannot prioritize if it should stop opponent from winning in a situation where it was winning if it would not had stopped the opponent


function hardComputerMove(){
    let count=0;
    let computerMoveIndex;
    boxes.forEach(box=>{
        if(box.innerText!=""){
            count++;
        }
    });

    if(count<8){

        //everything will be same as the easy one. only when we are deciding the index on which computer move is place, we need to check if the opponent is winning or not:
        //if opponent is winning, then stop them. if not then find winning pattern and place computer move. else place randomly

        if(opponentCheck()!=0){
            computerMoveIndex=opponentCheck();
            // console.log("here: ", computerMoveIndex)
        }
        else if(winningPattern()!=null){
            let pattern=winningPattern();
            // console.log(pattern)
            for(let index of pattern){
                if(document.getElementById(`${index}`).innerText===""){
                    computerMoveIndex=index;
                    // console.log("done")
                    break;
                }
            }
        }
        else{
            let randomIndex = randomIndexGenerator();
            let boxCheck = document.getElementById(`${randomIndex}`);
            while (true) {
                if (boxCheck.innerText != "") {
                    randomIndex = randomIndexGenerator();
                    boxCheck = document.getElementById(`${randomIndex}`);
                }
                else {
                    computerMoveIndex=randomIndex;
                    console.log("here2: ", computerMoveIndex)
                    break;
                }
            }
        }

        // console.log("here last: ", computerMoveIndex)

        box=document.getElementById(`${computerMoveIndex}`);
        box.removeEventListener("click", handleClick);
        box.innerText = "O";
        box.classList.add("green");
        playerX = true;
    }

    updatePlayerTurnIndicator();
    checkPattern();   
}

function opponentCheck(){
    for(let pattern of patterns){
        if(document.getElementById(`${pattern[0]}`).innerText!="" && document.getElementById(`${pattern[1]}`).innerText!="" && document.getElementById(`${pattern[2]}`).innerText!=""){
            return 0;
        }
        else if(document.getElementById(`${pattern[0]}`).innerText==="X"&&document.getElementById(`${pattern[1]}`).innerText==="X"){
            return pattern[2];
        }
        else if(document.getElementById(`${pattern[1]}`).innerText==="X"&&document.getElementById(`${pattern[2]}`).innerText==="X"){
            return pattern[0];
        }
        else if(document.getElementById(`${pattern[0]}`).innerText==="X"&&document.getElementById(`${pattern[2]}`).innerText==="X"){
            return pattern[1];
        }
    }
    return 0;
}


function winningPattern(){
    for(let pattern of patterns){
        if(document.getElementById(`${pattern[0]}`).innerText!="" && document.getElementById(`${pattern[1]}`).innerText!="" && document.getElementById(`${pattern[2]}`).innerText!=""){
            return null;
        }
        else if(document.getElementById(`${pattern[0]}`).innerText===""&&document.getElementById(`${pattern[1]}`).innerText==""&&document.getElementById(`${pattern[2]}`).innerText==""){
            return pattern;
        }
        else if( ((document.getElementById(`${pattern[0]}`).innerText==="O"&&document.getElementById(`${pattern[1]}`).innerText==="O"&&document.getElementById(`${pattern[2]}`).innerText!="")) || ((document.getElementById(`${pattern[1]}`).innerText==="O"&&document.getElementById(`${pattern[2]}`).innerText==="O"&&document.getElementById(`${pattern[0]}`).innerText!="")) || ((document.getElementById(`${pattern[0]}`).innerText==="O"&&document.getElementById(`${pattern[2]}`).innerText==="O"&&document.getElementById(`${pattern[1]}`).innerText!="")) ){
            return pattern;
        }
        else if((document.getElementById(`${pattern[0]}`).innerText==="O"&&document.getElementById(`${pattern[1]}`).innerText!=""&&document.getElementById(`${pattern[2]}`).innerText!="") || (document.getElementById(`${pattern[1]}`).innerText==="O"&&document.getElementById(`${pattern[0]}`).innerText!=""&&document.getElementById(`${pattern[2]}`).innerText!="") || (document.getElementById(`${pattern[2]}`).innerText==="O"&&document.getElementById(`${pattern[1]}`).innerText!=""&&document.getElementById(`${pattern[0]}`).innerText!="")){
            return pattern;
        }
    }
    return null;
}


//----------------------------------------------------------------------------------------------------------------
//Alert Functioning

function customAlert(message){
    let overlay=document.querySelector(".overlay");
    overlay.style.display="flex";

    let alert=document.querySelector(".overlay .custom-alert");
    alert.children[1].innerText=`${message}`;

    let cross=document.querySelector(".cross");
    cross.addEventListener("click", ()=>{
        overlay.style.display="none";
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


// ----------------------------------------------------------------------------------------------------
//Scorecard sharing functionality-----------used chatGPT
let message;

function handleShare() {
    if (!started) {
        customAlert("You can use the Share button only when the game is Started!");
    } else {

        //Updating score on scorecard
        let scoreDetailParent=document.querySelector(".score-details");
        scoreDetailParent.children[2].innerText=`Player X: ${xWinCount}`;
        scoreDetailParent.children[3].innerText=`Player O: ${oWinCount}`;
        scoreDetailParent.children[4].innerText=`Draws: ${drawCount}`;

       
        // Show Bootstrap Modal
        var myModal = new bootstrap.Modal(document.getElementById('scoreCard'));
        myModal.show();
    }
}

//Function to copy the message to the clipboard
function copyToClipboard() {

    const playerName1 = document.getElementById("playerName1")?.value || "Player X";
    const playerName2 = document.getElementById("playerName2")?.value || "Player O";

    //Updating message
        
    message= `🎮 ${playerName1} vs ${playerName2}\n${playerName1}: ${xWinCount} Wins\n${playerName2}: ${oWinCount} Wins\nDraws: ${drawCount}\nPlays Now: https://shaswata-mandal.github.io/HTML_CSS_JS_Projects/TicTacToe/`;
    
    navigator.clipboard.writeText(message).then(() => {
        alert("✅ Score copied to clipboard!");
    }).catch(err => {
        alert("❌ Failed to copy score. Try again!");
    });
}


// --------------------------------------------------------------------------------------------------
//Code for dynamic changing of website title 
document.addEventListener("visibilitychange", function() {
    if (document.hidden) {
        document.title = "Come back! 😢";
    } else {
        document.title = "Glad you're back! 😊";
        setTimeout(()=>{
            document.title = "Tic-Tac-Toe";
        }, 2000);
    }
});


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