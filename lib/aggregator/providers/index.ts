import { aggregatorRegistry } from "../base";
import { apiCoIdProvider } from "./apicoid";

/**
 * Registrasi seluruh provider 3PL ke registry. Meng-import modul ini akan
 * mendaftarkan provider sebagai efek samping; tambahkan provider baru di sini.
 */
aggregatorRegistry.register(apiCoIdProvider);

export { apiCoIdProvider } from "./apicoid";
