let newTask = document.getElementById("add-tasks-input");
let tasksInProgressList = document.getElementById("tasks-in-progress-list");
let completedTasksList = document.getElementById("completed-tasks-list");
let tagsList = document.getElementById("tags-list");
let searchBar = document.getElementById("search-bar");
let newTag = document.getElementById("new-tag");
let dateInput = document.getElementById("date-input");
let addTaskBtn = document.getElementById("add-task-button")
let currentEditingTask = null;

let inProgressTasksArray = JSON.parse(localStorage.getItem("inProgress")) || [];
let completedTasksArray = JSON.parse(localStorage.getItem("completed")) || [];
let tagsArray = JSON.parse(localStorage.getItem("tags")) || [];


function addTask() {
    let input = newTask.value.trim();
    let dateVal = dateInput.value;

    if (!input) {
        showNotification("Please enter a task title", "error");
        return;
    }
    if (!dateVal) {
        showNotification("Please select a due date", "error");
        return;
    }

    if (currentEditingTask) {
        currentEditingTask.title = input;
        currentEditingTask.dueDate = dateVal;

        let selectedTags = [];
        let tagItems = tagsList.querySelectorAll("li");
        tagItems.forEach(li => {
            let name = getTagNameIfChecked(li);
            if (name) selectedTags.push(name);
        });

        currentEditingTask.tags = selectedTags;

        currentEditingTask = null;
        addTaskBtn.innerText = "Add Task";
    }
    else {
        if (inProgressTasksArray.some(t => t.title === input) || completedTasksArray.some(t => t.title === input)) {
            alert("Task Already Exists");
            return;
        }

        let selectedTags = [];
        let tagItems = tagsList.querySelectorAll("li");
        tagItems.forEach(li => {
            let name = getTagNameIfChecked(li);
            if (name) selectedTags.push(name);
        });

        let taskItem = { title: input, completed: false, tags: selectedTags, dueDate: dateVal };
        inProgressTasksArray.push(taskItem);
    }

    newTask.value = "";
    dateInput.value = "";
    renderAll();
}

function editTask(event) {
    if (event.target.classList.contains("edit")) {
        let span = event.target.parentElement.querySelector(".text");
        let titleToEdit = span.innerText.trim();

        let taskObj = inProgressTasksArray.find(t => t.title === titleToEdit) ||
            completedTasksArray.find(t => t.title === titleToEdit);

        if (taskObj) {
            currentEditingTask = taskObj;
            newTask.value = taskObj.title;
            dateInput.value = taskObj.dueDate || "";
            addTaskBtn.innerText = "Edit Task";

            let tagItems = tagsList.querySelectorAll("li");
            tagItems.forEach(li => {
                let checkbox = li.querySelector("input");
                let tagName = li.querySelector("span").innerText;
                checkbox.checked = taskObj.tags.includes(tagName);
            });

            newTask.focus();
        }
    }
}

function deleteTask(event) {
    if (event.target.classList.contains("delete")) {
        let titleToDelete = event.target.parentElement.querySelector(".text").innerText.trim();

        let progInd = inProgressTasksArray.findIndex(t => t.title === titleToDelete);
        let compInd = completedTasksArray.findIndex(t => t.title === titleToDelete);
        if (progInd !== -1) {
            inProgressTasksArray.splice(progInd, 1);
        }
        else if (compInd !== -1) {
            completedTasksArray.splice(compInd, 1);
        }
        renderAll();
    }
}



function changeState(event) {
    if (event.target.type === "checkbox") {
        let taskTitle = event.target.parentElement.querySelector(".text").innerText.trim();

        if (event.target.checked) {
            let ind = inProgressTasksArray.findIndex(t => t.title === taskTitle)
            if (ind !== -1) {
                let taskChanged = inProgressTasksArray.splice(ind, 1)[0];
                taskChanged.completed = true;
                completedTasksArray.push(taskChanged);
            }
        } else {
            let ind = completedTasksArray.findIndex(t => t.title === taskTitle)
            if (ind !== -1) {
                let taskChanged = completedTasksArray.splice(ind, 1)[0];
                taskChanged.completed = false;
                inProgressTasksArray.push(taskChanged);
            }
        }
        renderAll();
    }

}



function renderAll() {
    saveToLocal()
    renderTask(inProgressTasksArray, tasksInProgressList);
    renderTask(completedTasksArray, completedTasksList);
}

