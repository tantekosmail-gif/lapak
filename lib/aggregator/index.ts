// Re-export kontrak base + pastikan seluruh provider terdaftar saat modul ini
// di-import (efek samping registrasi ada di "./providers").
export * from "./base";
import "./providers";
