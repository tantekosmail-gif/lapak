# Detach product images — `POST /api/products/images/detach`

Menghapus satu atau banyak gambar produk berdasarkan daftar `id`.

Sumber: `app/api/(auth)/products/images/detach/route.ts` → `ProductImageService.detach`.

## Auth

Tidak digerbang `proxy.ts`.

## Request body

`Content-Type: application/json`

| Field | Tipe | Wajib | Aturan |
|---|---|---|---|
| `ids` | int[] | ✅ | Minimal 1 ID, tiap ID > 0 |

```json
{ "ids": [1, 2, 3] }
```

## Response

### `200 OK`

```json
{ "success": true, "data": { "deleted": [1, 2, 3] } }
```

### `400 Bad Request`

| Code | Penyebab |
|---|---|
| `PRODUCT_IMAGE_VALIDATION_FAILED` | Payload tidak valid |
| `PRODUCT_IMAGE_NO_IDS` | `ids` kosong |
| `PRODUCT_IMAGE_NOT_FOUND` | Tidak ada gambar yang cocok |
| `PRODUCT_IMAGE_DETACH_FAILED` | Kegagalan saat menghapus |

### `500` — exception tak tertangani.

## Contoh

```bash
curl -X POST http://localhost:3000/api/products/images/detach \
  -H "Content-Type: application/json" \
  -d '{"ids":[1,2,3]}'
```
