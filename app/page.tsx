import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

export default async function HomePage() {
  return (
    <main className="min-h-screen w-full bg-white flex justify-center">
      <div className="w-[1440px] flex flex-col">
        <Navbar />
        <Hero />
        <Features />
        <StatsPrimary />
        <StatsSecondary />
        <Testimonials />
        <Cta />
        <Footer />
      </div>
    </main>
  );
}

function Navbar() {
  return (
    <nav
      className="h-16 bg-white border-b border-[#DDD6FE] shadow-sm flex items-center justify-between px-8"
      data-section-type="navbar"
    >
      <span className="text-xl font-bold text-[#4C1D95]">printtie</span>

      <div className="flex gap-6">
        <Link href="/" className="text-[#6D28D9]">
          홈
        </Link>
        <Link href="/artworks/new" className="text-[#6D28D9]">
          작품 등록
        </Link>
        <Link href="/market" className="text-[#6D28D9]">
          마켓
        </Link>
        <Link href="/orders" className="text-[#6D28D9]">
          주문/관리
        </Link>
        <Link href="/support" className="text-[#6D28D9]">
          정책·지원
        </Link>
        <Link href="/login" className="text-[#6D28D9]">
          로그인
        </Link>
      </div>

      <Button
        type="button"
        variant="secondary"
        className="bg-gray-100 text-[#6D28D9] rounded-lg px-4 py-2 shadow-none hover:bg-gray-100"
        data-component="cta-button"
        asChild
      >
        <Link href="/register">회원가입</Link>
      </Button>
    </nav>
  );
}

function Hero() {
  return (
    <section
      data-section-type="hero"
      className="flex flex-col items-center justify-center py-20 px-8 bg-gradient-to-br from-[#7C3AED] to-[#A78BFA]"
    >
      <h1 className="text-5xl font-bold text-white text-center">
        작가 진입장벽은 낮추고, 인쇄·배송은 대신합니다
      </h1>
      <p className="text-xl text-white/70 text-center max-w-3xl mt-4">
        간단한 작품 등록만으로 검수·인쇄·포장·배송까지 플랫폼이 대행합니다. 업로드 가이드와
        자동 검수로 승인까지 빠르게 연결되어 작가가 창작에만 집중할 수 있습니다.
      </p>

      <div className="flex gap-4 mt-8">
        <Button
          type="button"
          className="bg-gradient-to-br from-[#7C3AED] to-[#A78BFA] text-white/90 border border-white/30 rounded-lg px-6 py-3 hover:opacity-95"
          data-component="primary-button"
          asChild
        >
          <Link href="/register">회원가입하기</Link>
        </Button>
        <Button
          type="button"
          className="bg-gradient-to-br from-[#7C3AED] to-[#A78BFA] text-white/90 border border-white/30 rounded-lg px-6 py-3 hover:opacity-95"
          data-component="secondary-button"
          asChild
        >
          <Link href="/artworks/new">작품 등록해보기</Link>
        </Button>
      </div>

      <div className="flex gap-6 mt-10">
        <GradientCard title="검수 자동화" desc="업로드 단계에서 저작권·출력 가이드 체크로 반려 리스크 감소" />
        <GradientCard title="대행 인쇄·배송" desc="제작부터 포장, 전국 배송까지 일괄 처리" />
        <GradientCard title="간편 정산" desc="판매별 수익 정산과 리포트 제공" />
      </div>
    </section>
  );
}

function GradientCard({ title, desc }: { title: string; desc: string }) {
  return (
    <Card
      className="flex flex-col items-center p-0 bg-gradient-to-br from-[#7C3AED] to-[#A78BFA] rounded-lg border border-white/20 shadow-none"
      data-component="card"
    >
      <CardContent className="p-4 flex flex-col items-center">
        <p className="text-2xl font-bold text-white">{title}</p>
        <p className="text-white/70 text-sm text-center mt-1">{desc}</p>
      </CardContent>
    </Card>
  );
}

