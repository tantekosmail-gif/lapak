# Request cancellation (customer) — `PUT /api/public/orders/:id/request-cancel`

Customer (pemilik order) mengajukan permintaan pembatalan. Transisi status: **`MENUNGGU` atau `DIPROSES` → `MENUNGGU_PEMBATALAN`**. Pembatalan baru final setelah admin menyetujui via [`cancel-approve`](./orders-id-cancel-approve.md).

Sumber: `app/api/public/orders/[id]/request-cancel/route.ts` → `OrderService.requestCancel`.

## Auth

**Wajib login** + **harus pemilik order**.
- `proxy.ts`: `401 UNAUTHORIZED` bila tidak ada token.
- Service memverifikasi `order.customerId === sesi.user.id`, jika tidak → `403 ORDER_FORBIDDEN`.

## Path parameters

| Param | Tipe | Keterangan |
|---|---|---|
| `id` | int | ID order milik customer |

## Request body

Tidak ada.

## Response

### `200 OK`

```json
{ "success": true, "data": { "id": 99, "status": "MENUNGGU_PEMBATALAN", "items": [ ... ], "...": "..." } }
```

### Error

| Status | Code | Penyebab |
|---|---|---|
| `401` | `UNAUTHORIZED` | Belum login |
| `404` | `ORDER_NOT_FOUND` | Order tidak ada |
| `403` | `ORDER_FORBIDDEN` | Order bukan milik user ini |
| `400` | `ORDER_INVALID_STATE` | Status bukan `MENUNGGU`/`DIPROSES` (mis. sudah `DIKIRIM`) |
| `400` | `ORDER_CANCEL_REQUEST_FAILED` | Kegagalan tak terduga |

## Contoh

```bash
curl -X PUT http://localhost:3000/api/public/orders/99/request-cancel \
  --cookie "next-auth.session-token=<token>"
```
