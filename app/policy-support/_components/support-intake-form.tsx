"use client";

import * as React from "react";
import { CheckCircle2, ChevronDown, Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";

type InquiryType = "저작권" | "환불" | "배송" | "기타";

type ApiResponseOk = {
  ok: true;
  ticketId: string;
  receivedAt: string;
};

type ApiResponseErr = {
  ok: false;
  message: string;
};

export function SupportIntakeForm() {
  const [name, setName] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [inquiryType, setInquiryType] = React.useState<InquiryType>("저작권");
  const [referenceId, setReferenceId] = React.useState("");
  const [details, setDetails] = React.useState("");
  const [agreePrivacy, setAgreePrivacy] = React.useState<boolean>(false);
  const [agreeEvidence, setAgreeEvidence] = React.useState<boolean>(false);

  const [submitting, setSubmitting] = React.useState(false);
  const [result, setResult] = React.useState<ApiResponseOk | ApiResponseErr | null>(null);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setResult(null);

    if (!name.trim() || !email.trim() || !details.trim()) {
      setResult({ ok: false, message: "이름/이메일/상세 내용은 필수입니다." });
      return;
    }
    if (!agreePrivacy || !agreeEvidence) {
      setResult({ ok: false, message: "동의 항목(개인정보/증빙)을 모두 체크해 주세요." });
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch("/api/support-intake", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          name,
          email,
          inquiryType,
          referenceId: referenceId.trim() || null,
          details,
          agreements: { privacy: agreePrivacy, evidence: agreeEvidence },
        }),
      });

      const data = (await res.json()) as ApiResponseOk | ApiResponseErr;
      if (!res.ok) {
        setResult({ ok: false, message: "접수에 실패했습니다. 입력값을 확인해 주세요." });
        return;
      }

      setResult(data);
      if (data.ok) {
        // reset only after success
        setName("");
        setEmail("");
        setInquiryType("저작권");
        setReferenceId("");
        setDetails("");
        setAgreePrivacy(false);
        setAgreeEvidence(false);
      }
    } catch {
      setResult({ ok: false, message: "네트워크 오류가 발생했습니다. 잠시 후 다시 시도해 주세요." });
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <Card className="mx-auto w-full max-w-2xl rounded-xl border-[#DDD6FE] shadow-sm">
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-[#4C1D95]">신고 / 문의 접수</CardTitle>
        <p className="mt-2 text-sm text-[#6D28D9]">
          저작권 침해, 환불 요청, 배송 지연 등 문제를 구체적으로 작성해 주세요. 접수 번호는 회신 시
          안내됩니다.
        </p>
      </CardHeader>
      <CardContent>
        <form className="flex flex-col gap-4" onSubmit={onSubmit}>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="flex flex-col gap-1">
              <Label className="text-sm text-[#4C1D95]" htmlFor="name">
                이름
              </Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="홍길동"
                className="border-[#DDD6FE] text-[#4C1D95]"
                autoComplete="name"
              />
            </div>

            <div className="flex flex-col gap-1">
              <Label className="text-sm text-[#4C1D95]" htmlFor="email">
                이메일
              </Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="email@example.com"
                className="border-[#DDD6FE] text-[#4C1D95]"
                autoComplete="email"
              />
            </div>
          </div>

          <div className="flex flex-col gap-1">
            <Label className="text-sm text-[#4C1D95]">문의 유형</Label>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  type="button"
                  variant="outline"
                  className={cn(
                    "h-10 justify-between border-[#DDD6FE] bg-white text-[#4C1D95]",
                    "hover:bg-[#FAF5FF]"
                  )}
                >
                  <span>{inquiryType}</span>
                  <ChevronDown className="h-4 w-4" aria-hidden="true" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="w-[--radix-dropdown-menu-trigger-width]">
                {(["저작권", "환불", "배송", "기타"] as InquiryType[]).map((t) => (
                  <DropdownMenuItem key={t} onClick={() => setInquiryType(t)}>
                    {t}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
            <p className="text-xs text-[#6D28D9]">
              예: 저작권 침해(도용/무단 업로드), 환불(불량/오배송), 배송(SLA 초과/파손)
            </p>
          </div>

          <div className="flex flex-col gap-1">
            <Label className="text-sm text-[#4C1D95]" htmlFor="ref">
              관련 주문 또는 작품 ID
            </Label>
            <Input
              id="ref"
              value={referenceId}
              onChange={(e) => setReferenceId(e.target.value)}
              placeholder="Order12345 또는 Work6789"
              className="border-[#DDD6FE] text-[#4C1D95]"
            />
          </div>

          <div className="flex flex-col gap-1">
            <Label className="text-sm text-[#4C1D95]" htmlFor="details">
              상세 내용 및 증빙
            </Label>
            <Textarea
              id="details"
              value={details}
              onChange={(e) => setDetails(e.target.value)}
              placeholder="문제 발생 시점, 증빙(사진/파일) 링크 또는 설명을 입력하세요."
              className="min-h-36 border-[#DDD6FE] text-[#4C1D95]"
            />
            <p className="text-xs text-[#6D28D9]">
              파일 업로드는 MVP에서 링크 기반으로 접수합니다(예: 드라이브/이미지 링크).
            </p>
          </div>

          <div className="flex flex-col gap-3 md:flex-row md:items-center md:gap-6">
            <div className="flex items-center gap-2">
              <Checkbox
                id="agreePrivacy"
                checked={agreePrivacy}
                onCheckedChange={(v) => setAgreePrivacy(Boolean(v))}
              />
              <Label htmlFor="agreePrivacy" className="text-sm text-[#4C1D95]">
                개인정보 수집·이용에 동의합니다.
              </Label>
            </div>
            <div className="flex items-center gap-2">
              <Checkbox
                id="agreeEvidence"
                checked={agreeEvidence}
                onCheckedChange={(v) => setAgreeEvidence(Boolean(v))}
              />
              <Label htmlFor="agreeEvidence" className="text-sm text-[#4C1D95]">
                증빙 자료 제공에 동의합니다.
              </Label>
            </div>
          </div>

          {result && (
            <div
              className={cn(
                "rounded-lg border px-4 py-3 text-sm",
                result.ok
                  ? "border-emerald-200 bg-emerald-50 text-emerald-900"
                  : "border-rose-200 bg-rose-50 text-rose-900"
              )}
              role="status"
              aria-live="polite"
            >
              {result.ok ? (
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="mt-0.5 h-4 w-4" aria-hidden="true" />
                  <div>
                    <p className="font-medium">접수 완료</p>
                    <p className="mt-1">
                      접수번호: <span className="font-mono">{result.ticketId}</span>
                      <span className="ml-2 text-emerald-700/80">({new Date(result.receivedAt).toLocaleString()})</span>
                    </p>
                  </div>
                </div>
              ) : (
                <p>{result.message}</p>
              )}
            </div>
          )}

          <div className="flex justify-end">
            <Button
              type="submit"
              disabled={submitting}
              className="bg-[#FAF5FF] text-[#4C1D95] hover:bg-[#F3E8FF]"
            >
              {submitting ? (
                <span className="inline-flex items-center gap-2">
                  <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
                  제출 중
                </span>
              ) : (
                "제출하기"
              )}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
