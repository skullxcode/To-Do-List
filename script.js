let newTask = document.getElementById("add-tasks-input");
let tasksInProgressList = document.getElementById("tasks-in-progress-list");
let completedTasksList = document.getElementById("completed-tasks-list");
let tagsList = document.getElementById("tags-list");
// let searchBar = document.getElementById("search-bar")


let inProgressTasksArray = [];
let completedTasksArray = [];
let tagsArray = [];


function addTask(){
    let input = newTask.value.trim();
    if(input){
        let taskItem = {title:input, completed:false, tags:[], dueDate:""};
        inProgressTasksArray.push(taskItem);
        newTask.value = "";
        renderAll()
    }
}


function deleteTask(event){
    if(event.target.classList.contains("delete")){
        let titleToDelete = event.target.parentElement.querySelector(".text").innerText.trim();

        let progInd = inProgressTasksArray.findIndex(t => t.title === titleToDelete);
        let compInd = completedTasksArray.findIndex(t => t.title === titleToDelete);
        if(progInd!==-1){
            inProgressTasksArray.splice(progInd,1);
        }
        else if(compInd!==-1){
            completedTasksArray.splice(compInd,1);
        }
        renderAll();
    }
}



function changeState(event){
    if (event.target.type === "checkbox"){
        let taskTitle = event.target.parentElement.querySelector(".text").innerText.trim();

        if(event.target.checked){
            let ind = inProgressTasksArray.findIndex(t => t.title === taskTitle)
            if(ind!==-1){
                let taskChanged = inProgressTasksArray.splice(ind,1)[0];
                taskChanged.completed = true;
                completedTasksArray.push(taskChanged);
            }
        }else{
            let ind = completedTasksArray.findIndex(t => t.title === taskTitle)
            if(ind!==-1){
                let taskChanged = completedTasksArray.splice(ind,1)[0];
                taskChanged.completed = false;
                inProgressTasksArray.push(taskChanged);
            }
        }
        renderAll();
    }

}



function renderAll() {
    tasksInProgressList.innerHTML = "";
    completedTasksList.innerHTML = "";
    
    renderTask(inProgressTasksArray, tasksInProgressList);
    renderTask(completedTasksArray, completedTasksList);
}

function renderTask(arr, container) {
    for (let i of arr) {
        let li = document.createElement("li");
        li.innerHTML = `
            <input type="checkbox" ${i.completed ? "checked" : ""}>
            <span class="text">${i.title}</span>
            <button class="edit">Edit</button>
            <button class="delete">Delete</button>`;
        container.appendChild(li);
    }
}









tasksInProgressList.addEventListener("change",changeState);
completedTasksList.addEventListener("change",changeState);


tasksInProgressList.addEventListener("click",deleteTask);
completedTasksList.addEventListener("click",deleteTask);


tasksInProgressList.addEventListener("click",editTask);
completedTasksList.addEventListener("click",editTask);





// function editTask(event){
//     if(event.target.classList.contains("edit")){
//         let parent = event.target.parentElement;
//         let oldTask = parent.querySelector(".text");
//         let val = oldTask.innerText
//         let editedTask = prompt("Update task:", oldTask.innerText);
//         if(editedTask){oldTask.innerText = editedTask}
//         else{
//             oldTask.innerText = val;
//         }
//     }
// }