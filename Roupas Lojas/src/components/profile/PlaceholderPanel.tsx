export function PlaceholderPanel({ title, description }: { title: string; description?: string }) {
  return (
    <section className="rounded-2xl border border-ink/10 bg-white px-6 py-14 text-center">
      <h2 className="text-lg font-bold uppercase tracking-tight text-ink">{title}</h2>
      <p className="mx-auto mt-2 max-w-sm text-sm text-mist">
        {description ?? "Em breve esta área estará disponível na sua conta."}
      </p>
    </section>
  );
}