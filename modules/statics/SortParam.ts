/**
 *
 * @param sortDir
 * e.g `createdAt` -> `asc createdAt`; `-createdAt` -> `desc createdAt`.
 * `null`, `undefined`, atau string kosong di-default ke `"id"` (penting karena
 * `URLSearchParams.get(...)` mengembalikan `null` saat key tidak ada — default
 * parameter bawaan hanya berlaku untuk `undefined`, tidak untuk `null`).
 *
 * Arah dikembalikan dalam **lowercase** karena `Prisma.SortOrder` hanya menerima
 * `"asc" | "desc"`; nilai uppercase akan ditolak runtime Prisma.
 */
export function sortParamDirection(sortDir?: string | null) {
    const value = sortDir && sortDir.length > 0 ? sortDir : "id";
    const direction = value.startsWith("-") ? "desc" : "asc";
    const field = value.startsWith("-") ? value.slice(1) : value;
    return { direction, field };
}
