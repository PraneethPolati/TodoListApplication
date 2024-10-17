// Get the input field, buttons, and list elements
const todoInput = document.getElementById('todo-input');
const dueDateInput = document.getElementById('due-date');
const taskPriorityInput = document.getElementById('task-priority');
const addTodoBtn = document.getElementById('add-todo-btn');
const filterAllBtn = document.getElementById('filter-all');
const filterCompletedBtn = document.getElementById('filter-completed');
const filterPendingBtn = document.getElementById('filter-pending');
const todoList = document.getElementById('todo-list');

let todos = JSON.parse(localStorage.getItem('todos')) || [];
let editMode = false; // New variable to track edit mode
let editIndex = null; // To store the index of the todo being edited

function renderTodos(filter = 'all') {
    todoList.innerHTML = '';
    todos.forEach((todo, index) => {
        const todoItem = document.createElement('li');
        todoItem.classList.add('todo-item');
        todoItem.textContent = `${todo.task} - Due: ${todo.dueDate} - Priority: ${todo.priority}`;
        if (todo.completed) {
            todoItem.classList.add('completed');
        }

        // Delete button
        const deleteBtn = document.createElement('span');
        deleteBtn.textContent = ' (Delete)';
        deleteBtn.style.color = 'red';
        deleteBtn.style.cursor = 'pointer';
        todoItem.appendChild(deleteBtn);
        deleteBtn.addEventListener('click', () => {
            todos.splice(index, 1); // Remove the todo from the list
            localStorage.setItem('todos', JSON.stringify(todos)); // Update local storage
            renderTodos(filter); // Re-render the list
        });

        // Edit button
        const editBtn = document.createElement('span');
        editBtn.textContent = ' (Edit)';
        editBtn.style.color = 'blue';
        editBtn.style.cursor = 'pointer';
        todoItem.appendChild(editBtn);
        editBtn.addEventListener('click', () => {
            // Load the current todo into the input fields
            todoInput.value = todo.task;
            dueDateInput.value = todo.dueDate;
            taskPriorityInput.value = todo.priority;
            editMode = true; // Enter edit mode
            editIndex = index; // Store the index of the todo being edited
            addTodoBtn.textContent = 'Update'; // Change button text to "Update"
        });

        // Complete button
        const completeBtn = document.createElement('span');
        completeBtn.textContent = ' (Complete)';
        completeBtn.style.color = 'green';
        completeBtn.style.cursor = 'pointer';
        todoItem.appendChild(completeBtn);
        completeBtn.addEventListener('click', () => {
            todo.completed = !todo.completed; // Toggle completion
            localStorage.setItem('todos', JSON.stringify(todos)); // Update local storage
            renderTodos(filter); // Re-render the list
        });

        // Filter logic
        if (filter === 'all' || (filter === 'completed' && todo.completed) || (filter === 'pending' && !todo.completed)) {
            todoList.appendChild(todoItem);
        }
    });
}

// Add new or update an existing todo
addTodoBtn.addEventListener('click', () => {
    const task = todoInput.value.trim();
    const dueDate = dueDateInput.value;
    const priority = taskPriorityInput.value;
    
    if (task !== '') {
        if (editMode) {
            // If in edit mode, update the existing todo
            todos[editIndex] = { task, dueDate, priority, completed: todos[editIndex].completed };
            editMode = false; // Exit edit mode
            addTodoBtn.textContent = 'ADD'; // Reset button text
        } else {
            // Add a new todo
            const todo = { task, dueDate, priority, completed: false };
            todos.push(todo);
        }
        localStorage.setItem('todos', JSON.stringify(todos)); // Update local storage
        todoInput.value = ''; // Clear input field
        dueDateInput.value = '';
        taskPriorityInput.value = 'low';
        renderTodos(); // Re-render the list
    }
});

// Add event listeners to the filter buttons
filterAllBtn.addEventListener('click', () => renderTodos('all'));
filterCompletedBtn.addEventListener('click', () => renderTodos('completed'));
filterPendingBtn.addEventListener('click', () => renderTodos('pending'));

// Render todos initially
renderTodos();
