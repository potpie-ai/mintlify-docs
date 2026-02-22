# Search Codebase Endpoint — Status Notes

## Endpoint

`POST /api/v2/search`

## Availability

| Version | Route | Auth | Status |
|---------|-------|------|--------|
| v1 | `POST /api/v1/search` | Firebase (`AuthService.check_auth`) | Active — `app/modules/search/search_router.py` |
| v2 | `POST /api/v2/search` | API key (`get_api_key_user`) | Active — `app/api/router.py:295` |

Both versions share the same `SearchService.search_codebase()` logic in
`app/modules/search/search_service.py`.

## Reason page is commented out

Verified against main branch commit `4bf3ffe7` (2026-02-21). Discrepancies found:

| Field/Section | Docs claimed | Actual (source) |
|---------------|-------------|-----------------|
| `match_type` values | `"name_match"`, `"file_path_match"`, `"content_match"` | `"Exact Match"` or `"Partial Match"` — `search_service.py:101-104` |
| `relevance` range | `0-10` | Unbounded `float`, no cap — `search_service.py:73-99` |
| "How It Works" description | Semantic search, knowledge graph, intent understanding | Plain SQL `ILIKE "%word%"` keyword matching — `search_service.py:20-41` |
| Validation error HTTP code | `400 Bad Request` | `422 Unprocessable Entity` (Pydantic `@validator`) — `search_schema.py:10-13` |
| Integration example agent ID | `'qna-agent'` | `'codebase_qna_agent'` — `agents_service.py:89-90` |
| Integration create-conversation | Missing `user_id`, `title`, `status` | All three required by `CreateConversationRequest` |
| Integration post-message body | `application/json` | `multipart/form-data` (Form + File params) |
| `match_type` filter examples | `=== 'function'` | Not a valid value |