function Features() {
  return (
    <section
      data-section-type="features"
      className="flex flex-col items-center py-20 px-8 bg-white shadow-lg"
    >
      <h2 className="text-3xl font-bold text-[#4C1D95]">핵심 기능</h2>
      <p className="text-lg text-[#6D28D9]">작가 진입 장벽 해소 · 플랫폼 대행 인쇄·배송 · 업로드 검수</p>

      <div className="flex gap-8 mt-8">
        <FeatureCard
          title="자동 업로드 검수"
          desc="파일 해상도, 색상 모드, 저작권 체크를 자동으로 안내하고 승인까지 연결합니다."
        />
        <FeatureCard
          title="인쇄·포장·배송 대행"
          desc="여러 규격과 소재 지원, 파트너 공정을 통해 주문 자동 생산과 포장, 배송까지 일괄 처리합니다."
        />
        <FeatureCard
          title="작가 전용 대시보드"
          desc="작품 상태, 매출, 반려 이력과 개선 가이드를 한눈에 확인할 수 있습니다."
        />
      </div>
    </section>
  );
}

function FeatureCard({ title, desc }: { title: string; desc: string }) {
  return (
    <Card className="flex flex-col items-start p-0 bg-[#FFFFFF] rounded-xl w-80 shadow-none" data-component="feature-card">
      <CardContent className="p-6">
        <div className="w-12 h-12 bg-gray-200 rounded-lg" />
        <h3 className="text-xl font-semibold text-[#4C1D95] mt-4">{title}</h3>
        <p className="text-[#6D28D9] mt-2">{desc}</p>
      </CardContent>
    </Card>
  );
}

function StatsPrimary() {
  return (
    <section
      data-section-type="stats"
      className="flex items-center justify-center py-16 px-8 bg-white shadow-lg"
    >
      <div className="flex flex-wrap justify-center gap-16 max-w-[1100px]">
        <StatBlock title="주간 신규 작가" value="+350명 평균" />
        <StatBlock title="작품 등록 완료" value="약 2,400건/주 (업로드→승인 기준)" />
        <StatBlock title="승인율 / 반려율" value="승인 78% · 반려 22%" />
        <StatBlock title="평균 등록 소요시간" value="약 14분 (업로드→승인)" />
      </div>
    </section>
  );
}

function StatsSecondary() {
  return (
    <section data-section-type="stats" className="flex items-center justify-center py-12 px-8 bg-[#FAF5FF]">
      <div className="flex flex-wrap justify-center gap-16 max-w-[1100px]">
        <StatBlock title="방문자 대비 CVR" value="2.8%" />
        <StatBlock title="장바구니→결제" value="68%" />
        <StatBlock title="재구매율" value="21%" />
        <StatBlock title="평균 주문 금액" value="₩42,000" />
      </div>
    </section>
  );
}

function StatBlock({ title, value }: { title: string; value: string }) {
  return (
    <div className="flex flex-col items-center">
      <p className="text-4xl font-bold text-[#4C1D95]">{title}</p>
      <p className="text-[#6D28D9] mt-2">{value}</p>
    </div>
  );
}

function Testimonials() {
  return (
    <section data-section-type="testimonials" className="flex flex-col items-center py-20 px-8 bg-[#FFFFFF]">
      <h2 className="text-3xl font-bold text-[#4C1D95]">작가 후기</h2>

      <div className="flex gap-6 mt-8">
        <TestimonialCard
          quote="\"업로드 가이드가 상세해서 처음 판매하는 작품도 빠르게 승인받았습니다. 제작과 배송도 전부 맡겨서 신경 쓸 게 줄었어요.\""
          name="김아티스트"
          meta="일러스트레이터 · 판매자"
        />
        <TestimonialCard
          quote="\"정산이 투명하고 고객 문의도 플랫폼으로 통합되어 운영 효율이 크게 개선됐습니다. 제작 품질도 안정적이에요.\""
          name="이작가"
          meta="사진작가 · 판매자"
        />
      </div>
    </section>
  );
}

