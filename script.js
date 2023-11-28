const input = document.getElementById("input-task");
const addbutton = document.getElementById("add-btn");
const list = document.getElementById("todo-list");

addbutton.addEventListener("click", addTask);
input.addEventListener("keydown", function (event) {
  if (event.key === "Enter") {
    addTask();
  }
});

function filterTask() {
  sortTasksByPriority();
  sortTasksByCompletion();
}

// it change the priority text color according the priority value
function changePriorityColor(priorityElement, priorityValue) {
  if (priorityValue == "High") {
    priorityElement.style.color = "#e57373";
  } else if (priorityValue == "Low") {
    priorityElement.style.color = "#81c784";
  }
}

function addTask() {
  const task = input.value;
  const priority = document.getElementById("mode").value;

  if (!task) {
    alert("Please enter your task...");
  } else {
    const newTask = document.createElement("li");
    newTask.innerHTML = `
                    <div class="task">
                        <span class="task-p">${task}</span>
                        <div class="priority">${priority}</div>
                    </div>
                    <div class="task-buttons">
                        <button class="edit-button" onclick="editTask(this)">Edit</button>
                        <button class="delete-button" onclick="deleteTask(this)">Delete</button>
                        <button class="complete-button" id="done" onclick="completeTask(this)">Complete</button>
                    </div>
                `;

    list.appendChild(newTask);
    saveTasksToLocalStorage();
    sortTasksByPriority();
    input.value = "";
    const priorityElement = newTask.querySelector(".priority");
    changePriorityColor(priorityElement, priority);
  }
}

// Function to sort tasks based on priority status
function sortTasksByPriority() {
  const tasks = Array.from(document.querySelectorAll("#todo-list li"));

  tasks.sort((a, b) => {
    const priorityA = a.querySelector(".priority").innerText;
    const priorityB = b.querySelector(".priority").innerText;

    if (priorityA === priorityB) {
      return 0;
    } else if (priorityA === "High") {
      return -1;
    } else {
      return 1;
    }
  });

  list.innerHTML = "";

  tasks.forEach((task) => {
    list.appendChild(task);
  });
  saveTasksToLocalStorage();
}

// Function to sort tasks based on completion status
function sortTasksByCompletion() {
  const tasks = Array.from(document.querySelectorAll("#todo-list li"));

  tasks.sort((a, b) => {
    const completedA = a.classList.contains("completed-task");
    const completedB = b.classList.contains("completed-task");

    if (completedA === completedB) {
      return 0;
    } else if (completedA) {
      return 1; // Completed tasks should come after non-completed tasks
    } else {
      return -1;
    }
  });

  list.innerHTML = "";

  tasks.forEach((task) => {
    list.appendChild(task);
  });

  saveTasksToLocalStorage();
}

function editTask(button) {
  const taskElement =
    button.parentElement.parentElement.querySelector(".task span");
  const updatedTask = prompt("Edit task:", taskElement.innerText);
  if (updatedTask !== null) {
    taskElement.innerText = updatedTask;
  }
}

function deleteTask(button) {
  const listItem = button.parentElement.parentElement;
  listItem.remove();
  saveTasksToLocalStorage();
}

function completeTask(button) {
  const listItem = button.parentElement.parentElement;
  listItem.classList.toggle("completed-task");
  saveTasksToLocalStorage();
}

function saveTasksToLocalStorage() {
  const tasks = Array.from(document.querySelectorAll("#todo-list li")).map(
    (taskElement) => {
      return {
        task: taskElement.querySelector(".task-p").innerText,
        priority: taskElement.querySelector(".priority").innerText,
        completed: taskElement.classList.contains("completed-task"),
      };
    }
  );

  localStorage.setItem("tasks", JSON.stringify(tasks));
}

document.addEventListener("DOMContentLoaded", loadTasks);

function loadTasks() {
  const storedTasks = localStorage.getItem("tasks");

  if (storedTasks) {
    const tasks = JSON.parse(storedTasks);

    tasks.forEach((task) => {
      const newTask = document.createElement("li");
      newTask.innerHTML = `
                        <div class="task">
                            <span class="task-p">${task.task}</span>
                            <div class="priority">${task.priority}</div>
                        </div>
                        <div class="task-buttons">
                            <button class="edit-button" onclick="editTask(this)">Edit</button>
                            <button class="delete-button" onclick="deleteTask(this)">Delete</button>
                            <button class="complete-button" id="done" onclick="completeTask(this)">Complete</button>
                        </div>
                    `;
      list.appendChild(newTask);

      // If the task was completed, update the 'completed-task' class
      if (task.completed) {
        newTask.classList.add("completed-task");
      }
      const priorityElement = newTask.querySelector(".priority");
      changePriorityColor(priorityElement, task.priority);
    });
  }
}
