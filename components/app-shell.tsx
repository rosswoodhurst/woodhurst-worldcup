import Link from "next/link";
import { NavLinks } from "@/components/nav-links";

export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen">
      <header className="border-b bg-background/95">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-4 sm:px-6">
          <Link href="/" className="text-base font-black tracking-tight">
            World Cup Sweepstake HQ
          </Link>
          <div className="hidden sm:block"><NavLinks /></div>
        </div>
      </header>
      <main className="mx-auto max-w-5xl px-4 pb-28 pt-6 sm:px-6 sm:pb-12 sm:pt-10">{children}</main>
      <div className="fixed inset-x-0 bottom-0 border-t bg-background/95 p-3 backdrop-blur sm:hidden">
        <NavLinks />
      </div>
    </div>
  );
}
