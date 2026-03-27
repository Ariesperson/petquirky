"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";

type Option = {
  value: string;
  label: string;
};

type CategoryFilterProps = {
  label: string;
  options: Option[];
  value: string;
};

export function CategoryFilter({ label, options, value }: CategoryFilterProps) {
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();

  return (
    <label className="block">
      <span className="mb-1 ml-1 block text-[10px] font-bold uppercase tracking-[0.18em] text-muted">
        {label}
      </span>
      <select
        value={value}
        onChange={(event) => {
          const params = new URLSearchParams(searchParams.toString());
          if (event.target.value === "all") {
            params.delete("category");
          } else {
            params.set("category", event.target.value);
          }
          router.replace(`${pathname}?${params.toString()}`, { scroll: false });
        }}
        className="min-w-52 appearance-none rounded-full bg-white px-4 py-3 text-sm font-semibold text-dark outline-none ring-0 transition focus:ring-2 focus:ring-primary/20"
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