function renderTask(arr, container) {
    container.innerHTML = "";

    if (arr.length === 0) {
        let message = "No tasks found.";
        if (container.id === "tasks-in-progress-list") {
            message = "No active tasks. Time to relax? 🎉";
        } else if (container.id === "completed-tasks-list") {
            message = "No completed tasks yet. Keep going! 💪";
        }

        container.innerHTML = `
            <li class="empty-state">
                <span class="empty-text">${message}</span>
            </li>
        `;
        return;
    }

    for (let i of arr) {
        let li = document.createElement("li");

        let taskTagsHTML = "";
        for (let tag of i.tags) {
            taskTagsHTML += `<small class="task-tag-label">${tag}</small>`;
        }

        let dateHTML = "";
        if (i.dueDate) {
            dateHTML = `<small class="task-date-label">📅 ${i.dueDate}</small>`;
        }

        li.innerHTML = `
            <input type="checkbox" ${i.completed ? "checked" : ""}>
            <span class="text">${i.title}</span>
            <span class="tags-display">
                ${taskTagsHTML}
                ${dateHTML}
            </span>
            <button class="edit">Edit</button>
            <button class="delete">Delete</button>`;
        container.appendChild(li);
    }
}


function search(event) {
    let inProgressSearchArray = [];
    let completedSearchArray = [];
    let searchWord = searchBar.value.trim()
    if (searchWord) {
        for (let i of inProgressTasksArray) {
            if (i["title"].toLowerCase().includes(searchWord.toLowerCase())) {
                inProgressSearchArray.push(i)
            }
        }
        for (let i of completedTasksArray) {
            if (i["title"].toLowerCase().includes(searchWord.toLowerCase())) {
                completedSearchArray.push(i)
            }
        }
        renderTask(inProgressSearchArray, tasksInProgressList)
        renderTask(completedSearchArray, completedTasksList)
    }
    else {
        renderAll()
    }
}

function addTags() {
    let tagName = newTag.value.trim();
    if (tagName && !tagsArray.includes(tagName)) {
        tagsArray.push(tagName)
        renderTags();
        newTag.value = ""
    }
}


function renderTags() {
    saveToLocal()
    tagsList.innerHTML = ""
    for (let i of tagsArray) {
        let li = document.createElement("li");
        li.innerHTML = `<input type="checkbox" name="" id="tags-item"><span>${i}</span><button class="delete-tag-btn">&times;</button>`
        tagsList.appendChild(li)
    }
}


function getTagNameIfChecked(li) {
    let checkbox = li.querySelector("input");
    let span = li.querySelector("span");
    
    if (checkbox && checkbox.checked) {
        checkbox.checked = false;
        return span.innerText;
    }
    return null;
}

function cancelEdit() {
    currentEditingTask = null;
    newTask.value = "";
    addTaskBtn.innerText = "Add Task";
    
    let tagCheckboxes = tagsList.querySelectorAll('input[type="checkbox"]');
    tagCheckboxes.forEach(cb => cb.checked = false);
}

function saveToLocal() {
    localStorage.setItem("inProgress", JSON.stringify(inProgressTasksArray));
    localStorage.setItem("completed", JSON.stringify(completedTasksArray));
    localStorage.setItem("tags", JSON.stringify(tagsArray));
}

tagsList.addEventListener("click", function (event) {
    if (event.target.classList.contains("delete-tag-btn")) {
        let li = event.target.parentElement;
        let span = li.querySelector("span");
        let tagName = span.innerText;

        let index = tagsArray.indexOf(tagName);
        if (index > -1) {
            tagsArray.splice(index, 1);

            inProgressTasksArray.forEach(task => {
                let tagIndex = task.tags.indexOf(tagName);
                if (tagIndex > -1) {
                    task.tags.splice(tagIndex, 1);
                }
            });

            completedTasksArray.forEach(task => {
                let tagIndex = task.tags.indexOf(tagName);
                if (tagIndex > -1) {
                    task.tags.splice(tagIndex, 1);
                }
            });

            renderTags();
            renderAll();
        }
    }
});

newTask.addEventListener("keydown", function (event) {
    if (event.key === "Enter") {
        event.preventDefault();
        addTask();
    }
});


newTag.addEventListener("keydown", function (event) {
    if (event.key === "Enter") {
        event.preventDefault();
        addTags();
    }
});


searchBar.addEventListener("input", search);


tasksInProgressList.addEventListener("change", changeState);
completedTasksList.addEventListener("change", changeState);


tasksInProgressList.addEventListener("click", deleteTask);
completedTasksList.addEventListener("click", deleteTask);


tasksInProgressList.addEventListener("click", editTask);
completedTasksList.addEventListener("click", editTask);


renderAll();
renderTags();






let notificationContainer = document.createElement("div");
notificationContainer.id = "notification-container";
document.body.appendChild(notificationContainer);

function showNotification(message, type = "info") {
    let toast = document.createElement("div");
    toast.className = `toast ${type}`;

    let icon = "🔔";
    if (type === "error") icon = "⚠️";
    if (type === "success") icon = "✅";

    toast.innerHTML = `<span>${icon}</span> <span>${message}</span>`;

    notificationContainer.appendChild(toast);

    setTimeout(() => {
        toast.style.animation = "fadeOutRight 0.3s forwards";
        toast.addEventListener("animationend", () => {
            toast.remove();
        });
    }, 3000);
}
