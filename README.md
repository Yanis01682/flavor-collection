# Flavor Collection

Flavor Collection is a small personal prototype for keeping food and flavor notes. It lets you save food entries locally, attach images, rate dishes, export/import your data, and optionally use Gemini to infer a dish name and short note from an uploaded image.

This project is still a work in progress. It is kept public as a lightweight experiment rather than a polished product.

## Features

- Add and browse food records
- Star ratings and short notes
- Local browser storage
- JSON export and import for backups
- Optional Gemini image analysis for dish names and descriptions

## Tech Stack

- React
- TypeScript
- Vite
- `@google/genai`
- lucide-react

## Run Locally

Install dependencies:

```bash
npm install
```

Create `.env.local` if you want to use Gemini image analysis:

```text
API_KEY=your_gemini_api_key
```

Start the dev server:

```bash
npm run dev
```

Build:

```bash
npm run build
```

## Notes

Data is stored locally in the browser. Export a backup before clearing browser data.
