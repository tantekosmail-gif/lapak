# Approve order (admin) — `PATCH /api/orders/:id/approve`

Admin menyetujui pengemasan order. Transisi status: **`MENUNGGU` → `DIPROSES`**.

Sumber: `app/api/(auth)/orders/[id]/approve/route.ts` → `OrderService.approve`.

## Auth

**Admin saja** (proxy `401`/`403` + `requireAdmin()` `403`).

## Path parameters

| Param | Tipe | Keterangan |
|---|---|---|
| `id` | int | ID order |

## Request body

Tidak ada (kosong).

## Response

### `200 OK`

```json
{
  "success": true,
  "data": { "id": 99, "status": "DIPROSES", "items": [ ... ], "...": "..." }
}
```

### Error

| Status | Code | Penyebab |
|---|---|---|
| `404` | `ORDER_NOT_FOUND` | Order tidak ada |
| `400` | `ORDER_INVALID_STATE` | Status bukan `MENUNGGU` |
| `400` | `ORDER_APPROVE_FAILED` | Kegagalan tak terduga |
| `401` / `403` | — | Bukan admin |

## Contoh

```bash
curl -X PATCH http://localhost:3000/api/orders/99/approve
```
