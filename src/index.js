import './style.css';
import {displayTask, removeTasks} from './toDo.js';
import { format, compareAsc } from 'date-fns';

global.app = {
  name:"app-projects",
  projects:[]
};

 global.inbox = {
  name:"inbox",
  tasks:[]
};

let currentProject = global.inbox;
let projTitle = document.querySelector(".inbox > #projTitle");
//test();
//console.log(format(new Date(), "yyyy-MM-dd"));
let btnAddTask = document.querySelector(".inbox #btnAddTask");
btnAddTask.addEventListener("click", createTaskForm);
let inboxDom = document.querySelector(".inbox");

//creates & appends form
function createTaskForm() {
    let form = document.createElement("form");
    form.setAttribute("class","frmAddTask");
    let br = document.createElement("br");
    btnAddTask.className = "hidden";
    //title
    let title = document.createElement("input");
    title.setAttribute("type","text");
    title.setAttribute("name","title");
      title.value = "test";
    title.setAttribute("placeholder","Title");
    title.setAttribute("required","");
    form.appendChild(title);
    form.appendChild(br.cloneNode());
    //details
    let details = document.createElement("textarea");
    details.setAttribute("placeholder","Description");
    form.appendChild(details);
    form.appendChild(br.cloneNode());
    //date picker
    let date = document.createElement("input");
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
    prior.style.backgroundColor = "green";
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
    button.innerText = "Add Task";
    button.setAttribute("id","btnAddTask");
    form.appendChild(button);
    //cancel btn
    let btnCancel = document.createElement("button");
    btnCancel.innerText = "Cancel";
    btnCancel.setAttribute("id","btnCancel");
    btnCancel.setAttribute("type","button");
    btnCancel.addEventListener("click", () => {
        form.remove();
        btnAddTask.className = "block";
    })
    form.appendChild(btnCancel);
    //add form to taskpane
    let taskPane = document.querySelector("#addTaskPane");
    //event listener for form submit
    form.addEventListener("submit", addTask);
    taskPane.appendChild(form);
}


//adds task to inbox
function addTask(event) {
    let form = document.querySelector("form.frmAddTask");
    if (!form.checkValidity()) {
        form.reportValidity();
    }
    let title = form.querySelector("input").value;
    let details = form.querySelector("textarea").value;
    let date = form.querySelector("#date").value;
    let prior = form.querySelector("#prior").value;
    let done = false;
    //output
      //console.log({title, details, date, prior});
      let taskObj = {title, details, date, prior, done};
      currentProject.tasks.push(taskObj);
        console.log(global.app);
      let task = displayTask({title, details, date, prior, done});
      
    //show add button
    btnAddTask.className = "block";
    form.remove();
    //add task
    inboxDom.insertBefore(task, document.querySelector("#addTaskPane"));
    event.preventDefault();
}

//add new projects
let projectPane = document.querySelector(".addProjectPane");
let btnAddProj = document.querySelector("#btnAddProject");
let projects = document.querySelector(".projects");
btnAddProj.addEventListener("click", createProjectForm);

function createProjectForm() {
  let form = document.createElement("form");
  //input
  let input = document.createElement("input");
  input.setAttribute("type","text");
  input.setAttribute("required","");
  input.setAttribute("name","projectName");
  form.appendChild(input);
  //add btn
  let btnAdd = document.createElement("button");
  btnAdd.innerText = "Add";
  btnAdd.setAttribute("id","btnAddProj");
  form.appendChild(btnAdd);
    //event
  function addProj(event) {
    let input = document.querySelector(".addProjectPane > form > input");
    //h2
    let h2 = document.createElement("h2");
    h2.innerText = input.value;
    h2.setAttribute("data-index",`${global.app.projects.length}`);
    h2.classList.add("project");
    document.querySelector(".focus").classList.remove("focus");
    h2.classList.add("focus");
    projects.insertBefore(h2, projectPane);
    //add project create object
    let objProj = {
      project:input.value,
      tasks:[]
    };
    projTitle.innerText = input.value;
    currentProject = objProj;
    global.app.projects.push(objProj);
    console.log(global.app);
    removeTasks();
    //
    form.remove();
    btnAddProj.className = "block";
    event.preventDefault();
  }
  //cancel btn
  let btnCancel = document.createElement("button");
  btnCancel.setAttribute("type","button");
  btnCancel.innerText = "Cancel";
  form.appendChild(btnCancel);
  btnCancel.addEventListener("click", () => {
    form.remove();
    btnAddProj.className = "block";
  });
  //add form
  form.addEventListener("submit", addProj);
  projectPane.appendChild(form);
  btnAddProj.className = "hidden";
}

//selecting projects
projects.addEventListener("click", selectProj);
let pane = document.querySelector("#addTaskPane");
function selectProj(event) {
  let p = event.target;
  if (p.className=="project") {
    projTitle.innerText = p.innerText;
    removeTasks();
    document.querySelector(".focus").classList.remove("focus");
    p.classList.add("focus");
    let index = p.getAttribute("data-index");
    currentProject = global.app.projects[parseInt(index)];
    let tasks = currentProject.tasks;
    for (let i = 0; i < tasks.length; i++) {
     let t = displayTask(tasks[i]);
     t.setAttribute("data-index",`${i}`);
     inboxDom.insertBefore(t, pane);
    }
  }
}
let hInbox = document.querySelector(".side > .title");
hInbox.addEventListener("click", selectInbox);

function selectInbox() {
  if (hInbox.classList.contains("focus")) {
    console.log("has focus");
    return;
  }
  projTitle.innerText = "Inbox";
  removeTasks();
  document.querySelector(".focus").classList.remove("focus");
  hInbox.classList.add("focus");
  currentProject = global.inbox;
  let tasks = currentProject.tasks;
  for (let i = 0; i < tasks.length; i++) {
    let t = displayTask(tasks[i]);
    t.setAttribute("data-index",`${i}`);
    inboxDom.insertBefore(t, pane);
  }
}
