import { NextResponse } from "next/server";

export const runtime = "nodejs";

type Body = {
  action: "QUEUE_PRINT" | "BULK_INVOICE";
  orderIds: string[];
};

export async function POST(req: Request) {
  let body: Body;
  try {
    body = (await req.json()) as Body;
  } catch {
    return NextResponse.json({ message: "Invalid JSON" }, { status: 400 });
  }

  if (!body.action || !Array.isArray(body.orderIds)) {
    return NextResponse.json({ message: "Invalid payload" }, { status: 400 });
  }

  // MVP: 실제 상태 변경/DB 반영은 생략
  // - QUEUE_PRINT: 선택 주문을 인쇄대기 큐에 넣는 작업
  // - BULK_INVOICE: 송장 등록 플로우 진입(실제 등록은 /invoices/bulk)

  return NextResponse.json({
    ok: true,
    action: body.action,
    affected: body.orderIds.length,
  });
}
