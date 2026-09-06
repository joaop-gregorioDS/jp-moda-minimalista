"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { ProfileSidebar } from "@/components/profile/ProfileSidebar";

export default function PerfilLayout({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) router.replace("/login");
  }, [loading, user, router]);

  if (loading) {
    return (
      <div className="mx-auto flex min-h-[50vh] items-center justify-center">
        <p className="text-sm text-mist">Carregando sua conta…</p>
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="mx-auto max-w-5xl bg-white px-4 py-6 md:px-6 md:py-12">
      <div className="grid gap-10 md:grid-cols-[240px_1fr]">
        <ProfileSidebar />
        <main className="min-w-0">{children}</main>
      </div>
    </div>
  );
}