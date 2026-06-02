"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ActionButton } from "./action-modal";

const navItems = [
  ["Overview", "/", "Start here"],
  ["Projects", "/projects", "Jobs, owners, phases"],
  ["Manpower", "/manpower", "Men, trades, foremen"],
  ["Contracts", "/contracts", "Billing and costs"],
  ["Services", "/services", "Requests and tasks"],
];

export function AppShell({ children }) {
  const pathname = usePathname();

  return (
    <div className="min-h-screen lg:grid lg:grid-cols-[300px_1fr]">
      <aside className="border-b border-lime-900/10 bg-[#98c83d] lg:sticky lg:top-0 lg:h-screen lg:border-b-0 lg:border-r">
        <div className="flex items-center justify-between gap-4 px-4 py-4 lg:block lg:px-5">
          <Link className="flex items-center gap-3" href="/">
            <div className="grid h-11 w-11 place-items-center rounded-full bg-[#eef8df] text-sm font-black text-olive-800 shadow-inner">
              DM
            </div>
            <div>
              <p className="text-sm font-black text-olive-950">DM Architect</p>
              <p className="text-xs font-semibold text-olive-800">
                Design + Interiors
              </p>
            </div>
          </Link>
          <div className="hidden rounded-md bg-lime-100 px-3 py-1 text-xs font-black text-olive-800 lg:mt-6 lg:inline-flex">
            Firm OS
          </div>
        </div>

        <div className="px-4 pb-3 lg:px-5">
          <p className="rounded-md bg-[#e5f3cf] px-3 py-2 text-xs font-bold leading-5 text-olive-800">
            Choose the area you are managing. Each page has its own work list
            and action buttons.
          </p>
        </div>

        <nav className="flex gap-2 overflow-x-auto px-4 pb-4 lg:block lg:space-y-2 lg:px-5 lg:pb-0">
          {navItems.map(([label, href, helper]) => {
            const active =
              href === "/" ? pathname === "/" : pathname.startsWith(href);

            return (
              <Link
                className={`whitespace-nowrap rounded-md px-3 py-2 text-sm font-bold transition lg:block ${
                  active
                    ? "bg-[#eef8df] text-olive-950 shadow-sm"
                    : "text-olive-900 hover:bg-lime-100/80"
                }`}
                href={href}
                key={href}
              >
                <span>{label}</span>
                <span className="hidden text-xs font-semibold text-olive-700 lg:mt-1 lg:block">
                  {helper}
                </span>
              </Link>
            );
          })}
        </nav>

        <div className="mx-5 mt-8 hidden rounded-lg border border-lime-900/10 bg-[#e5f3cf] p-4 lg:block">
          <p className="text-xs font-black uppercase tracking-wide text-olive-700">
            Office Today
          </p>
          <p className="mt-3 text-2xl font-black text-olive-950">56</p>
          <p className="text-sm leading-6 text-olive-800">
            men assigned across 4 active sites.
          </p>
          <Link
            className="mt-4 inline-flex rounded-md bg-white px-3 py-2 text-sm font-bold text-olive-800"
            href="/manpower"
          >
            View manpower
          </Link>
        </div>
      </aside>

      <div className="min-w-0">
        <header className="sticky top-0 z-10 border-b border-lime-900/10 bg-[#f5faee]/90 px-5 py-3 backdrop-blur lg:px-8">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-wide text-olive-700">
                Operations Command
              </p>
              <p className="text-sm text-olive-800">
                Use the left menu for major areas. Use page buttons to draft
                reports, assignments, billing, and requests.
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <ActionButton action="daily-report" variant="secondary">
                Daily Report
              </ActionButton>
              <ActionButton action="new-project">New Project</ActionButton>
            </div>
          </div>
        </header>
        {children}
      </div>
    </div>
  );
}
