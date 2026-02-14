const taskInput = document.getElementById("taskInput");
const addBtn = document.getElementById("addBtn");
const taskList = document.getElementById("taskList");
const totalCount = document.getElementById("totalCount");
const doneCount = document.getElementById("doneCount");
const clearBtn = document.getElementById("clearDoneBtn"); // MATCH HTML
const clearAllBtn = document.getElementById("clearAllBtn");

// Data model
let tasks = loadTasks();

// 1) Render initial tasks
render();

// 2) Add task (button click)
addBtn.addEventListener("click", () => {
	addTask();
});

// 3) Add task (press Enter)
taskInput.addEventListener("keydown", (e) => {
	if (e.key === "Enter") {
		addTask();
	}
});

// Clear done tasks
clearBtn.addEventListener("click", () => {
	tasks = tasks.filter(t => !t.done);
	saveTasks();
	render();
});

// Clear all tasks
clearAllBtn.addEventListener("click", () => {
	tasks = [];
	saveTasks();
	render();
});

function addTask() {
	const text = taskInput.value.trim();

	// Basic validation
	if (text.length === 0) {
		alert("Please type a task first.");
		taskInput.focus();
		return;
	}

	// Create task object
	const task = {
		id: crypto.randomUUID(),
		text: text,
		done: false
	};

	tasks.unshift(task); // add on top
	taskInput.value = "";
	taskInput.focus();

	saveTasks();
	render();
}

function render() {
	// Clear UI list
	taskList.innerHTML = "";

	// Create list items
	for (const task of tasks) {
		const li = document.createElement("li");
		li.className = "item" + (task.done ? " done" : "");

		const left = document.createElement("div");
		left.className = "left";

		const checkbox = document.createElement("input");
		checkbox.type = "checkbox";
		checkbox.checked = task.done;
		checkbox.addEventListener("change", () => {
			task.done = checkbox.checked;
			saveTasks();
			render();
		});

		const span = document.createElement("span");
		span.className = "text";
		span.textContent = task.text;

		left.appendChild(checkbox);
		left.appendChild(span);

		const delBtn = document.createElement("button");
		delBtn.className = "smallBtn";
		delBtn.textContent = "Delete";
		delBtn.addEventListener("click", () => {
			tasks = tasks.filter(t => t.id !== task.id);
			saveTasks();
			render();
		});

		li.appendChild(left);
		li.appendChild(delBtn);

		taskList.appendChild(li);
	}

	// Update stats
	const total = tasks.length;
	const done = tasks.filter(t => t.done).length;
	totalCount.textContent = `Total: ${total}`;
	doneCount.textContent = `Done: ${done}`;
}

function saveTasks() {
	localStorage.setItem("tasks", JSON.stringify(tasks));
}

function loadTasks() {
	const raw = localStorage.getItem("tasks");
	return raw ? JSON.parse(raw) : [];
}