# Create product — `POST /api/products/save`

Membuat satu produk baru.

Sumber: `app/api/(auth)/products/save/route.ts` → `ProductService.create`.

## Auth

Tidak digerbang `proxy.ts`.

## Request body

`Content-Type: application/json`

| Field | Tipe | Wajib | Aturan |
|---|---|---|---|
| `name` | string | ✅ | min 1 |
| `price` | int | ✅ | ≥ 0 |
| `stock` | int | – | ≥ 0 (default `0`) |
| `sold` | int | – | ≥ 0 (default `0`) |
| `imageUrl` | string | – | URL valid |
| `status` | enum | – | `AKTIF` \| `HABIS` \| `NONAKTIF` (default `AKTIF`) |
| `slug` | string | – | min 1; bila kosong di-generate dari `name` |
| `categoryId` | int | – | > 0 (connect ke kategori) |

```json
{ "name": "Kopi Susu", "price": 20000, "stock": 100, "categoryId": 3 }
```

## Response

### `200 OK`

```json
{ "success": true, "data": { "id": 10, "name": "Kopi Susu", "slug": "kopi-susu", "...": "..." } }
```

### `400 Bad Request`

```json
{
  "success": false,
  "error": { "code": "PRODUCT_VALIDATION_FAILED", "message": "Invalid product payload", "details": [ /* Zod issues */ ] }
}
```

| Code | Penyebab |
|---|---|
| `PRODUCT_VALIDATION_FAILED` | Payload tidak valid (400) |
| `PRODUCT_CREATE_FAILED` | Kegagalan saat insert (400) |

### `500` — exception tak tertangani.

## Contoh

```bash
curl -X POST http://localhost:3000/api/products/save \
  -H "Content-Type: application/json" \
  -d '{"name":"Kopi Susu","price":20000,"stock":100,"categoryId":3}'
```
