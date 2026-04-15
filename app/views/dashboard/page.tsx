import { createClient } from "@/app/utils/supabase/server";
import { cookies } from "next/headers";
import DashboardClient, {
  type DashboardAttemptRow,
  type DashboardSummaryRow,
} from "./dashboard-client";

export default async function DashboardPage() {
  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const since = new Date();
  since.setDate(since.getDate() - 35);
  since.setHours(0, 0, 0, 0);

  const [attemptsRes, summaryRes] = await Promise.all([
    supabase
      .from("quiz_attempts")
      .select("score, created_at")
      .gte("created_at", since.toISOString())
      .order("created_at", { ascending: true }),
    supabase
      .from("summaries")
      .select("id, title, created_at")
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle(),
  ]);

  if (attemptsRes.error) {
    console.error("Dashboard: quiz_attempts error", attemptsRes.error);
  }
  if (summaryRes.error) {
    console.error("Dashboard: summaries error", summaryRes.error);
  }

  const attempts = (attemptsRes.data ?? []) as DashboardAttemptRow[];
  const lastSummary = (summaryRes.data ?? null) as DashboardSummaryRow | null;

  return (
    <DashboardClient
      user={user}
      attempts={attempts}
      lastSummary={lastSummary}
    />
  );
}
