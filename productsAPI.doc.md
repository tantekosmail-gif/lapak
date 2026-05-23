# Products API

REST endpoints for managing products. All product write operations expect JSON request bodies. Image upload is a separate endpoint that returns a URL you can pass as `imageUrl` when creating or updating a product.

All endpoints live under the `(auth)` route group, so they require an authenticated session.

## Response Envelope

Every endpoint returns a uniform JSON envelope:

**Success**
```json
{ "success": true, "data": <payload>, "message": "optional" }
```

**Failure**
```json
{ "success": false, "error": { "code": "ERROR_CODE", "message": "...", "details": ... } }
```

## Product Object

| Field       | Type                                 | Notes                                    |
|-------------|--------------------------------------|------------------------------------------|
| `id`        | integer                              | Auto-increment primary key               |
| `name`      | string                               | Required                                 |
| `price`     | integer                              | Required, non-negative                   |
| `stock`     | integer                              | Defaults to `0`                          |
| `sold`      | integer                              | Defaults to `0`                          |
| `imageUrl`  | string \| null                       | Public URL (use `/api/upload` to obtain) |
| `status`    | `"AKTIF"` \| `"HABIS"` \| `"NONAKTIF"` | Defaults to `AKTIF`                    |
| `slug`      | string                               | Unique. Auto-generated from `name` if omitted |
| `categoryId`| integer \| null                      | FK to `product_categories.id`            |
| `createdAt` | ISO timestamp                        |                                          |
| `updatedAt` | ISO timestamp                        |                                          |

---

## GET /api/products

List products with pagination, search, and sort.

**Query parameters**

| Param    | Type   | Default      | Description                                                                      |
|----------|--------|--------------|----------------------------------------------------------------------------------|
| `page`   | int    | `1`          | 1-indexed page number                                                            |
| `limit`  | int    | `10`         | Page size                                                                        |
| `search` | string | empty        | Case-sensitive `contains` match on `name`                                        |
| `sort`   | string | `createdAt`  | Field name to sort by. Prefix with `-` for descending (e.g. `-createdAt`, `-name`) |

**Example**

```http
GET /api/products?page=1&limit=10&sort=-createdAt&search=kopi
```

**200 OK**

```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "name": "Kopi Susu",
      "price": 15000,
      "stock": 10,
      "sold": 0,
      "imageUrl": "/uploads/uuid.png",
      "status": "AKTIF",
      "slug": "kopi-susu",
      "categoryId": 1,
      "createdAt": "2026-01-01T00:00:00.000Z",
      "updatedAt": "2026-01-01T00:00:00.000Z"
    }
  ]
}
```

**Error codes:** `PRODUCT_FIND_FAILED`

---

## GET /api/products/:id

Fetch a single product by ID.

**Example**

```http
GET /api/products/1
```

**200 OK**

```json
{
  "success": true,
  "data": { "id": 1, "name": "Kopi Susu", "...": "..." }
}
```

**404 Not Found**

```json
{ "data": null, "message": { "code": "PRODUCT_NOT_FOUND", "message": "Product not found" } }
```

**Error codes:** `PRODUCT_NOT_FOUND`, `PRODUCT_FIND_FAILED`

---

## POST /api/products/save

Create a new product.

**Request body**

```json
{
  "name": "Kopi Susu",
  "price": 15000,
  "stock": 10,
  "sold": 0,
  "imageUrl": "/uploads/uuid.png",
  "status": "AKTIF",
  "slug": "kopi-susu",
  "categoryId": 1
}
```

Only `name` and `price` are required. `slug` is auto-generated from `name` when omitted. `categoryId` must reference an existing category.

**200 OK**

```json
{ "success": true, "data": { "id": 1, "name": "Kopi Susu", "...": "..." } }
```

**400 Bad Request**

```json
{
  "success": false,
  "error": {
    "code": "PRODUCT_VALIDATION_FAILED",
    "message": "Invalid product payload",
    "details": [ { "path": ["price"], "message": "..." } ]
  }
}
```

**Error codes:** `PRODUCT_VALIDATION_FAILED`, `PRODUCT_CREATE_FAILED`

---

## POST /api/products/saveAll

Create a new category and a new product in a single transaction. Use this when the user adds a product whose category does not yet exist.

**Request body**

```json
{
  "category": {
    "name": "Minuman",
    "image": "/uploads/category.png"
  },
  "product": {
    "name": "Kopi Susu",
    "price": 15000,
    "stock": 10,
    "imageUrl": "/uploads/product.png"
  }
}
```

