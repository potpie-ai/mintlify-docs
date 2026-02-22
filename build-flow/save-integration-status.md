# Save Integration Endpoint — Status Notes

## Endpoint

`POST /api/v2/integrations/save`

## Source

Canonical v2 handler: `app/api/router.py:309-327`
Service method: `app/modules/integrations/integrations_service.py:1711-1780`
Schema: `app/modules/integrations/integrations_schema.py` (`IntegrationSaveRequest`, `IntegrationSaveResponse`)
DB model: `app/modules/integrations/integration_model.py`

Mounted via `potpie_api_router` at prefix `/api/v2` — `app/main.py:177`

Note: A duplicate handler also exists in `integrations_router.py:1835` mounted at `/api/v1`
(Firebase auth `AuthService.check_auth`), but the documented v2 endpoint uses API-key auth
(`get_api_key_user`).

## Reason page is commented out

Verified against commit `4bf3ffe7` (2026-02-21). Discrepancies found:

| # | Location in docs | Docs claimed | Actual (source) |
|---|-----------------|-------------|-----------------|
| 1 | "Minimal" tab — `data.integration_id` | `"int_abc123"` | `str(uuid.uuid4())` — plain UUID — `service.py:1717` |
| 2 | "Minimal" tab — `data.created_at` | `"2026-02-16T10:30:00Z"` | `datetime.utcnow().isoformat()` — no Z, microseconds included — `service.py:1771` |
| 3 | `<Note>` — Updating Integrations | "Use same `unique_identifier` to update" | `save_integration()` always does `db.add()` — no upsert/lookup logic — `service.py:1755-1758` |
| 4 | Error accordion title | "500 Internal Server Error" | HTTP **200** always returned; errors in JSON body with `success: false` — `router.py:322-327` |
| 5 | Error body | `"error": "Database connection failed"` | Always prefixed: `"Failed to save integration: Database connection failed"` — `router.py:326` |
| 6 | "Minimal" tab — failure `error` | `"Integration with this name already exists"` | No UNIQUE constraint on `name` column; no duplicate check in service — this error cannot occur — `integration_model.py:13` |
| 7 | Troubleshooting — "Duplicate unique identifier" | Listed as common error | `unique_identifier` column has no `unique=True` — duplicates accepted at DB level — `integration_model.py:30` |
| 8 | Troubleshooting — auth data validation | "Provide at least one of: access_token, refresh_token, or code" | All `AuthData` fields `Optional`, zero cross-field validation — API accepts all-None auth_data — `schema.py:30-35` |
| 9 | Response table / "Minimal" example | `data` contains 5 fields | Service returns 11: also `active`, `unique_identifier`, `created_by`, `has_auth_data`, `has_scope_data`, `metadata` — `service.py:1763-1775` |
