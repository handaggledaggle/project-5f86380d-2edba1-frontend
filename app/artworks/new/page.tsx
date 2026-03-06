import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

export default function Page() {
  return (
    <div className="w-[1440px] mx-auto flex flex-col">
      <Navbar />

      <Hero />

      <FeaturesSection />

      <GallerySection />

      <ArtworkStartFormSection />

      <FaqSection />

      <Footer />
    </div>
  );
}

function Navbar() {
  const navLinkClass = "text-[#6D28D9]";

  return (
    <nav
      className="h-16 bg-white border-b border-[#DDD6FE] shadow-sm flex items-center justify-between px-8"
      data-section-type="navbar"
    >
      <span className="text-xl font-bold text-[#4C1D95]">printtie</span>
      <div className="flex gap-6">
        <Link href="#" className={navLinkClass}>
          홈
        </Link>
        <Link href="#" className={navLinkClass}>
          작품 등록
        </Link>
        <Link href="#" className={navLinkClass}>
          마켓
        </Link>
        <Link href="#" className={navLinkClass}>
          주문/관리
        </Link>
        <Link href="#" className={navLinkClass}>
          정책·지원
        </Link>
        <Link href="#" className={navLinkClass}>
          로그인
        </Link>
      </div>
      <Button className="bg-gray-100 text-[#6D28D9] rounded-lg px-4 py-2 hover:bg-gray-200">
        회원가입
      </Button>
    </nav>
  );
}

function Hero() {
  return (
    <section
      data-section-type="hero"
      className="flex flex-col items-start py-14 px-12 bg-gradient-to-br from-[#7C3AED] to-[#A78BFA]"
    >
      <div className="max-w-3xl">
        <h1 className="text-4xl font-bold text-white">작품 등록 가이드</h1>
        <p className="mt-4 text-white/70 text-lg">
          파일 업로드에서 자동 규격 추천·가격 산정까지 — 처음 등록하는 작가를 위한 단계별
          안내입니다. 업로드 전 요구사항과 예상 수수료, 승인 기준을 미리 확인하세요.
        </p>

        <div className="flex gap-4 mt-6">
          <Button
            className={cn(
              "bg-gradient-to-br from-[#7C3AED] to-[#A78BFA] text-white/90",
              "border border-white/30 rounded-lg px-5 py-3 shadow-none hover:opacity-95"
            )}
          >
            빠른 시작
          </Button>
          <Button
            className={cn(
              "bg-gradient-to-br from-[#7C3AED] to-[#A78BFA] text-white/90",
              "rounded-lg px-5 py-3 shadow-none hover:opacity-95"
            )}
          >
            등록 절차 보기
          </Button>
        </div>

        <Card
          data-component="card"
          className={cn(
            "mt-6 p-4 rounded-lg",
            "bg-gradient-to-br from-[#7C3AED] to-[#A78BFA]",
            "border border-white/20"
          )}
        >
          <h4 className="text-white font-semibold">주요 KPI (운영 참고)</h4>
          <div className="mt-3 text-white/70 text-sm flex flex-col gap-2">
            <div>주간 신규 작가 가입 수, 작품 등록 완료 수(업로드→승인 완료 기준)</div>
            <div>작품 승인율/반려율, 작품당 평균 등록 소요시간</div>
            <div>
              플랫폼 매출 지표(주문·환불·결제 실패 등)은 승인·노출 전 예측에 영향을
              줍니다
            </div>
          </div>
        </Card>
      </div>
    </section>
  );
}

function FeaturesSection() {
  return (
    <section
      data-section-type="features"
      className="flex flex-col items-center py-20 px-8 bg-white shadow-lg"
    >
      <h2 className="text-3xl font-bold text-[#4C1D95]">주요 기능 안내</h2>
      <p className="text-lg text-[#6D28D9] mt-2">등록 전에 알아야 할 자동화 도구와 검수 기준</p>

      <div className="flex gap-8 mt-8">
        <FeatureCard
          title="자동 규격 추천"
          description="업로드한 이미지의 해상도/비율을 분석해 인쇄 가능한 규격과 권장 여백을 제시합니다. 규격 미준수 시 수정 안내를 제공합니다."
        />
        <FeatureCard
          title="실시간 가격 산정"
          description="선택한 규격과 재질, 인쇄 옵션에 따라 예상 판매가 및 작가 정산액(수수료 반영)을 즉시 보여줍니다."
        />
        <FeatureCard
          title="검수 체크리스트"
          description="저작권/품질 기준, 금지 이미지 목록, 권장 파일 포맷 및 명칭 규칙을 등록 전 단계에서 확인할 수 있습니다."
        />
      </div>
    </section>
  );
}

