//Global Variables
let clockStarted=false;
let mins=25;
let seconds=59;
let nav=document.querySelector("nav");
let box1=document.querySelector(".box1");
let body=document.querySelector("body");
let lastColor="pomodoro-theme";

// -------------------------------------------------------------------------------------------------------
//Code for dynamic document title change
document.addEventListener("visibilitychange", function(){
    if (document.hidden) {
        document.title = "Come back and focus! 😢";
    } 
    else {
        document.title = "Glad you're back! 😊";
        setTimeout(()=>{
            document.title = "Pomodex";
        }, 2000);
    }
})


// -------------------------------------------------------------------------------------------------------
//Dark mode feauter code--------------------------

const checkbox = document.getElementById("checkbox");

checkbox.addEventListener("change", () => {    

    if(!nav.classList.contains("dark-theme")){
        nav.classList.remove("pomodoro-theme", "short-break-theme", "long-break-theme");
        box1.classList.remove("pomodoro-theme", "short-break-theme", "long-break-theme");

        nav.classList.add("dark-theme");
        box1.classList.add("dark-theme");
    }
    else{
        nav.classList.remove("dark-theme");
        box1.classList.remove("dark-theme");
        
        nav.classList.add(`${lastColor}`);
        box1.classList.add(`${lastColor}`);
    }
    
  
//   console.dir(document.querySelector("nav").classList);
});


// -------------------------------------------------------------------------------------------------------
// Clock funcitoning code----------------------------

let startButton=document.querySelector(".start-pause-control");
startButton.innerText="START";

startButton.addEventListener("click", start);

function start(){
    if(!clockStarted){
        startButton.innerText="PAUSE";
        clockStarted=true;
        startButton.classList.add("start-pause-control-active");

        startPauseClock();
    }
    else{
        startButton.innerText="START";
        clockStarted=false;
        startButton.classList.remove("start-pause-control-active");

        startPauseClock();
    }
    // console.log(clockStarted);
}


//Clock ticking code
let clock=document.querySelector(".clock");

function startPauseClock(){

    if(clockStarted==true){
        clock.innerText=`${mins<10 ? `0${mins}` : `${mins}`}:${seconds<10 ? `0${seconds}` : `${seconds}`}`;

        intervalId= setInterval(()=>{

            seconds--;
            // secondsDiv.innerText= seconds<10 ? `0${seconds}` : `${seconds}`;
            clock.innerText=`${mins<10 ? `0${mins}` : `${mins}`}:${seconds<10 ? `0${seconds}` : `${seconds}`}`;

            if(mins==0 && seconds==0){
                startButton.innerText="START";
                startButton.classList.remove("start-pause-control-active");
                clockStarted=false;
                clearInterval(intervalId);
            }

            else if(seconds==0 && mins!=0){
                mins--;
                seconds=60;
                clock.innerText=`${mins<10 ? `0${mins}` : `${mins}`}:${seconds<10 ? `0${seconds}` : `${seconds}`}`;
                // minDiv.innerText= mins<10 ? `0${mins}` : `${mins}`;
            }  
            
        }, 1000);
    }

    else{
        clearInterval(intervalId);
    }
    
}

//Pomodor, short break and long break funcitonality----------------------------------

function setActive(clickedButton){

    //if any button is clicked when the timer was running then stop the timer and change the content of start/pause button
    if(clockStarted){
        clearInterval(intervalId);
        startButton.innerText="START";
        clockStarted=false;
        startButton.classList.remove("start-pause-control-active");
    }
    

    //removing the active state css from all the btns before adding to the clicked one
    document.querySelectorAll(".custom-button").forEach(button => button.classList.remove("level1-li-button-active"));
    //adding to the active state css to the clicked button
    clickedButton.classList.add("level1-li-button-active");

    //calling the funtion to change the time according to the buttons
    changeTime(clickedButton);
}

function changeTime(clickedButton){

    nav.classList.remove("pomodoro-theme", "short-break-theme", "long-break-theme");
    box1.classList.remove("pomodoro-theme", "short-break-theme", "long-break-theme");

    if(clickedButton.innerText==="Pomodoro"){
        mins=25;
        if(!nav.classList.contains("dark-theme")){
            nav.classList.add("pomodoro-theme");
            box1.classList.add("pomodoro-theme");
            lastColor="pomodoro-theme";
        }  
        
    }
    else if(clickedButton.innerText==="Short Break"){
        mins=5;
        if(!nav.classList.contains("dark-theme")){
           nav.classList.add("short-break-theme");
           box1.classList.add("short-break-theme");
           lastColor="short-break-theme";
        }     
    }
    else{
        mins=15;
        if(!nav.classList.contains("dark-theme")){
            nav.classList.add("long-break-theme");
            box1.classList.add("long-break-theme");
            lastColor="long-break-theme";
        }  
    }

    seconds=59;
    //Resetting the time on the clock according to the button pressed
    clock.innerText=`${mins<10 ? `0${mins}` : `${mins}`}:00`;
}


// -------------------------------------------------------------------------------------------------------
// Adding Task funcitoning code----------------------------

//opening the new task addition area
let addTaskButton=document.querySelector(".before-collapse-add-task");
let collapseAddTask=document.querySelector(".collapse-add-task");

addTaskButton.addEventListener("click", ()=>{
    addTaskButton.style.display="none";
    collapseAddTask.style.display="block";
});


//Closing the task eiditor
let closeButton=document.querySelector(".modal-footer .cancel");

closeButton.addEventListener("click", ()=>{
    addTaskButton.style.display="flex";
    collapseAddTask.style.display="none";
});

