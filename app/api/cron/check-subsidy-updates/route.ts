import { NextResponse } from "next/server";
import { runSubsidyMonitor } from "../../../lib/subsidy-monitor";

export const dynamic = "force-dynamic";
export const maxDuration = 60;

export async function GET(request: Request) {
  const cronSecret = process.env.CRON_SECRET;
  const authHeader = request.headers.get("authorization");

  if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const result = await runSubsidyMonitor();

  return NextResponse.json({
    ok: true,
    ...result,
  });
}
