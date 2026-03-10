# Quickstart: Todo Priority System

**Branch**: `001-todo-priority-system`

## Prerequisites

Node.js installed. Run from the repository root.

## Run the dev server

```bash
npm run dev
```

Opens at `http://localhost:5173`.

## Manual test checklist

### Priority assignment on creation

1. Type a todo title in the input field.
2. Select **High** from the priority dropdown.
3. Click **Add** (or press Enter).
4. **Expected**: todo appears in the list with a red "High" badge.
5. Repeat with **Medium** (amber badge) and **Low** (blue-green badge).
6. Add a todo without selecting a priority.
7. **Expected**: todo appears with a "Medium" badge (default).

### Persistence across refresh

1. Add a High-priority todo.
2. Refresh the page.
3. **Expected**: todo still shows the High badge.

### Visual indicators in dark mode

1. Click the **Dark** toggle.
2. **Expected**: all three priority badges remain clearly visible and distinguishable.

### Edit priority on existing todo

1. Find a todo with Low priority.
2. Change its priority selector to High.
3. **Expected**: badge updates immediately to "High".
4. Refresh the page.
5. **Expected**: priority is still High.

### Sort by priority

1. Create todos with all three priorities in mixed order.
2. Click **Sort by Priority**.
3. **Expected**: todos re-order to High → Medium → Low within their current filter.
4. Click **Sort by Priority** again.
5. **Expected**: list returns to original manual order.

### Mutual exclusivity with due-date sort

1. Click **Sort by Due Date** to activate it.
2. Click **Sort by Priority**.
3. **Expected**: due-date sort deactivates; priority sort activates.
4. Now click **Sort by Due Date** again.
5. **Expected**: priority sort deactivates; due-date sort activates (both directions work per FR-007).

### Import backward compatibility

1. Export an existing todos file (if any).
2. Remove the `"priority"` field from entries in the JSON.
3. Import the modified file.
4. **Expected**: all imported todos display a "Medium" badge — no errors.

### Accessibility: Priority distinguishable without colour (SC-006)

1. Open the todo list with todos of all three priority levels.
2. Use your browser's DevTools to temporarily disable CSS (e.g., uncheck the stylesheet in the Sources/Styles panel).
3. **Expected**: the text labels "High", "Medium", and "Low" remain visible and clearly identify each priority level — no information is lost when colour is removed.
4. Re-enable CSS.
5. **Expected**: each priority level has a distinct background colour in addition to its label.

## Lint

```bash
npm run lint
```

All ESLint and Stylelint rules must pass before submitting.
