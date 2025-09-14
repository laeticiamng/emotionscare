# Backend API Routes

This document lists current backend endpoints and the unified error format.

## Authentication

All requests require a signed JWT in the `Authorization: Bearer <token>` header. Tokens
use the HS256 algorithm and include the following claims:

- `sub` – user identifier
- `role` – one of `b2c`, `b2b_user`, `b2b_admin`
- `aud` – intended audience of the token
- `exp` – expiration timestamp

The server rejects missing, invalid or expired tokens.

## Error format

All endpoints return the following JSON structure when an error occurs:

```json
{
  "ok": false,
  "error": { "code": "<identifier>", "message": "<human readable message>" }
}
```

* `401 Unauthorized` uses code `unauthorized`.
* `403 Forbidden` uses code `forbidden`.
* `500 Internal Server Error` uses code `internal`.

## Routes

### Journal
- `POST /api/v1/journal/voice`
- `POST /api/v1/journal/text`
- `GET /api/v1/me/journal`

### Breath
- `GET /api/v1/me/breath/weekly`
- `GET /api/v1/org/:orgId/breath/weekly`

All routes require an `Authorization: Bearer <token>` header.
