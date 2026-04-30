import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function isNavItemActive(pathname: string, href: string) {
  const hrefSegments = href.split("/").filter(Boolean);

  if (href === "/" || hrefSegments.length === 1) {
    return pathname === href;
  }

  return pathname === href || pathname.startsWith(`${href}/`);
}
