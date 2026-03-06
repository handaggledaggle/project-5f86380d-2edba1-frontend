import { Truck, ShieldCheck, Scale } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const ITEMS = [
  {
    title: "저작권·사용 권한",
    description:
      "아티스트는 업로드 시 작품의 저작권을 보유하거나 적법한 권한을 보유했음을 확인해야 합니다. 침해 신고 접수 시 조사 절차를 진행합니다.",
    Icon: ShieldCheck,
  },
  {
    title: "환불·교환 정책",
    description:
      "상품 불량·오배송은 확인 후 환불 또는 재제작으로 처리합니다. 구매자와 아티스트 보호를 위해 증빙을 요청할 수 있습니다.",
    Icon: Scale,
  },
  {
    title: "배송 SLA",
    description:
      "표준 제작 및 배송 리드타임을 명시하며, SLA 초과 시 보상 규정을 적용합니다. 지연 원인과 재발 방지 대책을 공개합니다.",
    Icon: Truck,
  },
];

export function PolicySummarySection() {
  return (
    <section className="bg-white">
      <div className="mx-auto w-full max-w-6xl px-6 py-12">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-[#4C1D95]">주요 정책 요약</h2>
          <p className="mt-2 text-lg text-[#6D28D9]">
            서비스 이용자와 아티스트를 보호하기 위한 핵심 운영 정책
          </p>
        </div>

        <div className="mt-8 grid gap-6 md:grid-cols-3">
          {ITEMS.map(({ title, description, Icon }) => (
            <Card key={title} className="rounded-xl">
              <CardHeader>
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-gray-100">
                  <Icon className="h-6 w-6 text-[#4C1D95]" aria-hidden="true" />
                </div>
                <CardTitle className="mt-4 text-xl text-[#4C1D95]">{title}</CardTitle>
              </CardHeader>
              <CardContent className="text-sm text-[#6D28D9]">{description}</CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
