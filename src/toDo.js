export {displayTask, test, removeTasks};
function displayTask(t) {
    let {title, details, date, prior, done} = t;
    let task = document.createElement("div");
    task.setAttribute("class","task");
    //prior
    if (prior == "l") task.style.boxShadow = "-5px 0px green";
    else if (prior == "m") task.style.boxShadow = "-5px 0px yellow";
    else if (prior == "h") task.style.boxShadow = "-5px 0px red";
    //checkbox
    let check = document.createElement("input");
    check.setAttribute("type","checkbox");
    task.appendChild(check);
    //title
    let p = document.createElement("p");
    p.innerText = title;
    task.appendChild(p);
    //done
    if (done) p.classList.add("line-through");
    else p.classList.remove("line-through");
    //date
    let sDate = document.createElement("span");
    sDate.innerText = date;
    task.appendChild(sDate);
    //edit
    let btnEdit = document.createElement("button");
    btnEdit.innerText = "Edit";
    task.appendChild(btnEdit);
    //delete
    let btnDelete = document.createElement("button");
    btnDelete.innerText = "Delete";
    task.appendChild(btnDelete);
    //event listeners
    check.addEventListener("change", () => {
        if (check.checked) p.classList.add("line-through");
        else p.classList.remove("line-through");
    });
    btnDelete.addEventListener("click", deleteTask);
    //return dom element
    return task;
}

function deleteTask(event){
    event.target.parentElement.remove();
}

function test(){
    global.inbox.tasks.push("push success");
    console.log(global.inbox);
}

function removeTasks(){
    let tasks = Array.from(document.querySelectorAll(".inbox > .task"));
    tasks.forEach(element => {
        element.remove();
    });
}