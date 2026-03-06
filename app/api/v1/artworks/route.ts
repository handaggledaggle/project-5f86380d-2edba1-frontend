import { NextResponse } from "next/server";

type ArtworkSummary = {
  artwork_id: string;
  title: string;
  artist_name: string;
  category: "일러스트" | "포스터" | "사진" | "디지털아트";
  price: number;
  subtitle: string;
  image_url: string;
  badges?: string[];
  created_at: string; // ISO
};

type ArtworkListResponse = {
  items: Omit<ArtworkSummary, "created_at">[];
  total_count: number;
  page: number;
  page_size: number;
};

const seed: ArtworkSummary[] = [
  {
    artwork_id: "art_001",
    title: "봄빛 일러스트",
    artist_name: "김소연",
    category: "일러스트",
    price: 45000,
    subtitle: "따뜻한 봄의 색감을 담은 일러스트 — 거실/서재 인테리어에 추천",
    image_url: "https://picsum.photos/seed/printtie-art-001/800/600",
    badges: ["프린트 가능", "즉시 구매"],
    created_at: "2026-03-04T10:00:00.000Z",
  },
  {
    artwork_id: "art_002",
    title: "모노톤 도시 사진",
    artist_name: "박준형",
    category: "사진",
    price: 32000,
    subtitle: "검은 도시의 질감과 대비를 강조한 모노톤 스트리트 포토",
    image_url: "https://picsum.photos/seed/printtie-art-002/800/600",
    badges: ["한정판", "승인 완료"],
    created_at: "2026-03-01T12:00:00.000Z",
  },
  {
    artwork_id: "art_003",
    title: "레트로 포스터 세트",
    artist_name: "이지훈",
    category: "포스터",
    price: 78000,
    subtitle: "레트로 무드 3종 세트 — 시리즈로 연출하기 좋은 포스터 구성",
    image_url: "https://picsum.photos/seed/printtie-art-003/800/600",
    badges: ["세트 할인"],
    created_at: "2026-02-25T09:00:00.000Z",
  },
  {
    artwork_id: "art_004",
    title: "디지털 추상 작품",
    artist_name: "한예린",
    category: "디지털아트",
    price: 60000,
    subtitle: "선과 면의 리듬이 돋보이는 추상 디지털아트 — 포인트 월에 적합",
    image_url: "https://picsum.photos/seed/printtie-art-004/800/600",
    badges: ["상업 이용 가능"],
    created_at: "2026-02-20T15:00:00.000Z",
  },
  {
    artwork_id: "art_005",
    title: "여름 바다 포스터",
    artist_name: "정하늘",
    category: "포스터",
    price: 52000,
    subtitle: "청량한 컬러의 바다 풍경 — A3 추천",
    image_url: "https://picsum.photos/seed/printtie-art-005/800/600",
    badges: ["프린트 가능"],
    created_at: "2026-03-05T08:30:00.000Z",
  },
  {
    artwork_id: "art_006",
    title: "골목의 오후",
    artist_name: "윤태호",
    category: "사진",
    price: 39000,
    subtitle: "빛과 그림자가 만드는 고요한 골목의 순간",
    image_url: "https://picsum.photos/seed/printtie-art-006/800/600",
    badges: ["승인 완료"],
    created_at: "2026-02-18T11:00:00.000Z",
  },
  {
    artwork_id: "art_007",
    title: "라인 드로잉 — 식물",
    artist_name: "최나래",
    category: "일러스트",
    price: 28000,
    subtitle: "미니멀 라인 드로잉 시리즈 — 세로 프레임 추천",
    image_url: "https://picsum.photos/seed/printtie-art-007/800/600",
    badges: ["미니멀"],
    created_at: "2026-02-10T09:40:00.000Z",
  },
  {
    artwork_id: "art_008",
    title: "네온 나이트",
    artist_name: "서지수",
    category: "디지털아트",
    price: 67000,
    subtitle: "네온 컬러로 재해석한 밤의 도시 — 강한 색감을 선호하는 공간에",
    image_url: "https://picsum.photos/seed/printtie-art-008/800/600",
    badges: ["컬러 강함"],
    created_at: "2026-02-28T13:10:00.000Z",
  },
];

// 목록이 비어보이지 않도록 seed를 확장(결정론적)
const ALL: ArtworkSummary[] = Array.from({ length: 32 }).map((_, idx) => {
  const base = seed[idx % seed.length];
  const n = idx + 1;
  return {
    ...base,
    artwork_id: `${base.artwork_id}_${String(n).padStart(2, "0")}`,
    title: idx < seed.length ? base.title : `${base.title} #${n}`,
    price: Math.max(18000, base.price + ((idx % 7) - 3) * 3500),
    image_url: `https://picsum.photos/seed/printtie-art-${encodeURIComponent(base.artwork_id)}-${n}/800/600`,
    created_at: new Date(Date.parse(base.created_at) + idx * 36e5).toISOString(),
  };
});

function toInt(value: string | null, fallback: number) {
  if (!value) return fallback;
  const n = Number(value);
  if (!Number.isFinite(n)) return fallback;
  return Math.trunc(n);
}

function clamp(n: number, min: number, max: number) {
  return Math.min(max, Math.max(min, n));
}

export async function GET(req: Request) {
  const url = new URL(req.url);

  const page = clamp(toInt(url.searchParams.get("page"), 1), 1, 10_000);
  const pageSize = clamp(toInt(url.searchParams.get("page_size"), 8), 1, 40);

  const q = (url.searchParams.get("q") ?? "").trim().toLowerCase();
  const category = (url.searchParams.get("category") ?? "").trim();
  const sortBy = (url.searchParams.get("sort_by") ?? "recommended").trim();

  const priceMin = toInt(url.searchParams.get("price_min"), Number.NEGATIVE_INFINITY);
  const priceMax = toInt(url.searchParams.get("price_max"), Number.POSITIVE_INFINITY);

  // MVP 정책: 승인된 작품만 노출(여기서는 샘플 데이터 전부 승인으로 간주)
  let filtered = ALL.slice();

  if (q) {
    filtered = filtered.filter((a) => {
      const hay = `${a.title} ${a.artist_name} ${(a.badges ?? []).join(" ")} ${a.category}`.toLowerCase();
      return hay.includes(q);
    });
  }

  if (category) {
    filtered = filtered.filter((a) => a.category === category);
  }

  filtered = filtered.filter((a) => a.price >= priceMin && a.price <= priceMax);

  switch (sortBy) {
    case "latest":
      filtered.sort((a, b) => (a.created_at < b.created_at ? 1 : -1));
      break;
    case "price_asc":
      filtered.sort((a, b) => a.price - b.price);
      break;
    case "price_desc":
      filtered.sort((a, b) => b.price - a.price);
      break;
    case "recommended":
    default:
      // 추천순(샘플): 가격과 생성시각을 섞은 결정론적 정렬
      filtered.sort((a, b) => {
        const scoreA = (a.price % 97) + Date.parse(a.created_at) / 1e11;
        const scoreB = (b.price % 97) + Date.parse(b.created_at) / 1e11;
        return scoreB - scoreA;
      });
      break;
  }

  const totalCount = filtered.length;
  const start = (page - 1) * pageSize;
  const end = start + pageSize;
  const pageItems = filtered.slice(start, end).map(({ created_at: _createdAt, ...rest }) => rest);

  const body: ArtworkListResponse = {
    items: pageItems,
    total_count: totalCount,
    page,
    page_size: pageSize,
  };

  return NextResponse.json(body, {
    status: 200,
    headers: {
      "Cache-Control": "no-store",
    },
  });
}
