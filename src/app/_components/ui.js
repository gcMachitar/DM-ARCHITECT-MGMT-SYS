import { ActionButton } from "./action-modal";

export function PageHeader({ eyebrow, title, children, action }) {
  return (
    <div className="flex flex-col gap-4 border-b border-lime-900/10 bg-[#d8edbf] px-5 py-6 lg:flex-row lg:items-end lg:justify-between lg:px-8">
      <div>
        <p className="text-xs font-black uppercase tracking-[0.18em] text-olive-700">
          {eyebrow}
        </p>
        <h1 className="mt-2 max-w-4xl text-3xl font-black leading-tight text-olive-950 lg:text-4xl">
          {title}
        </h1>
        {children ? (
          <p className="mt-3 max-w-3xl text-sm leading-6 text-olive-800">
            {children}
          </p>
        ) : null}
      </div>
      {action ? <div className="shrink-0">{action}</div> : null}
    </div>
  );
}

export function StatCard({ icon, label, value, note, tone = "light" }) {
  const toneClass =
    tone === "dark"
      ? "bg-olive-900 text-lime-50"
      : "bg-white/85 text-olive-950";

  return (
    <div
      className={`surface-pop rounded-lg border border-lime-700/15 p-4 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md ${toneClass}`}
    >
      <div className="flex items-start justify-between gap-3">
        <p className="text-xs font-bold uppercase tracking-wide opacity-75">
          {label}
        </p>
        {icon ? (
          <span aria-hidden="true" className={`stat-icon ${icon}`} />
        ) : null}
      </div>
      <div className="mt-4 flex items-end justify-between gap-4">
        <p className="text-3xl font-black leading-none">{value}</p>
        <p className="max-w-28 text-right text-sm leading-5 opacity-80">{note}</p>
      </div>
    </div>
  );
}

export function ProgressBar({ value, label = "Progress" }) {
  return (
    <div
      aria-label={label}
      aria-valuemax={100}
      aria-valuemin={0}
      aria-valuenow={value}
      className="h-2.5 overflow-hidden rounded-full bg-lime-100"
      role="progressbar"
    >
      <div
        className="h-full rounded-full bg-[#98c83d]"
        style={{ width: `${value}%` }}
      />
    </div>
  );
}

export function StatusPill({ children, tone = "neutral" }) {
  const tones = {
    neutral: "bg-white text-olive-800 ring-lime-900/10",
    good: "bg-lime-100 text-olive-900 ring-lime-600/25",
    warn: "bg-yellow-100 text-yellow-900 ring-yellow-700/20",
    danger: "bg-red-100 text-red-900 ring-red-700/20",
  };

  return (
    <span
      className={`inline-flex whitespace-nowrap rounded-md px-2.5 py-1 text-xs font-bold ring-1 ${tones[tone]}`}
    >
      {children}
    </span>
  );
}

export function Panel({ title, subtitle, children, action }) {
  return (
    <section className="surface-pop rounded-lg border border-lime-700/15 bg-white/85 shadow-sm">
      <div className="flex flex-col gap-3 border-b border-lime-900/10 p-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-lg font-black text-olive-950">{title}</h2>
          {subtitle ? (
            <p className="mt-1 text-sm text-olive-700">{subtitle}</p>
          ) : null}
        </div>
        {action ? <div>{action}</div> : null}
      </div>
      <div className="p-4">{children}</div>
    </section>
  );
}

export function PrimaryButton({ action, children, href, ...props }) {
  return (
    <ActionButton action={action} href={href} {...props}>
      {children}
    </ActionButton>
  );
}

export function SecondaryButton({ action, children, href, ...props }) {
  return (
    <ActionButton action={action} href={href} variant="secondary" {...props}>
      {children}
    </ActionButton>
  );
}
