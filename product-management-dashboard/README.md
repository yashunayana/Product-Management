# Gupio Product Management Dashboard

Frontend Developer — Option 2: Product Management Dashboard

## Assignment requirements covered

- Create products
- List products
- View product details
- Edit products
- Delete products
- Search by product name
- Filter by category
- Sort by price (low → high / high → low)
- Show stock quantity and stock status
- Form validation and clear error feedback
- Responsive interface
- Local browser data persistence

These requirements are based on the supplied Gupio assignment PDF.

## Technology

- React
- Vite
- JavaScript
- CSS
- Lucide React icons
- Browser localStorage for the frontend data approach

No separate backend is required for the Frontend Developer role.

## Run locally

1. Install Node.js (LTS recommended).
2. Open this project folder in VS Code.
3. Open a terminal in the project folder.
4. Run:

```bash
npm install
npm run dev
```

5. Open the local URL shown by Vite.

## Production build

```bash
npm run build
npm run preview
```

## Data approach

Products are stored in browser `localStorage` under:

`gupio-products-v1`

This means create/update/delete changes remain after refreshing the browser on the same device/browser.

## Validation

The product form checks:

- Product name is required and must have at least 2 characters.
- Category is required.
- Price must be greater than 0.
- Stock must be a whole number 0 or greater.
- Description is required and must contain at least 10 characters.

## Stock status

- `0` → Out of stock
- `1–10` → Low stock
- `11+` → In stock

## Suggested GitHub / deployment flow

```bash
git init
git add .
git commit -m "Build Gupio product management dashboard"
git branch -M main
git remote add origin YOUR_GITHUB_REPOSITORY_URL
git push -u origin main
```

For deployment, a Vite React project can be deployed to a static frontend host such as Vercel or Netlify.

## Important for the placement verification

The supplied assignment states that AI tools may be used as coding/reference assistants, but the candidate must understand the submitted code and be able to explain, debug and modify it during verification. Do not submit code you cannot explain.

## Project structure

```text
product-management-dashboard/
├── index.html
├── package.json
├── README.md
└── src/
    ├── App.jsx
    ├── main.jsx
    └── styles.css
```
