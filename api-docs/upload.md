# Upload — `POST /api/upload`

Mengunggah satu file gambar ke storage lokal (`public/uploads`) dan mengembalikan URL publiknya.

Sumber: `app/api/(auth)/upload/route.ts` → `UploadService.saveImage`.

## Auth

Tidak digerbang `proxy.ts`. (Disarankan menambah proteksi bila dipakai publik.)

## Request

`Content-Type: multipart/form-data`

| Field | Tipe | Wajib | Keterangan |
|---|---|---|---|
| `file` | File | ✅ | Gambar yang diunggah |

**Batasan:**
- MIME yang diizinkan: `image/jpeg`, `image/png`, `image/webp`, `image/gif`.
- Ukuran maksimum: **5 MB** (`5 * 1024 * 1024` byte).

## Response

### `200 OK`

```json
{
  "success": true,
  "data": {
    "url": "/uploads/3f9a....png",
    "filename": "3f9a....png",
    "size": 20480
  }
}
```

### `400 Bad Request`

```json
{ "success": false, "error": { "code": "UPLOAD_NO_FILE", "message": "Field 'file' is required" } }
```

| Code | Penyebab |
|---|---|
| `UPLOAD_NO_FILE` | Field `file` tidak ada / bukan File |
| `UPLOAD_INVALID_TYPE` | MIME tidak diizinkan |
| `UPLOAD_TOO_LARGE` | Melebihi 5 MB |
| `UPLOAD_FAILED` | Kegagalan tak terduga saat menulis file |

### `500` — exception tak tertangani.

## Contoh

```bash
curl -X POST http://localhost:3000/api/upload \
  -F "file=@./foto.png"
```
