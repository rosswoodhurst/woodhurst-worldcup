"use client";

import Link from "next/link";
import { CalendarDays, Settings, Trophy } from "lucide-react";
import { usePathname } from "next/navigation";

const links = [
  { href: "/", label: "Table", icon: Trophy },
  { href: "/fixtures", label: "Fixtures", icon: CalendarDays },
  { href: "/admin", label: "Admin", icon: Settings },
];

export function NavLinks() {
  const pathname = usePathname();
  return (
    <nav className="flex items-center justify-center gap-1 rounded-xl border bg-card p-1">
      {links.map(({ href, label, icon: Icon }) => {
        const active = href === "/" ? pathname === "/" : pathname.startsWith(href);
        return (
          <Link
            key={href}
            href={href}
            className={`flex min-w-20 items-center justify-center gap-2 rounded-lg px-3 py-2 text-xs font-extrabold transition-colors ${
              active ? "bg-card-muted text-accent" : "text-muted hover:text-foreground"
            }`}
          >
            <Icon size={16} strokeWidth={2.5} />
            {label}
          </Link>
        );
      })}
    </nav>
  );
}
