# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm install       # Install dependencies
npm start         # Start the server (node server.js) on PORT 5000
```

There is no test suite or linter configured.

## Architecture

This is the **backend API** of a MERN stack wedding planning application (frontend not yet implemented).

**Stack:** Node.js + Express v5 + MongoDB + Mongoose + dotenv + CORS

**Structure:**
- `server.js` — Entry point: connects to MongoDB, registers middleware (CORS, JSON body parser), mounts all route files under `/api/*`
- `models/` — Mongoose schemas: `Wedding`, `Guest`, `Vendor`, `Budget`
- `routes/` — Express routers: one file per entity, each exposing standard CRUD (`GET/POST /api/<entity>` and `GET/PUT/DELETE /api/<entity>/:id`)

**Environment:** Requires a `.env` file with:
```
MONGO_URI=mongodb://localhost:27017/wedding_planner
PORT=5000
```

**Data model relationships:** All four entities are independent (no foreign-key references between them). Guests have an RSVP status field (`invité` / `confirmé` / `annulé`). Budget items have a boolean `paid` field.

**No authentication, input validation middleware, or test runner is in place.**
