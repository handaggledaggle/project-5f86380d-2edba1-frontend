"use client";

import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Filter,
  Search,
  ArrowUpDown,
  Loader2,
  Store,
  ShieldCheck,
  Truck,
  CreditCard,
} from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Separator } from "@/components/ui/separator";
import { Label } from "@/components/ui/label";

type ArtworkSummary = {
  artwork_id: string;
  title: string;
  artist_name: string;
  category: "일러스트" | "포스터" | "사진" | "디지털아트";
  price: number;
  subtitle: string;
  image_url: string;
  badges?: string[];
};

type ArtworkListResponse = {
  items: ArtworkSummary[];
  total_count: number;
  page: number;
  page_size: number;
};

const CATEGORIES: Array<{ label: string; value: string }> = [
  { label: "모든 카테고리", value: "" },
  { label: "일러스트", value: "일러스트" },
  { label: "포스터", value: "포스터" },
  { label: "사진", value: "사진" },
  { label: "디지털아트", value: "디지털아트" },
];

const SORTS: Array<{ label: string; value: string }> = [
  { label: "추천순", value: "recommended" },
  { label: "최신순", value: "latest" },
  { label: "가격 낮은순", value: "price_asc" },
  { label: "가격 높은순", value: "price_desc" },
];

function formatKRW(value: number) {
  return new Intl.NumberFormat("ko-KR", {
    style: "currency",
    currency: "KRW",
    maximumFractionDigits: 0,
  }).format(value);
}

function HeroGradient({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "bg-gradient-to-br from-violet-600 to-violet-300",
        className
      )}
      aria-hidden="true"
    />
  );
}

