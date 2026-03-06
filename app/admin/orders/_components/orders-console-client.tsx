"use client";

import * as React from "react";
import Link from "next/link";
import Image from "next/image";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";

import {
  Download,
  FileUp,
  Filter,
  PackageCheck,
  Printer,
  Search,
  Truck,
  X,
} from "lucide-react";

type OrderStatus =
  | "ALL"
  | "PAID"
  | "REVIEWING"
  | "PRINT_WAITING"
  | "INVOICE_PENDING"
  | "SHIPPING"
  | "DELIVERED";

type OrderItem = {
  id: string;
  customerName: string;
  artworkTitle: string;
  quantity: number;
  paidAt: string; // ISO
  status: Exclude<OrderStatus, "ALL">;
  amount: number;
  shippingMethod: "일반" | "빠른배송";
};

type StatsPayload = {
  newArtistsThisWeek: number;
  artworksApprovedThisWeek: number;
  cvr: number; // 0~1
  gmvWeekly: number;
  pendingReview: number;
  pendingPrint: number;
};

type OrdersResponse = {
  items: OrderItem[];
  totalCount: number;
};

type BulkInvoicePreview = {
  courier: string;
  parsedCount: number;
  okCount: number;
  errorCount: number;
  errors: Array<{ row: number; message: string }>;
  sample: Array<{ order_id: string; tracking_no: string; courier: string }>;
};

const STATUS_LABEL: Record<Exclude<OrderStatus, "ALL">, string> = {
  PAID: "결제완료",
  REVIEWING: "검수중",
  PRINT_WAITING: "인쇄대기",
  INVOICE_PENDING: "송장등록",
  SHIPPING: "배송중",
  DELIVERED: "배송완료",
};

const STATUS_OPTIONS: Array<{ value: OrderStatus; label: string }> = [
  { value: "ALL", label: "전체" },
  { value: "PAID", label: "결제완료" },
  { value: "REVIEWING", label: "검수중" },
  { value: "PRINT_WAITING", label: "인쇄대기" },
  { value: "INVOICE_PENDING", label: "송장등록" },
  { value: "SHIPPING", label: "배송중" },
  { value: "DELIVERED", label: "배송완료" },
];

function formatKrw(n: number) {
  return new Intl.NumberFormat("ko-KR", {
    style: "currency",
    currency: "KRW",
    maximumFractionDigits: 0,
  }).format(n);
}

function formatPct(p: number) {
  return `${(p * 100).toFixed(1)}%`;
}

