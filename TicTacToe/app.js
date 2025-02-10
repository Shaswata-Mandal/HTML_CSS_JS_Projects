let started=false;
let playerX=true;
let xWinCount=0;
let oWinCount=0;
let drawCount=0;
const patterns=[[1,2,3],[4,5,6],[7,8,9],[1,4,7],[2,5,8],[3,6,9],[1,5,9],[3,5,7]];
let boxes=document.querySelectorAll(".boxes");
let gameStatus=document.querySelector(".game_status");

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
    console.log(started);
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
    }
    else{
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
                console.log("game stoped")
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
        console.dir(cross.style);
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