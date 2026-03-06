import { NextResponse } from "next/server";

export const runtime = "nodejs";

function makeMockArtwork(artworkId: string) {
  // NOTE: MVP 데모용 목 데이터 (DB 연동 전)
  return {
    artwork_id: artworkId,
    title: "달빛 정원",
    description:
      "아마추어 아티스트도 손쉽게 작품을 등록하고, 플랫폼이 인쇄·포장·배송을 표준화해 판매할 수 있도록 설계된 데모 상세 페이지입니다.",
    artist: {
      artist_id: "artist_001",
      name: "김아티스트",
    },
    release_date: "2026-02-12",
    view_count: 3248,
    images: [
      {
        id: "img_main",
        url: "https://placehold.co/720x520/png?text=%EC%9E%91%ED%92%88+%EB%AF%B8%EB%A6%AC%EB%B3%B4%EA%B8%B0",
        alt: "작품 미리보기",
        width: 720,
        height: 520,
      },
      {
        id: "img_1",
        url: "https://placehold.co/320x224/png?text=%EC%83%98%ED%94%8C+1",
        alt: "샘플 1",
        width: 320,
        height: 224,
      },
      {
        id: "img_2",
        url: "https://placehold.co/320x224/png?text=%EC%83%98%ED%94%8C+2",
        alt: "샘플 2",
        width: 320,
        height: 224,
      },
      {
        id: "img_3",
        url: "https://placehold.co/320x224/png?text=%EC%83%98%ED%94%8C+3",
        alt: "샘플 3",
        width: 320,
        height: 224,
      },
      {
        id: "img_4",
        url: "https://placehold.co/320x224/png?text=%ED%94%84%EB%A6%B0%ED%8A%B8+%EC%83%98%ED%94%8C+%EC%95%88%EB%82%B4",
        alt: "프린트 샘플 안내",
        width: 320,
        height: 224,
      },
    ],
    purchase_options: {
      sizes: [
        { id: "A4", label: "A4 (210×297mm)", hint: "가성비 좋은 기본 규격" },
        { id: "A3", label: "A3 (297×420mm)", hint: "권장: 선명도와 존재감이 좋아요" },
        { id: "30x40", label: "30x40cm", hint: "액자 활용에 무난한 비율" },
      ],
      materials: [
        { id: "MATTE", label: "무광 아트지", hint: "반사가 적어 감상용에 적합" },
        { id: "GLOSSY", label: "유광 아트지", hint: "선명한 대비와 광택감" },
        { id: "CANVAS", label: "캔버스", hint: "두께감 있는 질감, 인테리어용" },
      ],
      default_size_id: "A4",
      default_material_id: "MATTE",
    },
  };
}

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ artworkId: string }> }
) {
  const { artworkId } = await params;

  if (!artworkId || typeof artworkId !== "string") {
    return NextResponse.json({ message: "Invalid artworkId" }, { status: 400 });
  }

  // MVP: 승인된 작품만 노출한다는 가정. (실서비스: DB에서 status=APPROVED 필터)
  // 데모에서는 어떤 ID든 동일한 목 데이터 반환.
  const payload = makeMockArtwork(artworkId);

  return NextResponse.json(payload, {
    status: 200,
    headers: {
      "Cache-Control": "no-store",
    },
  });
}
