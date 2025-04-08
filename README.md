# Async Race 🏁

**Async Race** is a web application that simulates asynchronous car races using a modular architecture and RESTful API.

## 🔧 Tech Stack

- **TypeScript** — static typing
- **Vite** — fast dev server and build tool
- **Tailwind CSS** — utility-first styling
- **ESLint / Prettier / Stylelint** — code linting and formatting
- **Husky / Lint-staged / Commitlint** — Git hooks and commit message linting
- **json-server** — mock API server

## 🚀 Getting Started

1. Clone the repository:

   ```bash
   git clone <repo-url>
   cd async-race
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Copy `.env.example` to `.env`:
   ```bash
   cp .env.example .env
   ```
   Edit the `.env` file if needed.

## 🏁 Running the App

### Development mode:

```bash
npm run dev
```

This will launch:

- `json-server` on port `3001`
- Vite dev server on port `3000`

### Build for production:

```bash
npm run build
```

### Preview the production build:

```bash
npm run preview
```

## 🧹 Linting

- Check code quality:

  ```bash
  npm run lint
  ```

- Auto-fix:
  ```bash
  npm run fix:script
  npm run fix:style
  ```

## ✅ Commits

Git hooks are configured via `husky`, `lint-staged`, and `commitlint`.
Please follow the [Conventional Commits](https://www.conventionalcommits.org/) specification for commit messages.
