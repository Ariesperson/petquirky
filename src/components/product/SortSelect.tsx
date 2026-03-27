"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";

type Option = {
  value: string;
  label: string;
};

type SortSelectProps = {
  label: string;
  options: Option[];
  value: string;
};

export function SortSelect({ label, options, value }: SortSelectProps) {
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();

  return (
    <label className="block w-full lg:w-auto">
      <span className="mb-1 ml-1 block text-[10px] font-bold uppercase tracking-[0.18em] text-muted">
        {label}
      </span>
      <select
        value={value}
        onChange={(event) => {
          const params = new URLSearchParams(searchParams.toString());
          if (event.target.value === "recommended") {
            params.delete("sort");
          } else {
            params.set("sort", event.target.value);
          }
          router.replace(`${pathname}?${params.toString()}`, { scroll: false });
        }}
        className="w-full appearance-none rounded-full bg-white px-4 py-3 text-sm font-semibold text-dark outline-none ring-0 transition focus:ring-2 focus:ring-primary/20 lg:w-64"
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </label>
  );
}
