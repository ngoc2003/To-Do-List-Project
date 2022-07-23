const taskInput = document.querySelector(".task-input input");
const controls = document.querySelectorAll(".task-controller__btn span");
const taskList = document.querySelector(".task-list");
var isEdit = 0;
var numberEdit = 0;
var todos = sessionStorage.getItem("todos")
  ? JSON.parse(sessionStorage.getItem("todos"))
  : [];
var isContent = todos.length;

taskBegin(isContent);
controls.forEach((btn) => {
  btn.addEventListener("click", () => {
    document
      .querySelector(".task-controller span.active")
      .classList.remove("active");
    btn.classList.add("active");
    taskBegin(isContent, getStatus());
  });
});
function getStatus() {
  return document
    .querySelector(".task-controller span.active")
    .getAttribute("id");
}
function taskBegin(checked, status = "all") {
  let liContent = "";
  if (checked === 0) {
    todos = [];
    liContent = `<li class="begin-task">You don't have any task here!</li>`;
  } else {
    todos.forEach((todo, index) => {
      let updateStatus = todo.status !== "completed" ? "" : "checked";
      if (status === todo.status || status === "all") {
        liContent += `<li class="task-item" >
                    <label for="">
                        <input type="checkbox" class="checkbox" value=0 ${
                          todo.status == "completed" ? "checked" : ""
                        } onclick="checkBoxCheck(this, ${index})">
                        <p class="task-item__text ${updateStatus}">${
          todo.content
        }</p>
                    </label>
                    <div class="task-setting">
                        <i class="fas fa-ellipsis-h task-setting__btn " onclick="showMenu(this)" ></i>
                        <ul class="task-setting__menu" >
                            <li class="task-setting-item edit" onclick = "editTask('${
                              todo.content
                            }', ${todo.id})">
                                <i class="task-text fas fa-marker"></i>
                                <p class="task-text">Edit</p> 
                            </li>
                            <li class="task-setting-item" onclick= "deleteTask('${
                              todo.content
                            }')">
                                <i class="task-text fas fa-trash"></i>
                                <p class="task-text">Delete</p>   
                            </li>
                        </ul>
                    </div>
                </li>`;
      }
    });
    sessionStorage.setItem("todos", JSON.stringify(todos));
    if (todos.every((todo) => todo.status !== status && status !== "all")) {
      liContent = `<li class="begin-task">You don't have any task here!</li>`;
    }
  }
  taskList.innerHTML = liContent;
}

taskInput.addEventListener("keyup", (e) => {
  let userText = taskInput.value.trim();
  if (e.key == "Enter") {
    if (userText == ``) {
      alert("Hey bro, you havent written anything yet!");
    } else {
      isContent = 1;
      showTask(userText);
    }
  }
});
function showTask(userText) {
  if (isEdit == 1) {
    todos[numberEdit].content = userText;
  }
  isEdit = 0;
  todos = [
    ...todos,
    {
      content: userText,
      status: "pending",
    },
  ];
  taskInput.value = ``;
  taskBegin(isContent, getStatus());
  taskList.offsetHeight > 250
    ? taskList.classList.add("overflow")
    : taskList.classList.remove("overflow");
}

// choose option
function checkBoxCheck(para, index) {
  let content = para.parentElement.lastElementChild;
  if (para.checked) {
    todos[index].status = "completed";
    content.classList.add("checked");
  } else {
    todos[index].status = "pending";
    content.classList.remove("checked");
  }
}

// show Menu List when click option
function showMenu(para) {
  let settingBox = para.parentElement.lastElementChild;
  settingBox.classList.add("active");
  document.addEventListener("click", (e) => {
    if (e.target != para) {
      settingBox.classList.remove("active");
    }
  });
}
function clearAllTask() {
  todos = [];
  isContent = 0;
  taskBegin(0);
  taskInput.focus();
}

function deleteTask(content) {
  let index = todos.find((item, index) => {
    if (item.content === content) {
      return index;
    }
  });
  todos.splice(index, 1);
  taskBegin(isContent, getStatus());
  if (todos.length == 0) {
    clearAllTask();
  }
  taskInput.focus();
}
function editTask(text, index) {
  taskInput.value = text;
  isEdit = 1;
  numberEdit = index;
  taskInput.focus();
}
