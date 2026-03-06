import { NextResponse } from "next/server";

export const runtime = "nodejs";

type Body = {
  size_id?: string;
  material_id?: string;
};

function calcBaseBySize(sizeId: string) {
  switch (sizeId) {
    case "A4":
      return 45000;
    case "A3":
      return 65000;
    case "30x40":
      return 55000;
    default:
      return 45000;
  }
}

function calcMaterialMultiplier(materialId: string) {
  switch (materialId) {
    case "MATTE":
      return 1.0;
    case "GLOSSY":
      return 1.05;
    case "CANVAS":
      return 1.4;
    default:
      return 1.0;
  }
}

function roundToNearest10(amount: number) {
  return Math.round(amount / 10) * 10;
}

export async function POST(req: Request) {
  let body: Body;
  try {
    body = (await req.json()) as Body;
  } catch {
    return NextResponse.json({ message: "Invalid JSON" }, { status: 400 });
  }

  const sizeId = String(body.size_id ?? "");
  const materialId = String(body.material_id ?? "");

  if (!sizeId || !materialId) {
    return NextResponse.json(
      { message: "size_id and material_id are required" },
      { status: 400 }
    );
  }

  const base = calcBaseBySize(sizeId);
  const material_multiplier = calcMaterialMultiplier(materialId);

  const raw = base * material_multiplier;
  const suggested_price = roundToNearest10(raw);

  return NextResponse.json(
    {
      suggested_price,
      currency: "KRW",
      cost_breakdown: {
        base,
        material_multiplier,
        rounding: suggested_price - raw,
      },
    },
    {
      status: 200,
      headers: {
        "Cache-Control": "no-store",
      },
    }
  );
}
