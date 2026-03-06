import { NextResponse } from "next/server";

export const runtime = "nodejs";

type OrderStatus = "PAID" | "REVIEWING" | "PRINT_WAITING" | "INVOICE_PENDING" | "SHIPPING" | "DELIVERED";

type OrderItem = {
  id: string;
  customerName: string;
  artworkTitle: string;
  quantity: number;
  paidAt: string;
  status: OrderStatus;
  amount: number;
  shippingMethod: "일반" | "빠른배송";
};

const SAMPLE_ORDERS: OrderItem[] = [
  {
    id: "#20260306-0001",
    customerName: "박지혜",
    artworkTitle: "봄날 풍경",
    quantity: 2,
    paidAt: "2026-03-05T14:22:00+09:00",
    status: "REVIEWING",
    amount: 36000,
    shippingMethod: "빠른배송",
  },
  {
    id: "#20260306-0002",
    customerName: "이민수",
    artworkTitle: "도시의 밤",
    quantity: 1,
    paidAt: "2026-03-05T13:12:00+09:00",
    status: "PRINT_WAITING",
    amount: 18000,
    shippingMethod: "일반",
  },
  {
    id: "#20260305-0999",
    customerName: "조민호",
    artworkTitle: "추상 A",
    quantity: 3,
    paidAt: "2026-03-04T09:05:00+09:00",
    status: "INVOICE_PENDING",
    amount: 72000,
    shippingMethod: "일반",
  },
];

function csvEscape(v: string) {
  const needs = /[",\n\r]/.test(v);
  const escaped = v.replaceAll("\"", "\"\"");
  return needs ? `"${escaped}"` : escaped;
}

export async function GET(req: Request) {
  const url = new URL(req.url);
  const status = url.searchParams.get("status") as OrderStatus | null;
  const q = (url.searchParams.get("q") ?? "").trim().toLowerCase();

  let items = [...SAMPLE_ORDERS];
  if (status) items = items.filter((o) => o.status === status);
  if (q) {
    items = items.filter((o) => `${o.id} ${o.customerName} ${o.artworkTitle}`.toLowerCase().includes(q));
  }

  const header = [
    "order_id",
    "customer_name",
    "artwork_title",
    "quantity",
    "paid_at",
    "status",
    "amount",
    "shipping_method",
  ].join(",");

  const rows = items.map((o) =>
    [
      o.id,
      o.customerName,
      o.artworkTitle,
      String(o.quantity),
      o.paidAt,
      o.status,
      String(o.amount),
      o.shippingMethod,
    ]
      .map(csvEscape)
      .join(","),
  );

  const csv = [header, ...rows].join("\n");

  return new NextResponse(csv, {
    headers: {
      "content-type": "text/csv; charset=utf-8",
      "content-disposition": "attachment; filename=orders.csv",
      "cache-control": "no-store",
    },
  });
}
