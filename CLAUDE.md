# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is an AI-empowered development bootcamp. The root contains a vanilla JS/HTML/CSS TODO application that serves as the hands-on exercise platform. Course content lives in `Course Material/`.

## Commands

```bash
npm run dev          # Start Vite dev server on port 5173 (auto-opens browser)
npm run build        # Production build
npm run preview      # Preview production build
npm run lint         # Run ESLint + Stylelint
npm run lint:fix     # Auto-fix linting issues
```

> Note: `package.json` lint scripts reference `app.js` but the actual file is `main.js`.

## Architecture

**Single-page TODO app** (`index.html`, `main.js`, `styles.css`):
- Vanilla ES Module JavaScript — no framework
- In-memory state: `todos` array + `currentFilter` string
- Event-driven DOM re-rendering pattern
- `escapeHtml()` utility guards against XSS in user input
- Code is organized into Feature 1 (CRUD) and Feature 2 (filtering) comment sections

**Linting**:
- ESLint: browser/ES2021, strict semicolons, double quotes, no unused vars
- Stylelint: extends `stylelint-config-standard`

**VibeKanban**: `vibe-kanban-web-companion` package integrates task orchestration UI for multi-agent workflows (covered in Course Material module 5).

## Course Material

Nine progressive modules in `Course Material/` build on the TODO app:
1. Getting started
2. Working with AI agents
3. Model Context Protocol
4. Safety and guardrails
5. Task orchestration (VibeKanban)
6. Advanced planning (Speckit)
7. QA and pull requests
8. Language Server Protocol
9. Transforming/structuring data
