"use client";

import { startTransition, useDeferredValue, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { Search, X } from "lucide-react";

import type { Locale } from "@/lib/i18n";
import { searchProducts } from "@/lib/search";

type SearchOverlayProps = {
  locale: Locale;
  onClose: () => void;
  labels: {
    title: string;
    placeholder: string;
    empty: string;
    close: string;
  };
};

export function SearchOverlay({
  locale,
  onClose,
  labels,
}: SearchOverlayProps) {
  const [query, setQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const deferredQuery = useDeferredValue(debouncedQuery);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      startTransition(() => {
        setDebouncedQuery(query);
      });
    }, 300);

    return () => window.clearTimeout(timer);
  }, [query]);

  const results = useMemo(
    () => searchProducts(locale, deferredQuery, 5),
    [deferredQuery, locale]
  );

  return (
    <div className="fixed inset-0 z-[80] bg-dark/35 p-4 backdrop-blur-md">
      <div className="mx-auto mt-8 w-full max-w-3xl overflow-hidden rounded-[34px] bg-[#fcf9f8] shadow-[0_30px_90px_rgba(165,54,13,0.18)]">
        <div className="flex items-center justify-between border-b border-white/50 px-6 py-5">
          <h2 className="font-heading text-3xl font-extrabold text-dark">{labels.title}</h2>
          <button
            type="button"
            onClick={onClose}
            aria-label={labels.close}
            className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-white text-dark shadow-sm transition hover:scale-105"
          >
            <X className="size-5" />
          </button>
        </div>

        <div className="px-6 py-6">
          <div className="relative">
            <Search className="absolute left-5 top-1/2 size-5 -translate-y-1/2 text-muted" />
            <input
              type="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder={labels.placeholder}
              autoFocus
              className="w-full rounded-[26px] bg-[#f0eded] py-4 pl-14 pr-5 text-base text-dark outline-none ring-0 transition focus:ring-2 focus:ring-primary/20"
            />
          </div>

          <div className="mt-5">
            {results.length === 0 ? (
              <div className="rounded-[26px] bg-white px-5 py-10 text-center text-sm text-muted shadow-[0_14px_34px_rgba(165,54,13,0.06)]">
                {labels.empty}
              </div>
            ) : (
              <div className="space-y-3">
                {results.map((result) => (
                  <Link
                    key={result.id}
                    href={`/${locale}/products/${result.slug}`}
                    onClick={onClose}
                    className="flex items-center gap-4 rounded-[26px] bg-white p-4 shadow-[0_14px_34px_rgba(165,54,13,0.06)] transition hover:-translate-y-0.5 hover:shadow-[0_18px_40px_rgba(165,54,13,0.1)]"
                  >
                    <div className="h-20 w-20 overflow-hidden rounded-[18px] bg-[#f6f3f2]">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={result.image}
                        alt={result.name}
                        className="h-full w-full object-cover"
                      />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-lg font-semibold text-dark">{result.name}</p>
                      <p className="mt-1 line-clamp-2 text-sm leading-6 text-muted">
                        {result.description}
                      </p>
                    </div>
                    <div className="shrink-0 text-sm font-semibold text-primary">
                      {result.price}
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
