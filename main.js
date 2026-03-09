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

    // Apply saved theme
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
        document.documentElement.setAttribute('data-theme', 'dark');
        document.getElementById('themeToggle').textContent = 'Light';
    }
    document.getElementById('exportBtn').addEventListener('click', exportTodos);
    document.getElementById('importBtn').addEventListener('click', () => {
        document.getElementById('importFile').click();
    });
    document.getElementById('importFile').addEventListener('change', (e) => {
        if (e.target.files[0]) {
            importTodos(e.target.files[0]);
            e.target.value = ''; // reset so same file can be re-imported
        }
    });

    document.getElementById('themeToggle').addEventListener('click', () => {
        const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
        if (isDark) {
            document.documentElement.removeAttribute('data-theme');
            localStorage.setItem('theme', 'light');
            document.getElementById('themeToggle').textContent = 'Dark';
        } else {
            document.documentElement.setAttribute('data-theme', 'dark');
            localStorage.setItem('theme', 'dark');
            document.getElementById('themeToggle').textContent = 'Light';
        }
    });

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

        li.dataset.id = todo.id;
        li.draggable = !sortByDueDateActive;

        if (!sortByDueDateActive) {
            li.addEventListener('dragstart', (e) => {
                e.dataTransfer.setData('text/plain', String(todo.id));
                li.classList.add('dragging');
            });
            li.addEventListener('dragend', () => {
                li.classList.remove('dragging');
            });
            li.addEventListener('dragover', (e) => {
                e.preventDefault();
                li.classList.add('drag-over');
            });
            li.addEventListener('dragleave', () => {
                li.classList.remove('drag-over');
            });
            li.addEventListener('drop', (e) => {
                e.preventDefault();
                li.classList.remove('drag-over');
                const draggedId = Number(e.dataTransfer.getData('text/plain'));
                const targetId = todo.id;
                if (draggedId === targetId) return;
                const fromIndex = todos.findIndex(t => t.id === draggedId);
                const toIndex = todos.findIndex(t => t.id === targetId);
                // Reorder in-place
                const [moved] = todos.splice(fromIndex, 1);
                todos.splice(toIndex, 0, moved);
                saveTodos();
                renderTodos();
            });
        }

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

// Feature 4: Export todos to JSON file
function exportTodos() {
    const blob = new Blob([JSON.stringify(todos, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'todos.json';
    a.click();
    URL.revokeObjectURL(url);
}

// Feature 4: Import todos from JSON file
function importTodos(file) {
    const reader = new FileReader();
    reader.onload = (e) => {
        try {
            const data = JSON.parse(e.target.result);
            if (!Array.isArray(data) || !data.every(t => 'id' in t && 'text' in t && 'completed' in t)) {
                alert('Invalid todos file format.');
                return;
            }
            todos = data;
            nextId = todos.length > 0 ? Math.max(...todos.map(t => t.id)) + 1 : 1;
            saveTodos();
            renderTodos();
        } catch {
            alert('Failed to parse JSON file.');
        }
    };
    reader.readAsText(file);
}
