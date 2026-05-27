# Attach product images — `POST /api/products/images/attach`

Mengunggah dan melampirkan satu atau banyak gambar ke sebuah produk.

Sumber: `app/api/(auth)/products/images/attach/route.ts` → `ProductImageService.attachMany`.

## Auth

Tidak digerbang `proxy.ts`.

## Request

`Content-Type: multipart/form-data`

| Field | Tipe | Wajib | Keterangan |
|---|---|---|---|
| `productId` | int | ✅ | ID produk tujuan |
| `file` | File (boleh banyak) | ✅ | Bisa diulang untuk beberapa gambar |
| `sortOrder` | int | – | Urutan tampil (≥ 0) |
| `isPrimary` | bool / `"true"`/`"false"` | – | Tandai sebagai gambar utama |

Batasan file mengikuti [`/api/upload`](./upload.md): JPEG/PNG/WebP/GIF, maks 5 MB.

## Response

### `200 OK`

```json
{
  "success": true,
  "data": [
    { "id": 1, "url": "/uploads/a.png", "sortOrder": 0, "isPrimary": true, "productId": 5, "createdAt": "..." }
  ]
}
```

`data` adalah array record `ProductImage` yang dibuat.

### `400 Bad Request`

| Code | Penyebab |
|---|---|
| `PRODUCT_IMAGE_VALIDATION_FAILED` | Metadata (`productId`/`sortOrder`/`isPrimary`) tidak valid |
| `PRODUCT_IMAGE_NO_FILES` | Tidak ada file dikirim |
| `PRODUCT_NOT_FOUND` | `productId` tidak ditemukan |
| `PRODUCT_IMAGE_ATTACH_FAILED` | Kegagalan saat menyimpan (upload di-rollback) |

### `500` — exception tak tertangani.

## Contoh

```bash
curl -X POST http://localhost:3000/api/products/images/attach \
  -F "productId=5" \
  -F "isPrimary=true" \
  -F "file=@./1.png" \
  -F "file=@./2.png"
```
