import './style.css';
import {displayTask, removeTasks} from './toDo.js';
import { format, isBefore, addDays, endOfToday, endOfWeek } from 'date-fns';
export {setStorage};

// if (!localStorage.getItem("app")) {
//   setStorage();
// } else{
//   let s = localStorage.getItem("app");
//   console.log(s.help,"yay");
// }


global.app = {
  name:"app-projects",
  projects:[]
};

 global.inbox = {
  name:"inbox",
  tasks:[]
};

global.currentProject = global.inbox;

//dom object declarations
var hInbox = document.querySelector(".side > .title");
hInbox.addEventListener("click", selectInbox);
let projTitle = document.querySelector(".inbox > #projTitle");
//test();
//console.log(format(new Date(), "yyyy-MM-dd"));
let btnAddTask = document.querySelector(".inbox #btnAddTask");
btnAddTask.addEventListener("click", createTaskForm);
let inboxDom = document.querySelector(".inbox");
let taskPane = document.querySelector("#addTaskPane");

//add new projects
var projectPane = document.querySelector(".addProjectPane");
let btnAddProj = document.querySelector("#btnAddProject");
var projects = document.querySelector(".projects");
btnAddProj.addEventListener("click", createProjectForm);

//selecting projects
projects.addEventListener("click", selectProj);
let pane = document.querySelector("#addTaskPane");

//check if storage exists
if (!localStorage.getItem("app")) {
  setStorage();
} else {
  getStorage();
  selectInbox();
  bootAllProjects();
}
//storage functions
function setStorage(){
  localStorage.setItem("app", JSON.stringify(global.app));
  localStorage.setItem("inbox", JSON.stringify(global.inbox));
}

function getStorage() {
  global.app = JSON.parse(localStorage.getItem("app"));
  global.inbox = JSON.parse(localStorage.getItem("inbox"));
}

function bootAllProjects() {
  let projs = global.app.projects;
  for (let i = 0; i < projs.length; i++) {
    let h2 = bootProj(projs[i].project , i);
    projects.insertBefore(h2, projectPane);
  }
}

function bootProj(name, i) {
  //h2
  let h2 = document.createElement("h2");
  h2.innerText = name;
  h2.setAttribute("data-index",`${i}`);
  h2.classList.add("project");
  //delete project button
  let btnDelProj = document.createElement("button");
  btnDelProj.innerText = "X";
  btnDelProj.className = "btnDelProj";
  btnDelProj.addEventListener("click", removeProj);
  h2.appendChild(btnDelProj);
  return h2;
}


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
    button.setAttribute("id","btnFormAddTask");
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
    
    //event listener for form submit
    form.addEventListener("submit", addTask);
    taskPane.appendChild(form);
    title.focus();
}



//form function removes forms when selecting a project
function removeForm() {
  if (document.querySelector("form.frmAddTask")) {
    let form = document.querySelector("form.frmAddTask");
    form.remove();
    btnAddTask.className = "block";
  }
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
      global.currentProject.tasks.push(taskObj);
        console.log(global.app);
      let task = displayTask({title, details, date, prior, done});
      let index = global.currentProject.tasks.length;
      index -= 1;
      task.setAttribute("data-index",`${index}`);
    //show add button
    btnAddTask.className = "block";
    form.remove();
    //add task
    inboxDom.insertBefore(task, document.querySelector("#addTaskPane"));
     //update storage
     setStorage();
    event.preventDefault();
}


// form to add new projects
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
    removeForm();
    taskPane.classList.remove("hidden");
    let input = document.querySelector(".addProjectPane > form > input");
    //h2
    let h2 = document.createElement("h2");
    h2.innerText = input.value;
    h2.setAttribute("data-index",`${global.app.projects.length}`);
    h2.classList.add("project");
    if (document.querySelector(".focus")) {
      document.querySelector(".focus").classList.remove("focus");
    }
    h2.classList.add("focus");
    //delete project button
    let btnDelProj = document.createElement("button");
    btnDelProj.innerText = "X";
    btnDelProj.className = "btnDelProj";
    btnDelProj.addEventListener("click", removeProj);
    h2.appendChild(btnDelProj);
    //insert project
    projects.insertBefore(h2, projectPane);
    //add project create object
    let objProj = {
      project:input.value,
      tasks:[]
    };
    projTitle.innerText = input.value;
    global.currentProject = objProj;
    global.app.projects.push(objProj);
    //update storage
    setStorage();
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
  input.focus();
  btnAddProj.className = "hidden";
}

