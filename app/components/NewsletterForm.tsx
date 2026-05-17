"use client";

import { useState, FormEvent } from "react";

export function NewsletterForm() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (email.trim()) {
      setSubmitted(true);
      setEmail("");
    }
  }

  if (submitted) {
    return (
      <div className="mt-6 max-w-md mx-auto rounded-lg bg-primary/10 px-4 py-3 text-sm font-medium text-primary text-center">
        ✅ Terima kasih! Anda berhasil berlangganan newsletter kami.
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="mt-6 flex flex-col sm:flex-row gap-3 max-w-md mx-auto"
    >
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Alamat email Anda"
        required
        className="flex-1 rounded-lg border border-hairline bg-canvas px-4 py-3 text-sm text-ink placeholder:text-muted-soft focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary transition-colors"
      />
      <button
        type="submit"
        className="rounded-lg bg-primary px-6 py-3 text-sm font-semibold text-on-primary hover:bg-primary-active transition-colors shrink-0"
      >
        Berlangganan
      </button>
    </form>
  );
}