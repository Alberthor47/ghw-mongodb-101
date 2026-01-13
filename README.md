# MongoDB 101

This repository contains workshop slides and example Node.js scripts demonstrating how to connect to MongoDB (Atlas or local), create a collection, and perform basic CRUD operations.

Quick start

1. Copy `.env.example` to `.env` and set `MONGODB_URI` and optional `DB_NAME`.

2. Install dependencies:

```bash
npm install
```

3. Run the examples (they will run in sequence with `npm start`):

```bash
npm start
```

Or run individual examples:

```bash
npm run example:create
npm run example:crud
npm run example:find
```

Notes

# MongoDB 101 — Workshop Materials

This repository contains slides and hands-on code used for the "MongoDB 101" workshop (Session 1: Foundations & Document Model). The materials were prepared for Global Hack Week — Beginners Week and include:

- Slide source files in `slides/` (authored for Marp).
- Node.js example scripts that demonstrate connecting to MongoDB (Atlas or local), creating collections, and performing basic CRUD operations.

Facilitator: Alberto Camarena
Presented at: Global Hack Week — Beginners Week
Session: `slides/session1.md` (Session 1 — Foundations & Document Model)

## Contents

- `slides/` — Markdown slide decks (Marp). See `slides/session1.md` for the Session 1 deck.
- `src/lib/mongo.js` — small connection helper using the official `mongodb` driver and `dotenv`.
- `src/examples/` — runnable examples:
	- `createCollection.js` — create a `customers` collection with a basic JSON-schema validator.
	- `crud.js` — insertOne, insertMany, find, updateOne, deleteOne examples.
	- `find.js` — example queries including nested field lookups.
	- `runAll.js` — runs the examples in sequence.
- `.env.example` — copy to `.env` and set your `MONGODB_URI` and optional `DB_NAME`.

## Quick start (run the examples)

1. Copy the example env and set your connection string:

```bash
cp .env.example .env
# Edit .env and replace MONGODB_URI with your Atlas or local connection string
```

2. Install dependencies:

```bash
npm install
```

3. Run all examples (create collection, CRUD, find):

```bash
npm start
```

Or run examples individually:

```bash
npm run example:create
npm run example:crud
npm run example:find
```

Notes

- These example scripts are educational and intentionally simple. They demonstrate core concepts but do not implement production-grade error handling, retry logic, or input validation.
- By default the examples use the database name from `DB_NAME` in `.env` (default `ghw_workshop`).
