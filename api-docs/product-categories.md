# Product Categories — `/api/product-categories`

| Method | Fungsi |
|---|---|
| `GET` | Daftar kategori (paginasi, search, sort) |
| `POST` | Buat kategori baru |

Sumber: `app/api/(auth)/product-categories/route.ts` → `ProductCategoryService`.

## Auth

Digerbang `proxy.ts`: **wajib login** (401 `UNAUTHORIZED` bila tidak ada token). Role apa pun boleh.

---

## `GET /api/product-categories`

### Query parameters

| Param | Tipe | Default | Keterangan |
|---|---|---|---|
| `page` | int | `1` | Halaman |
| `limit` | int | `10` | Item per halaman |
| `search` | string | `""` | Filter `name` |
| `sort` | string | `createdAt` | `field` ASC / `-field` DESC |

### `200 OK`

```json
{
  "success": true,
  "data": [
    { "id": 3, "name": "Minuman", "image": "minuman.jpg", "createdAt": "2026-05-27T10:00:00.000Z" }
  ]
}
```

> Kegagalan service tetap dibungkus `{ success: false, ... }`; exception → `500`.

---

## `POST /api/product-categories`

### Request body

`Content-Type: application/json`

| Field | Tipe | Wajib | Aturan |
|---|---|---|---|
| `name` | string | ✅ | min 1 |
| `image` | string | – | URL valid |

```json
{ "name": "Minuman", "image": "https://example.com/minuman.jpg" }
```

### `200 OK`

```json
{ "success": true, "data": { "id": 4, "name": "Minuman", "image": "...", "createdAt": "..." } }
```

### Kegagalan

⚠️ Bila pembuatan gagal/validasi gagal, route **melempar error** sehingga balasannya **`500`** dengan body `{ "error": ... }` (bukan `400`).

## Contoh

```bash
# list
curl "http://localhost:3000/api/product-categories?search=minuman"
# create
curl -X POST http://localhost:3000/api/product-categories \
  -H "Content-Type: application/json" -d '{"name":"Minuman"}'
```