function FeatureCard({ title, description }: { title: string; description: string }) {
  return (
    <Card
      data-component="card"
      className="flex flex-col items-start p-6 bg-[#FFFFFF] rounded-xl border border-[#DDD6FE] shadow-none"
    >
      <div className="w-12 h-12 bg-gray-200 rounded-lg" />
      <h3 className="text-xl font-semibold text-[#4C1D95] mt-4">{title}</h3>
      <p className="text-[#6D28D9] mt-2">{description}</p>
    </Card>
  );
}

function GallerySection() {
  return (
    <section
      data-section-type="gallery"
      className="flex flex-col items-center py-16 px-8 bg-[#FAF5FF]"
    >
      <h2 className="text-3xl font-bold text-[#4C1D95]">등록 예시 갤러리</h2>
      <p className="text-[#6D28D9] mt-2">다양한 작품 유형별 권장 규격과 메타 정보 예시</p>

      <div className="flex gap-4 mt-6">
        <GalleryCard
          title="포스터 — A2 권장"
          meta="카테고리: 일러스트 · 태그: 미니멀,포스터"
        />
        <GalleryCard
          title="캔버스 아트 — 정사각형 추천"
          meta="카테고리: 회화 · 태그: 캔버스,원화"
        />
        <GalleryCard title="엽서 세트 — 100x148mm" meta="카테고리: 굿즈 · 태그: 엽서,세트" />
      </div>
    </section>
  );
}

function GalleryCard({ title, meta }: { title: string; meta: string }) {
  return (
    <Card
      data-component="card"
      className={cn(
        "w-80 h-60 bg-white shadow-lg rounded-lg border border-[#DDD6FE]",
        "flex flex-col overflow-hidden"
      )}
    >
      <div className="w-full h-40 bg-gray-200" />
      <div className="p-3">
        <div className="text-sm text-[#4C1D95] font-semibold">{title}</div>
        <div className="text-xs text-[#6D28D9] mt-1">{meta}</div>
      </div>
    </Card>
  );
}

function ArtworkStartFormSection() {
  return (
    <section
      data-section-type="form"
      className="flex flex-col items-center py-20 px-8 bg-white shadow-lg"
    >
      <Card
        data-component="card"
        className="flex flex-col p-8 bg-[#FFFFFF] rounded-xl border border-[#DDD6FE] w-full max-w-3xl shadow-none"
      >
        <h2 className="text-2xl font-bold text-[#4C1D95]">작품 등록 시작하기</h2>
        <p className="text-[#6D28D9] mt-2">
          업로드 전 체크리스트를 확인하고, 메타정보 입력 및 자동 규격/가격 추천을 한번에
          확인하세요.
        </p>

        <div className="mt-6 flex flex-col gap-4">
          <div className="flex gap-4">
            <div className="flex-1 flex flex-col gap-1">
              <Label className="text-sm text-[#4C1D95]">작품 파일 (PNG/JPG/PSD)</Label>
              <div
                className="h-40 bg-white shadow-lg border border-[#DDD6FE] rounded-lg flex items-center justify-center text-[#6D28D9]"
                data-component="uploader"
              >
                여기에 파일을 끌어다 놓거나 선택하세요
              </div>
              <p className="text-xs text-[#6D28D9] mt-1">
                권장 해상도: 300 DPI 이상 · 최대 200MB
              </p>
            </div>

            <Card
              data-component="card"
              className="w-80 p-4 bg-white shadow-lg border border-[#DDD6FE] rounded-lg shadow-none"
            >
              <h4 className="text-[#4C1D95] font-semibold">자동 추천 (샘플)</h4>
              <div className="mt-3 text-[#6D28D9] text-sm flex flex-col gap-2">
                <div>권장 규격: A2 (420×594 mm)</div>
                <div>예상 판매가: 25,000원</div>
                <div>예상 작가 정산액: 17,500원 (수수료 30% 가정)</div>
              </div>
            </Card>
          </div>

          <div className="flex gap-4">
            <div className="flex-1 flex flex-col gap-1">
              <Label className="text-sm text-[#4C1D95]">제목</Label>
              <Input
                className="h-10 bg-white shadow-lg border border-[#DDD6FE] rounded-lg px-3 text-[#4C1D95]"
                placeholder="작품 제목을 입력하세요"
              />
            </div>

            <div className="w-72 flex flex-col gap-1">
              <Label className="text-sm text-[#4C1D95]">카테고리</Label>
              <div className="h-10 bg-white shadow-lg border border-[#DDD6FE] rounded-lg px-3 flex items-center text-[#4C1D95]">
                일러스트
              </div>
            </div>

            <div className="w-72 flex flex-col gap-1">
              <Label className="text-sm text-[#4C1D95]">태그 (콤마로 구분)</Label>
              <Input
                className="h-10 bg-white shadow-lg border border-[#DDD6FE] rounded-lg px-3 text-[#4C1D95]"
                placeholder="예: 미니멀,포스터"
              />
            </div>
          </div>

          <div className="flex gap-4">
            <div className="flex-1 flex flex-col gap-1">
              <Label className="text-sm text-[#4C1D95]">작품 설명</Label>
              <textarea
                className="h-28 bg-white shadow-lg border border-[#DDD6FE] rounded-lg p-3 text-[#4C1D95] placeholder:text-[#4C1D95]/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#DDD6FE]"
                placeholder="작품에 대한 설명, 제작 의도, 사용된 재료 등을 입력하세요"
              />
            </div>

            <Card
              data-component="card"
              className="w-72 p-4 bg-white shadow-lg border border-[#DDD6FE] rounded-lg shadow-none"
            >
              <h4 className="text-[#4C1D95] font-semibold">검수 가이드</h4>
              <ul className="text-[#6D28D9] text-sm mt-2 space-y-1">
                <li>저작권이 확인된 이미지만 등록하세요.</li>
                <li>금지 콘텐츠(음란·혐오·불법)는 반려됩니다.</li>
                <li>파일명에 한글 특수문자 사용을 피하세요.</li>
              </ul>
            </Card>
          </div>

          <div className="flex justify-between items-center mt-4">
            <div className="text-sm text-[#6D28D9]">
              등록 예상 소요시간: 파일 준비 2분 · 메타 입력 3분 · 검수 평균 1~3영업일
            </div>
            <div className="flex gap-3">
              <Button className="bg-white shadow-lg text-[#4C1D95] border border-[#DDD6FE] rounded-lg px-5 py-3 hover:bg-[#FAF5FF]">
                임시저장
              </Button>
              <Button className="bg-[#FFFFFF] text-[#4C1D95] rounded-lg px-6 py-3 shadow-none hover:bg-[#FAF5FF]">
                등록 요청
              </Button>
            </div>
          </div>
        </div>
      </Card>
    </section>
  );
}

