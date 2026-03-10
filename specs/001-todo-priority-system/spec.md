# Feature Specification: Todo Priority System

**Feature Branch**: `001-todo-priority-system`
**Created**: 2026-03-10
**Status**: Draft
**Input**: User description: "Add a priority system (High/Medium/Low) to todos with visual indicators and sorting"

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Assign Priority When Creating a Todo (Priority: P1)

A user wants to mark a new todo as High, Medium, or Low priority at the time they create it, so they can immediately communicate its urgency. When no priority is selected, the todo defaults to Medium priority.

**Why this priority**: This is the foundation of the feature — without the ability to assign a priority, none of the other stories deliver value. It defines the data model that everything else depends on.

**Independent Test**: Create a new todo, select "High" priority, and confirm the saved todo reflects that priority with a visible indicator. Delivers full value as a standalone capability.

**Acceptance Scenarios**:

1. **Given** the add-todo form is displayed, **When** the user selects "High" and submits a todo, **Then** the new todo appears in the list with a High-priority visual indicator.
2. **Given** the add-todo form is displayed, **When** the user submits a todo without selecting a priority, **Then** the new todo defaults to Medium priority with a Medium-priority visual indicator.
3. **Given** a todo has been created with a priority, **When** the page is refreshed, **Then** the todo retains its assigned priority.

---

### User Story 2 - Visual Priority Indicators on Todo Items (Priority: P2)

A user scanning the todo list can immediately distinguish between High, Medium, and Low priority items through distinct visual indicators (e.g., color-coded badges or labels), without needing to read each todo's details.

**Why this priority**: Visual differentiation is the primary value of a priority system. Without it, priorities are invisible and the feature fails its core purpose.

**Independent Test**: Given a list of todos with all three priority levels, all three indicators are visually distinct and clearly labeled. Each priority level must be recognizable at a glance without requiring interaction.

**Acceptance Scenarios**:

1. **Given** a todo list contains High, Medium, and Low priority items, **When** the user views the list, **Then** each item displays a visually distinct indicator that clearly communicates its priority level.
2. **Given** a todo is marked as High priority, **When** it is displayed, **Then** its indicator is visually differentiated from Medium and Low indicators (e.g., distinct color or label).
3. **Given** dark mode is enabled, **When** the user views the todo list, **Then** priority indicators remain clearly visible and distinguishable in the dark theme.

---

### User Story 3 - Sort Todos by Priority (Priority: P3)

A user wants to sort their todo list by priority (High first, then Medium, then Low) with a single action, so they can quickly focus on what matters most.

**Why this priority**: Sorting is a productivity multiplier on top of the visual system. It helps users act on priorities, not just see them. Depends on P1 and P2 being in place.

**Independent Test**: Click "Sort by Priority" and confirm that High-priority todos appear before Medium, and Medium before Low. Can be tested independently once todos with varying priorities exist.

**Acceptance Scenarios**:

1. **Given** the todo list contains items with different priorities, **When** the user activates priority sort, **Then** todos are ordered High → Medium → Low.
2. **Given** priority sort is active, **When** todos share the same priority level, **Then** their relative order within that priority group is preserved (stable sort).
3. **Given** priority sort is active alongside the "sort by due date" feature, **When** the user switches between the two, **Then** only one sort mode is active at a time.
4. **Given** priority sort is active, **When** the user deactivates it, **Then** the list returns to its original manual order.

---

### User Story 4 - Edit Priority of an Existing Todo (Priority: P4)

A user can change the priority of an existing todo item to reflect changing circumstances, so their list stays accurate over time.

**Why this priority**: Priorities change. Without the ability to edit them, the system becomes stale. Lower priority than creation because the core value is delivered by P1–P3.

**Independent Test**: Change a todo's priority from Low to High and confirm the visual indicator updates immediately and persists after a page refresh.

**Acceptance Scenarios**:

1. **Given** a todo exists with Medium priority, **When** the user changes it to High, **Then** the visual indicator updates immediately to reflect the new priority.
2. **Given** a todo's priority has been changed, **When** the page is refreshed, **Then** the updated priority is preserved.

---

### Edge Cases

- What happens when all todos share the same priority? The list order is unchanged (stable sort).
- What happens when a todo is imported via the existing import feature without a priority field? The todo defaults to Medium priority.
- What happens when priority sort and due date sort are both toggled? Only the most recently activated sort applies; the other is deactivated.
- What priority does a todo have if it was created before this feature existed? Existing todos without a stored priority are treated as Medium by default.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: Users MUST be able to assign a priority level (High, Medium, or Low) to a todo when creating it.
- **FR-002**: When no priority is selected during creation, the system MUST default to Medium priority.
- **FR-003**: Each todo item MUST display a visible priority indicator that clearly distinguishes between High, Medium, and Low levels.
- **FR-004**: Priority indicators MUST remain visually distinct in both light and dark display modes.
- **FR-005**: Users MUST be able to change the priority of an existing todo item.
- **FR-006**: The system MUST allow users to sort the todo list by priority in descending order (High → Medium → Low).
- **FR-007**: Priority sort MUST be mutually exclusive with the existing due-date sort — activating one MUST deactivate the other.
- **FR-008**: Within the same priority level, the relative order of todos MUST be preserved (stable sort).
- **FR-009**: The system MUST persist each todo's priority across page refreshes and sessions.
- **FR-010**: Todos imported without a priority field MUST default to Medium priority.

### Key Entities

- **Priority Level**: One of three ordered values — High, Medium, Low — assigned to a todo. Has a defined sort order (High > Medium > Low) and a distinct visual representation for each level.
- **Todo** (extended): The existing todo entity gains a `priority` attribute. Priority is required; the system supplies a default if not provided.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Users can assign a priority to a new todo in under 5 seconds using the existing add-todo interface.
- **SC-002**: 100% of todos in the list display a priority indicator at all times (no todo appears without one).
- **SC-003**: Users can sort the entire todo list by priority in a single interaction (one click/tap).
- **SC-004**: Priority assignments persist correctly across 100% of page reloads and browser sessions.
- **SC-005**: Importing a legacy todos file (without priority data) results in 0 broken or missing priority indicators — all imported todos receive the Medium default.
- **SC-006**: All three priority levels are visually distinguishable for users in both light and dark modes without requiring color alone (label or icon must also differentiate levels).

## Assumptions

- The existing "sort by due date" toggle behavior is the reference pattern for the new "sort by priority" toggle.
- Priority is a required attribute on every todo; the system never renders a todo without a priority value.
- The feature targets the existing single-user, local-storage-based app — no multi-user or server-side considerations apply.
- "Visual indicators" includes at minimum a text label (e.g., "High", "Medium", "Low") or equivalent icon, ensuring accessibility beyond color alone.
- The default priority of Medium is appropriate for most new tasks; no user research is required to validate this choice at this stage.
