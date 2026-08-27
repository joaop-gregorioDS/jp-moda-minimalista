import { InstitutionalSidebar } from "@/components/institucional/InstitutionalSidebar";

export default function InstitucionalLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="mx-auto max-w-6xl px-4 py-10 md:px-6 md:py-16">
      <div className="grid gap-10 lg:grid-cols-[256px_1fr]">
        <InstitutionalSidebar />
        <div className="min-w-0">{children}</div>
      </div>
    </div>
  );
}