# Create order (admin) — `POST /api/orders`

Admin membuat order atas nama seorang customer. Order baru berstatus `MENUNGGU`.

Sumber: `app/api/(auth)/orders/route.ts` → `OrderService.createAsAdmin`.

## Auth

**Admin saja.**
- `proxy.ts`: `401 UNAUTHORIZED` bila anonim, `403 FORBIDDEN` bila bukan ADMIN.
- Route juga memanggil `requireAdmin()` (`403` bila bukan admin).

## Request body

`Content-Type: application/json`

| Field | Tipe | Wajib | Aturan |
|---|---|---|---|
| `customerId` | int | ✅ | > 0 — ID user yang dibuatkan order |
| `items` | array | ✅ | Minimal 1 item |
| `items[].productId` | int | ✅ | > 0 |
| `items[].quantity` | int | ✅ | > 0 |

```json
{
  "customerId": 7,
  "items": [
    { "productId": 1, "quantity": 2 },
    { "productId": 2, "quantity": 1 }
  ]
}
```

> Harga, `subtotal`, `total`, dan `itemsCount` **dihitung server dari DB** — nilai harga dari client diabaikan.

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
| `400` | `ORDER_VALIDATION_FAILED` | Payload tidak valid |
| `400` | `ORDER_CREATE_FAILED` | Customer/produk tidak ditemukan, atau gagal transaksi |
| `401` / `403` | — | Bukan admin (dari proxy / route) |

## Contoh

```bash
curl -X POST http://localhost:3000/api/orders \
  -H "Content-Type: application/json" \
  -d '{"customerId":7,"items":[{"productId":1,"quantity":2}]}'
```
