"use client";
import { useRouter, useSearchParams, usePathname } from "next/navigation";

export function ProjectFilter({ projects }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const currentProject = searchParams.get("project") || "";

  return (
    <select
      className="rounded-md border border-lime-700/20 bg-white px-3 py-2 text-sm font-bold text-olive-950 shadow-sm focus:border-lime-600 focus:outline-none focus:ring-1 focus:ring-lime-600"
      value={currentProject}
      onChange={(e) => {
        const val = e.target.value;
        const params = new URLSearchParams(searchParams.toString());
        if (val) {
          params.set("project", val);
        } else {
          params.delete("project");
        }
        router.push(`${pathname}?${params.toString()}`);
      }}
    >
      <option value="">All Projects</option>
      {projects.map((p) => (
        <option key={p.slug || p.name} value={p.name}>
          {p.name}
        </option>
      ))}
    </select>
  );
}
