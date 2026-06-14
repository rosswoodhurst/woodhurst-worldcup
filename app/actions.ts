"use server";

import { revalidatePath } from "next/cache";
import { syncResults } from "@/lib/sync";

export async function runManualSync() {
  try {
    const result = await syncResults();
    revalidatePath("/");
    revalidatePath("/fixtures");
    revalidatePath("/admin");
    return result;
  } catch (error) {
    return {
      status: "error",
      message: error instanceof Error ? error.message : "Result sync failed.",
      matchesFetched: 0,
      matchesUpserted: 0,
    };
  }
}
