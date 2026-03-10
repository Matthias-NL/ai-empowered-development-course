# Tasks: Todo Priority System

**Input**: Design documents from `/specs/001-todo-priority-system/`
**Prerequisites**: plan.md ✓, spec.md ✓, research.md ✓, data-model.md ✓, quickstart.md ✓

**Tests**: No automated test framework is configured in this project — manual verification using `quickstart.md` scenarios.

**Organization**: Tasks grouped by user story (P1→P4) to enable independent implementation and validation of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no shared-state dependency)
- **[Story]**: Which user story this task belongs to (US1–US4)
- Exact file paths included in every description

---

## Phase 1: Setup

**Purpose**: Confirm the existing application runs cleanly before any changes.

- [x] T001 Start dev server with `npm run dev` and manually verify existing features (add/toggle/delete todos, filter, due-date sort, dark mode, drag-drop, export/import) all work correctly in `index.html` / `main.js` / `styles.css`

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Add the `priority` data field and backward-compatibility defaults — required by every user story.

**⚠️ CRITICAL**: No user story work can begin until this phase is complete.

- [x] T002 Add `const PRIORITY_ORDER = { high: 1, medium: 2, low: 3 };` constant at the top of `main.js` (after existing state variables)
- [x] T003 [P] Update `importTodos()` in `main.js` to apply `priority: t.priority ?? "medium"` when mapping imported todos (preserves backward compatibility with JSON files that lack a priority field)
- [x] T004 [P] Update `loadTodos()` in `main.js` to apply `todos = todos.map(t => ({ priority: "medium", ...t }))` after parsing stored JSON (ensures existing localStorage data without a priority field receives the default)

**Checkpoint**: All todos — stored, imported, or newly created — now have a `priority` field.

---

## Phase 3: User Story 1 — Assign Priority When Creating a Todo (Priority: P1) 🎯 MVP

**Goal**: Users can select a priority (High / Medium / Low) at creation time; it is saved and persists across refreshes.

**Independent Test**: Add a "High" priority todo → refresh page → confirm it still shows as High priority. Add one with no selection → confirm it defaults to Medium.

### Implementation for User Story 1

- [x] T005 [US1] Add a `<select id="todoPriority">` element with options High / Medium / Low (Medium pre-selected) to the add-todo form in `index.html`, alongside the existing `#todoInput` and `#todoDueDate` inputs
- [x] T006 [US1] Update `addTodo()` in `main.js` to read `document.getElementById("todoPriority").value` and include `priority` in the new todo object pushed to `todos`
- [x] T007 [US1] Reset `#todoPriority` back to `"medium"` in `addTodo()` in `main.js` after a todo is successfully added (alongside the existing input/dueDate resets)

**Checkpoint**: User Story 1 is fully functional. Create todos with all three priorities, refresh — all priorities persist correctly.

---

## Phase 4: User Story 2 — Visual Priority Indicators (Priority: P2)

**Goal**: Every todo item displays a visually distinct badge (text + colour) for its priority level, in both light and dark modes.

**Independent Test**: Given todos of all three priority levels in the list, all badges are clearly distinguishable by label and colour. Switch to dark mode — badges remain readable.

### Implementation for User Story 2

- [x] T008 [P] [US2] Add `.priority-badge` base styles (including `appearance: none; -webkit-appearance: none;` so background-color renders correctly when applied to a `<select>` in US4) and `.priority-high` / `.priority-medium` / `.priority-low` colour variants (light mode) to `styles.css` — use distinct background colours (e.g., red-family / amber-family / teal-family) with contrasting text
- [x] T009 [P] [US2] Add dark-mode overrides for all three `.priority-*` variants inside the existing `[data-theme="dark"]` selector block in `styles.css` (depends on T008 defining the base classes, but touches only the dark-mode block — safe to run in parallel)
- [x] T010 [US2] In `renderTodos()` in `main.js`, create a `<span class="priority-badge priority-${todo.priority ?? 'medium'}">` element with capitalised label text (e.g., "High") and insert it into each `<li>` before the delete button (mirrors the existing `todo-due-date` span insertion pattern)

**Checkpoint**: User Story 2 functional. All three badge variants visible and distinguishable in both themes.

---

## Phase 5: User Story 3 — Sort Todos by Priority (Priority: P3)

**Goal**: A single toggle sorts the list High → Medium → Low; deactivating it restores the original order. Mutually exclusive with due-date sort.

**Independent Test**: Create todos in mixed priority order → click "Sort by Priority" → confirm High items are first, then Medium, then Low. Click again → order restored.

### Implementation for User Story 3

- [x] T011 [US3] Add `let sortByPriorityActive = false;` state variable in `main.js` alongside the existing `sortByDueDateActive` variable
- [x] T012 [US3] Add a `<button id="sortByPriority">Sort by Priority</button>` button to the controls section of `index.html` (alongside the existing `#sortByDueDate` button)
- [x] T013 [US3] In `init()` in `main.js`, wire up a click handler for `#sortByPriority` that: (1) toggles `sortByPriorityActive`, (2) if activating, sets `sortByDueDateActive = false` and removes `active` class from `#sortByDueDate`, (3) toggles `active` class on `#sortByPriority`, (4) calls `renderTodos()`
- [x] T013b [US3] Update the existing `#sortByDueDate` click handler in `init()` in `main.js` to reset `sortByPriorityActive = false` and remove the `active` class from `#sortByPriority` when due-date sort is activated (makes mutual exclusivity work in both directions per FR-007)
- [x] T014 [US3] Add a priority sort branch to `getFilteredTodos()` in `main.js`: when `sortByPriorityActive` is true, sort `filtered` by `PRIORITY_ORDER[a.priority ?? "medium"] - PRIORITY_ORDER[b.priority ?? "medium"]` (stable — JavaScript sort is stable in ES2019+); requires T002 (PRIORITY_ORDER constant)

