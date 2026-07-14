# Active Context — Monisha IMS

## Current Focus

**Restock/depletion system, low stock alerts, database reset — all implemented.** The `AdminRepository` startup error (`JpaRepository<Object, Void>` → "Not a managed type") was just fixed by replacing it with `JdbcTemplate` in `AdminService`. Backend builds clean. The system is ready for end-to-end testing.

## What Was Built (Recent Sessions)

### Export & UI Fixes
- Excel/PDF export for Warehouse, Products, Orders, Dashboard — shared `exportUtils.js`
- Profile dropdown + navbar links — replaced HTML5 Popover API with React state
- Dark mode — replaced hardcoded colors with semantic tokens across all components

### Dropdown/Modal Simplification
- Dropdown pattern: `onBlur`/`relatedTarget` close + `onMouseDown`/`preventDefault` select
- Modal: `<dialog>` → `fixed` overlay, composition pattern (`Modal.Header`, `Modal.Body`, `Modal.Footer`)
- Deleted 5 modal files, refactored all consumers

### Restock & Depletion System
- Removed delete buttons from warehouse batches and products — data preserved forever
- Depletion auto-detection in `deductStock()` — triggers when stock hits 0
- Refactored `restockProductSizes()` to call `batchSizeService.deductStock()` instead of inline saves
- Restock endpoints: `POST /restock-batch/{id}`, `POST /restock-product/{id}` (ADMIN/MANAGER only)
- Restock history + depletion history — 4 entities, 4 repositories, 4 DTOs, 4 endpoints, frontend tables
- Restock modal in Warehouse and Products pages
- `depletedBy` field removed per user request

### Low Stock Alerts
- Amber warning at ≤20 units on list pages (badge + row highlight) and detail pages (banner + size card indicators)

### Database Reset
- Reset Database button on Dashboard (ADMIN-only, two-step confirmation)
- Backend: `DELETE /api/monishaInventory/admin/reset-database` — wipes all 14 tables in FK-safe order
- Uses `JdbcTemplate` (not JPA repository) — fixed startup error
- `queryClient.clear()` on reset wipes all React Query cache

## Session State

The `AdminRepository` → `JdbcTemplate` fix just completed. Backend compiles clean. Next step is testing end-to-end.

## Known Issues / Next Steps

1. **Test database reset end-to-end** — click button, confirm, verify data wiped, verify DataSeeder recreates admin on restart
2. **Test restock flow** — restock a batch, verify sizes update, verify history recorded, verify depleted status clears
3. **Test depletion flow** — place order that drains stock to 0, verify `depletedAt` set automatically
4. **Test low stock alerts** — reduce a size to ≤20, verify amber badge appears
5. **No tests** — critical: `OrderService`, `AuthService`, `WarehouseBatchService`
6. **No role-based auth on user management endpoints** — `@PreAuthorize` only on restock and admin
7. **`show-sql=true`** — should be profile-guarded for production
8. **Missing `@Transactional`** on some write service methods

## Active Decisions

- **Single dev DB** (root/pass, no Docker). Acceptable for local dev.
- **No global state library** — TanStack Query + localStorage is sufficient for v1.
- **JWT in localStorage** (not httpOnly cookie). Acceptable for v1; XSS exposure noted.
- **Field names are code-authoritative.** Do not invent or paraphrase — copy from source.
- **Verb-suffixed URL convention** (`/get-all-X`, `/create-X`) — do NOT refactor to RESTful.
- **DELETE is permanent — batches/products will NEVER be deleted** — data preserved for analytics.
- **`deductStock()` is the single source of truth for depletion** — all 4 stock consumption paths flow through it.
- **Restock methods only clear `depletedAt`** — they never set it.
- **Low stock threshold = 20** — amber warning at ≤20, red depleted at 0.
- **Database reset wipes ALL 14 tables** including users — DataSeeder recreates default admin on next startup.
- **Database reset uses `JdbcTemplate`** — not JPA repository, avoids "Not a managed type" error.

## Environment Notes

- Platform: Windows (PowerShell 5.1).
- Working dir: `C:\Users\Tinashe Gomo\Desktop\MonishaInventoryManagementSystem`.
- No git repo yet.
- No Docker — MySQL expected on `localhost:3306`.
- Skills directory: `C:\Users\Tinashe Gomo\Desktop\MonishaInventoryManagementSystem\skills\` (24 skills).
- See `progress.md` for detailed status of every component.
