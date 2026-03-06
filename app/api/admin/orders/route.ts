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
  {
    id: "#20260305-0888",
    customerName: "정수빈",
    artworkTitle: "바다의 결",
    quantity: 1,
    paidAt: "2026-03-04T08:11:00+09:00",
    status: "PAID",
    amount: 22000,
    shippingMethod: "일반",
  },
  {
    id: "#20260303-0123",
    customerName: "최현우",
    artworkTitle: "노을 스케치",
    quantity: 2,
    paidAt: "2026-03-02T17:40:00+09:00",
    status: "SHIPPING",
    amount: 44000,
    shippingMethod: "빠른배송",
  },
  {
    id: "#20260301-0007",
    customerName: "한서연",
    artworkTitle: "정원",
    quantity: 1,
    paidAt: "2026-03-01T10:10:00+09:00",
    status: "DELIVERED",
    amount: 19000,
    shippingMethod: "일반",
  },
];

export async function GET(req: Request) {
  const url = new URL(req.url);
  const status = url.searchParams.get("status") as OrderStatus | null;
  const q = (url.searchParams.get("q") ?? "").trim().toLowerCase();

  let items = [...SAMPLE_ORDERS];

  if (status) {
    items = items.filter((o) => o.status === status);
  }

  if (q) {
    items = items.filter((o) => {
      const hay = `${o.id} ${o.customerName} ${o.artworkTitle}`.toLowerCase();
      return hay.includes(q);
    });
  }

  // 최신 결제일 우선
  items.sort((a, b) => new Date(b.paidAt).getTime() - new Date(a.paidAt).getTime());

  return NextResponse.json({
    items,
    totalCount: items.length,
  });
}
