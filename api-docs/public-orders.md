# Create order (customer) — `POST /api/public/orders`

Customer yang sedang login membuat order untuk dirinya sendiri. `customerId` diambil dari sesi (bukan dari body). Order baru berstatus `MENUNGGU`.

Sumber: `app/api/public/orders/route.ts` → `OrderService.create`.

## Auth

**Wajib login** (role apa pun).
- `proxy.ts`: `401 UNAUTHORIZED` bila tidak ada token.
- Route memanggil `currentUser()`; `401` bila tidak ada sesi.

## Request body

`Content-Type: application/json`

| Field | Tipe | Wajib | Aturan |
|---|---|---|---|
| `items` | array | ✅ | Minimal 1 item |
| `items[].productId` | int | ✅ | > 0 |
| `items[].quantity` | int | ✅ | > 0 |

```json
{
  "items": [
    { "productId": 1, "quantity": 2 },
    { "productId": 2, "quantity": 1 }
  ]
}
```

> `customerId` **tidak** diterima dari body — diambil dari user yang login. Harga/`subtotal`/`total`/`itemsCount` dihitung server dari DB.

## Response

### `201 Created`

```json
{
  "success": true,
  "data": {
    "id": 99,
    "orderNumber": "ORD-XXXX-YYYY",
    "customerId": 7,
    "total": 4500,
    "itemsCount": 3,
    "status": "MENUNGGU",
    "createdAt": "...",
    "updatedAt": "...",
    "items": [
      { "id": 1, "quantity": 2, "price": 1000, "subtotal": 2000, "orderId": 99, "productId": 1, "createdAt": "..." }
    ]
  }
}
```

### Error

| Status | Code | Penyebab |
|---|---|---|
| `401` | `UNAUTHORIZED` | Belum login |
| `400` | `ORDER_VALIDATION_FAILED` | Payload tidak valid |
| `400` | `ORDER_CREATE_FAILED` | Produk tidak ditemukan / gagal transaksi |

## Contoh

```bash
curl -X POST http://localhost:3000/api/public/orders \
  -H "Content-Type: application/json" \
  --cookie "next-auth.session-token=<token>" \
  -d '{"items":[{"productId":1,"quantity":2}]}'
```
