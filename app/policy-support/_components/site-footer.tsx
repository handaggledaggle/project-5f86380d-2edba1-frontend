import { Separator } from "@/components/ui/separator";

export function SiteFooter() {
  return (
    <footer className="bg-white">
      <Separator className="bg-[#DDD6FE]" />
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-10 px-6 py-12 md:flex-row md:items-start md:justify-between">
        <div className="flex flex-col gap-2">
          <span className="text-lg font-bold text-gray-900">printtie</span>
          <p className="text-sm text-[#6D28D9]">© 2026 printtie Inc. All rights reserved.</p>
        </div>

        <div className="grid gap-8 sm:grid-cols-2 md:grid-cols-4 md:gap-12">
          <div className="flex flex-col gap-2">
            <p className="font-semibold text-gray-700">회사</p>
            <p className="text-sm text-[#6D28D9]">소개</p>
            <p className="text-sm text-[#6D28D9]">채용</p>
            <p className="text-sm text-[#6D28D9]">보도자료</p>
          </div>
          <div className="flex flex-col gap-2">
            <p className="font-semibold text-gray-700">서비스</p>
            <p className="text-sm text-[#6D28D9]">작품 등록</p>
            <p className="text-sm text-[#6D28D9]">가격 안내</p>
            <p className="text-sm text-[#6D28D9]">주문 처리 흐름</p>
          </div>
          <div className="flex flex-col gap-2">
            <p className="font-semibold text-gray-700">지원</p>
            <p className="text-sm text-[#6D28D9]">자주 묻는 질문</p>
            <p className="text-sm text-[#6D28D9]">문의하기</p>
            <p className="text-sm text-[#6D28D9]">정책(환불/저작권)</p>
          </div>
          <div className="flex flex-col gap-2">
            <p className="font-semibold text-gray-700">파트너</p>
            <p className="text-sm text-[#6D28D9]">API/통합</p>
            <p className="text-sm text-[#6D28D9]">배송 파트너</p>
            <p className="text-sm text-[#6D28D9]">인쇄 파트너</p>
          </div>
        </div>
      </div>
    </footer>
  );
}