function FaqSection() {
  return (
    <section
      data-section-type="faq"
      className="flex flex-col items-center py-20 px-8 bg-[#FAF5FF]"
    >
      <h2 className="text-3xl font-bold text-[#4C1D95]">자주 묻는 질문</h2>
      <p className="text-[#6D28D9] mt-2">작품 등록 전 확인되는 일반 문의사항</p>

      <div className="flex flex-col gap-4 mt-6 max-w-3xl">
        <FaqItem
          question="등록 파일 형식과 해상도 기준은?"
          answer="PNG/JPG를 기본으로 권장하며, 인쇄 품질을 위해 300 DPI 이상의 원본 파일을 권장합니다. PSD 등 레이어 파일은 옵션에 따라 허용됩니다."
        />
        <FaqItem
          question="가격 산정은 어떻게 이뤄지나요?"
          answer="선택한 규격, 재질, 프린트 방식에 따라 플랫폼에서 실시간으로 계산합니다. 예상 정산액(작가 수익)은 수수료를 반영해 표시됩니다."
        />
        <FaqItem
          question="작품이 반려되면 어떻게 하나요?"
          answer="반려 사유와 수정 가이드를 제공합니다. 수정 후 재등록하면 검수 대기열에 재진입됩니다. 반복 반려 시 계정 제약이 있을 수 있습니다."
        />
      </div>
    </section>
  );
}

function FaqItem({ question, answer }: { question: string; answer: string }) {
  return (
    <Card
      data-component="card"
      className="flex flex-col p-4 bg-white shadow-lg rounded-lg border border-[#DDD6FE] shadow-none"
    >
      <h3 className="text-lg font-semibold text-[#4C1D95]">{question}</h3>
      <p className="text-[#6D28D9] mt-2">{answer}</p>
    </Card>
  );
}

function Footer() {
  return (
    <footer data-section-type="footer" className="flex justify-between py-12 px-8 bg-[#FFFFFF]">
      <div className="flex flex-col gap-2">
        <span className="text-lg font-bold text-gray-900">printtie</span>
        <p className="text-[#6D28D9] text-sm">© 2026 printtie Inc. All rights reserved.</p>
      </div>

      <div className="flex gap-12">
        <FooterCol
          title="회사"
          items={["소개", "채용", "보도자료"]}
        />
        <FooterCol
          title="서비스"
          items={["작품 등록", "가격 안내", "주문 처리 흐름"]}
        />
        <FooterCol
          title="지원"
          items={["자주 묻는 질문", "문의하기", "정책(환불/저작권)"]}
        />
        <FooterCol
          title="개발자/파트너"
          items={["API/통합", "배송 파트너", "인쇄 파트너"]}
        />
      </div>
    </footer>
  );
}

function FooterCol({ title, items }: { title: string; items: string[] }) {
  return (
    <div className="flex flex-col gap-2">
      <p className="text-gray-700 font-semibold">{title}</p>
      {items.map((it) => (
        <p key={it} className="text-[#6D28D9] text-sm">
          {it}
        </p>
      ))}
    </div>
  );
}