**Checkpoint**: User Story 3 functional. Priority sort and due-date sort are mutually exclusive; deactivating restores manual order.

---

## Phase 6: User Story 4 — Edit Priority on Existing Todos (Priority: P4)

**Goal**: Users can change the priority of an already-saved todo via an inline control; the change persists immediately.

**Independent Test**: Change a Low-priority todo to High → badge/control updates immediately → refresh → still shows High.

### Implementation for User Story 4

- [x] T015 [US4] In `renderTodos()` in `main.js`, replace the static `.priority-badge` span (created in T010) with an inline `<select class="priority-select priority-badge priority-${todo.priority ?? 'medium'}">` element containing the same High/Medium/Low options, with `todo.priority ?? "medium"` pre-selected — relies on `appearance: none` added in T009 to ensure colour classes render on the `<select>`
- [x] T016 [US4] Wire up a `change` event handler on the inline `<select>` in `renderTodos()` in `main.js` that updates `todo.priority` to the new value and calls `saveTodos()` then `renderTodos()`

**Checkpoint**: User Story 4 functional. All four user stories are independently functional.

---

## Phase 7: Polish & Cross-Cutting Concerns

**Purpose**: Lint compliance, dark-mode QA, and full manual validation.

- [x] T017 [P] Run `npm run lint` and fix any ESLint errors in `main.js` (double quotes, semicolons, no unused vars) and any Stylelint errors in `styles.css`
- [ ] T018 Execute all manual test scenarios from `specs/001-todo-priority-system/quickstart.md` — verify every acceptance criterion from all four user stories passes

---

## Dependencies & Execution Order

### Phase Dependencies

- **Phase 1 (Setup)**: No dependencies — start immediately
- **Phase 2 (Foundational)**: Depends on Phase 1 — BLOCKS all user stories
- **Phase 3 (US1)**: Depends on Phase 2 completion
- **Phase 4 (US2)**: Depends on Phase 2 completion; T010 depends on T008/T009 (CSS must exist before JS renders badges)
- **Phase 5 (US3)**: Depends on Phase 2 and T002 (PRIORITY_ORDER constant); T014 depends on T011/T012/T013/T013b
- **Phase 6 (US4)**: Depends on T010 (replaces the badge element created there)
- **Phase 7 (Polish)**: Depends on all prior phases complete

### User Story Dependencies

- **US1 (P1)**: Can start after Phase 2 — no dependency on other user stories
- **US2 (P2)**: Can start after Phase 2 — T008/T009 are independent of US1
- **US3 (P3)**: Can start after Phase 2 — depends on PRIORITY_ORDER (T002) but not on US1 or US2
- **US4 (P4)**: Depends on T010 from US2 (modifies the same DOM element)

### Within Each User Story

- CSS tasks (T008, T009) before the JS rendering task (T010) within US2
- State variable (T011) and button (T012) before handler wiring (T013) before sort logic (T014) within US3
- T015 must follow T010; T016 must follow T015 within US4

### Parallel Opportunities

- T003 and T004 (Phase 2) touch different functions — can run in parallel
- T008 and T009 (US2 CSS tasks) touch the same file but different rule blocks — can run in parallel
- T008/T009 and T011/T012 (US2 CSS vs US3 setup) touch different files — can run in parallel
- T017 (lint) is independent of T018 (manual QA) — can run in parallel

---

## Parallel Example: Phase 2

```
# Both can run simultaneously — different functions:
Task T003: Update importTodos() backward compat in main.js
Task T004: Update loadTodos() backward compat in main.js
```

## Parallel Example: Phase 4 (US2)

```
# CSS tasks run together, then JS rendering:
Task T008: Add light-mode priority badge CSS in styles.css
Task T009: Add dark-mode priority badge CSS in styles.css
↓ (both complete)
Task T010: Render priority badge in renderTodos() in main.js
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup
2. Complete Phase 2: Foundational (T002–T004)
3. Complete Phase 3: User Story 1 (T005–T007)
4. **STOP and VALIDATE**: Todos save and persist priority — full US1 test passes
5. Continue to US2 for visible indicators

### Incremental Delivery

1. Setup + Foundational → priority field exists everywhere
2. US1 → priorities can be created and saved (MVP)
3. US2 → priorities are visible as badges (full core value)
4. US3 → list can be sorted by priority (power user feature)
5. US4 → priorities can be edited after creation (completeness)
6. Polish → lint clean, all quickstart scenarios verified

---

## Notes

- [P] tasks operate on different files or non-conflicting sections — safe to parallelize
- [Story] label traces each task back to its user story for coverage verification
- No automated test framework — validation is manual via `quickstart.md`
- Commit after each phase checkpoint to enable easy rollback
- `todo.priority ?? "medium"` fallback must appear in all rendering/sorting paths — enforced by T004 (load) and T003 (import) in Phase 2, and defensively in render/sort code
