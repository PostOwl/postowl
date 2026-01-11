# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

PostOwl is a personal blogging/sharing platform built with SvelteKit. It supports public posts (blog), private posts (journal), and sharing posts via secret links with email notifications.

## Commands

```bash
npm run dev          # Start dev server at localhost:5173
npm run build        # Production build
npm run start        # Run production build (node build)
npm run lint         # Check formatting and lint (prettier --check . && eslint .)
npm run format       # Auto-format all files
```

## Development Setup

1. `npm install`
2. Rename `.env.example` to `.env`
3. Create database: `sqlite3 data/db.sqlite3 < scripts/schema.sql`
4. `npm run dev`
5. Login with ADMIN_PASSWORD from .env

For email testing, use [mailpit](https://github.com/axllent/mailpit) - view sent emails at localhost:8025.

## Architecture

### Tech Stack

- **Framework**: SvelteKit with adapter-node
- **Database**: SQLite (better-sqlite3) - synchronous, no ORM
- **Styling**: Tailwind CSS with Forms and Typography plugins
- **Rich Text**: ProseMirror
- **Email**: Nodemailer
- **Deployment**: Fly.io with Docker

### Key Directories

- `src/lib/` - Shared utilities and components
- `src/lib/api.js` - All database operations (posts, friends, auth, assets)
- `src/lib/prosemirror*.js` - Editor schema, keymaps, plugins
- `src/lib/components/` - Reusable Svelte components
- `src/routes/` - SvelteKit file-based routing
- `src/routes/api/` - JSON API endpoints
- `scripts/schema.sql` - Database schema
- `data/` - SQLite database files

### Routing Pattern

- `+page.svelte` - Page component
- `+page.server.js` - Server-side data loading
- `+server.js` - API endpoints (JSON)
- `hooks.server.js` - Request handling, auth injection into locals

### Authentication

- Single admin user, password from ADMIN_PASSWORD env var
- Cookie-based sessions stored in `sessions` table
- `currentUser` available in `locals` after auth check in hooks
- Secret-based access for shared posts via `?secret=` query param

### Database

SQLite with WAL mode. Key tables: `posts`, `friends`, `recipients` (post sharing), `sessions`, `pages` (bio/settings), `assets` (file uploads), `counters` (view tracking).

### State Management

- Svelte stores in `src/lib/stores.js` for client state
- Server-side data via SvelteKit load functions
- Form actions for mutations

### API Pattern

REST-style endpoints in `/api/` routes. Client uses `fetchJSON(method, url, payload)` utility from `src/lib/util.js`.
