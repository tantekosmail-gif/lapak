/**
 * 
 * @param sortDir 
 * e.g `createdAt` -> `DESC createdAt` `-createdAt` -> `ASC createdAt` 
 */
export function sortParamDirection(sortDir: string = "id") {
    const direction = sortDir.startsWith("-") ? "DESC" : "ASC";
    const field = sortDir.startsWith("-") ? sortDir.slice(1) : sortDir;
    return { direction, field };
}