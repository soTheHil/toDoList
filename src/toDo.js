import { format, compareAsc } from 'date-fns';
import { setStorage } from './index.js';
export {displayTask, test, removeTasks};
let pane = document.querySelector("#addTaskPane");
let inboxDom = document.querySelector(".inbox");
let dayBox = document.querySelector(".side > .today");
let weekBox = document.querySelector(".side > .thisWeek");
let projIndex;
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
    check.checked = done;
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
    sDate.innerText = format(new Date(date),"do MMM yy");
    task.appendChild(sDate);
    //edit
    let btnEdit = document.createElement("button");
    btnEdit.addEventListener("click", (event)=> {
        editTask(event);
    });
    btnEdit.classList.add("btnEditTask");
    task.appendChild(btnEdit);
    //delete
    let btnDelete = document.createElement("button");
    btnDelete.classList.add("btnDelTask");
    task.appendChild(btnDelete);
    //event listeners
    check.addEventListener("change", (event) => {
        checkFilter(event.target.parentNode);
        let index = parseInt(event.target.parentNode.getAttribute("data-index"));
        if (check.checked) {
            p.classList.add("line-through");
            //console.log(global.currentProject.tasks[index]);
            global.currentProject.tasks[index].done = true;
            //update storage
            setStorage();
        }
        else {
            p.classList.remove("line-through");
            global.currentProject.tasks[index].done = false;
            //update storage
            setStorage();
        }
    });
      //delete event
    btnDelete.addEventListener("click", deleteTask);
    //return dom element
    return task;
}

let btnAddTask = document.querySelector(".inbox #btnAddTask");

//check filter / change current project if filter is in focus
function checkFilter(parent) {
     if (dayBox.classList.contains("focus")||
     weekBox.classList.contains("focus")) {
         projIndex = parent.getAttribute("project-index");
         if (projIndex == "inbox") {
            global.currentProject = global.inbox;
         } else {
         global.currentProject =  global.app.projects[projIndex];
         }
     }
}


function editTask(event){
    let parent = event.target.parentNode;
    checkFilter(parent);
    let index = parent.getAttribute("data-index");
    let obj = global.currentProject.tasks[index];
    //console.log(obj);
    let form = document.createElement("form");
    form.setAttribute("class","frmAddTask");
    let br = document.createElement("br");
    btnAddTask.className = "hidden";
    //title
    let title = document.createElement("input");
    title.setAttribute("type","text");
    title.setAttribute("name","title");
    title.value = obj.title;
    title.setAttribute("placeholder","Title");
    title.setAttribute("required","");
    form.appendChild(title);
    form.appendChild(br.cloneNode());
    //details
    let details = document.createElement("textarea");
    details.value = obj.details;
    details.setAttribute("placeholder","Description");
    form.appendChild(details);
    form.appendChild(br.cloneNode());
    //date picker
    let date = document.createElement("input");
    date.value = obj.date;
    date.setAttribute("type","date");
    date.setAttribute("name","date");
    date.setAttribute("required","");
    date.setAttribute("id","date");
    date.setAttribute("min",format(new Date(), "yyyy-MM-dd"));
    date.setAttribute("value",format(new Date(), "yyyy-MM-dd"));
      //date.setAttribute("value",format(new Date(), "yyyy-MM-dd"));
    form.appendChild(date);
    //priority
    let prior = document.createElement("select");
    prior.setAttribute("id","prior");
    prior.setAttribute("name","choice");
    prior.setAttribute("title","Set priority");
    prior.innerHTML = `<option style="background-color:green" selected value="l">Low</option>
    <option style="background-color:yellow" value="m">Medium</option>
    <option style="background-color:red" value="h">High</option>`;
    //prior.style.backgroundColor = "green";
    if (obj.prior == "l") prior.value = "l";
    else if (obj.prior == "m") prior.value = "m";
    else if (obj.prior == "h") prior.value = "h";
    changePrior();
    prior.addEventListener("change", changePrior);
      //event listener for select
    function changePrior(){
        if (prior.value=="l") prior.style.backgroundColor = "green";
        else if (prior.value=="m") prior.style.backgroundColor = "yellow";
        else if (prior.value=="h") prior.style.backgroundColor = "red";
    }
    form.appendChild(prior);
    //add button
    let button = document.createElement("button");
    button.innerText = "Save";
    button.setAttribute("id","btnFormAddTask");
    form.appendChild(button);
    //cancel btn
    let btnCancel = document.createElement("button");
    btnCancel.innerText = "Cancel";
    btnCancel.setAttribute("id","btnCancel");
    btnCancel.setAttribute("type","button");
    btnCancel.addEventListener("click", () => {
        parent.classList.remove("hidden");
        form.remove();
        btnAddTask.className = "block";
    })
    form.appendChild(btnCancel);
    //add form to taskpane
    let edit = {title, details, date, prior};
    //event listener for form submit
    form.addEventListener("submit", (event) => {
        saveEdit(event, edit, parent, obj);
    });
    parent.classList.add("hidden");
    inboxDom.insertBefore(form, parent);
    //end of task pane
}
//saving all edits from form
function saveEdit(event, edit, parent, obj){
    let form = document.querySelector("form.frmAddTask");
    if (!form.checkValidity()) {
        form.reportValidity();
    }
    let title = edit.title.value;
    let details = edit.details.value;
    let date = edit.date.value;
    let prior = edit.prior.value;
    //update object
      //console.log(edit, parent, obj);
    obj.title = title;
    obj.details = details;
    obj.date = date;
    obj.prior = prior;
    //update task in dom
    parent.querySelector("p").innerText = title;
    parent.querySelector("span").innerText = format(new Date(date),"do MMM yy");
    
    if (prior == "l") parent.style.boxShadow = "-5px 0px green";
    else if (prior == "m") parent.style.boxShadow = "-5px 0px yellow";
    else if (prior == "h") parent.style.boxShadow = "-5px 0px red";
    // remove form
    parent.classList.remove("hidden");
    form.remove();
    btnAddTask.className = "block";
    //update storage
    setStorage();
    event.preventDefault();
}
//delete tasks
function deleteTask(event){
    let parent = event.target.parentNode;
    checkFilter(parent);
    let index = parent.getAttribute("data-index");
    global.currentProject.tasks.splice(index,1);
    //check filter prevent default behaviour
    if (dayBox.classList.contains("focus")||
     weekBox.classList.contains("focus")) {
        parent.remove();
        return;
     }
    let tasks = global.currentProject.tasks;
    removeTasks();
    for (let i = 0; i < tasks.length; i++) {
        let t = displayTask(tasks[i]);
        t.setAttribute("data-index",`${i}`);
        inboxDom.insertBefore(t, pane);
       }
       //update storage
       setStorage();
    //event.target.parentElement.remove();
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