function formatDateTime(iso: string) {
  const d = new Date(iso);
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  const hh = String(d.getHours()).padStart(2, "0");
  const mi = String(d.getMinutes()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd} ${hh}:${mi}`;
}

function statusBadgeVariant(status: Exclude<OrderStatus, "ALL">): "default" | "secondary" | "outline" {
  switch (status) {
    case "REVIEWING":
      return "default";
    case "PRINT_WAITING":
      return "secondary";
    case "INVOICE_PENDING":
      return "outline";
    case "SHIPPING":
      return "secondary";
    case "DELIVERED":
      return "outline";
    default:
      return "secondary";
  }
}

function OrderCard({
  order,
  selected,
  onToggleSelect,
  onOpenInvoice,
  onQueuePrint,
}: {
  order: OrderItem;
  selected: boolean;
  onToggleSelect: () => void;
  onOpenInvoice: () => void;
  onQueuePrint: () => void;
}) {
  return (
    <div className="flex gap-4">
      <button
        type="button"
        onClick={onToggleSelect}
        className={cn(
          "w-12 h-12 rounded-lg flex items-center justify-center border transition",
          selected
            ? "bg-[#4C1D95] border-[#4C1D95] text-white"
            : "bg-white border-[#DDD6FE] text-[#4C1D95]",
        )}
        aria-pressed={selected}
        aria-label={selected ? "선택 해제" : "선택"}
      >
        {selected ? "✓" : "P"}
      </button>

      <Card className="flex-1 bg-white shadow-lg border-[#DDD6FE] p-4">
        <div className="flex justify-between gap-6">
          <div>
            <p className="text-sm text-[#6D28D9]">주문번호 • 고객</p>
            <p className="text-[#4C1D95] font-semibold">{order.id} · {order.customerName}</p>
            <p className="text-sm text-[#6D28D9]">작품: &quot;{order.artworkTitle}&quot; · 수량 {order.quantity}</p>
          </div>

          <div className="flex flex-col items-end">
            <p className="text-sm text-[#6D28D9]">결제일</p>
            <p className="text-[#4C1D95] font-medium">{formatDateTime(order.paidAt)}</p>
            <div className="flex items-center gap-2">
              <p className="text-sm text-[#6D28D9]">상태:</p>
              <Badge variant={statusBadgeVariant(order.status)} className="border-[#DDD6FE] text-[#4C1D95]">
                {STATUS_LABEL[order.status]}
              </Badge>
            </div>
          </div>
        </div>

        <div className="flex justify-between items-center mt-3 gap-6 flex-wrap">
          <div className="flex gap-4 text-sm text-[#6D28D9]">
            <span>결제금액: {formatKrw(order.amount)}</span>
            <span>배송: {order.shippingMethod}</span>
          </div>
          <div className="flex gap-2">
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="secondary" size="sm" className="bg-[#FAF5FF] text-[#4C1D95] hover:bg-[#F3E8FF]">
                  검수 상세
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-xl">
                <DialogHeader>
                  <DialogTitle>주문 상세</DialogTitle>
                  <DialogDescription>
                    운영자가 주문 검수/처리 정보를 확인합니다.
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-3">
                  <div className="grid grid-cols-3 gap-2 text-sm">
                    <div className="text-muted-foreground">주문번호</div>
                    <div className="col-span-2 font-medium">{order.id}</div>
                    <div className="text-muted-foreground">고객</div>
                    <div className="col-span-2 font-medium">{order.customerName}</div>
                    <div className="text-muted-foreground">작품</div>
                    <div className="col-span-2 font-medium">{order.artworkTitle}</div>
                    <div className="text-muted-foreground">수량</div>
                    <div className="col-span-2 font-medium">{order.quantity}</div>
                    <div className="text-muted-foreground">결제금액</div>
                    <div className="col-span-2 font-medium">{formatKrw(order.amount)}</div>
                    <div className="text-muted-foreground">상태</div>
                    <div className="col-span-2 font-medium">{STATUS_LABEL[order.status]}</div>
                  </div>
                  <Separator />
                  <div className="text-sm text-muted-foreground">
                    MVP에서는 ‘저작권/파일 규격 검수 체크리스트’, ‘인쇄용 파일 다운로드’, ‘상태 전환 로그/메모’를 이 화면에 확장합니다.
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="secondary">닫기</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>

            <Button
              variant="secondary"
              size="sm"
              className="bg-[#FAF5FF] text-[#4C1D95] hover:bg-[#F3E8FF]"
              onClick={onOpenInvoice}
            >
              송장 등록
            </Button>
            <Button
              variant="secondary"
              size="sm"
              className="bg-[#FAF5FF] text-[#4C1D95] hover:bg-[#F3E8FF]"
              onClick={onQueuePrint}
            >
              인쇄 큐 배치
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
}

export default function OrdersConsoleClient() {
  const [status, setStatus] = React.useState<OrderStatus>("ALL");
  const [q, setQ] = React.useState<string>("");
  const [appliedStatus, setAppliedStatus] = React.useState<OrderStatus>("ALL");
  const [appliedQ, setAppliedQ] = React.useState<string>("");

  const [stats, setStats] = React.useState<StatsPayload | null>(null);
  const [orders, setOrders] = React.useState<OrderItem[]>([]);
  const [totalCount, setTotalCount] = React.useState<number>(0);

  const [loadingStats, setLoadingStats] = React.useState(false);
  const [loadingOrders, setLoadingOrders] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  const [selectedIds, setSelectedIds] = React.useState<Record<string, boolean>>({});

  const selectedOrderIds = React.useMemo(
    () => Object.entries(selectedIds).filter(([, v]) => v).map(([k]) => k),
    [selectedIds],
  );

  const [invoiceDialogOpen, setInvoiceDialogOpen] = React.useState(false);
  const [invoiceCourier, setInvoiceCourier] = React.useState("CJ대한통운");
  const [invoiceFile, setInvoiceFile] = React.useState<File | null>(null);
  const [invoicePreview, setInvoicePreview] = React.useState<BulkInvoicePreview | null>(null);
  const [invoiceBusy, setInvoiceBusy] = React.useState(false);

  async function fetchStats() {
    setLoadingStats(true);
    try {
      const res = await fetch("/api/admin/stats", { cache: "no-store" });
      if (!res.ok) throw new Error("통계 데이터를 불러오지 못했습니다.");
      const json = (await res.json()) as StatsPayload;
      setStats(json);
    } finally {
      setLoadingStats(false);
    }
  }

  async function fetchOrders(nextStatus: OrderStatus, nextQ: string) {
    setLoadingOrders(true);
    setError(null);
    try {
      const params = new URLSearchParams();
      if (nextStatus && nextStatus !== "ALL") params.set("status", nextStatus);
      if (nextQ?.trim()) params.set("q", nextQ.trim());

      const res = await fetch(`/api/admin/orders?${params.toString()}`, {
        cache: "no-store",
      });
      if (!res.ok) throw new Error("주문 목록을 불러오지 못했습니다.");
      const json = (await res.json()) as OrdersResponse;
      setOrders(json.items);
      setTotalCount(json.totalCount);
      // 화면이 바뀌었을 때, 선택은 유지하되 존재하지 않는 주문은 자동 해제
      setSelectedIds((prev) => {
        const next: Record<string, boolean> = { ...prev };
        const idSet = new Set(json.items.map((o) => o.id));
        for (const k of Object.keys(next)) {
          if (!idSet.has(k)) delete next[k];
        }
        return next;
      });
    } catch (e) {
      setError(e instanceof Error ? e.message : "알 수 없는 오류");
    } finally {
      setLoadingOrders(false);
    }
  }

  React.useEffect(() => {
    void fetchStats();
    void fetchOrders(appliedStatus, appliedQ);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function applyFilters() {
    setAppliedStatus(status);
    setAppliedQ(q);
    void fetchOrders(status, q);
  }

  function resetFilters() {
    setStatus("ALL");
    setQ("");
    setAppliedStatus("ALL");
    setAppliedQ("");
    setSelectedIds({});
    void fetchOrders("ALL", "");
  }

  async function bulkAction(action: "QUEUE_PRINT" | "BULK_INVOICE") {
    if (selectedOrderIds.length === 0) {
      setError("선택된 주문이 없습니다.");
      return;
    }

    setError(null);
    try {
      const res = await fetch("/api/admin/orders/bulk", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ action, orderIds: selectedOrderIds }),
      });
      if (!res.ok) throw new Error("일괄 작업에 실패했습니다.");
      await fetchStats();
      await fetchOrders(appliedStatus, appliedQ);
    } catch (e) {
      setError(e instanceof Error ? e.message : "알 수 없는 오류");
    }
  }

  async function exportCsv() {
    setError(null);
    try {
      const params = new URLSearchParams();
      if (appliedStatus !== "ALL") params.set("status", appliedStatus);
      if (appliedQ?.trim()) params.set("q", appliedQ.trim());

      const res = await fetch(`/api/admin/orders/export?${params.toString()}`);
      if (!res.ok) throw new Error("CSV 내보내기에 실패했습니다.");
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `orders_${new Date().toISOString().slice(0, 10)}.csv`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
    } catch (e) {
      setError(e instanceof Error ? e.message : "알 수 없는 오류");
    }
  }

  async function previewBulkInvoice() {
    if (!invoiceFile) {
      setError("송장 CSV 파일을 선택하세요.");
      return;
    }

    setInvoiceBusy(true);
    setError(null);
    setInvoicePreview(null);
    try {
      const fd = new FormData();
      fd.set("courier", invoiceCourier);
      fd.set("file", invoiceFile);
      fd.set("dryRun", "true");

      const res = await fetch("/api/admin/invoices/bulk", {
        method: "POST",
        body: fd,
      });
      if (!res.ok) throw new Error("미리보기에 실패했습니다.");
      const json = (await res.json()) as BulkInvoicePreview;
      setInvoicePreview(json);
    } catch (e) {
      setError(e instanceof Error ? e.message : "알 수 없는 오류");
    } finally {
      setInvoiceBusy(false);
    }
  }

  async function executeBulkInvoice() {
    if (!invoiceFile) {
      setError("송장 CSV 파일을 선택하세요.");
      return;
    }

    setInvoiceBusy(true);
    setError(null);
    try {
      const fd = new FormData();
      fd.set("courier", invoiceCourier);
      fd.set("file", invoiceFile);
      fd.set("dryRun", "false");

      const res = await fetch("/api/admin/invoices/bulk", {
        method: "POST",
        body: fd,
      });
      if (!res.ok) throw new Error("일괄 등록 실행에 실패했습니다.");

      setInvoiceDialogOpen(false);
      setInvoicePreview(null);
      setInvoiceFile(null);

      await fetchStats();
      await fetchOrders(appliedStatus, appliedQ);
    } catch (e) {
      setError(e instanceof Error ? e.message : "알 수 없는 오류");
    } finally {
      setInvoiceBusy(false);
    }
  }

  return (
    <div className="w-full flex flex-col min-h-screen bg-white">
      {/* Navbar */}
      <nav className="h-16 bg-white border-b border-[#DDD6FE] shadow-sm flex items-center justify-between px-8">
        <div className="flex items-center gap-3">
          <Link href="/" className="text-xl font-bold text-[#4C1D95]">
            printtie
          </Link>
          <span className="text-xs text-muted-foreground">Admin</span>
        </div>

        <div className="hidden md:flex gap-6">
          <Link className="text-[#6D28D9] hover:text-[#4C1D95]" href="/">홈</Link>
          <Link className="text-[#6D28D9] hover:text-[#4C1D95]" href="/artworks/new">작품 등록</Link>
          <Link className="text-[#6D28D9] hover:text-[#4C1D95]" href="/market">마켓</Link>
          <Link className="text-[#4C1D95] font-semibold" href="/admin/orders">주문/관리</Link>
          <Link className="text-[#6D28D9] hover:text-[#4C1D95]" href="/policies">정책·지원</Link>
          <Link className="text-[#6D28D9] hover:text-[#4C1D95]" href="/login">로그인</Link>
        </div>

        <Button variant="secondary" className="bg-gray-100 text-[#6D28D9] hover:bg-gray-200">
          운영자 계정
        </Button>
      </nav>

      {/* Hero */}
      <header className="flex flex-col gap-4 px-8 py-6 bg-gradient-to-br from-[#7C3AED] to-[#A78BFA]">
        <div className="flex items-center justify-between gap-6">
          <div className="min-w-0">
            <h1 className="text-2xl font-bold text-white">주문/관리 콘솔</h1>
            <p className="text-white/70 mt-1 max-w-3xl">
              관리자가 주문 검수, 인쇄 큐 배치 및 송장 관리를 수행하는 운영 대시보드입니다. 상태 필터와 일괄 작업을 사용해 대량 주문을 효율적으로 처리하세요.
            </p>
          </div>

          <div className="flex gap-3 items-center">
            <div className="hidden sm:flex flex-col items-end">
              <span className="text-sm text-white/70">운영자</span>
              <span className="text-white font-semibold">김운영</span>
            </div>
            <Avatar className="w-10 h-10">
              <AvatarFallback className="bg-white/20 text-white">KO</AvatarFallback>
            </Avatar>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-3 lg:gap-4 items-stretch lg:items-center">
          <div className="flex items-center gap-2 bg-white/10 border border-white/20 rounded-lg px-3 py-2">
            <Filter className="w-4 h-4 text-white/90" />
            <Label className="text-sm text-white/90">상태</Label>
            <select
              className="bg-transparent text-white/90 outline-none text-sm"
              value={status}
              onChange={(e) => setStatus(e.target.value as OrderStatus)}
              aria-label="상태 필터"
            >
              {STATUS_OPTIONS.map((o) => (
                <option key={o.value} value={o.value} className="text-black">
                  {o.label}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-2 bg-white/10 border border-white/20 rounded-lg px-3 py-2 flex-1">
            <Search className="w-4 h-4 text-white/90" />
            <Label className="text-sm text-white/90">검색</Label>
            <input
              className="bg-transparent text-white/90 outline-none w-full placeholder:text-white/60 text-sm"
              placeholder="주문번호, 고객명, 작품명으로 검색"
              value={q}
              onChange={(e) => setQ(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") applyFilters();
              }}
            />
          </div>

          <div className="flex gap-2">
            <Button
              className="bg-white/15 text-white hover:bg-white/20"
              onClick={applyFilters}
              disabled={loadingOrders}
            >
              필터 적용
            </Button>
            <Button
              className="bg-white/15 text-white hover:bg-white/20"
              onClick={resetFilters}
              disabled={loadingOrders}
            >
              선택 초기화
            </Button>
          </div>
        </div>

        {error ? (
          <div className="rounded-lg border border-white/20 bg-white/10 px-3 py-2 text-white text-sm flex items-center justify-between gap-3">
            <span className="truncate">{error}</span>
            <Button
              size="sm"
              variant="secondary"
              className="bg-white/20 text-white hover:bg-white/25"
              onClick={() => setError(null)}
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
        ) : null}
      </header>

      {/* Main */}
      <main className="flex flex-col px-8 py-8 gap-8 bg-gradient-to-br from-[#7C3AED] to-[#A78BFA] flex-1">
        {/* Stats */}
        <section className="flex flex-col xl:flex-row items-stretch xl:items-center justify-between gap-4 py-4 bg-white/95 rounded-lg shadow-lg px-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 flex-1">
            <Card className="border-[#DDD6FE] p-4 shadow-lg">
              <p className="text-sm text-[#6D28D9]">이번주 신규 작가 가입</p>
              <p className="text-2xl font-bold text-[#4C1D95]">{loadingStats || !stats ? "—" : `${stats.newArtistsThisWeek}명`}</p>
            </Card>
            <Card className="border-[#DDD6FE] p-4 shadow-lg">
              <p className="text-sm text-[#6D28D9]">주간 작품 승인(완료)</p>
              <p className="text-2xl font-bold text-[#4C1D95]">{loadingStats || !stats ? "—" : `${stats.artworksApprovedThisWeek.toLocaleString()}건`}</p>
            </Card>
            <Card className="border-[#DDD6FE] p-4 shadow-lg">
              <p className="text-sm text-[#6D28D9]">주문 전환율(CVR)</p>
              <p className="text-2xl font-bold text-[#4C1D95]">{loadingStats || !stats ? "—" : formatPct(stats.cvr)}</p>
            </Card>
            <Card className="border-[#DDD6FE] p-4 shadow-lg">
              <p className="text-sm text-[#6D28D9]">GMV(주간)</p>
              <p className="text-2xl font-bold text-[#4C1D95]">{loadingStats || !stats ? "—" : formatKrw(stats.gmvWeekly)}</p>
            </Card>
          </div>

          <div className="flex gap-8 items-center justify-end">
            <div className="flex flex-col items-end">
              <p className="text-sm text-[#6D28D9]">검수 대기</p>
              <p className="text-lg font-bold text-[#4C1D95]">{loadingStats || !stats ? "—" : `${stats.pendingReview}건`}</p>
            </div>
            <div className="flex flex-col items-end">
              <p className="text-sm text-[#6D28D9]">인쇄 대기</p>
              <p className="text-lg font-bold text-[#4C1D95]">{loadingStats || !stats ? "—" : `${stats.pendingPrint}건`}</p>
            </div>
          </div>
        </section>

        {/* Orders list */}
        <section className="flex flex-col gap-6 bg-[#FAF5FF] p-6 rounded-lg border border-[#DDD6FE]">
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-3">
            <div>
              <h2 className="text-xl font-bold text-[#4C1D95]">주문 목록</h2>
              <p className="text-sm text-[#6D28D9]">
                결과 {totalCount.toLocaleString()}건 · 선택 {selectedOrderIds.length}건
              </p>
            </div>

            <div className="flex flex-wrap gap-2">
              <Dialog open={invoiceDialogOpen} onOpenChange={setInvoiceDialogOpen}>
                <DialogTrigger asChild>
                  <Button
                    variant="secondary"
                    className="bg-[#FAF5FF] text-[#4C1D95] hover:bg-[#F3E8FF]"
                    onClick={() => {
                      setInvoiceDialogOpen(true);
                      setInvoicePreview(null);
                    }}
                  >
                    <Truck className="w-4 h-4 mr-2" />
                    선택 송장 등록
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl">
                  <DialogHeader>
                    <DialogTitle>선택 주문 송장 등록</DialogTitle>
                    <DialogDescription>
                      선택된 주문에 대해 송장을 일괄 등록합니다. (MVP: 샘플 검증/실행)
                    </DialogDescription>
                  </DialogHeader>

                  <div className="grid gap-4">
                    <div className="rounded-lg border p-3 bg-muted/30">
                      <div className="text-sm">
                        선택 주문: <span className="font-medium">{selectedOrderIds.length}건</span>
                      </div>
                      <div className="text-xs text-muted-foreground mt-1 break-all">
                        {selectedOrderIds.slice(0, 8).join(", ")}
                        {selectedOrderIds.length > 8 ? " …" : ""}
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="grid gap-2">
                        <Label>택배사</Label>
                        <select
                          className="h-10 rounded-md border px-3 bg-white"
                          value={invoiceCourier}
                          onChange={(e) => setInvoiceCourier(e.target.value)}
                        >
                          <option value="CJ대한통운">CJ대한통운</option>
                          <option value="한진택배">한진택배</option>
                          <option value="로젠">로젠</option>
                        </select>
                      </div>

                      <div className="grid gap-2">
                        <Label>송장 파일 업로드 (CSV)</Label>
                        <Input
                          type="file"
                          accept=".csv,text/csv"
                          onChange={(e) => setInvoiceFile(e.target.files?.[0] ?? null)}
                        />
                        <div className="text-xs text-muted-foreground">
                          컬럼 예: <span className="font-mono">order_id,tracking_no,courier</span>
                        </div>
                      </div>
                    </div>

                    <div className="grid gap-2">
                      <Label>매핑 옵션</Label>
                      <div className="flex flex-wrap gap-2">
                        <Badge variant="secondary" className="bg-white border border-[#DDD6FE] text-[#4C1D95]">주문번호 ↔ order_id</Badge>
                        <Badge variant="secondary" className="bg-white border border-[#DDD6FE] text-[#4C1D95]">송장번호 ↔ tracking_no</Badge>
                        <Badge variant="secondary" className="bg-white border border-[#DDD6FE] text-[#4C1D95]">택배사 ↔ courier</Badge>
                      </div>
                    </div>

                    {invoicePreview ? (
                      <div className="rounded-lg border p-3">
                        <div className="flex items-center justify-between gap-3">
                          <div className="text-sm font-medium">미리보기 결과</div>
                          <div className="text-xs text-muted-foreground">
                            parsed {invoicePreview.parsedCount} · ok {invoicePreview.okCount} · errors {invoicePreview.errorCount}
                          </div>
                        </div>
                        <Separator className="my-3" />

                        {invoicePreview.errorCount > 0 ? (
                          <div className="text-sm text-red-600 grid gap-1">
                            {invoicePreview.errors.slice(0, 6).map((e) => (
                              <div key={`${e.row}-${e.message}`}>Row {e.row}: {e.message}</div>
                            ))}
                            {invoicePreview.errors.length > 6 ? (
                              <div className="text-xs text-muted-foreground">(일부 오류만 표시)</div>
                            ) : null}
                          </div>
                        ) : (
                          <div className="text-sm text-emerald-700 flex items-center gap-2">
                            <PackageCheck className="w-4 h-4" />
                            형식 검증 통과
                          </div>
                        )}

                        <div className="mt-3">
                          <div className="text-xs text-muted-foreground mb-1">샘플(최대 5줄)</div>
                          <div className="rounded-md border bg-white overflow-auto">
                            <table className="w-full text-sm">
                              <thead>
                                <tr className="border-b">
                                  <th className="text-left p-2">order_id</th>
                                  <th className="text-left p-2">tracking_no</th>
                                  <th className="text-left p-2">courier</th>
                                </tr>
                              </thead>
                              <tbody>
                                {invoicePreview.sample.map((r, idx) => (
                                  <tr key={idx} className="border-b last:border-b-0">
                                    <td className="p-2 font-mono">{r.order_id}</td>
                                    <td className="p-2 font-mono">{r.tracking_no}</td>
                                    <td className="p-2">{r.courier}</td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                        </div>
                      </div>
                    ) : null}
                  </div>

                  <DialogFooter className="gap-2">
                    <Button
                      variant="secondary"
                      onClick={previewBulkInvoice}
                      disabled={invoiceBusy}
                      className="bg-[#FAF5FF] text-[#4C1D95] hover:bg-[#F3E8FF]"
                    >
                      <FileUp className="w-4 h-4 mr-2" />
                      미리보기
                    </Button>
                    <Button
                      onClick={executeBulkInvoice}
                      disabled={invoiceBusy}
                      className="bg-[#4C1D95] text-white hover:bg-[#3B1572]"
                    >
                      일괄 등록 실행
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>

              <Button
                variant="secondary"
                className="bg-[#FAF5FF] text-[#4C1D95] hover:bg-[#F3E8FF]"
                onClick={() => void bulkAction("QUEUE_PRINT")}
              >
                <Printer className="w-4 h-4 mr-2" />
                선택 인쇄 큐에 배치
              </Button>

              <Button
                variant="secondary"
                className="bg-[#FAF5FF] text-[#4C1D95] hover:bg-[#F3E8FF]"
                onClick={exportCsv}
              >
                <Download className="w-4 h-4 mr-2" />
                CSV 내보내기
              </Button>
            </div>
          </div>

          {loadingOrders ? (
            <Card className="p-6 border-[#DDD6FE] bg-white/80">
              <div className="text-sm text-muted-foreground">주문 목록을 불러오는 중…</div>
            </Card>
          ) : orders.length === 0 ? (
            <Card className="p-6 border-[#DDD6FE] bg-white/80">
              <div className="text-sm text-muted-foreground">조건에 해당하는 주문이 없습니다.</div>
            </Card>
          ) : (
            <div className="flex flex-col gap-4">
              {orders.map((o) => (
                <OrderCard
                  key={o.id}
                  order={o}
                  selected={!!selectedIds[o.id]}
                  onToggleSelect={() =>
                    setSelectedIds((prev) => ({ ...prev, [o.id]: !prev[o.id] }))
                  }
                  onOpenInvoice={() => {
                    setSelectedIds((prev) => ({ ...prev, [o.id]: true }));
                    setInvoiceDialogOpen(true);
                    setInvoicePreview(null);
                  }}
                  onQueuePrint={() => {
                    setSelectedIds((prev) => ({ ...prev, [o.id]: true }));
                    void bulkAction("QUEUE_PRINT");
                  }}
                />
              ))}
            </div>
          )}
        </section>

        {/* Timeline */}
        <section className="flex flex-col gap-6 bg-white shadow-lg p-6 rounded-lg border border-[#DDD6FE]">
          <h2 className="text-xl font-bold text-[#4C1D95]">주문 처리 흐름</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                n: 1,
                title: "결제 완료",
                desc: "결제 확인 후 자동으로 검수 목록에 등록됩니다.",
              },
              {
                n: 2,
                title: "검수",
                desc: "아티스트 저작권/파일 규격 검토 및 승인 여부 판단.",
              },
              {
                n: 3,
                title: "인쇄 큐",
                desc: "검수 통과 시 인쇄 파트너 큐에 배치합니다.",
              },
              {
                n: 4,
                title: "송장 등록",
                desc: "택배사 송장 번호 등록 후 배송 시작.",
              },
            ].map((s) => (
              <div key={s.n} className="flex flex-col items-center gap-2">
                <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center">
                  <p className="text-[#4C1D95] font-bold">{s.n}</p>
                </div>
                <h3 className="text-sm font-semibold text-[#4C1D95]">{s.title}</h3>
                <p className="text-[#6D28D9] text-center text-sm">{s.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Bulk invoice form (static section mirroring the screen) */}
        <section className="flex flex-col items-start bg-[#FAF5FF] p-6 rounded-lg border border-[#DDD6FE] w-full">
          <h2 className="text-lg font-bold text-[#4C1D95]">일괄 송장 등록</h2>
          <div className="flex flex-col xl:flex-row gap-6 mt-4 w-full">
            <Card className="flex-1 bg-white shadow-lg border-[#DDD6FE] p-4">
              <div className="flex flex-col gap-3">
                <div className="flex flex-col gap-2">
                  <Label className="text-sm text-[#4C1D95]">택배사</Label>
                  <select
                    className="bg-white shadow-lg text-[#4C1D95] border border-[#DDD6FE] rounded-lg h-10 px-3"
                    value={invoiceCourier}
                    onChange={(e) => setInvoiceCourier(e.target.value)}
                  >
                    <option value="CJ대한통운">CJ대한통운</option>
                    <option value="한진택배">한진택배</option>
                    <option value="로젠">로젠</option>
                  </select>
                </div>

                <div className="flex flex-col gap-2">
                  <Label className="text-sm text-[#4C1D95]">송장 파일 업로드 (CSV)</Label>
                  <div className="grid gap-2">
                    <Input
                      type="file"
                      accept=".csv,text/csv"
                      onChange={(e) => setInvoiceFile(e.target.files?.[0] ?? null)}
                    />
                    <div className="h-12 bg-white shadow-lg border border-[#DDD6FE] rounded-lg flex items-center px-3 text-[#6D28D9]">
                      파일 선택 또는 드래그 앤 드롭 (MVP: 파일 선택)
                    </div>
                  </div>
                </div>

                <div className="flex flex-col gap-2">
                  <Label className="text-sm text-[#4C1D95]">매핑 옵션</Label>
                  <div className="flex flex-wrap gap-3">
                    <div className="bg-white shadow-lg border border-[#DDD6FE] rounded-lg px-3 py-2 text-[#4C1D95]">
                      주문번호 ↔ order_id
                    </div>
                    <div className="bg-white shadow-lg border border-[#DDD6FE] rounded-lg px-3 py-2 text-[#4C1D95]">
                      송장번호 ↔ tracking_no
                    </div>
                  </div>
                </div>

                <div className="flex gap-3 mt-3">
                  <Button
                    variant="secondary"
                    className="bg-[#FAF5FF] text-[#4C1D95] hover:bg-[#F3E8FF]"
                    onClick={previewBulkInvoice}
                    disabled={invoiceBusy}
                  >
                    미리보기
                  </Button>
                  <Button
                    variant="secondary"
                    className="bg-[#FAF5FF] text-[#4C1D95] hover:bg-[#F3E8FF]"
                    onClick={executeBulkInvoice}
                    disabled={invoiceBusy}
                  >
                    일괄 등록 실행
                  </Button>
                </div>

                {invoicePreview ? (
                  <div className="rounded-lg border border-[#DDD6FE] p-3 mt-2">
                    <div className="flex items-center justify-between gap-2">
                      <div className="text-sm font-medium text-[#4C1D95]">미리보기</div>
                      <Badge variant="secondary" className="bg-white border border-[#DDD6FE] text-[#4C1D95]">
                        ok {invoicePreview.okCount} / errors {invoicePreview.errorCount}
                      </Badge>
                    </div>
                    <div className="text-xs text-[#6D28D9] mt-2">
                      {invoicePreview.errorCount > 0
                        ? "오류를 수정한 후 실행하세요."
                        : "검증 통과: 실행 가능"}
                    </div>
                  </div>
                ) : null}
              </div>
            </Card>

            <aside className="xl:w-96 bg-white shadow-lg border border-[#DDD6FE] rounded-lg p-4">
              <h3 className="text-sm font-semibold text-[#4C1D95]">업로드 가이드</h3>
              <ul className="text-sm text-[#6D28D9] mt-2 list-disc ml-5">
                <li>컬럼: order_id, tracking_no, courier</li>
                <li>order_id는 내부 주문번호와 정확히 매칭되어야 합니다.</li>
                <li>중복 송장번호는 등록되지 않습니다.</li>
                <li>오류 발생 시 오류 건수와 사유를 제공합니다.</li>
              </ul>
              <Separator className="my-4" />
              <div className="text-xs text-muted-foreground">
                서비스 기획 관점: 송장 업로드는 “운영 SLA”와 직결됩니다. CSV 템플릿 다운로드, 업로드 히스토리(누가/언제/몇 건), 실패 건 재시도 UX를 MVP 이후 확장하세요.
              </div>
            </aside>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="flex flex-col md:flex-row justify-between gap-8 py-12 px-8 bg-[#FFFFFF]">
        <div className="flex flex-col gap-2">
          <span className="text-lg font-bold text-gray-900">printtie</span>
          <p className="text-[#6D28D9] text-sm">© 2026 printtie Inc. All rights reserved.</p>
        </div>
        <div className="flex gap-12 flex-wrap">
          <div className="flex flex-col gap-2">
            <p className="text-gray-700 font-semibold">회사</p>
            <p className="text-[#6D28D9] text-sm">소개</p>
            <p className="text-[#6D28D9] text-sm">채용</p>
            <p className="text-[#6D28D9] text-sm">보도자료</p>
          </div>
          <div className="flex flex-col gap-2">
            <p className="text-gray-700 font-semibold">서비스</p>
            <p className="text-[#6D28D9] text-sm">작품 등록</p>
            <p className="text-[#6D28D9] text-sm">가격 안내</p>
            <p className="text-[#6D28D9] text-sm">주문 처리 흐름</p>
          </div>
          <div className="flex flex-col gap-2">
            <p className="text-gray-700 font-semibold">지원</p>
            <p className="text-[#6D28D9] text-sm">자주 묻는 질문</p>
            <p className="text-[#6D28D9] text-sm">문의하기</p>
            <p className="text-[#6D28D9] text-sm">정책(환불/저작권)</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
