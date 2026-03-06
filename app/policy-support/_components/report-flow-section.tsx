import { cn } from "@/lib/utils";

const STEPS = [
  {
    title: "신고 접수",
    description: "사용자 또는 아티스트가 신고 양식을 제출합니다.",
  },
  {
    title: "초기 검토",
    description: "증빙자료 확인 후 우선 처리 여부를 결정합니다.",
  },
  {
    title: "조사·결정",
    description: "정책팀이 조사하여 조치(삭제·환불·경고 등)를 결정합니다.",
  },
  {
    title: "결과 통보",
    description: "신고 접수자와 관련자에게 처리 결과 및 향후 절차를 안내합니다.",
  },
];

function Step({ index, title, description }: { index: number; title: string; description: string }) {
  return (
    <div className="flex flex-col items-center gap-2">
      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gray-100">
        <p className="font-bold text-[#4C1D95]">{index}</p>
      </div>
      <h3 className="text-lg font-semibold text-[#4C1D95]">{title}</h3>
      <p className={cn("w-48 text-center text-sm text-[#6D28D9]", "md:w-40")}>{description}</p>
    </div>
  );
}

export function ReportFlowSection() {
  return (
    <section className="bg-white">
      <div className="mx-auto w-full max-w-6xl px-6 py-12">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-[#4C1D95]">신고·처리 흐름</h2>
        </div>

        <div className="mt-8 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {STEPS.map((s, i) => (
            <Step key={s.title} index={i + 1} title={s.title} description={s.description} />
          ))}
        </div>
      </div>
    </section>
  );
}
