const STORAGE_KEY = 'todos';

let todos = [];
let currentFilter = 'all';

function loadTodos() {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
        todos = JSON.parse(saved);
    }
}

function saveTodos() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(todos));
}

function generateId() {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

function addTodo(text, dueDate) {
    const todo = {
        id: generateId(),
        text: text.trim(),
        completed: false,
        dueDate: dueDate || null,
        createdAt: new Date().toISOString()
    };
    todos.unshift(todo);
    saveTodos();
    render();
}

function formatDate(dateString) {
    if (!dateString) return null;
    const date = new Date(dateString);
    return `${date.getFullYear()}/${(date.getMonth() + 1).toString().padStart(2, '0')}/${date.getDate().toString().padStart(2, '0')}`;
}

function isOverdue(dueDate) {
    if (!dueDate) return false;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return new Date(dueDate) < today;
}

function toggleTodo(id) {
    const todo = todos.find(t => t.id === id);
    if (todo) {
        todo.completed = !todo.completed;
        saveTodos();
        render();
    }
}

function deleteTodo(id) {
    todos = todos.filter(t => t.id !== id);
    saveTodos();
    render();
}

function getFilteredTodos() {
    switch (currentFilter) {
        case 'active':
            return todos.filter(t => !t.completed);
        case 'completed':
            return todos.filter(t => t.completed);
        default:
            return todos;
    }
}

function createTodoElement(todo) {
    const li = document.createElement('li');
    let className = 'todo-item';
    if (todo.completed) className += ' completed';
    if (!todo.completed && isOverdue(todo.dueDate)) className += ' overdue';
    li.className = className;

    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.className = 'todo-checkbox';
    checkbox.checked = todo.completed;
    checkbox.addEventListener('change', () => toggleTodo(todo.id));

    const contentDiv = document.createElement('div');
    contentDiv.className = 'todo-content';

    const span = document.createElement('span');
    span.className = 'todo-text';
    span.textContent = todo.text;
    contentDiv.appendChild(span);

    if (todo.dueDate) {
        const dueDateSpan = document.createElement('span');
        dueDateSpan.className = 'todo-due-date';
        dueDateSpan.textContent = formatDate(todo.dueDate);
        contentDiv.appendChild(dueDateSpan);
    }

    const deleteBtn = document.createElement('button');
    deleteBtn.className = 'delete-btn';
    deleteBtn.innerHTML = '&times;';
    deleteBtn.addEventListener('click', () => deleteTodo(todo.id));

    li.appendChild(checkbox);
    li.appendChild(contentDiv);
    li.appendChild(deleteBtn);

    return li;
}

function render() {
    const list = document.getElementById('todo-list');
    list.innerHTML = '';

    const filteredTodos = getFilteredTodos();
    filteredTodos.forEach(todo => {
        list.appendChild(createTodoElement(todo));
    });

    const remaining = todos.filter(t => !t.completed).length;
    document.getElementById('remaining-count').textContent = remaining;
}

function setFilter(filter) {
    currentFilter = filter;
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.classList.toggle('active', btn.dataset.filter === filter);
    });
    render();
}

document.addEventListener('DOMContentLoaded', () => {
    loadTodos();

    const form = document.getElementById('todo-form');
    const input = document.getElementById('todo-input');
    const dateInput = document.getElementById('todo-date');

    form.addEventListener('submit', (e) => {
        e.preventDefault();
        const text = input.value.trim();
        if (text) {
            addTodo(text, dateInput.value);
            input.value = '';
            dateInput.value = '';
        }
    });

    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.addEventListener('click', () => setFilter(btn.dataset.filter));
    });

    render();
});
