# Product detail — `GET /api/products/:id`

Mengambil satu produk berdasarkan `id`.

Sumber: `app/api/(auth)/products/[id]/route.ts` → `ProductService.findById`.

## Auth

Tidak digerbang `proxy.ts`.

## Path parameters

| Param | Tipe | Keterangan |
|---|---|---|
| `id` | int (string di URL) | ID produk |

## Response

### `200 OK`

```json
{
  "success": true,
  "data": {
    "id": 1,
    "name": "Kopi Susu",
    "price": 20000,
    "stock": 100,
    "sold": 0,
    "imageUrl": "/uploads/abc.png",
    "status": "AKTIF",
    "slug": "kopi-susu",
    "categoryId": 3,
    "createdAt": "2026-05-27T10:00:00.000Z",
    "updatedAt": "2026-05-27T10:00:00.000Z"
  }
}
```

### `404 Not Found`

```json
{ "data": null, "message": { "code": "PRODUCT_NOT_FOUND", "message": "Product not found" } }
```

## Contoh

```bash
curl http://localhost:3000/api/products/1
```
