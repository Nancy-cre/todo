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

function addTodo(text) {
    const todo = {
        id: generateId(),
        text: text.trim(),
        completed: false,
        createdAt: new Date().toISOString()
    };
    todos.unshift(todo);
    saveTodos();
    render();
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
    li.className = 'todo-item' + (todo.completed ? ' completed' : '');

    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.className = 'todo-checkbox';
    checkbox.checked = todo.completed;
    checkbox.addEventListener('change', () => toggleTodo(todo.id));

    const span = document.createElement('span');
    span.className = 'todo-text';
    span.textContent = todo.text;

    const deleteBtn = document.createElement('button');
    deleteBtn.className = 'delete-btn';
    deleteBtn.innerHTML = '&times;';
    deleteBtn.addEventListener('click', () => deleteTodo(todo.id));

    li.appendChild(checkbox);
    li.appendChild(span);
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

    form.addEventListener('submit', (e) => {
        e.preventDefault();
        const text = input.value.trim();
        if (text) {
            addTodo(text);
            input.value = '';
        }
    });

    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.addEventListener('click', () => setFilter(btn.dataset.filter));
    });

    render();
});
