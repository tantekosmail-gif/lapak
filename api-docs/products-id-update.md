# Update product — `PUT /api/products/:id/update`

Memperbarui sebagian field produk (partial update).

Sumber: `app/api/(auth)/products/[id]/update/route.ts` → `ProductService.update`.

## Auth

Tidak digerbang `proxy.ts`.

## Path parameters

| Param | Tipe | Keterangan |
|---|---|---|
| `id` | int | ID produk |

## Request body

`Content-Type: application/json` — semua field opsional (partial dari skema create).

| Field | Tipe | Aturan |
|---|---|---|
| `name` | string | min 1 |
| `price` | int | ≥ 0 |
| `stock` | int | ≥ 0 |
| `sold` | int | ≥ 0 |
| `imageUrl` | string | URL valid |
| `status` | enum | `AKTIF` \| `HABIS` \| `NONAKTIF` |
| `slug` | string | min 1 |
| `categoryId` | int | > 0 (connect ke kategori) |

```json
{ "price": 25000, "stock": 80, "status": "AKTIF" }
```

## Response

### `200 OK`

```json
{ "success": true, "data": { "id": 1, "name": "Kopi Susu", "price": 25000, "...": "..." } }
```

### `404 Not Found`

```json
{ "data": null, "message": { "code": "PRODUCT_NOT_FOUND", "message": "Product not found" } }
```

Validasi gagal juga membalas `404` dengan `code: "PRODUCT_VALIDATION_FAILED"` (`details` berisi issue Zod).

## Contoh

```bash
curl -X PUT http://localhost:3000/api/products/1/update \
  -H "Content-Type: application/json" \
  -d '{"price":25000,"stock":80}'
```
