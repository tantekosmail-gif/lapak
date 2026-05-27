# Auth — `/api/auth/[...nextauth]`

Catch-all handler NextAuth (v4) dengan provider Google. Menangani sign-in, callback, session, sign-out, dan CSRF.

| Method | Keterangan |
|---|---|
| `GET` | Endpoint NextAuth (session, providers, csrf, callback, signout page) |
| `POST` | Endpoint NextAuth (signin, callback, signout) |

Sumber: `app/api/auth/[...nextauth]/route.ts`, konfigurasi di `app/lib/auth.ts`.

## Rute sub-path NextAuth (umum)

| Path | Method | Fungsi |
|---|---|---|
| `/api/auth/session` | GET | Session pengguna saat ini |
| `/api/auth/providers` | GET | Daftar provider |
| `/api/auth/csrf` | GET | Token CSRF |
| `/api/auth/signin/google` | POST | Mulai OAuth Google |
| `/api/auth/callback/google` | GET/POST | Callback OAuth |
| `/api/auth/signout` | POST | Sign out |

## Perilaku khusus

- **Strategi session: JWT.** Token & session membawa `id` (numerik) dan `userType` (`ADMIN` | `CUSTOMER`).
- **Admin intent:** jika cookie `lapak_admin_intent=1` ada saat sign-in, sistem memverifikasi email termasuk admin; bila bukan admin → redirect `/admin/signin?error=NotAdmin`.
- **Customer:** sign-in biasa melakukan upsert user dari profil Google.

## Session shape (`GET /api/auth/session`)

```json
{
  "user": {
    "id": 7,
    "name": "Jane Doe",
    "email": "jane@example.com",
    "image": "https://.../avatar.png",
    "userType": "CUSTOMER"
  },
  "expires": "2026-06-27T10:00:00.000Z"
}
```

Anonim → `{}` (atau `null` user).

## Env yang dibutuhkan

`GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`, `NEXTAUTH_SECRET`, `NEXTAUTH_URL`.
