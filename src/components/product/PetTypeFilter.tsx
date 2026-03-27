"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";

type Option = {
  value: string;
  label: string;
};

type PetTypeFilterProps = {
  label: string;
  options: Option[];
  value: string;
};

export function PetTypeFilter({ label, options, value }: PetTypeFilterProps) {
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();

  return (
    <div>
      <span className="mb-1 ml-1 block text-[10px] font-bold uppercase tracking-[0.18em] text-muted">
        {label}
      </span>
      <div className="flex flex-wrap gap-2">
        {options.map((option) => {
          const active = option.value === value;

          return (
            <button
              key={option.value}
              type="button"
              onClick={() => {
                const params = new URLSearchParams(searchParams.toString());
                if (option.value === "all") {
                  params.delete("petType");
                } else {
                  params.set("petType", option.value);
                }
                router.replace(`${pathname}?${params.toString()}`, { scroll: false });
              }}
              className={`rounded-full px-5 py-2.5 text-sm font-semibold transition ${
                active
                  ? "bg-primary text-white shadow-[0_12px_24px_rgba(216,90,48,0.22)]"
                  : "bg-white text-dark hover:bg-primary-tint"
              }`}
            >
              {option.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
