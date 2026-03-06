import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const FAQS = [
  {
    q: "저작권 침해 신고는 어떻게 하나요?",
    a: "신고 양식을 통해 침해 주장과 관련 증빙(원본 파일, 등록 시점 자료 등)을 제출하세요. 접수 후 조사팀이 7영업일 내 회신합니다.",
  },
  {
    q: "상품이 파손되어 도착했어요. 환불 절차는?",
    a: "수령 후 7일 이내 사진 증빙을 제출하면 검토 후 환불 또는 재제작 처리합니다. 교환 배송비 정책은 상품 유형에 따라 다릅니다.",
  },
  {
    q: "배송이 SLA를 초과했어요. 보상은 어떻게 되나요?",
    a: "배송지연 발생 시 주문 상태 및 원인 확인 후 지연 기간에 따른 보상(부분 환불 또는 쿠폰)을 제공합니다. 대규모 지연은 공지로 안내합니다.",
  },
];

export function FaqSection() {
  return (
    <section className="bg-[#FAF5FF]">
      <div className="mx-auto w-full max-w-6xl px-6 py-12">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-[#4C1D95]">자주 묻는 질문</h2>
        </div>

        <div className="mx-auto mt-6 flex max-w-3xl flex-col gap-4">
          {FAQS.map((f) => (
            <Card key={f.q} className="border-[#DDD6FE] shadow-sm">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg text-[#4C1D95]">{f.q}</CardTitle>
              </CardHeader>
              <CardContent className="text-[#6D28D9]">{f.a}</CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
