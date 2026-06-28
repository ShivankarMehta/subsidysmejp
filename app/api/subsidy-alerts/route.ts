import { NextResponse } from "next/server";
import { getSubsidyAlerts } from "../../lib/subsidy-monitor";

export const dynamic = "force-dynamic";

export async function GET() {
  const result = await getSubsidyAlerts();

  return NextResponse.json({
    ok: true,
    ...result,
  });
}
