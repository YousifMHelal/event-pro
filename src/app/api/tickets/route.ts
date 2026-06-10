import { NextRequest, NextResponse } from "next/server";
import { getTicketsForType } from "@/lib/tickets";

export async function GET(req: NextRequest) {
  const typeId = req.nextUrl.searchParams.get("typeId");
  if (!typeId) return NextResponse.json([], { status: 400 });

  const tickets = await getTicketsForType(typeId);
  return NextResponse.json(tickets);
}