export default function MarketPageClient() {
  const router = useRouter();

  const [qDraft, setQDraft] = useState("");
  const [q, setQ] = useState("");
  const [category, setCategory] = useState("");
  const [sortBy, setSortBy] = useState("recommended");
  const [priceMin, setPriceMin] = useState<string>("");
  const [priceMax, setPriceMax] = useState<string>("");

  const [items, setItems] = useState<ArtworkSummary[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [page, setPage] = useState(1);
  const [pageSize] = useState(8);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const hasMore = useMemo(() => items.length < totalCount, [items.length, totalCount]);

  const buildUrl = useCallback(
    (nextPage: number) => {
      const params = new URLSearchParams();
      params.set("page", String(nextPage));
      params.set("page_size", String(pageSize));
      if (q.trim()) params.set("q", q.trim());
      if (category) params.set("category", category);
      if (sortBy) params.set("sort_by", sortBy);
      if (priceMin.trim()) params.set("price_min", priceMin.trim());
      if (priceMax.trim()) params.set("price_max", priceMax.trim());
      return `/api/v1/artworks?${params.toString()}`;
    },
    [category, pageSize, priceMax, priceMin, q, sortBy]
  );

  const syncQueryString = useCallback(
    (nextPage = 1) => {
      const params = new URLSearchParams();
      if (q.trim()) params.set("q", q.trim());
      if (category) params.set("category", category);
      if (sortBy) params.set("sort_by", sortBy);
      if (priceMin.trim()) params.set("price_min", priceMin.trim());
      if (priceMax.trim()) params.set("price_max", priceMax.trim());
      if (nextPage !== 1) params.set("page", String(nextPage));
      router.replace(`/market?${params.toString()}`);
    },
    [category, priceMax, priceMin, q, router, sortBy]
  );

  const fetchPage = useCallback(
    async (nextPage: number, mode: "replace" | "append") => {
      const url = buildUrl(nextPage);
      const res = await fetch(url, { method: "GET", cache: "no-store" });
      if (!res.ok) {
        const text = await res.text().catch(() => "");
        throw new Error(text || `요청 실패 (HTTP ${res.status})`);
      }
      const data = (await res.json()) as ArtworkListResponse;

      setTotalCount(data.total_count);
      setPage(data.page);
      setItems((prev) => (mode === "append" ? [...prev, ...data.items] : data.items));
    },
    [buildUrl]
  );

  const runSearch = useCallback(async () => {
    setError(null);
    setIsLoading(true);
    try {
      await fetchPage(1, "replace");
      syncQueryString(1);
    } catch (e) {
      setError(e instanceof Error ? e.message : "알 수 없는 오류가 발생했습니다.");
    } finally {
      setIsLoading(false);
    }
  }, [fetchPage, syncQueryString]);

  const loadMore = useCallback(async () => {
    if (!hasMore || isLoadingMore) return;
    setError(null);
    setIsLoadingMore(true);
    try {
      const nextPage = page + 1;
      await fetchPage(nextPage, "append");
      syncQueryString(nextPage);
    } catch (e) {
      setError(e instanceof Error ? e.message : "알 수 없는 오류가 발생했습니다.");
    } finally {
      setIsLoadingMore(false);
    }
  }, [fetchPage, hasMore, isLoadingMore, page, syncQueryString]);

  useEffect(() => {
    // 초기 로드: 기본 추천순 + 승인 작품만 노출(백엔드에서 보장)
    (async () => {
      setError(null);
      setIsLoading(true);
      try {
        await fetchPage(1, "replace");
      } catch (e) {
        setError(e instanceof Error ? e.message : "알 수 없는 오류가 발생했습니다.");
      } finally {
        setIsLoading(false);
      }
    })();
  }, [fetchPage]);

  return (
    <div className="mx-auto flex w-full max-w-[1440px] flex-col">
      {/* Navbar */}
      <nav className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-violet-200 bg-white/95 px-6 shadow-sm backdrop-blur">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-violet-100 text-violet-900">
            <Store className="h-5 w-5" />
          </div>
          <span className="text-xl font-bold text-violet-950">printtie</span>
        </div>

        <div className="hidden items-center gap-6 md:flex">
          <Link className="text-sm font-medium text-violet-700 hover:text-violet-900" href="/">홈</Link>
          <Link className="text-sm font-medium text-violet-700 hover:text-violet-900" href="/upload">작품 등록</Link>
          <Link className="text-sm font-semibold text-violet-900" href="/market">마켓</Link>
          <Link className="text-sm font-medium text-violet-700 hover:text-violet-900" href="/orders">주문/관리</Link>
          <Link className="text-sm font-medium text-violet-700 hover:text-violet-900" href="/support">정책·지원</Link>
          <Link className="text-sm font-medium text-violet-700 hover:text-violet-900" href="/login">로그인</Link>
        </div>

        <Button variant="secondary" className="text-violet-700" asChild>
          <Link href="/register">회원가입</Link>
        </Button>
      </nav>

      {/* Hero */}
      <section className="relative overflow-hidden px-6 py-12" data-section-type="hero">
        <HeroGradient className="absolute inset-0" />
        <div className="relative">
          <div className="flex w-full flex-col justify-between gap-6 lg:flex-row lg:items-center">
            <div>
              <h1 className="text-3xl font-bold text-white">마켓 — 작품 탐색</h1>
              <p className="mt-2 max-w-2xl text-white/80">
                카테고리 기반 카드 그리드로 아티스트 작품을 찾아보고, 필터·검색으로 원하는 작품을 빠르게 발견하세요.
              </p>
              <div className="mt-4 flex flex-wrap gap-2">
                <Badge variant="secondary" className="bg-white/15 text-white hover:bg-white/20">
                  승인된 작품만
                </Badge>
                <Badge variant="secondary" className="bg-white/15 text-white hover:bg-white/20">
                  인쇄·포장·배송 플랫폼 운영
                </Badge>
                <Badge variant="secondary" className="bg-white/15 text-white hover:bg-white/20">
                  규격 기반 가격 정책
                </Badge>
              </div>
            </div>

            <div className="flex w-full flex-col gap-3 lg:max-w-xl">
              <div className="flex w-full gap-2 rounded-xl border border-white/20 bg-white/10 p-2">
                <div className="flex flex-1 items-center gap-2 rounded-lg bg-white/10 px-3">
                  <Search className="h-4 w-4 text-white/80" />
                  <Input
                    value={qDraft}
                    onChange={(e) => setQDraft(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        setQ(qDraft);
                        runSearch();
                      }
                    }}
                    placeholder="작가명, 작품명, 태그로 검색"
                    className={cn(
                      "border-0 bg-transparent text-white placeholder:text-white/60",
                      "focus-visible:ring-0 focus-visible:ring-offset-0"
                    )}
                  />
                </div>
                <Button
                  className="bg-white/15 text-white hover:bg-white/20"
                  onClick={() => {
                    setQ(qDraft);
                    runSearch();
                  }}
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      검색 중
                    </>
                  ) : (
                    "검색"
                  )}
                </Button>

                <Sheet>
                  <SheetTrigger asChild>
                    <Button className="bg-white/15 text-white hover:bg-white/20" type="button">
                      <Filter className="mr-2 h-4 w-4" />
                      고급 필터
                    </Button>
                  </SheetTrigger>
                  <SheetContent side="right" className="w-full sm:max-w-lg">
                    <SheetHeader>
                      <SheetTitle>고급 필터</SheetTitle>
                      <SheetDescription>
                        MVP 범위에서는 가격 범위/정렬/카테고리로 빠르게 탐색합니다. (추후: 태그, 배송 옵션, 한정판 등)
                      </SheetDescription>
                    </SheetHeader>

                    <div className="mt-6 grid gap-5">
                      <div className="grid gap-2">
                        <Label htmlFor="price-min">가격 최소</Label>
                        <Input
                          id="price-min"
                          inputMode="numeric"
                          placeholder="예: 30000"
                          value={priceMin}
                          onChange={(e) => setPriceMin(e.target.value)}
                        />
                      </div>
                      <div className="grid gap-2">
                        <Label htmlFor="price-max">가격 최대</Label>
                        <Input
                          id="price-max"
                          inputMode="numeric"
                          placeholder="예: 80000"
                          value={priceMax}
                          onChange={(e) => setPriceMax(e.target.value)}
                        />
                      </div>

                      <Separator />

                      <div className="text-sm text-muted-foreground">
                        노출 정책: 승인 완료 작품만 노출됩니다. 저작권/품질 기준은 운영 검수에서 관리합니다.
                      </div>
                    </div>

                    <SheetFooter className="mt-8">
                      <SheetClose asChild>
                        <Button
                          onClick={() => {
                            // 현재 qDraft를 적용하지 않는 UX를 피하기 위해 qDraft -> q로 동기화
                            setQ(qDraft);
                            runSearch();
                          }}
                        >
                          필터 적용
                        </Button>
                      </SheetClose>
                    </SheetFooter>
                  </SheetContent>
                </Sheet>
              </div>

              <div className="flex flex-col gap-3 rounded-xl border border-white/20 bg-white/10 p-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex flex-wrap items-center gap-3">
                  <div className="flex items-center gap-2">
                    <Label className="text-white/90">카테고리</Label>
                    <select
                      className="h-10 rounded-lg border border-white/20 bg-white/10 px-3 text-sm text-white outline-none"
                      value={category}
                      onChange={(e) => {
                        setCategory(e.target.value);
                      }}
                    >
                      {CATEGORIES.map((c) => (
                        <option key={c.label} value={c.value} className="text-black">
                          {c.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="flex items-center gap-2">
                    <Label className="text-white/90">정렬</Label>
                    <select
                      className="h-10 rounded-lg border border-white/20 bg-white/10 px-3 text-sm text-white outline-none"
                      value={sortBy}
                      onChange={(e) => {
                        setSortBy(e.target.value);
                      }}
                    >
                      {SORTS.map((s) => (
                        <option key={s.value} value={s.value} className="text-black">
                          {s.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <Button
                  variant="secondary"
                  className="bg-white/15 text-white hover:bg-white/20"
                  onClick={() => {
                    setQ(qDraft);
                    runSearch();
                  }}
                  disabled={isLoading}
                >
                  <ArrowUpDown className="mr-2 h-4 w-4" />
                  적용
                </Button>
              </div>

              <div className="text-sm text-white/75">필터: 무료배송 없음 · 승인된 작품만</div>
            </div>
          </div>
        </div>
      </section>

      {/* Card Grid */}
      <section className="bg-white px-6 py-16 shadow-sm" data-section-type="card-grid">
        <div className="mb-6 flex w-full flex-col justify-between gap-3 sm:flex-row sm:items-end">
          <div>
            <h2 className="text-2xl font-bold text-violet-950">추천 작품</h2>
            <p className="text-sm text-violet-700">주요 카테고리별로 엄선된 작품들을 확인하세요.</p>
          </div>
          <div className="text-sm text-violet-700">
            검색결과 <span className="font-semibold text-violet-950">{totalCount.toLocaleString("ko-KR")}건</span>
          </div>
        </div>

        {error ? (
          <Card className="border-violet-100">
            <CardHeader>
              <CardTitle className="text-base">목록을 불러오지 못했습니다</CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground">{error}</CardContent>
            <CardFooter>
              <Button onClick={runSearch}>다시 시도</Button>
            </CardFooter>
          </Card>
        ) : null}

        <div className="grid w-full grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {items.map((art) => (
            <Card key={art.artwork_id} className="overflow-hidden border-violet-100 shadow-sm">
              <div className="relative h-44 w-full bg-muted">
                <Image
                  src={art.image_url}
                  alt={art.title}
                  fill
                  sizes="(max-width: 1024px) 50vw, 25vw"
                  className="object-cover"
                  unoptimized
                />
              </div>
              <CardHeader className="space-y-2">
                <CardTitle className="line-clamp-1 text-lg text-violet-950">{art.title}</CardTitle>
                <div className="flex flex-wrap gap-2">
                  <Badge variant="outline" className="border-violet-200 text-violet-800">
                    {art.category}
                  </Badge>
                  {(art.badges ?? []).slice(0, 2).map((b) => (
                    <Badge key={b} variant="secondary" className="bg-violet-50 text-violet-800">
                      {b}
                    </Badge>
                  ))}
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center gap-2 text-sm text-violet-700">
                  <Avatar className="h-7 w-7">
                    <AvatarFallback className="bg-violet-100 text-violet-800">
                      {art.artist_name.slice(0, 1)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="truncate">아티스트: {art.artist_name}</div>
                </div>
                <div className="text-sm text-muted-foreground line-clamp-2">{art.subtitle}</div>
              </CardContent>
              <CardFooter className="flex items-center justify-between">
                <div className="flex flex-col">
                  <span className="font-semibold text-violet-950">{formatKRW(art.price)}</span>
                  <span className="text-xs text-violet-700">프린트 제작 가능 · 즉시 구매</span>
                </div>
                <Button variant="outline" className="border-violet-200 text-violet-950" asChild>
                  <Link href={`/artworks/${encodeURIComponent(art.artwork_id)}`}>상세보기</Link>
                </Button>
              </CardFooter>
            </Card>
          ))}

          {isLoading && items.length === 0 ? (
            <div className="col-span-full">
              <Card className="border-violet-100">
                <CardContent className="flex items-center gap-3 py-10 text-sm text-muted-foreground">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  작품 목록을 불러오는 중…
                </CardContent>
              </Card>
            </div>
          ) : null}
        </div>

        <div className="mt-8 flex w-full justify-center">
          <Button
            variant="outline"
            className="border-violet-200 text-violet-950"
            onClick={loadMore}
            disabled={!hasMore || isLoadingMore}
          >
            {isLoadingMore ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                불러오는 중
              </>
            ) : hasMore ? (
              "더 보기"
            ) : (
              "마지막 페이지"
            )}
          </Button>
        </div>
      </section>

      {/* Features */}
      <section className="bg-violet-50 px-6 py-16" data-section-type="features">
        <div className="mx-auto max-w-5xl text-center">
          <h2 className="text-3xl font-bold text-violet-950">주요 기능</h2>
          <p className="mt-2 text-violet-700">구매자가 작품을 쉽게 발견하고 주문할 수 있도록 돕는 기능들</p>
        </div>

        <div className="mx-auto mt-8 grid max-w-5xl grid-cols-1 gap-6 md:grid-cols-3">
          <Card className="border-violet-100">
            <CardHeader className="items-center text-center">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white shadow-sm">
                <Filter className="h-5 w-5 text-violet-700" />
              </div>
              <CardTitle className="mt-4 text-xl text-violet-950">카테고리 필터</CardTitle>
            </CardHeader>
            <CardContent className="text-center text-sm text-violet-700">
              카테고리·태그·가격대별 필터로 관심 작품만 빠르게 탐색
            </CardContent>
          </Card>

          <Card className="border-violet-100">
            <CardHeader className="items-center text-center">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white shadow-sm">
                <ShieldCheck className="h-5 w-5 text-violet-700" />
              </div>
              <CardTitle className="mt-4 text-xl text-violet-950">작품 상태 표시</CardTitle>
            </CardHeader>
            <CardContent className="text-center text-sm text-violet-700">
              승인 완료, 한정판, 즉시 제작 가능 등 상태를 명확히 표시
            </CardContent>
          </Card>

          <Card className="border-violet-100">
            <CardHeader className="items-center text-center">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white shadow-sm">
                <CreditCard className="h-5 w-5 text-violet-700" />
              </div>
              <CardTitle className="mt-4 text-xl text-violet-950">빠른 결제 연동</CardTitle>
            </CardHeader>
            <CardContent className="text-center text-sm text-violet-700">
              장바구니→결제 흐름을 단축해 구매전환율을 높입니다
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Pricing */}
      <section className="bg-white px-6 py-16" data-section-type="pricing">
        <div className="mx-auto max-w-5xl text-center">
          <h2 className="text-3xl font-bold text-violet-950">가격 정책</h2>
          <p className="mt-2 text-violet-700">작품별 판매 수수료와 제작 옵션 안내</p>
        </div>

        <div className="mx-auto mt-8 grid max-w-5xl grid-cols-1 gap-6 md:grid-cols-2">
          <Card className="border-violet-100">
            <CardHeader>
              <CardTitle className="text-xl text-violet-950">기본 판매</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-3xl font-bold text-violet-950">
                수수료 10%<span className="text-lg font-medium text-violet-700"> · 제작비 별도</span>
              </div>
              <div className="space-y-2 text-sm text-violet-950">
                <div>작품당 커미션: 10%</div>
                <div>승인 처리: 평균 24시간 내</div>
                <div>환불 정책: 구매일로부터 7일 이내</div>
              </div>
            </CardContent>
            <CardFooter>
              <Button variant="outline" className="border-violet-200 text-violet-950" asChild>
                <Link href="/support/pricing">수수료 상세보기</Link>
              </Button>
            </CardFooter>
          </Card>

          <Card className="border-violet-100">
            <CardHeader>
              <CardTitle className="text-xl text-violet-950">프리미엄 제작 옵션</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-3xl font-bold text-violet-950">
                제작비 별도<span className="text-lg font-medium text-violet-700"> · 견적별도</span>
              </div>
              <div className="space-y-2 text-sm text-violet-950">
                <div>고품질 인쇄 옵션 제공</div>
                <div>대량 주문 시 할인 제공</div>
                <div>배송 추적·보증 포함</div>
              </div>
            </CardContent>
            <CardFooter className="flex flex-wrap gap-2">
              <Button variant="outline" className="border-violet-200 text-violet-950" asChild>
                <Link href="/support/quote">견적 요청</Link>
              </Button>
              <Button variant="secondary" className="text-violet-700" asChild>
                <Link href="/support/shipping">배송·SLA 안내</Link>
              </Button>
            </CardFooter>
          </Card>
        </div>
      </section>

      {/* Testimonials */}
      <section className="bg-violet-50 px-6 py-16" data-section-type="testimonials">
        <div className="mx-auto max-w-5xl text-center">
          <h2 className="text-3xl font-bold text-violet-950">구매자 리뷰</h2>
          <p className="mt-2 text-violet-700">실제 구매자들이 남긴 후기와 평가</p>
        </div>

        <div className="mx-auto mt-8 grid max-w-5xl grid-cols-1 gap-6 md:grid-cols-2">
          <Card className="border-violet-100">
            <CardContent className="space-y-4 pt-6">
              <p className="text-violet-950">
                "작품 설명과 인쇄 품질이 기대 이상이었어요. 배송도 빠르게 처리되었습니다."
              </p>
              <div className="flex items-center gap-3">
                <Avatar>
                  <AvatarFallback className="bg-violet-100 text-violet-800">김</AvatarFallback>
                </Avatar>
                <div className="flex flex-col">
                  <span className="text-sm font-semibold text-violet-950">김민지</span>
                  <span className="text-xs text-violet-700">구매자 · 3일 전</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-violet-100">
            <CardContent className="space-y-4 pt-6">
              <p className="text-violet-950">
                "작가와의 커뮤니케이션이 원활했고 맞춤 제작도 친절히 안내받았습니다."
              </p>
              <div className="flex items-center gap-3">
                <Avatar>
                  <AvatarFallback className="bg-violet-100 text-violet-800">오</AvatarFallback>
                </Avatar>
                <div className="flex flex-col">
                  <span className="text-sm font-semibold text-violet-950">오준호</span>
                  <span className="text-xs text-violet-700">구매자 · 2주 전</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="mx-auto mt-10 flex max-w-5xl items-center justify-center gap-2 text-sm text-violet-700">
          <Truck className="h-4 w-4" />
          결제완료 → 인쇄 → 포장 → 배송까지, 운영 프로세스 표준화로 SLA를 지킵니다.
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white px-6 py-12" data-section-type="footer">
        <div className="flex flex-col justify-between gap-8 md:flex-row">
          <div className="flex flex-col gap-2">
            <span className="text-lg font-bold text-violet-950">printtie</span>
            <p className="text-sm text-violet-700">© 2026 printtie Inc. All rights reserved.</p>
          </div>
          <div className="grid grid-cols-2 gap-8 sm:grid-cols-4">
            <div className="flex flex-col gap-2">
              <p className="text-sm font-semibold text-gray-700">회사</p>
              <Link className="text-sm text-violet-700 hover:text-violet-900" href="/about">소개</Link>
              <Link className="text-sm text-violet-700 hover:text-violet-900" href="/careers">채용</Link>
              <Link className="text-sm text-violet-700 hover:text-violet-900" href="/press">보도자료</Link>
            </div>
            <div className="flex flex-col gap-2">
              <p className="text-sm font-semibold text-gray-700">서비스</p>
              <Link className="text-sm text-violet-700 hover:text-violet-900" href="/upload">작품 등록</Link>
              <Link className="text-sm text-violet-700 hover:text-violet-900" href="/support/pricing">가격 안내</Link>
              <Link className="text-sm text-violet-700 hover:text-violet-900" href="/support/operations">주문 처리 흐름</Link>
            </div>
            <div className="flex flex-col gap-2">
              <p className="text-sm font-semibold text-gray-700">지원</p>
              <Link className="text-sm text-violet-700 hover:text-violet-900" href="/support/faq">자주 묻는 질문</Link>
              <Link className="text-sm text-violet-700 hover:text-violet-900" href="/support/contact">문의하기</Link>
              <Link className="text-sm text-violet-700 hover:text-violet-900" href="/support/policies">정책(환불/저작권)</Link>
            </div>
            <div className="flex flex-col gap-2">
              <p className="text-sm font-semibold text-gray-700">파트너</p>
              <Link className="text-sm text-violet-700 hover:text-violet-900" href="/partners/api">API/통합</Link>
              <Link className="text-sm text-violet-700 hover:text-violet-900" href="/partners/shipping">배송 파트너</Link>
              <Link className="text-sm text-violet-700 hover:text-violet-900" href="/partners/printing">인쇄 파트너</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