The new product is automatically linked to the newly created category. The `product` object does NOT accept `categoryId` — it is set internally.

**200 OK** — returns the created product.

```json
{ "success": true, "data": { "id": 1, "name": "Kopi Susu", "categoryId": 7, "...": "..." } }
```

**Error codes:** `PRODUCT_VALIDATION_FAILED`, `PRODUCT_SAVE_ALL_FAILED`

---

## PUT /api/products/:id/update

Update an existing product. All fields are optional; only the fields sent are updated.

**Request body**

```json
{
  "price": 20000,
  "stock": 5,
  "status": "HABIS"
}
```

**200 OK** — returns the updated product.

**404 Not Found** — when the ID does not exist.

**Error codes:** `PRODUCT_VALIDATION_FAILED`, `PRODUCT_NOT_FOUND`, `PRODUCT_UPDATE_FAILED`

---

## DELETE /api/products/:id/delete

Delete a product by ID.

**Example**

```http
DELETE /api/products/1/delete
```

**200 OK**

```json
{ "success": true, "data": { "id": 1, "name": "Kopi Susu", "...": "..." } }
```

**404 Not Found** — when the ID does not exist.

**Error codes:** `PRODUCT_NOT_FOUND`, `PRODUCT_DELETE_FAILED`

---

## POST /api/upload

Upload an image and receive a public URL. The uploaded file is **not** persisted to the database — the returned URL is meant to be passed back as `imageUrl` on a subsequent product create/update call.

**Request** — `multipart/form-data` with a single field `file`.

```bash
curl -X POST http://localhost:3000/api/upload \
  -F "file=@./foto.jpg"
```

**Constraints**

- Allowed MIME types: `image/jpeg`, `image/png`, `image/webp`, `image/gif`
- Maximum size: 5 MB
- File is saved to `public/uploads/<uuid>.<ext>`

**200 OK**

```json
{
  "success": true,
  "data": {
    "url": "/uploads/3f9b8e22-....jpg",
    "filename": "3f9b8e22-....jpg",
    "size": 12345
  }
}
```

**Error codes:** `UPLOAD_NO_FILE`, `UPLOAD_INVALID_TYPE`, `UPLOAD_TOO_LARGE`, `UPLOAD_FAILED`

> **Implementation note:** the upload service streams the request body to disk
> using `Readable.fromWeb(file.stream())` piped through a size-guard `Transform`
> into `createWriteStream`. The whole file is never held in memory; see the
> benchmark in `tests/benchmarks/upload-benchmark.test.ts`.

---

## Product Image Object

A product can have many images. They are managed independently of the product's
single `imageUrl` field, via the `/api/products/images/*` endpoints.

| Field       | Type     | Notes                                       |
|-------------|----------|---------------------------------------------|
| `id`        | integer  | Auto-increment primary key                  |
| `url`       | string   | Public URL written by `UploadService`       |
| `sortOrder` | integer  | Defaults to `0`; auto-incremented per file  |
| `isPrimary` | boolean  | Marks the cover image                       |
| `productId` | integer  | FK to `products.id` (cascade on product delete) |
| `createdAt` | ISO timestamp |                                        |

---

## POST /api/products/images/attach

Upload one or more images and attach them to an existing product in a single
request. Files are streamed to disk one-by-one (low memory) and a
`ProductImage` row is created per successful upload. If any step fails, the
service rolls back: previously written files and DB rows from the same request
are removed.

**Request** — `multipart/form-data`

| Field       | Type   | Required | Description                                                                  |
|-------------|--------|----------|------------------------------------------------------------------------------|
| `file`      | file   | yes      | The image. Repeat the field to send multiple files in one request.           |
| `productId` | string | yes      | Target product ID (numeric)                                                  |
| `sortOrder` | string | no       | Starting `sortOrder` for the first file. Subsequent files increment from it. |
| `isPrimary` | string | no       | `"true"` / `"false"`. Applied only to the first file in the batch.           |

```bash
curl -X POST http://localhost:3000/api/products/images/attach \
  -F "productId=5" \
  -F "isPrimary=true" \
  -F "file=@./front.jpg" \
  -F "file=@./back.jpg"
```

**Constraints** — same as `/api/upload` (allow-list of image MIME types, 5 MB per file).

**200 OK**

```json
{
  "success": true,
  "data": [
    {
      "id": 11,
      "url": "/uploads/uuid-a.jpg",
      "sortOrder": 0,
      "isPrimary": true,
      "productId": 5,
      "createdAt": "2026-05-23T00:00:00.000Z"
    },
    {
      "id": 12,
      "url": "/uploads/uuid-b.jpg",
      "sortOrder": 1,
      "isPrimary": false,
      "productId": 5,
      "createdAt": "2026-05-23T00:00:00.000Z"
    }
  ]
}
```

