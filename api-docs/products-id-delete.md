# Delete product — `DELETE /api/products/:id/delete`

Menghapus satu produk berdasarkan `id`.

Sumber: `app/api/(auth)/products/[id]/delete/route.ts` → `ProductService.delete`.

## Auth

Tidak digerbang `proxy.ts`.

## Path parameters

| Param | Tipe | Keterangan |
|---|---|---|
| `id` | int | ID produk |

## Response

### `200 OK`

```json
{ "success": true, "data": { "id": 1, "name": "Kopi Susu", "...": "..." } }
```

`data` berisi produk yang dihapus.

### `404 Not Found`

```json
{ "data": null, "message": { "code": "PRODUCT_NOT_FOUND", "message": "Product not found" } }
```

## Catatan

Relasi `ProductImage` punya `onDelete: Cascade`, sehingga gambar terkait ikut terhapus. Produk yang sudah memiliki `OrderItem` dapat gagal dihapus karena relasi (`PRODUCT_DELETE_FAILED`).

## Contoh

```bash
curl -X DELETE http://localhost:3000/api/products/1/delete
```
