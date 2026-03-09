import { VibeKanbanWebCompanion } from 'vibe-kanban-web-companion';
import { format, parseISO, isValid, isPast, isToday, isTomorrow } from "date-fns";

// Todos array (Feature 1)
let todos = [];
let nextId = 1;

// Feature 3: Sort by due date
let sortByDueDateActive = false;

function saveTodos() {
    localStorage.setItem('todos', JSON.stringify(todos));
    localStorage.setItem('nextId', String(nextId));
}

function loadTodos() {
    const stored = localStorage.getItem('todos');
    if (stored) {
        todos = JSON.parse(stored);
        nextId = Number(localStorage.getItem('nextId')) || todos.length + 1;
    }
}

// Current filter (Feature 2)
let currentFilter = 'all';

document.addEventListener('DOMContentLoaded', () => {
    init();
    initVibeKanban();
});

function init() {
    // Wire up add button
    const addBtn = document.getElementById('addBtn');
    const todoInput = document.getElementById('todoInput');

    addBtn.addEventListener('click', addTodo);
    todoInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') addTodo();
    });

    // Wire up filter buttons
    const filterButtons = document.querySelectorAll('.filter-btn');
    filterButtons.forEach(btn => {
        btn.addEventListener('click', () => setFilter(btn.dataset.filter));
    });

    // Wire up sort button
    document.getElementById('sortByDueDate').addEventListener('click', () => {
        sortByDueDateActive = !sortByDueDateActive;
        document.getElementById('sortByDueDate').classList.toggle('active', sortByDueDateActive);
        renderTodos();
    });

    loadTodos();
    renderTodos();
}

function initVibeKanban() {
    const companion = new VibeKanbanWebCompanion();
    companion.render(document.body);
}

// Feature 1: Add, toggle, delete todos
function addTodo() {
    const input = document.getElementById('todoInput');
    const text = input.value.trim();

    if (text === '') return;

    const dueDate = document.getElementById('todoDueDate').value || null;

    todos.push({
        id: nextId++,
        text: text,
        completed: false,
        dueDate: dueDate
    });

    input.value = '';
    document.getElementById('todoDueDate').value = '';
    saveTodos();
    renderTodos();
}

function toggleTodo(id) {
    const todo = todos.find(t => t.id === id);
    if (todo) {
        todo.completed = !todo.completed;
        saveTodos();
        renderTodos();
    }
}

function deleteTodo(id) {
    todos = todos.filter(t => t.id !== id);
    saveTodos();
    renderTodos();
}

// Feature 1: Render todos
function renderTodos() {
    const todoList = document.getElementById('todoList');
    const filteredTodos = getFilteredTodos();

    todoList.innerHTML = '';

    filteredTodos.forEach(todo => {
        const li = document.createElement('li');
        li.className = 'todo-item';
        if (todo.completed) li.classList.add('completed');

        li.innerHTML = `
            <input type="checkbox" class="todo-checkbox" ${todo.completed ? 'checked' : ''}>
            <span class="todo-text">${escapeHtml(todo.text)}</span>
            <button class="todo-delete">Delete</button>
        `;

        if (todo.dueDate) {
            const dueDateEl = document.createElement('span');
            dueDateEl.className = 'todo-due-date';
            if (isPast(parseISO(todo.dueDate)) && !isToday(parseISO(todo.dueDate))) {
                dueDateEl.classList.add('overdue');
            }
            dueDateEl.textContent = formatDueDate(todo.dueDate);
            li.insertBefore(dueDateEl, li.querySelector('.todo-delete'));
        }

        li.querySelector('.todo-checkbox').addEventListener('change', () => toggleTodo(todo.id));
        li.querySelector('.todo-delete').addEventListener('click', () => deleteTodo(todo.id));

        todoList.appendChild(li);
    });
}

// Feature 2: Filter todos based on current filter
function getFilteredTodos() {
    let filtered;
    if (currentFilter === 'active') {
        filtered = todos.filter(t => !t.completed);
    } else if (currentFilter === 'completed') {
        filtered = todos.filter(t => t.completed);
    } else {
        filtered = [...todos];
    }

    if (sortByDueDateActive) {
        filtered.sort((a, b) => {
            if (!a.dueDate && !b.dueDate) return 0;
            if (!a.dueDate) return 1;
            if (!b.dueDate) return -1;
            return a.dueDate.localeCompare(b.dueDate);
        });
    }

    return filtered;
}

// Feature 3: Format due date for display
function formatDueDate(dateStr) {
    const date = parseISO(dateStr);
    if (!isValid(date)) return null;
    if (isToday(date)) return "Due today";
    if (isTomorrow(date)) return "Due tomorrow";
    if (isPast(date)) return `Overdue · ${format(date, "MMM d")}`;
    return `Due ${format(date, "MMM d, yyyy")}`;
}

// Feature 2: Set filter and update UI
function setFilter(filter) {
    currentFilter = filter;

    // Update button styling
    const filterButtons = document.querySelectorAll('.filter-btn');
    filterButtons.forEach(btn => {
        btn.classList.remove('active');
        if (btn.dataset.filter === filter) {
            btn.classList.add('active');
        }
    });

    renderTodos();
}

// Utility function to escape HTML
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}
