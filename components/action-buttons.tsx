"use client";

import { Clipboard, LoaderCircle, RefreshCw } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { runManualSync } from "@/app/actions";

type Action = "refresh" | "table" | "today";

export function ActionButtons({ compact = false }: { compact?: boolean }) {
  const router = useRouter();
  const [loading, setLoading] = useState<Action | null>(null);

  async function run(action: Action) {
    setLoading(action);
    try {
      if (action === "refresh") {
        const result = await runManualSync();
        if (result.status === "error") throw new Error(result.message);
        toast.success(result.message);
        router.refresh();
      } else {
        const response = await fetch(action === "table" ? "/api/whatsapp/table" : "/api/whatsapp/today");
        if (!response.ok) throw new Error(await response.text());
        await navigator.clipboard.writeText(await response.text());
        toast.success(action === "table" ? "Table copied" : "Today’s fixtures copied");
      }
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Something went wrong");
    } finally {
      setLoading(null);
    }
  }

  const icon = (action: Action, fallback: React.ReactNode) =>
    loading === action ? <LoaderCircle size={17} className="animate-spin" /> : fallback;

  return (
    <div className={`grid gap-3 ${compact ? "sm:grid-cols-1" : "sm:grid-cols-3"}`}>
      <button className="button button-primary" disabled={loading !== null} onClick={() => run("refresh")}>
        {icon("refresh", <RefreshCw size={17} />)} Refresh results
      </button>
      <button className="button button-secondary" disabled={loading !== null} onClick={() => run("table")}>
        {icon("table", <Clipboard size={17} />)} Copy table
      </button>
      <button className="button button-secondary" disabled={loading !== null} onClick={() => run("today")}>
        {icon("today", <Clipboard size={17} />)} Copy today’s fixtures
      </button>
    </div>
  );
}
