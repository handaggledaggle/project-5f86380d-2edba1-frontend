"use client";

import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import { Info, ShoppingCart } from "lucide-react";

type ArtworkDetail = {
  artwork_id: string;
  title: string;
  description: string;
  artist: {
    artist_id: string;
    name: string;
  };
  release_date: string;
  view_count: number;
  images: { id: string; url: string; alt: string; width: number; height: number }[];
  purchase_options: {
    sizes: { id: string; label: string; hint?: string }[];
    materials: { id: string; label: string; hint?: string }[];
    default_size_id: string;
    default_material_id: string;
  };
};

type PricingResponse = {
  suggested_price: number;
  currency: "KRW";
  cost_breakdown: {
    base: number;
    material_multiplier: number;
    rounding: number;
  };
};

function formatKRW(amount: number) {
  return new Intl.NumberFormat("ko-KR").format(amount) + "원";
}

async function fetchArtwork(artworkId: string): Promise<ArtworkDetail> {
  const res = await fetch(`/api/v1/artworks/${encodeURIComponent(artworkId)}`, {
    method: "GET",
    headers: { "Accept": "application/json" },
  });
  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`Failed to load artwork (${res.status}): ${text}`);
  }
  return res.json();
}

async function fetchPrice(input: { size_id: string; material_id: string }) {
  const res = await fetch("/api/v1/pricing/calculate", {
    method: "POST",
    headers: { "Content-Type": "application/json", "Accept": "application/json" },
    body: JSON.stringify(input),
  });
  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`Failed to calculate price (${res.status}): ${text}`);
  }
  return (await res.json()) as PricingResponse;
}

