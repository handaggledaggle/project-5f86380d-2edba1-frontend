import { NextResponse } from "next/server";

type Payload = {
  name: string;
  email: string;
  inquiryType: "저작권" | "환불" | "배송" | "기타";
  referenceId: string | null;
  details: string;
  agreements: { privacy: boolean; evidence: boolean };
};

export async function POST(req: Request) {
  let body: Payload | null = null;
  try {
    body = (await req.json()) as Payload;
  } catch {
    return NextResponse.json({ ok: false, message: "Invalid JSON" }, { status: 400 });
  }

  if (!body) {
    return NextResponse.json({ ok: false, message: "Missing body" }, { status: 400 });
  }

  const name = (body.name ?? "").trim();
  const email = (body.email ?? "").trim();
  const details = (body.details ?? "").trim();

  if (!name || !email || !details) {
    return NextResponse.json(
      { ok: false, message: "Required fields: name, email, details" },
      { status: 400 }
    );
  }

  if (!body.agreements?.privacy || !body.agreements?.evidence) {
    return NextResponse.json(
      { ok: false, message: "Agreements are required" },
      { status: 400 }
    );
  }

  // MVP: DB 저장 없이 접수번호만 발급 (서버리스 환경에서 안전하게 동작)
  const ticketId = `PT-${crypto.randomUUID()}`;
  const receivedAt = new Date().toISOString();

  return NextResponse.json({ ok: true, ticketId, receivedAt }, { status: 201 });
}
