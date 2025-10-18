## Book Journal Frontend

This project scaffolds a modern React + TypeScript interface for capturing book notes by genre. It ships with a sample library, fluid layout, and dialogs to add genres, record new books, and edit the table of contents for each title. Data lives purely in the browser for now—perfect for rapid iteration before connecting to a backend.

### Getting Started

```bash
npm install
npm run dev
```

Open the URL printed in the terminal (defaults to `http://localhost:5173`) to explore the app. The development server supports hot module reloading, so UI changes appear instantly.

### Core Features

- Nested genre sidebar with live book counts and quick add actions
- Searchable book gallery with elegant cards and accent colours
- Detail workspace for rich notes, tag management, and custom table-of-contents sections
- Reusable modal system for adding books and genres

Since the state is in-memory, refreshing the browser resets to the seeded demo catalogue. This keeps the experience lightweight while you iterate on backend choices.