export function ArtworkDetailClient({ artworkId }: { artworkId: string }) {
  const [data, setData] = useState<ArtworkDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [selectedImageId, setSelectedImageId] = useState<string | null>(null);
  const [sizeId, setSizeId] = useState<string>("");
  const [materialId, setMaterialId] = useState<string>("");

  const [pricing, setPricing] = useState<PricingResponse | null>(null);
  const [pricingLoading, setPricingLoading] = useState(false);
  const [pricingError, setPricingError] = useState<string | null>(null);

  const [cartDialogOpen, setCartDialogOpen] = useState(false);
  const [buyDialogOpen, setBuyDialogOpen] = useState(false);

  useEffect(() => {
    let alive = true;
    setLoading(true);
    setError(null);

    fetchArtwork(artworkId)
      .then((d) => {
        if (!alive) return;
        setData(d);
        setSelectedImageId(d.images[0]?.id ?? null);
        setSizeId(d.purchase_options.default_size_id);
        setMaterialId(d.purchase_options.default_material_id);
      })
      .catch((e: unknown) => {
        if (!alive) return;
        setError(e instanceof Error ? e.message : "알 수 없는 오류가 발생했습니다.");
      })
      .finally(() => {
        if (!alive) return;
        setLoading(false);
      });

    return () => {
      alive = false;
    };
  }, [artworkId]);

  const selectedImage = useMemo(() => {
    if (!data) return null;
    return data.images.find((img) => img.id === selectedImageId) ?? data.images[0] ?? null;
  }, [data, selectedImageId]);

  useEffect(() => {
    if (!sizeId || !materialId) return;

    let alive = true;
    setPricingLoading(true);
    setPricingError(null);

    fetchPrice({ size_id: sizeId, material_id: materialId })
      .then((p) => {
        if (!alive) return;
        setPricing(p);
      })
      .catch((e: unknown) => {
        if (!alive) return;
        setPricingError(e instanceof Error ? e.message : "가격 계산 중 오류가 발생했습니다.");
      })
      .finally(() => {
        if (!alive) return;
        setPricingLoading(false);
      });

    return () => {
      alive = false;
    };
  }, [sizeId, materialId]);

  if (loading) {
    return (
      <section className="flex flex-col gap-6">
        <Card className="border-[#DDD6FE]">
          <CardHeader>
            <div className="h-7 w-80 animate-pulse rounded bg-gray-200" />
            <div className="h-4 w-96 animate-pulse rounded bg-gray-100" />
          </CardHeader>
        </Card>
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-[minmax(0,720px)_minmax(0,600px)]">
          <div className="h-[520px] animate-pulse rounded-lg bg-gray-200" />
          <div className="h-[520px] animate-pulse rounded-lg bg-gray-200" />
        </div>
      </section>
    );
  }

  if (error || !data) {
    return (
      <Card className="border-[#DDD6FE]">
        <CardHeader>
          <CardTitle className="text-[#4C1D95]">작품을 불러오지 못했습니다</CardTitle>
          <CardDescription className="text-[#6D28D9]">{error ?? "데이터가 없습니다."}</CardDescription>
        </CardHeader>
        <CardContent>
          <Button variant="secondary" onClick={() => location.reload()}>
            새로고침
          </Button>
        </CardContent>
      </Card>
    );
  }

  const selectedSize = data.purchase_options.sizes.find((s) => s.id === sizeId);
  const selectedMaterial = data.purchase_options.materials.find((m) => m.id === materialId);

  return (
    <div className="flex flex-col gap-12">
      {/* Hero / Gallery */}
      <section className="grid grid-cols-1 gap-10 rounded-lg bg-white p-0 lg:grid-cols-[minmax(0,720px)_minmax(0,600px)]">
        <div className="flex flex-col gap-4">
          <Card className="border-0 shadow-none">
            <CardContent className="p-0">
              <div className="relative h-[520px] w-full overflow-hidden rounded-lg bg-gray-200">
                {selectedImage ? (
                  <Image
                    src={selectedImage.url}
                    alt={selectedImage.alt}
                    fill
                    className="object-cover"
                    unoptimized
                    priority
                    sizes="(max-width: 1024px) 100vw, 720px"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center">
                    <span className="text-[#6D28D9]">작품 미리보기 이미지</span>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          <div className="flex flex-wrap gap-3">
            {data.images.slice(0, 4).map((img, idx) => {
              const active = img.id === selectedImageId;
              return (
                <button
                  key={img.id}
                  type="button"
                  className={cn(
                    "relative h-28 w-40 overflow-hidden rounded-lg border bg-gray-200",
                    active ? "border-[#6D28D9] ring-2 ring-[#6D28D9]/30" : "border-transparent"
                  )}
                  onClick={() => setSelectedImageId(img.id)}
                  aria-label={`썸네일 ${idx + 1}`}
                >
                  <Image
                    src={img.url}
                    alt={img.alt}
                    fill
                    className="object-cover"
                    unoptimized
                    sizes="160px"
                  />
                </button>
              );
            })}
          </div>
        </div>

        {/* Right column: details, pricing, actions */}
        <aside className="flex flex-col gap-6">
          <Card className="border border-white/20 bg-gradient-to-br from-[#7C3AED] to-[#A78BFA]">
            <CardHeader>
              <CardTitle className="text-2xl text-white">작품명: {data.title}</CardTitle>
              <CardDescription className="text-white/90">
                작가: {data.artist.name} • 판형 옵션 및 프린트 재질 선택 후 결제 가능합니다.
              </CardDescription>
              <div className="mt-2 flex flex-wrap items-center gap-3">
                <span className="text-sm text-white/70">출시일: {data.release_date}</span>
                <span className="text-sm text-white/70">•</span>
                <span className="text-sm text-white/70">조회수 {new Intl.NumberFormat("ko-KR").format(data.view_count)}</span>
              </div>
            </CardHeader>
          </Card>

          <Card className="border-[#DDD6FE] shadow-lg">
            <CardHeader>
              <CardTitle className="text-xl text-[#4C1D95]">구매 옵션</CardTitle>
              <CardDescription className="text-[#6D28D9]">규격/재질에 따라 가격이 자동 반영됩니다.</CardDescription>
            </CardHeader>

            <CardContent className="flex flex-col gap-4">
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div className="flex flex-col gap-2">
                  <Label className="text-sm text-[#4C1D95]" htmlFor="size">
                    규격
                  </Label>
                  <select
                    id="size"
                    className="h-11 rounded-lg border border-[#DDD6FE] bg-white px-3 text-[#4C1D95] shadow-sm"
                    value={sizeId}
                    onChange={(e) => setSizeId(e.target.value)}
                  >
                    {data.purchase_options.sizes.map((s) => (
                      <option key={s.id} value={s.id} className="text-[#4C1D95]">
                        {s.label}
                      </option>
                    ))}
                  </select>
                  <p className="text-sm text-[#6D28D9]">권장: {selectedSize?.hint ?? "A3는 프린트 선명도가 높습니다."}</p>
                </div>

                <div className="flex flex-col gap-2">
                  <Label className="text-sm text-[#4C1D95]" htmlFor="material">
                    프린트 재질
                  </Label>
                  <select
                    id="material"
                    className="h-11 rounded-lg border border-[#DDD6FE] bg-white px-3 text-[#4C1D95] shadow-sm"
                    value={materialId}
                    onChange={(e) => setMaterialId(e.target.value)}
                  >
                    {data.purchase_options.materials.map((m) => (
                      <option key={m.id} value={m.id} className="text-[#4C1D95]">
                        {m.label}
                      </option>
                    ))}
                  </select>
                  <p className="text-sm text-[#6D28D9]">
                    {selectedMaterial?.hint ?? "프린트 재질에 따라 색감과 마감 차이가 있습니다."}
                  </p>
                </div>
              </div>

              <Separator />

              <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                <div className="flex flex-col">
                  <span className="text-lg font-semibold text-[#4C1D95]">
                    가격: {pricingLoading ? "계산 중…" : pricing ? formatKRW(pricing.suggested_price) : "-"}
                  </span>
                  <span className="text-sm text-[#6D28D9]">선택한 규격/재질에 따라 자동 반영됩니다</span>
                  {pricingError && <span className="text-sm text-red-600">{pricingError}</span>}
                </div>

                <div className="flex flex-wrap gap-3">
                  <Button
                    variant="secondary"
                    className="bg-[#FAF5FF] text-[#4C1D95] hover:bg-[#F3E8FF]"
                    onClick={() => setCartDialogOpen(true)}
                  >
                    <ShoppingCart className="mr-2 h-4 w-4" />
                    장바구니에 담기
                  </Button>
                  <Button
                    variant="secondary"
                    className="bg-[#FAF5FF] text-[#4C1D95] hover:bg-[#F3E8FF]"
                    onClick={() => setBuyDialogOpen(true)}
                  >
                    바로 구매
                  </Button>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <Badge variant="secondary" className="bg-[#FAF5FF] text-[#4C1D95]">
                  옵션: {selectedSize?.label ?? "-"} / {selectedMaterial?.label ?? "-"}
                </Badge>
              </div>
            </CardContent>
          </Card>

          <Card className="border-[#DDD6FE] shadow-lg">
            <CardHeader>
              <CardTitle className="text-lg text-[#4C1D95]">제작 · 배송 · 환불 요약</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <p className="text-[#4C1D95]">제작 기간</p>
                <p className="text-[#6D28D9]">결제 후 3–5 영업일</p>
              </div>
              <div className="flex items-center justify-between">
                <p className="text-[#4C1D95]">배송 (국내)</p>
                <p className="text-[#6D28D9]">택배사 기준 2–3일 추가</p>
              </div>
              <div className="flex items-center justify-between">
                <p className="text-[#4C1D95]">환불 정책</p>
                <p className="text-[#6D28D9]">인쇄 품질 불량 시 전액 환불 또는 재작업</p>
              </div>
              <div className="flex items-center justify-between">
                <p className="text-[#4C1D95]">교환/반품</p>
                <p className="text-[#6D28D9]">수령 후 7일 이내 고객센터 접수</p>
              </div>
              <p className="mt-2 text-sm text-[#6D28D9]">
                ※ 맞춤 제작 및 작가 약관에 따라 일부 조건이 달라질 수 있습니다.
              </p>
            </CardContent>
          </Card>

          <Card className="border-[#DDD6FE] shadow-lg">
            <CardContent className="flex gap-3 p-4">
              <Info className="mt-0.5 h-4 w-4 text-[#6D28D9]" />
              <p className="text-sm text-[#4C1D95]">
                작품 등록 지표: 승인 완료된 작품은 품질 검수를 통해 노출됩니다. 신규 작가의 빠른 등록/승인 촉진이 구매 전환에 영향을 미칩니다.
              </p>
            </CardContent>
          </Card>
        </aside>
      </section>

      {/* Features expanded */}
      <section className="rounded-lg border border-[#DDD6FE] bg-white p-6 shadow-lg">
        <h2 className="text-2xl font-bold text-[#4C1D95]">제작 및 품질 안내</h2>
        <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-3">
          <div className="rounded-lg bg-white p-4">
            <h3 className="text-lg font-semibold text-[#4C1D95]">프린트 규격 & 샘플</h3>
            <p className="mt-3 text-[#6D28D9]">
              각 규격별 샘플 이미지를 제공하여 인쇄 결과물을 사전에 확인할 수 있습니다. 고해상도 원본을 권장합니다.
            </p>
          </div>
          <div className="rounded-lg bg-white p-4">
            <h3 className="text-lg font-semibold text-[#4C1D95]">색감 보정</h3>
            <p className="mt-3 text-[#6D28D9]">
              기계별 색감 차이를 줄이기 위해 프로파일 보정을 적용합니다. 컨펌 시 색상 차이 발생 시 상담을 통해 조정합니다.
            </p>
          </div>
          <div className="rounded-lg bg-white p-4">
            <h3 className="text-lg font-semibold text-[#4C1D95]">포장 및 배송</h3>
            <p className="mt-3 text-[#6D28D9]">
              안전한 튜브 포장 또는 판지 포장으로 발송합니다. 배송지연 발생 시 알림을 통해 안내합니다.
            </p>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="rounded-lg bg-[#FAF5FF] py-6">
        <div className="mx-auto flex max-w-3xl flex-col items-center px-4">
          <h2 className="text-2xl font-bold text-[#4C1D95]">자주 묻는 질문</h2>
          <div className="mt-4 flex w-full flex-col gap-4">
            <Card className="border-[#DDD6FE] shadow-lg">
              <CardHeader>
                <CardTitle className="text-lg text-[#4C1D95]">프린트 색상이 화면과 다른데 교환 가능한가요?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-[#6D28D9]">
                  원칙적으로 인쇄물의 색상은 모니터와 차이가 있을 수 있습니다. 심각한 색상 왜곡이 확인될 경우 사진 제출 후 품질 검증을 통해 재인쇄 또는 환불 처리합니다.
                </p>
              </CardContent>
            </Card>

            <Card className="border-[#DDD6FE] shadow-lg">
              <CardHeader>
                <CardTitle className="text-lg text-[#4C1D95]">주문 후 규격을 변경할 수 있나요?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-[#6D28D9]">
                  제작 전(결제 후 24시간 이내)에는 변경이 가능할 수 있습니다. 이미 제작이 시작된 경우 변경이 불가하니 고객센터로 문의 바랍니다.
                </p>
              </CardContent>
            </Card>

            <Card className="border-[#DDD6FE] shadow-lg">
              <CardHeader>
                <CardTitle className="text-lg text-[#4C1D95]">배송 지연 시 환불은 어떻게 되나요?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-[#6D28D9]">
                  배송 지연이 당사 귀책 사유인 경우 배송비 보상 또는 주문 취소 시 전액 환불이 가능합니다. 세부 기준은 배송 정책을 따릅니다.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* dialogs */}
      <Dialog open={cartDialogOpen} onOpenChange={setCartDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>장바구니에 담겼습니다</DialogTitle>
            <DialogDescription>
              {data.title} ({selectedSize?.label ?? "-"} / {selectedMaterial?.label ?? "-"})
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-end gap-2">
            <Button variant="secondary" onClick={() => setCartDialogOpen(false)}>
              계속 쇼핑
            </Button>
            <Button asChild>
              <a href="/cart">장바구니로 이동</a>
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={buyDialogOpen} onOpenChange={setBuyDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>바로 구매(데모)</DialogTitle>
            <DialogDescription>
              MVP에서는 체크아웃/결제 연동 전 단계입니다. 선택 옵션과 가격 산정이 정상 동작하는지 확인합니다.
            </DialogDescription>
          </DialogHeader>
          <div className="rounded-lg border p-3 text-sm">
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">작품</span>
              <span className="font-medium">{data.title}</span>
            </div>
            <div className="mt-2 flex items-center justify-between">
              <span className="text-muted-foreground">옵션</span>
              <span className="font-medium">
                {selectedSize?.label ?? "-"} / {selectedMaterial?.label ?? "-"}
              </span>
            </div>
            <div className="mt-2 flex items-center justify-between">
              <span className="text-muted-foreground">가격</span>
              <span className="font-medium text-[#4C1D95]">
                {pricing ? formatKRW(pricing.suggested_price) : "-"}
              </span>
            </div>
          </div>
          <div className="flex justify-end gap-2">
            <Button variant="secondary" onClick={() => setBuyDialogOpen(false)}>
              닫기
            </Button>
            <Button onClick={() => setBuyDialogOpen(false)}>확인</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
