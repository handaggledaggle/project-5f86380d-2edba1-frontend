import Link from "next/link";

import { SiteFooter } from "@/app/policy-support/_components/site-footer";
import { SiteNavbar } from "@/app/policy-support/_components/site-navbar";
import { PolicySummarySection } from "@/app/policy-support/_components/policy-summary-section";
import { FaqSection } from "@/app/policy-support/_components/faq-section";
import { ReportFlowSection } from "@/app/policy-support/_components/report-flow-section";
import { SupportIntakeForm } from "@/app/policy-support/_components/support-intake-form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export const metadata = {
  title: "정책·지원 | printtie",
  description:
    "저작권 동의, 환불·교환 정책, 신고 절차와 배송 SLA를 안내하고 신고·문의 접수를 제공합니다.",
};

export default function PolicySupportPage() {
  return (
    <div className="min-h-dvh w-full bg-white">
      <SiteNavbar active="정책·지원" />

      <main>
        <section className="bg-gradient-to-br from-[#7C3AED] to-[#A78BFA]">
          <div className="mx-auto w-full max-w-6xl px-6 py-12">
            <div className="max-w-4xl">
              <h1 className="text-3xl font-bold tracking-tight text-white">정책·지원</h1>
              <p className="mt-2 text-white/80">
                저작권 동의, 환불·교환 정책, 신고 절차와 배송 SLA를 명확히 안내하고, 신고·문의
                양식을 통해 빠르게 대응합니다.
              </p>

              <div className="mt-6 grid gap-4 sm:grid-cols-2">
                <Card className="border-white/20 bg-gradient-to-br from-[#7C3AED] to-[#A78BFA]">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-semibold text-white">운영 지표</CardTitle>
                  </CardHeader>
                  <CardContent className="text-sm text-white/80">
                    배송 SLA, 반려율 등 운영 관련 지표를 기준으로 정책을 운영합니다.
                  </CardContent>
                </Card>

                <Card className="border-white/20 bg-gradient-to-br from-[#7C3AED] to-[#A78BFA]">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-semibold text-white">신고·문의</CardTitle>
                  </CardHeader>
                  <CardContent className="text-sm text-white/80">
                    저작권 침해, 품질 문제, 환불 요청을 접수할 수 있습니다.
                  </CardContent>
                </Card>
              </div>

              <div className="mt-6 text-sm text-white/70">
                참고: 본 페이지는 MVP 기준의 요약 안내이며, 상세 약관/개인정보 처리방침은 별도 문서로
                고지됩니다.
              </div>
            </div>
          </div>
        </section>

        <PolicySummarySection />
        <FaqSection />
        <ReportFlowSection />

        <section className="bg-[#FAF5FF]">
          <div className="mx-auto w-full max-w-6xl px-6 py-12">
            <SupportIntakeForm />
            <p className="mt-4 text-center text-xs text-[#6D28D9]">
              긴급 이슈(결제 완료 후 배송 불가, 개인 정보 유출 의심 등)는 접수 내용에 “긴급” 표시 후
              주문 ID를 함께 기재해 주세요.
            </p>
            <p className="mt-2 text-center text-xs text-[#6D28D9]">
              <Link className="underline underline-offset-4" href="/">
                홈으로
              </Link>
            </p>
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}
