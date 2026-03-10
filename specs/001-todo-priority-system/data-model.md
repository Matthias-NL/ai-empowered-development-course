# Data Model: Todo Priority System

**Branch**: `001-todo-priority-system` | **Date**: 2026-03-10

## Entities

### Priority Level

A fixed enumeration with a defined sort order.

| Value    | Display Label | Sort Order | Description                        |
|----------|---------------|------------|------------------------------------|
| `"high"` | High          | 1 (first)  | Urgent — needs immediate attention |
| `"medium"` | Medium      | 2          | Normal — default for new todos     |
| `"low"`  | Low           | 3 (last)   | Optional / nice-to-have            |

**Validation rules**:
- Must be one of the three values above.
- If absent (legacy data or import), system substitutes `"medium"`.

---

### Todo (extended)

The existing todo object gains one new field.

| Field       | Type    | Required | Default    | Notes                                      |
|-------------|---------|----------|------------|--------------------------------------------|
| `id`        | number  | yes      | auto-inc   | Unchanged                                  |
| `text`      | string  | yes      | —          | Unchanged                                  |
| `completed` | boolean | yes      | `false`    | Unchanged                                  |
| `dueDate`   | string  | no       | `null`     | ISO date string — unchanged                |
| `priority`  | string  | yes      | `"medium"` | One of `"high"`, `"medium"`, `"low"`       |

**Example (stored in localStorage)**:
```json
{
  "id": 1,
  "text": "Fix critical login bug",
  "completed": false,
  "dueDate": "2026-03-15",
  "priority": "high"
}
```

**Backward compatibility**: Existing stored todos without a `priority` field are treated as `"medium"` at read/render time. No migration script required.

---

## State

### New state variables in `main.js`

| Variable               | Type    | Initial | Description                            |
|------------------------|---------|---------|----------------------------------------|
| `sortByPriorityActive` | boolean | `false` | Whether priority sort is currently on  |

**Mutual exclusivity rule**: When `sortByPriorityActive` is set to `true`, `sortByDueDateActive` MUST be set to `false`, and vice versa.

---

## Sort Logic

Priority sort uses a numeric mapping applied at render time:

```
PRIORITY_ORDER = { high: 1, medium: 2, low: 3 }
```

Todos are sorted ascending by `PRIORITY_ORDER[todo.priority ?? "medium"]`. Todos with equal priority retain their original relative order (stable sort, consistent with JavaScript's `Array.prototype.sort` guarantee in ES2019+).

---

## Exported JSON Shape

The `priority` field is included in all export files. Imported files without the field remain valid (backward-compatible).
