/**
 * Visible FAQ for the /about page. Mirrors the FAQPage JSON-LD so Google (and AI
 * answer engines) can surface clear answers to "who is Utkarsh Kushwaha" queries.
 */
export default function AboutFaq({ items }: { items: { q: string; a: string }[] }) {
  return (
    <section
      aria-labelledby="faq-heading"
      className="mx-auto w-full max-w-[var(--container)] px-5 pb-20 pt-4 sm:px-8"
    >
      <p className="mb-4 font-mono text-xs tracking-[0.25em] text-brand-300">$ cat faq.md</p>
      <h2 id="faq-heading" className="mb-6 text-2xl font-bold text-content sm:text-3xl">
        Frequently asked questions
      </h2>

      <div className="divide-y divide-border overflow-hidden rounded-[var(--r-lg)] border border-border bg-surface-1/60 backdrop-blur-sm">
        {items.map((it) => (
          <details key={it.q} className="group">
            <summary className="flex cursor-pointer list-none items-center justify-between gap-4 px-5 py-4 text-sm font-medium text-content marker:content-none hover:text-brand-200 sm:text-base">
              <span>{it.q}</span>
              <span aria-hidden className="text-lg text-brand-300 transition-transform duration-300 group-open:rotate-45">
                +
              </span>
            </summary>
            <p className="px-5 pb-5 text-sm leading-relaxed text-muted">{it.a}</p>
          </details>
        ))}
      </div>
    </section>
  )
}
