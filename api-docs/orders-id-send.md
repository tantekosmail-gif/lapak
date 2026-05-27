# Send order (admin) — `PATCH /api/orders/:id/send`

Admin menandai order sebagai dikirim. Transisi status: **`DIPROSES` → `DIKIRIM`**.

Sumber: `app/api/(auth)/orders/[id]/send/route.ts` → `OrderService.send`.

## Auth

**Admin saja** (proxy `401`/`403` + `requireAdmin()` `403`).

## Path parameters

| Param | Tipe | Keterangan |
|---|---|---|
| `id` | int | ID order |

## Request body

Tidak ada.

## Response

### `200 OK`

```json
{ "success": true, "data": { "id": 99, "status": "DIKIRIM", "items": [ ... ], "...": "..." } }
```

### Error

| Status | Code | Penyebab |
|---|---|---|
| `404` | `ORDER_NOT_FOUND` | Order tidak ada |
| `400` | `ORDER_INVALID_STATE` | Status bukan `DIPROSES` |
| `400` | `ORDER_SEND_FAILED` | Kegagalan tak terduga |
| `401` / `403` | — | Bukan admin |

## Contoh

```bash
curl -X PATCH http://localhost:3000/api/orders/99/send
```