**400 Bad Request** examples:

- Missing `productId`: `PRODUCT_IMAGE_VALIDATION_FAILED`
- Product does not exist: `PRODUCT_NOT_FOUND`
- An invalid file in the batch causes the whole batch to roll back and returns the upload error code.

**Error codes:** `PRODUCT_IMAGE_VALIDATION_FAILED`, `PRODUCT_IMAGE_NO_FILES`, `PRODUCT_NOT_FOUND`, `UPLOAD_INVALID_TYPE`, `UPLOAD_TOO_LARGE`, `UPLOAD_FAILED`, `PRODUCT_IMAGE_ATTACH_FAILED`

---

## POST /api/products/images/detach

Delete one or more product images. The endpoint removes the DB rows **and**
the underlying files from storage in a single call.

**Request body** — JSON

```json
{ "ids": [11, 12] }
```

`ids` must be a non-empty array of `ProductImage.id`. Missing IDs are silently
ignored as long as at least one matches; if none match, the request fails.

**200 OK**

```json
{
  "success": true,
  "data": { "deleted": [11, 12] }
}
```

**400 Bad Request**

- Empty / malformed `ids`: `PRODUCT_IMAGE_VALIDATION_FAILED`
- No matching rows: `PRODUCT_IMAGE_NOT_FOUND`

**Error codes:** `PRODUCT_IMAGE_VALIDATION_FAILED`, `PRODUCT_IMAGE_NO_IDS`, `PRODUCT_IMAGE_NOT_FOUND`, `PRODUCT_IMAGE_DETACH_FAILED`

---

## Typical Flow

### Single image (legacy `imageUrl`)

1. `POST /api/upload` with the image file → receive `{ url: "/uploads/xxx.png" }`.
2. `POST /api/products/save` (or `/saveAll`) with the URL passed as `imageUrl` → product persisted with the image reference.
3. `GET /api/products` or `GET /api/products/:id` to read back.

### Multiple images (gallery)

1. `POST /api/products/save` to create the product (no images required upfront).
2. `POST /api/products/images/attach` with the new `productId` and one or more `file` fields → image records created and linked.
3. To remove a gallery image: `POST /api/products/images/detach` with the image IDs. Both the DB rows and the storage files are deleted.

---

## Error Code Reference

| Code                          | Endpoint(s)                          | Meaning                                |
|-------------------------------|--------------------------------------|----------------------------------------|
| `PRODUCT_FIND_FAILED`         | GET list, GET by id                  | Repository error while reading         |
| `PRODUCT_NOT_FOUND`           | GET by id, update, delete            | No product matches the given ID        |
| `PRODUCT_VALIDATION_FAILED`   | save, saveAll, update                | Body failed zod validation             |
| `PRODUCT_CREATE_FAILED`       | save                                 | Repository error while creating        |
| `PRODUCT_UPDATE_FAILED`       | update                               | Repository error while updating        |
| `PRODUCT_DELETE_FAILED`       | delete                               | Repository error while deleting        |
| `PRODUCT_SAVE_ALL_FAILED`     | saveAll                              | Transaction failed                     |
| `UPLOAD_NO_FILE`              | upload                               | `file` field missing                   |
| `UPLOAD_INVALID_TYPE`         | upload, images/attach                | MIME type not in the allow-list        |
| `UPLOAD_TOO_LARGE`            | upload, images/attach                | File exceeds 5 MB                      |
| `UPLOAD_FAILED`               | upload, images/attach                | Filesystem write error                 |
| `UPLOAD_INVALID_URL`          | images/detach                        | URL not managed by local storage       |
| `UPLOAD_DELETE_FAILED`        | images/detach                        | Filesystem delete error                |
| `PRODUCT_IMAGE_VALIDATION_FAILED` | images/attach, images/detach     | Form fields or body failed validation  |
| `PRODUCT_IMAGE_NO_FILES`      | images/attach                        | Zero files in the request              |
| `PRODUCT_IMAGE_NO_IDS`        | images/detach                        | Empty `ids` array                      |
| `PRODUCT_IMAGE_NOT_FOUND`     | images/detach                        | No image rows match the supplied IDs   |
| `PRODUCT_IMAGE_ATTACH_FAILED` | images/attach                        | Unexpected error while attaching       |
| `PRODUCT_IMAGE_DETACH_FAILED` | images/detach                        | Unexpected error while detaching       |
