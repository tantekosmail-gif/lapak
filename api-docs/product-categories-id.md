# Product Category by id — `/api/product-categories/:id`

| Method | Fungsi |
|---|---|
| `GET` | Ambil satu kategori |
| `PUT` | Perbarui kategori (partial) |
| `DELETE` | Hapus kategori |

Sumber: `app/api/(auth)/product-categories/[id]/route.ts` → `ProductCategoryService`.

## Auth

Digerbang `proxy.ts`: **wajib login** (401 `UNAUTHORIZED`). Role apa pun boleh.

## Path parameters

| Param | Tipe | Keterangan |
|---|---|---|
| `id` | int | ID kategori |

---

## `GET /api/product-categories/:id`

### `200 OK`

```json
{ "success": true, "data": { "id": 3, "name": "Minuman", "image": "minuman.jpg", "createdAt": "..." } }
```

### `404 Not Found`

```json
{ "data": null, "message": { "code": "PRODUCT_CATEGORY_NOT_FOUND", "message": "..." } }
```

---

## `PUT /api/product-categories/:id`

### Request body (partial)

| Field | Tipe | Aturan |
|---|---|---|
| `name` | string | min 1 |
| `image` | string | URL valid |

```json
{ "name": "Minuman Dingin" }
```

### `200 OK`

```json
{ "success": true, "data": { "id": 3, "name": "Minuman Dingin", "...": "..." } }
```

### `404 Not Found` — kategori tidak ada / update gagal.

---

## `DELETE /api/product-categories/:id`

### `200 OK`

```json
{ "success": true, "data": { "id": 3, "name": "Minuman", "...": "..." } }
```

### `404 Not Found` — kategori tidak ada / delete gagal.

> Catatan: produk yang masih merujuk kategori ini dapat menyebabkan kegagalan relasi.

## Contoh

```bash
curl http://localhost:3000/api/product-categories/3
curl -X PUT http://localhost:3000/api/product-categories/3 \
  -H "Content-Type: application/json" -d '{"name":"Minuman Dingin"}'
curl -X DELETE http://localhost:3000/api/product-categories/3
```