function TestimonialCard({
  quote,
  name,
  meta,
}: {
  quote: string;
  name: string;
  meta: string;
}) {
  return (
    <Card
      className="flex flex-col p-0 bg-white shadow-lg rounded-xl border border-[#DDD6FE] w-96"
      data-component="testimonial-card"
    >
      <CardContent className="p-6">
        <p className="text-[#4C1D95]">{quote}</p>
        <div className="flex items-center gap-3 mt-4">
          <Avatar className="w-10 h-10">
            <AvatarFallback className="bg-gray-200" />
          </Avatar>
          <div className="flex flex-col">
            <p className="text-[#4C1D95] font-semibold">{name}</p>
            <p className="text-[#6D28D9] text-sm">{meta}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function Cta() {
  return (
    <section data-section-type="cta" className="flex flex-col items-center justify-center py-16 px-8 bg-[#FAF5FF]">
      <h2 className="text-3xl font-bold text-[#4C1D95] text-center">지금 바로 작품을 등록하고 판매를 시작하세요</h2>
      <p className="text-lg text-[#6D28D9] text-center max-w-2xl mt-4">
        복잡한 생산·배송 과정을 플랫폼이 대신 처리합니다. 승인 가이드와 전담 지원으로 첫 판매까지 빠르게 연결됩니다.
      </p>

      <div className="flex gap-4 mt-6">
        <Button
          type="button"
          variant="outline"
          className="bg-[#FAF5FF] text-[#4C1D95] border border-[#DDD6FE] rounded-lg px-8 py-3 hover:bg-[#FAF5FF]"
          data-component="primary-button"
          asChild
        >
          <Link href="/register">회원가입</Link>
        </Button>
        <Button
          type="button"
          variant="outline"
          className="bg-white shadow-lg text-[#4C1D95] border border-[#DDD6FE] rounded-lg px-8 py-3 hover:bg-white"
          data-component="secondary-button"
          asChild
        >
          <Link href="/artworks/new">작품 등록하기</Link>
        </Button>
      </div>

      <p className="text-[#6D28D9] text-sm mt-4">문의: support@printtie.example · 가이드 보기</p>
    </section>
  );
}

function Footer() {
  return (
    <footer data-section-type="footer" className="flex justify-between py-12 px-8 bg-[#FFFFFF]">
      <div className="flex flex-col gap-2">
        <span className="text-lg font-bold text-gray-900">printtie</span>
        <p className="text-[#6D28D9] text-sm">© 2026 printtie Inc. All rights reserved.</p>
      </div>

      <div className="flex flex-col gap-2">
        <p className="text-gray-900 font-semibold">회사</p>
        <p className="text-[#6D28D9] text-sm">소개</p>
        <p className="text-[#6D28D9] text-sm">채용</p>
        <p className="text-[#6D28D9] text-sm">보도자료</p>
      </div>

      <div className="flex flex-col gap-2">
        <p className="text-gray-900 font-semibold">서비스</p>
        <p className="text-[#6D28D9] text-sm">작품 등록</p>
        <p className="text-[#6D28D9] text-sm">가격 안내</p>
        <p className="text-[#6D28D9] text-sm">주문 처리 흐름</p>
      </div>

      <div className="flex flex-col gap-2">
        <p className="text-gray-900 font-semibold">지원</p>
        <p className="text-[#6D28D9] text-sm">자주 묻는 질문</p>
        <p className="text-[#6D28D9] text-sm">문의하기</p>
        <p className="text-[#6D28D9] text-sm">정책(환불/저작권)</p>
      </div>

      <div className="flex flex-col gap-2">
        <p className="text-gray-900 font-semibold">개발자/파트너</p>
        <p className="text-[#6D28D9] text-sm">API/통합</p>
        <p className="text-[#6D28D9] text-sm">배송 파트너</p>
        <p className="text-[#6D28D9] text-sm">인쇄 파트너</p>
      </div>
    </footer>
  );
}
