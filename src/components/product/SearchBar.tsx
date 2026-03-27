"use client";

import { useEffect, useState } from "react";
import { Search } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

type SearchBarProps = {
  placeholder: string;
};

export function SearchBar({ placeholder }: SearchBarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [value, setValue] = useState(searchParams.get("q") ?? "");

  useEffect(() => {
    const timer = window.setTimeout(() => {
      const params = new URLSearchParams(searchParams.toString());

      if (value.trim()) {
        params.set("q", value.trim());
      } else {
        params.delete("q");
      }

      router.replace(`${pathname}?${params.toString()}`, { scroll: false });
    }, 300);

    return () => window.clearTimeout(timer);
  }, [pathname, router, searchParams, value]);

  return (
    <div className="group relative mb-12">
      <Search className="absolute left-6 top-1/2 size-5 -translate-y-1/2 text-muted transition group-focus-within:text-primary" />
      <input
        type="search"
        value={value}
        onChange={(event) => setValue(event.target.value)}
        placeholder={placeholder}
        className="w-full rounded-[28px] bg-[#eae7e7] py-5 pl-16 pr-6 text-base text-dark outline-none ring-0 transition focus:ring-2 focus:ring-primary/20"
      />
    </div>
  );
}
