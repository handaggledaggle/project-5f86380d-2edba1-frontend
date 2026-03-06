import Link from "next/link";
import { Suspense } from "react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { ArtworkDetailClient } from "./_components/artwork-detail-client";

export default async function ArtworkDetailPage({
  params,
}: {
  params: Promise<{ artworkId: string }>;
}) {
  const { artworkId } = await params;

  return (
    <div className="mx-auto w-full max-w-[1440px]">
      <nav className="flex h-16 items-center justify-between border-b border-[#DDD6FE] bg-white px-8 shadow-sm">
        <Link href="/" className="text-xl font-bold text-[#4C1D95]">
          printtie
        </Link>

        <div className="hidden items-center gap-6 text-[#6D28D9] md:flex">
          <Link href="/" className="text-[#6D28D9] hover:underline">
            홈
          </Link>
          <Link href="/artworks/new" className="text-[#6D28D9] hover:underline">
            작품 등록
          </Link>
          <Link href="/market" className="text-[#6D28D9] hover:underline">
            마켓
          </Link>
          <Link href="/orders" className="text-[#6D28D9] hover:underline">
            주문/관리
          </Link>
          <Link href="/policies" className="text-[#6D28D9] hover:underline">
            정책·지원
          </Link>
          <Link href="/login" className="text-[#6D28D9] hover:underline">
            로그인
          </Link>
        </div>

        <Button variant="secondary" className="bg-gray-100 text-[#6D28D9] hover:bg-gray-200">
          Sign Up
        </Button>
      </nav>

      <main className="flex flex-col gap-12 bg-gray-50 px-8 py-10">
        <Suspense
          fallback={
            <div className="rounded-lg border border-[#DDD6FE] bg-white p-6 shadow-sm">
              <div className="h-6 w-56 animate-pulse rounded bg-gray-200" />
              <Separator className="my-4" />
              <div className="h-96 w-full animate-pulse rounded bg-gray-200" />
            </div>
          }
        >
          <ArtworkDetailClient artworkId={artworkId} />
        </Suspense>
      </main>

      <footer className="flex flex-col justify-between gap-8 bg-white px-8 py-12 md:flex-row">
        <div className="flex flex-col gap-2">
          <span className="text-lg font-bold text-gray-900">printtie</span>
          <p className="text-sm text-[#6D28D9]">© 2026 printtie Inc. All rights reserved.</p>
        </div>

        <div className="grid grid-cols-2 gap-10 md:flex md:gap-12">
          <div className="flex flex-col gap-2">
            <p className="font-semibold text-gray-900">회사</p>
            <Link href="/company" className="text-sm text-[#6D28D9] hover:underline">
              소개
            </Link>
            <Link href="/careers" className="text-sm text-[#6D28D9] hover:underline">
              채용
            </Link>
            <Link href="/press" className="text-sm text-[#6D28D9] hover:underline">
              보도자료
            </Link>
          </div>

          <div className="flex flex-col gap-2">
            <p className="font-semibold text-gray-900">서비스</p>
            <Link href="/artworks/new" className="text-sm text-[#6D28D9] hover:underline">
              작품 등록
            </Link>
            <Link href="/pricing" className="text-sm text-[#6D28D9] hover:underline">
              가격 안내
            </Link>
            <Link href="/orders/flow" className="text-sm text-[#6D28D9] hover:underline">
              주문 처리 흐름
            </Link>
          </div>

          <div className="flex flex-col gap-2">
            <p className="font-semibold text-gray-900">지원</p>
            <Link href="/faq" className="text-sm text-[#6D28D9] hover:underline">
              자주 묻는 질문
            </Link>
            <Link href="/support" className="text-sm text-[#6D28D9] hover:underline">
              문의하기
            </Link>
            <Link href="/policies" className="text-sm text-[#6D28D9] hover:underline">
              정책(환불/저작권)
            </Link>
          </div>

          <div className="flex flex-col gap-2">
            <p className="font-semibold text-gray-900">개발자/파트너</p>
            <Link href="/partners/api" className="text-sm text-[#6D28D9] hover:underline">
              API/통합
            </Link>
            <Link href="/partners/shipping" className="text-sm text-[#6D28D9] hover:underline">
              배송 파트너
            </Link>
            <Link href="/partners/print" className="text-sm text-[#6D28D9] hover:underline">
              인쇄 파트너
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
