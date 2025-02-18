document.addEventListener("DOMContentLoaded", () => {
  const taskDate = document.getElementById("task-date");
  const taskForm = document.getElementById("task-form");
  const taskName = document.getElementById("task-name");
  const taskTime = document.getElementById("task-time");
  const taskPlace = document.getElementById("task-place");
  const selectedDate = document.getElementById("selected-date");
  const taskList = document.getElementById("tasks");

  let sortOrder = {
    name: "asc",
    time: "asc",
    status: "asc",
  };

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
        <td contenteditable="false">${task.name}</td>
        <td contenteditable="false">
          <input type="time" value="${task.time}" disabled>
        </td>
        <td contenteditable="false">${task.place}</td>
        <td>
          <select class="status-select">
            <option value="Pending" ${task.status === "Pending" ? "selected" : ""}>Pending</option>
            <option value="Completed" ${task.status === "Completed" ? "selected" : ""}>Completed</option>
          </select>
        </td>
        <td>
          <button class="edit-btn">Edit</button>
          <button class="delete-btn">Delete</button>
        </td>
      `;

      // ✅ Allow status update via dropdown
      row.querySelector(".status-select").addEventListener("change", (e) => {
        tasks[date][index].status = e.target.value;
        localStorage.setItem("tasks", JSON.stringify(tasks));
      });

      // ✅ Edit Task Functionality (Now with proper input types)
      row.querySelector(".edit-btn").addEventListener("click", () => {
        const isEditing = row.classList.toggle("editing");
        const nameCell = row.cells[0];
        const timeCell = row.cells[1].querySelector("input");
        const placeCell = row.cells[2];

        if (isEditing) {
          row.querySelector(".edit-btn").textContent = "Save";
          nameCell.contentEditable = "true";
          placeCell.contentEditable = "true";
          timeCell.disabled = false;
        } else {
          row.querySelector(".edit-btn").textContent = "Edit";
          nameCell.contentEditable = "false";
          placeCell.contentEditable = "false";
          timeCell.disabled = true;

          // ✅ Save updated task details
          tasks[date][index].name = nameCell.textContent.trim();
          tasks[date][index].time = timeCell.value.trim();
          tasks[date][index].place = placeCell.textContent.trim();
          localStorage.setItem("tasks", JSON.stringify(tasks));
        }
      });

      // ✅ Delete Task Functionality
      row.querySelector(".delete-btn").addEventListener("click", () => {
        tasks[date].splice(index, 1);
        localStorage.setItem("tasks", JSON.stringify(tasks));
        displayTasks(date);
      });

      taskList.appendChild(row);
    });
  }

  // ✅ Sorting Functionality (Preserving Sorting When Status & Editing Features Were Added)
  function sortTasks(date, key) {
    if (!tasks[date]) return;

    const order = sortOrder[key] === "asc" ? 1 : -1;
    tasks[date].sort((a, b) => {
      if (a[key] < b[key]) return -order;
      if (a[key] > b[key]) return order;
      return 0;
    });

    // Toggle order for next click
    sortOrder[key] = sortOrder[key] === "asc" ? "desc" : "asc";

    localStorage.setItem("tasks", JSON.stringify(tasks));
    displayTasks(date);
  }

  // ✅ Attach Sorting Events to Table Headers
  document.addEventListener("click", (e) => {
    const date = taskDate.value;
    if (!date) return;

    if (e.target.matches("#sort-name")) sortTasks(date, "name");
    if (e.target.matches("#sort-time")) sortTasks(date, "time");
    if (e.target.matches("#sort-status")) sortTasks(date, "status");
  });
});