//remove project button
function removeProj(event) {
  let parent = event.target.parentNode;
  let index = parent.getAttribute("data-index");
  if (parent.classList.contains("focus")) {
    removeTasks();
    taskPane.classList.add("hidden");
    projTitle.innerText = "";
  }
  global.app.projects.splice(index,1);
  parent.remove();
  let projects = document.querySelectorAll(".project");
  for (let i = 0; i < projects.length; i++) {
    projects[i].setAttribute("data-index",`${i}`);
  }
  //if (global.app.projects.length == 0) selectInbox();
  if (dayBox.classList.contains("focus")) {
    selectToday();
  }
  else if (weekBox.classList.contains("focus")) {
    selectWeek();
  }
  //update storage
  setStorage();
  console.log(global.app.projects);
}

function selectProj(event) {
  let p = event.target;
  if (p.className=="project") {
    removeForm();
    taskPane.classList.remove("hidden");
    removeTasks();
    if (document.querySelector(".focus")) {
      document.querySelector(".focus").classList.remove("focus");
    }
    p.classList.add("focus");
    let index = p.getAttribute("data-index");
    projTitle.innerText = global.app.projects[index].project;
    global.currentProject = global.app.projects[parseInt(index)];
    let tasks = global.currentProject.tasks;
    for (let i = 0; i < tasks.length; i++) {
     let t = displayTask(tasks[i]);
     t.setAttribute("data-index",`${i}`);
     inboxDom.insertBefore(t, pane);
    }
  }
}

//inbox

function selectInbox() {
  if (hInbox.classList.contains("focus")) {
    console.log("has focus");
    return;
  }
  removeForm();
  taskPane.classList.remove("hidden");
  projTitle.innerText = "Inbox";
  removeTasks();
  if (document.querySelector(".focus")) {
    document.querySelector(".focus").classList.remove("focus");
  }
  hInbox.classList.add("focus");
  global.currentProject = global.inbox;
  let tasks = global.currentProject.tasks;
  for (let i = 0; i < tasks.length; i++) {
    let t = displayTask(tasks[i]);
    t.setAttribute("data-index",`${i}`);
    inboxDom.insertBefore(t, pane);
  }
}
//today box
let dayBox = document.querySelector(".side > .today");
dayBox.addEventListener("click", selectToday);

function selectToday(){
  // if (dayBox.classList.contains("focus")) {
  //   console.log("has focus");
  //   return;
  // }
  taskPane.classList.add("hidden");
  projTitle.innerText = "Today";
  removeTasks();
  if (document.querySelector(".focus")) {
    document.querySelector(".focus").classList.remove("focus");
  }
  dayBox.classList.add("focus");
  let projects = global.app.projects;
  let today = endOfToday();

  let inboxTasks = global.inbox.tasks;
  for (let index = 0; index < inboxTasks.length; index++) {
    let date = new Date(inboxTasks[index].date);
    if (isBefore(date,today)) {
      let t = displayTask(inboxTasks[index]);
      t.setAttribute("data-index",`${index}`);
      t.setAttribute("project-index","inbox");
      inboxDom.insertBefore(t, pane);
    }
  }

  for (let i = 0; i < projects.length; i++){
    let tasks = projects[i].tasks;
    for(let j = 0; j < tasks.length; j++) {
      let date = new Date(tasks[j].date);
      if (isBefore(date,today)) {
        let t = displayTask(tasks[j]);
        t.setAttribute("data-index",`${j}`);
        t.setAttribute("project-index",`${i}`);
        inboxDom.insertBefore(t, pane);
      }
    }
  }
}

//select week
let weekBox = document.querySelector(".side > .thisWeek");
weekBox.addEventListener("click", selectWeek);

function selectWeek() {
  if (weekBox.classList.contains("focus")) {
    console.log("has focus");
    return;
  }
  taskPane.classList.add("hidden");
  projTitle.innerText = "This Week";
  removeTasks();
  if (document.querySelector(".focus")) {
    document.querySelector(".focus").classList.remove("focus");
  }
  weekBox.classList.add("focus");
  let projects = global.app.projects;
  let thisWeek = endOfWeek(new Date());
  let tasks = global.inbox.tasks;
  for (let index = 0; index < tasks.length; index++) {
    let date = new Date(tasks[index].date);
    if (isBefore(date,thisWeek)) {
      let t = displayTask(tasks[index]);
      t.setAttribute("data-index",`${index}`);
      t.setAttribute("project-index","inbox");
      inboxDom.insertBefore(t, pane);
    }
  }

  for (let i = 0; i < projects.length; i++){
    let tasks = projects[i].tasks;
    for(let j = 0; j < tasks.length; j++) {
      let date = new Date(tasks[j].date);
      if (isBefore(date,thisWeek)) {
        let t = displayTask(tasks[j]);
        t.setAttribute("data-index",`${j}`);
        t.setAttribute("project-index",`${i}`);
        inboxDom.insertBefore(t, pane);
      }
    }
  }
}
