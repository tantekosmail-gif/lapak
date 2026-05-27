# Approve cancellation (admin) — `PATCH /api/orders/:id/cancel-approve`

Admin menyetujui permintaan pembatalan dari customer. Transisi status: **`MENUNGGU_PEMBATALAN` → `DIBATALKAN`**.

Sumber: `app/api/(auth)/orders/[id]/cancel-approve/route.ts` → `OrderService.cancelApprove`.

## Auth

**Admin saja** (proxy `401`/`403` + `requireAdmin()` `403`).

## Path parameters

| Param | Tipe | Keterangan |
|---|---|---|
| `id` | int | ID order |

## Request body

Tidak ada.

## Alur terkait

Customer lebih dulu memanggil [`PUT /api/public/orders/:id/request-cancel`](./public-orders-id-request-cancel.md) → status jadi `MENUNGGU_PEMBATALAN`. Endpoint ini menuntaskan pembatalan tsb.

## Response

### `200 OK`

```json
{ "success": true, "data": { "id": 99, "status": "DIBATALKAN", "items": [ ... ], "...": "..." } }
```

### Error

| Status | Code | Penyebab |
|---|---|---|
| `404` | `ORDER_NOT_FOUND` | Order tidak ada |
| `400` | `ORDER_INVALID_STATE` | Status bukan `MENUNGGU_PEMBATALAN` (tidak ada permintaan batal) |
| `400` | `ORDER_CANCEL_APPROVE_FAILED` | Kegagalan tak terduga |
| `401` / `403` | — | Bukan admin |

## Contoh

```bash
curl -X PATCH http://localhost:3000/api/orders/99/cancel-approve
```