//Saving a new task by creating a new list item----------------------------
let saveButton=document.querySelector(".modal-footer .save");
let taskList=document.querySelector("#task-list");

//Storing the inputs from the modal
let taskName=document.querySelector(".modal-header input");
let taskPomodoroCount=document.querySelector(".modal-body .input-group input");

saveButton.addEventListener("click", createTask);

function createTask(){
    console.log(taskName.value);
    if(taskName.value==""){
        alert("Please write a task to save it!");
    }
    else{
        let taskLi=document.createElement("li");
        console.log("working");

        console.dir(taskPomodoroCount.value);
        taskLi.innerHTML=`<li class="new-task list-hover-effect" onclick="currentTaskSelection(this)">
                    <div class="task-left">
                      <div class="task-complete-status" onclick="taskCompleteState(this)"><i class="fa-regular fa-circle-check"></i></div>
                      <div class="task-meta-data">${taskName.value}</div>
                    </div>
                    <div class="task-right">
                      <span class="pomodoro-complete-count">0/${taskPomodoroCount.value}</span>
                      <div class="task-box-options" onclick="editTask(this)"><i class="fa-sharp fa-solid fa-ellipsis-vertical"></i></div>
                    </div>

                    <div class="collapse-add-task">

                      <div class="custom-modal">
                        <div class="modal-header">
                          <input type="text" placeholder="What are you working on?" />
                        </div>
                
                        <div class="modal-body">
                            <p>Est Pomodoros</p>
                
                            <div class="input-group">
                                <input type="number" value="1" min="1">
                            </div>
                
                            <div class="add-links">
                                <a href="#">+ Add Note</a>
                            </div>
                        </div>
                
                        <div class="modal-footer">
                            <button class="cancel">Cancel</button>
                            <button class="save">Save</button>
                        </div>
                      </div>

                    </div>

                  </li>`;
                
        //Adding the list in the task list ul as a child
        taskList.prepend(taskLi);

        //resetting the values of input fields after saving
        taskName.value=null;
        taskPomodoroCount.value=1;

        addTaskButton.style.display="flex";
        collapseAddTask.style.display="none";

        sortable();
    }
    
}

// -------------------------------------------------------------------------------------------------------
// Editing Task funcitoning code----------------------------

function editTask(clickedButton){

    //selecting the required elements
    let editModal=clickedButton.parentElement.parentElement.children[2];
    let taskLeft=clickedButton.parentElement.parentElement.children[0];
    let taskRight=clickedButton.parentElement.parentElement.children[1];

    //changing the display style so that the modal appears
    taskLeft.style.display="none";
    taskRight.style.display="none";
    editModal.style.display="flex";

    //selecting the required editing areas and updating modal before editing
    let editTaskNameArea=editModal.children[0].children[0].children[0];
    let taskToEdit=taskLeft.children[1];

    let editTaskPomodoroCountArea=editModal.children[0].children[1].children[1].children[0];
    let taskPomodoroCountToEdit=taskRight.children[0].innerText.split("/")[1];

    editTaskPomodoroCountArea.value=`${taskPomodoroCountToEdit}`;
    editTaskNameArea.value=`${taskToEdit.innerText}`;

    //adding events to the buttons in the edit modal
    let editModalCancel=editModal.children[0].children[2].children[0];
    let editModalSave=editModal.children[0].children[2].children[1];

    //edit cancel button functioning
    editModalCancel.addEventListener("click", ()=>{
        //closing the edit modal when cancel is clicked
        taskLeft.style.display="flex";
        taskRight.style.display="flex";
        editModal.style.display="none";
    }, { once: true });

    //edit save button functioning
    editModalSave.addEventListener("click", editSave.bind(null, taskLeft, taskRight, taskToEdit, editModal, editTaskNameArea, editTaskPomodoroCountArea, editModalSave), { once: true });
    

}

function editSave(taskLeft, taskRight, taskToEdit, editModal, editTaskNameArea, editTaskPomodoroCountArea, editModalSave){

    editModalSave.removeEventListener("click", editSave.bind(null, taskLeft, taskRight, taskToEdit, editModal, editTaskNameArea, editTaskPomodoroCountArea, editModalSave));

    //closing the edit modal when save is clicked
    taskLeft.style.display="flex";
    taskRight.style.display="flex";
    editModal.style.display="none";

    //updating the values of edited task
    console.dir(editTaskNameArea.value);
    console.log(editTaskPomodoroCountArea.value);
    taskToEdit.innerText=`${editTaskNameArea.value}`;
    taskRight.children[0].innerText=`0/${editTaskPomodoroCountArea.value}`;
}


// -------------------------------------------------------------------------------------------------------
//If a task is completed and the tick button is clicked then toggle styling

function taskCompleteState(clickedButton){
    let taskLeft=clickedButton.parentElement.parentElement.children[0];
    taskLeft.classList.toggle("task-status");
}

//if task li is clicked then toggle styling

function currentTaskSelection(clickedButton){

    //removing border from all the list before adding to the clicked one
    document.querySelectorAll(".new-task").forEach(list => list.classList.remove("current-task-style"));
    document.querySelectorAll(".new-task").forEach(list => list.classList.add("list-hover-effect"));


    //selecting tihe clicked task list item
    clickedButton.classList.add("current-task-style");
    clickedButton.classList.remove("list-hover-effect");
    console.dir(clickedButton.classList)

}


// -------------------------------------------------------------------------------------------------------
// Draggable feature code

let dragBox=document.querySelector("#task-list");
new Sortable(dragBox, {
    animation: 400
});
