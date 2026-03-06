import { NextResponse } from "next/server";

export const runtime = "nodejs";

type PreviewResponse = {
  courier: string;
  parsedCount: number;
  okCount: number;
  errorCount: number;
  errors: Array<{ row: number; message: string }>;
  sample: Array<{ order_id: string; tracking_no: string; courier: string }>;
};

function parseCsvSimple(text: string): Array<Record<string, string>> {
  // MVP용 단순 파서: 콤마 분리 + 따옴표 일부 지원(완전한 RFC4180 아님)
  const lines = text
    .split(/\r?\n/)
    .map((l) => l.trim())
    .filter(Boolean);

  if (lines.length === 0) return [];

  const header = splitCsvLine(lines[0]).map((h) => h.trim());
  const rows: Array<Record<string, string>> = [];

  for (let i = 1; i < lines.length; i++) {
    const cols = splitCsvLine(lines[i]);
    const obj: Record<string, string> = {};
    for (let j = 0; j < header.length; j++) {
      obj[header[j]] = (cols[j] ?? "").trim();
    }
    rows.push(obj);
  }

  return rows;
}

function splitCsvLine(line: string): string[] {
  const out: string[] = [];
  let cur = "";
  let inQuotes = false;

  for (let i = 0; i < line.length; i++) {
    const ch = line[i];
    if (ch === '"') {
      const next = line[i + 1];
      if (inQuotes && next === '"') {
        cur += '"';
        i++;
        continue;
      }
      inQuotes = !inQuotes;
      continue;
    }
    if (ch === "," && !inQuotes) {
      out.push(cur);
      cur = "";
      continue;
    }
    cur += ch;
  }
  out.push(cur);
  return out;
}

export async function POST(req: Request) {
  const form = await req.formData();
  const courier = String(form.get("courier") ?? "").trim() || "(미지정)";
  const dryRun = String(form.get("dryRun") ?? "true") === "true";
  const file = form.get("file");

  if (!(file instanceof File)) {
    return NextResponse.json({ message: "file is required" }, { status: 400 });
  }

  const text = await file.text();
  const rows = parseCsvSimple(text);

  const errors: Array<{ row: number; message: string }> = [];
  const normalized: Array<{ order_id: string; tracking_no: string; courier: string }> = [];

  rows.forEach((r, idx) => {
    const rowNum = idx + 2; // header is row 1
    const order_id = (r.order_id ?? r.orderId ?? "").trim();
    const tracking_no = (r.tracking_no ?? r.trackingNo ?? "").trim();
    const rowCourier = (r.courier ?? courier).trim() || courier;

    if (!order_id) errors.push({ row: rowNum, message: "order_id 누락" });
    if (!tracking_no) errors.push({ row: rowNum, message: "tracking_no 누락" });

    if (order_id && tracking_no) {
      normalized.push({ order_id, tracking_no, courier: rowCourier });
    }
  });

  const resp: PreviewResponse = {
    courier,
    parsedCount: rows.length,
    okCount: normalized.length,
    errorCount: errors.length,
    errors,
    sample: normalized.slice(0, 5),
  };

  if (dryRun) {
    return NextResponse.json(resp);
  }

  // MVP: 실제 DB 반영은 생략. 실행 시에도 동일한 형식의 결과를 반환.
  return NextResponse.json({
    ...resp,
    executed: true,
  });
}
