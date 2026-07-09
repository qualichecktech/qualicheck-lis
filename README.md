# QualiCheck Admin Portal — Foundation

A single, modular Admin Portal shell for QualiCheck Diagnostic Clinic's Clinic
Information System. This is the **foundation** every future module (Patients,
EMR, full Laboratory workflow, Billing, Doctors, Reports, Users, Settings,
etc.) plugs into — not a finished product.

## What's included

- **Firebase reuse**: `src/firebase/config.js` initializes the app once from
  your existing Firebase project (via `.env`, see `.env.example`). No
  Firestore data or config is created or altered.
- **Authentication**: Firebase Auth email/password sign-in
  (`src/contexts/AuthContext.jsx`), merged with a Firestore `users/{uid}`
  profile that carries a `role`.
- **Role-based permissions**: `src/utils/permissions.js` defines roles
  (Super Admin, Administrator, Medical Technologist, Pathologist,
  Receptionist, Cashier, Doctor) and a `permission` string per capability.
  Nothing is hardcoded per-page — pages/nav items declare the permission
  they need, and this file maps roles to permissions. Extending access later
  means editing this one file.
- **Protected routing**: `src/routes/ProtectedRoute.jsx` blocks
  unauthenticated users and, optionally, users without a specific
  permission (redirecting to `/login` or `/403`).
- **App shell / layout**: `src/layouts/MainLayout.jsx` composes a top app
  bar, collapsible left navigation drawer (mobile-responsive), breadcrumbs,
  user profile menu, and a global toast notification system.
- **Navigation as data**: `src/routes/navigationConfig.js` is the single
  source of truth for both the sidebar and the router. Modules not yet
  built (`implemented: false`) automatically render a shared
  **Coming Soon** page — nothing breaks when you add a nav entry before the
  page exists.
- **Reusable components** (`src/components/common/`): Button, Card /
  StatCard, Table, Modal, ConfirmDialog, SearchBar, Pagination,
  LoadingSpinner / LoadingOverlay, NotificationContainer, and form fields
  (FormField, TextInput, Select, Textarea). Import them all from
  `src/components/common/index.js`.
- **Generic Firestore service** (`src/services/firestoreService.js`): a
  `createFirestoreService(collectionName)` factory giving every module
  consistent `getById / getAll / create / update / remove` methods instead
  of hand-rolled Firestore calls per module.
- **Dashboard**: placeholder stat cards (Patients, Laboratory Orders,
  Released Results, Revenue, Pending Verifications) with static data only,
  as requested — ready to wire up to real queries later.
- **Laboratory module scaffold**:
  - **Test Catalog** (`/laboratory/test-catalog`) — fully working
    list/search/create/edit/delete against your **existing** `tests`
    collection, cross-referencing the existing `departments`, `units`, and
    `inputTypes` collections. Nothing about that existing data is
    restructured.
  - **Reference Ranges** (`/laboratory/reference-ranges`) — fully working
    CRUD UI for defining normal ranges per test, per sex/age bracket. This
    introduces one new collection, `referenceRanges`, since that data
    doesn't exist yet; it does not touch the Test Catalog collections.
  - Result Entry and Verification are scaffolded in navigation as
    "Coming Soon".
- **Lazy-loaded routes**: every page is code-split via `React.lazy`, so the
  initial bundle stays small as more modules are added.

## Getting started

```bash
npm install
cp .env.example .env   # fill in your EXISTING Firebase project config
npm run dev
```

### First login

Firebase Auth accounts don't automatically get a role. After creating a
user in the Firebase console (or your own sign-up flow, if you add one
later), create a matching document at `users/{uid}` in Firestore, e.g.:

```json
{
  "name": "Jane Dela Cruz",
  "role": "super_admin",
  "active": true
}
```

Valid `role` values are defined in `src/utils/permissions.js`
(`super_admin`, `administrator`, `medical_technologist`, `pathologist`,
`receptionist`, `cashier`, `doctor`).

## Deploying to GitHub Pages

1. Update `base` in `vite.config.js` to match your repository name
   (`/your-repo-name/`), and `homepage` in `package.json`.
2. Add your Firebase config values as **GitHub Actions secrets**
   (`VITE_FIREBASE_API_KEY`, etc. — see `.github/workflows/deploy.yml`).
3. Push to `main`. The included workflow builds and publishes `dist/` to
   GitHub Pages automatically. (Enable Pages → Source: GitHub Actions in
   the repo settings once, the first time.)

Alternatively, deploy manually with `npm run deploy` (uses `gh-pages`).

## Adding a new module (e.g. Patients)

1. Add a page component under `src/modules/patients/pages/`.
2. Add any Firestore access via `createFirestoreService('patients')` in a
   `src/modules/patients/services/` file.
3. Add a permission constant in `src/utils/permissions.js` if needed, and
   grant it to the relevant roles.
4. Register the page in `IMPLEMENTED_PAGES` in `src/routes/AppRoutes.jsx`.
5. Flip `implemented: true` on the matching entry in
   `src/routes/navigationConfig.js`.

No changes to the layout, auth, or routing internals are needed — that's
the point of the foundation.

## Notes

- `firestore.rules.example` is a reference starting point for Firestore
  security rules matching this role model — review before deploying it.
- CSS uses plain per-component stylesheets with shared design tokens in
  `src/assets/theme.css` (colors, spacing, radii) rather than a framework,
  keeping the dependency footprint small for GitHub Pages hosting.
