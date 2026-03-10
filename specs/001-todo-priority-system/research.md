# Research: Todo Priority System

**Branch**: `001-todo-priority-system` | **Date**: 2026-03-10

## Decision Log

### 1. Priority Internal Representation

**Decision**: Store priority as a lowercase string enum — `"high"`, `"medium"`, `"low"`.

**Rationale**: String values are human-readable in localStorage/exported JSON, making the export/import format self-documenting. No serialisation step needed. Sorting is done via a fixed numeric map (`{high: 1, medium: 2, low: 3}`) at sort time rather than storing numbers, keeping the data model stable if priority labels change.

**Alternatives considered**:
- Numeric (1/2/3): Compact but opaque in exported JSON; requires a lookup to display.
- Capitalised strings ("High"/"Medium"/"Low"): Display-ready but creates a dependency between storage and display; lowercase is safer.

---

### 2. Visual Indicator Approach

**Decision**: Render a small inline badge (`<span class="priority-badge priority-{level}">`) beside the todo text, containing the capitalised label ("High", "Medium", "Low"). Apply a distinct background colour per level (red family / amber family / blue-green family) with sufficient contrast in both light and dark themes.

**Rationale**: Text label satisfies the spec requirement (SC-006) that levels be distinguishable without colour alone — screen readers read the label; colour provides a secondary, faster visual cue. A badge is consistent with the existing `todo-due-date` span pattern already in `renderTodos()`.

**Alternatives considered**:
- Icon-only (⚠️ / · / ↓): Fails accessibility requirement — icons alone have no text alternative without extra `aria-label` work.
- Coloured left border on `<li>`: Works visually but does not communicate priority to assistive technology without additional markup.

---

### 3. Sort Integration

**Decision**: Add a `sortByPriorityActive` boolean (mirroring the existing `sortByDueDateActive` flag). The two sort modes are mutually exclusive: activating one resets the other. Both toggles are wired the same way — click → flip flag → re-render.

**Rationale**: Follows the exact pattern already implemented for due-date sorting (see `main.js` lines 8–53 and `getFilteredTodos()` lines 212–219). Zero new patterns to learn or maintain.

**Alternatives considered**:
- Multi-key sort (priority + due date simultaneously): Adds complexity not requested in the spec and conflicts with FR-007 (mutual exclusivity).
- Dropdown sort selector: More discoverable but inconsistent with the existing toggle-button UX pattern.

---

### 4. Edit Priority on Existing Todos

**Decision**: Replace the static priority badge with a `<select>` element when inline editing is needed, OR add a small priority `<select>` directly in the rendered todo item (always-visible, no edit mode required). Given the app has no edit mode today, always-visible inline select is simpler.

**Rationale**: The app currently has no "edit mode" — todos are toggled and deleted but never text-edited inline. Adding a dedicated edit mode just for priority would be disproportionate. An always-visible `<select>` is the simplest implementation that satisfies FR-005 and is consistent with the checkbox-and-delete pattern.

**Alternatives considered**:
- Click-to-edit badge: Requires hit-area, focus management, and a confirmation step — over-engineered for this app.
- Separate "edit" modal: Inconsistent with the app's current zero-modal design.

---

### 5. Backward Compatibility / Import Migration

**Decision**: When rendering a todo, default `priority` to `"medium"` if the field is absent. During import validation, accept todos without a `priority` field and apply the default silently.

**Rationale**: Satisfies edge case 4 (pre-feature todos) and FR-010 (imported todos without priority). The existing import validator checks `'id' in t && 'text' in t && 'completed' in t` — `priority` will be optional so old files remain valid.

**Alternatives considered**:
- Reject imports without priority: Breaks backward compatibility unnecessarily.
- Prompt user to assign priority on import: Adds friction with no meaningful benefit given the sensible default.
