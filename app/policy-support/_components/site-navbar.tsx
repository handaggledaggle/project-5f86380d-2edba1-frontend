import Link from "next/link";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const NAV_ITEMS: Array<{ label: string; href: string }> = [
  { label: "홈", href: "/" },
  { label: "작품 등록", href: "/upload" },
  { label: "마켓", href: "/market" },
  { label: "주문/관리", href: "/orders" },
  { label: "정책·지원", href: "/policy-support" },
  { label: "로그인", href: "/login" },
];

export function SiteNavbar({ active }: { active?: string }) {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-[#DDD6FE] bg-white/90 backdrop-blur">
      <div className="mx-auto flex h-16 w-full max-w-6xl items-center justify-between px-6">
        <Link href="/" className="text-xl font-bold text-[#4C1D95]">
          printtie
        </Link>

        <nav className="hidden items-center gap-6 md:flex" aria-label="주요 메뉴">
          {NAV_ITEMS.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "text-sm font-medium text-[#6D28D9] hover:underline hover:underline-offset-4",
                active === item.label && "font-semibold text-[#4C1D95]"
              )}
              aria-current={active === item.label ? "page" : undefined}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <Button variant="secondary" className="bg-gray-100 text-[#6D28D9] hover:bg-gray-200">
          Sign Up
        </Button>
      </div>
    </header>
  );
}
