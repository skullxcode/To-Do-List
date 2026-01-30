let newTask = document.getElementById("add-tasks-input");
let tasksInProgressList = document.getElementById("tasks-in-progress-list");
let completedTasksList = document.getElementById("completed-tasks-list")

tasksArray = []

function addTask(){
    let input = newTask.value;
    
    
    let task = document.createElement("li");
    if(input){
    task.innerHTML = `<input type="checkbox" name="" class="in-progress-task-items"><span class="text">${input}</span>
                <button class="edit">Edit</button>
                <button class="delete">Delete</button>`;
    tasksInProgressList.appendChild(task);
    newTask.value = "";
    }
}


tasksInProgressList.addEventListener("click",deleteTask);
completedTasksList.addEventListener("click",deleteTask);

function deleteTask(event){
    if(event.target.classList.contains("delete")){
        event.target.parentElement.remove();
    }
}

tasksInProgressList.addEventListener("change",changeState);
completedTasksList.addEventListener("change",changeState);

function changeState(event){
    if (event.target.type === "checkbox"){
        let taskToStateChange = event.target.parentElement;
        if(event.target.checked){
            completedTasksList.appendChild(taskToStateChange);
        }else{
            tasksInProgressList.appendChild(taskToStateChange);
        }
    }
}

tasksInProgressList.addEventListener("click",editTask);
completedTasksList.addEventListener("click",editTask);

function editTask(event){
    if(event.target.classList.contains("edit")){
        let parent = event.target.parentElement;
        let oldTask = parent.querySelector(".text");
        let val = oldTask.innerText
        let editedTask = prompt("Update task:", oldTask.innerText);
        if(editedTask){oldTask.innerText = editedTask}
        else{
            oldTask.innerText = val;
        }
    }
}