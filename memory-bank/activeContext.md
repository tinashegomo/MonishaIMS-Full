# Active Context — Monisha IMS

## Current Focus

**Frontend UI build-out.** The backend is feature-complete for v1 (auth, users, schools, customers, warehouse/batches, products, orders, measurements). The frontend has:
- Working API client + React Query hooks
- Working JWT interceptor + token utilities (with local expiry check)
- Working routing + auth-gated layout chrome (sidebar, header, MainLayout)
- **Built auth pages:** Login + Register with react-hook-form, yup validation, brand styling, dark mode
- **Built warehouse pages:** Batch list + Create batch form (with sizes)
- **Built products pages:** Product list + Create product form (with sizes)
- **Built schools page:** Full CRUD list + create/edit modal
- **Built customers page:** Full CRUD list + create/edit modal
- **Built orders pages:** Order list + full create form with customer typeahead
- **Placeholder pages** for: Dashboard, Tailoring, Settings, Profile

## Session State

This session fixed three UI issues reported after the major revamp.

### What was done this session:

1. **Fixed Header visibility:**
   - `MainLayout.jsx` — removed `overflow-hidden` from the flex-1 column that was preventing `sticky top-0` on the Header from working
   - The Header now stays visible at the top when scrolling

2. **Fixed user details not displaying:**
   - `Header.jsx` — changed `user?.username` to `user?.userName` (matches backend `UserResponseDTO.userName`)
   - `Sidebar.jsx` — same fix: `user?.username` → `user?.userName`
   - Both now show real user name and role from `useGetCurrentUser()` hook

3. **Fixed button sizing across app:**
   - Primary submit buttons (LoginForm, RegisterForm, CreateOrder, ProductForm, WarehouseForm): `px-24 py-14 text-body-normal` → `px-16 py-10 text-sm`
   - Secondary action buttons (Orders, Products, Schools, Warehouse, Tailoring "New" buttons): `px-20 py-12 text-body-normal` → `px-14 py-8 text-sm`
   - Modal buttons (ConfirmProductDelete, ConfirmBatchDelete, SchoolModal, CustomerModal): `px-20 py-10 text-body-normal` → `px-14 py-8 text-sm`
   - Profile logout button: `px-20 py-10 text-body-normal` → `px-14 py-8 text-sm`
   - Build passes ✅, Lint clean ✅ (only pre-existing `react-hooks/incompatible-library` warning)

## Known Issues / Quick Wins (priority order)

1. **No tests** — critical: `OrderService` (stock mutation, order number gen), `AuthService` (JWT issue/validate), `WarehouseBatchService` (size CRUD).
2. **No role-based auth** — add `@PreAuthorize` on admin endpoints (user management).
3. **`show-sql=true`** — should be profile-guarded for production.
4. **Missing `@Transactional`** on some write service methods.
5. **Inconsistent delete response types** (void vs ResponseEntity<Void>).
6. **No `update-batch` or `update-product` endpoints.**

## Active Decisions

- **Single dev DB** (root/pass, no Docker). Acceptable for local dev.
- **No global state library** — TanStack Query + localStorage is sufficient for v1.
- **JWT in localStorage** (not httpOnly cookie). Acceptable for v1; XSS exposure noted.
- **Field names are code-authoritative.** Do not invent or paraphrase — copy from source.
- **Frontend pages will use react-hook-form** for all forms.
- **Page + Form separation pattern** for all future pages.
- **Verb-suffixed URL convention** (`/get-all-X`, `/create-X`) — do NOT refactor to RESTful.
- **No modals for forms** — use separate routes (full pages) for create/edit forms.
- **Component extraction pattern** — extract table into `<Entity>List.jsx`, delete confirmation into `Confirm<Entity>DeleteModal.jsx`, keep page thin.
- **`entityManager.flush()` + `entityManager.clear()` pattern** — use when writing data in one service call and reading it back in the same transaction.

## Next Concrete Steps (recommended order)

1. Wire dynamic user in `Sidebar.jsx` + `Header.jsx` using `useGetCurrentUser`
2. Build Dashboard page (orders-by-status cards, low-stock alerts, recent activity)
3. Build Tailoring page (list IN_PRODUCTION orders, mark-complete action)
4. Build Settings page (minimal v1: theme toggle)
5. Build Profile page (show current user)
6. Add backend tests for critical services
7. Add role-based authorization
8. Production hardening

## Environment Notes

- Platform: Windows (PowerShell 5.1).
- Working dir: `C:\Users\Tinashe Gomo\Desktop\MonishaInventoryManagementSystem`.
- No git repo yet.
- No Docker — MySQL expected on `localhost:3306`.
- Skills directory: `C:\Users\Tinashe Gomo\Desktop\MonishaInventoryManagementSystem\skills\` (24 skills).
- See `progress.md` for detailed status of every component.
