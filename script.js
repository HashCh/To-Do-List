document.addEventListener("DOMContentLoaded", () => {
  const taskDate = document.getElementById("task-date");
  const taskForm = document.getElementById("task-form");
  const taskName = document.getElementById("task-name");
  const taskTime = document.getElementById("task-time");
  const taskPlace = document.getElementById("task-place");
  const selectedDate = document.getElementById("selected-date");
  const taskList = document.getElementById("tasks");

  let tasks = JSON.parse(localStorage.getItem("tasks")) || {};

  // Update tasks when date changes
  taskDate.addEventListener("change", () => {
    const date = taskDate.value;
    selectedDate.textContent = date || "[No Date Selected]";
    displayTasks(date);
  });

  // Add a task
  taskForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const date = taskDate.value;

    if (!date) {
      alert("Please select a date!");
      return;
    }

    const task = {
      name: taskName.value.trim(),
      time: taskTime.value.trim(),
      place: taskPlace.value.trim(),
      status: "Pending",
    };

    if (!tasks[date]) tasks[date] = [];
    tasks[date].push(task);

    localStorage.setItem("tasks", JSON.stringify(tasks));

    taskName.value = "";
    taskTime.value = "";
    taskPlace.value = "";

    displayTasks(date);
  });

  // Display tasks for the selected date
  function displayTasks(date) {
    taskList.innerHTML = "";

    if (!tasks[date] || tasks[date].length === 0) {
      taskList.innerHTML = `<tr><td colspan="5">No tasks available for this date.</td></tr>`;
      return;
    }

    tasks[date].forEach((task, index) => {
      const row = document.createElement("tr");
      row.innerHTML = `
        <td>${task.name}</td>
        <td>${task.time}</td>
        <td>${task.place}</td>
        <td>${task.status}</td>
        <td>
          <button class="edit-btn">Edit</button>
          <button class="delete-btn">Delete</button>
        </td>
      `;

      // Edit task functionality
      row.querySelector(".edit-btn").addEventListener("click", () => {
        const isEditing = row.classList.toggle("editing");
        if (!isEditing) {
          task.name = row.cells[0].textContent.trim();
          task.time = row.cells[1].textContent.trim();
          task.place = row.cells[2].textContent.trim();
          localStorage.setItem("tasks", JSON.stringify(tasks));
        }
      });

      // Delete task functionality
      row.querySelector(".delete-btn").addEventListener("click", () => {
        tasks[date].splice(index, 1);
        localStorage.setItem("tasks", JSON.stringify(tasks));
        displayTasks(date);
      });

      taskList.appendChild(row);
    });
  }
});
