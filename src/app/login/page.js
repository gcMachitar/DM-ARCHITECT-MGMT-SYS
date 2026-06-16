"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { login } from "../actions";

function getNextPath() {
  if (typeof window === "undefined") return "/";
  const next = new URLSearchParams(window.location.search).get("next");
  return next && next.startsWith("/") ? next : "/";
}

export default function LoginPage() {
  const router = useRouter();

  const [role, setRole] = useState("architect");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [isPending, startTransition] = useTransition();

  function handleSubmit(event) {
    event.preventDefault();
    setError("");

    startTransition(async () => {
      try {
        const result = await login({ role, password });
        if (result.success) {
          router.push(getNextPath());
          router.refresh();
        }
      } catch (err) {
        setError(err.message || "Incorrect access password");
        setPassword("");
      }
    });
  }

  return (
    <div className="login-shell min-h-screen text-olive-950">
      <div className="login-grid-bg" aria-hidden="true" />
      <div className="login-glow login-glow-a" aria-hidden="true" />
      <div className="login-glow login-glow-b" aria-hidden="true" />

      <div className="relative z-10 mx-auto flex min-h-screen max-w-6xl flex-col lg:flex-row">
        <section className="flex flex-1 flex-col justify-center px-6 py-12 lg:px-12 lg:py-16">
          <div className="reveal-card max-w-md">
            <div className="mb-8 flex items-center gap-4">
              <div className="grid h-14 w-14 overflow-hidden place-items-center rounded-2xl bg-[#eef8df] text-lg font-black text-olive-800 shadow-[inset_0_1px_0_rgb(255_255_255/0.8),0_10px_24px_rgb(38_63_25/0.12)]">
                <img src="/logo.jpg" alt="DM Logo" className="h-full w-full object-cover" />
              </div>
              <div>
                <p className="text-xs font-black uppercase tracking-[0.22em] text-olive-700">
                  Restricted Access
                </p>
                <h1 className="text-2xl font-black tracking-tight text-olive-950 sm:text-3xl">
                  DM Operations Command
                </h1>
              </div>
            </div>

            <p className="text-base leading-7 text-olive-800">
              Architecture, construction execution, and project controls for
              the firm. Select your role and enter the access password to continue.
            </p>

            <ul className="mt-8 space-y-3 text-sm text-olive-800">
              <li className="login-feature-row">
                <span className="login-feature-dot" aria-hidden="true" />
                Projects, manpower, contracts, and payroll in one workspace
              </li>
              <li className="login-feature-row">
                <span className="login-feature-dot" aria-hidden="true" />
                Internal use only — authorized personnel
              </li>
            </ul>
          </div>
        </section>

        <section className="flex flex-1 items-center justify-center px-6 py-10 lg:px-12">
          <div className="reveal-card login-card w-full max-w-md rounded-2xl border border-lime-900/10 bg-white/75 p-8 shadow-[0_24px_60px_rgb(38_63_25/0.12)] backdrop-blur-md sm:p-10">
            <div className="mb-8">
              <p className="text-xs font-black uppercase tracking-[0.18em] text-olive-700">
                Sign in
              </p>
              <h2 className="mt-2 text-xl font-black text-olive-950">
                Access your workspace
              </h2>
              <p className="mt-2 text-sm leading-6 text-olive-700">
                A simple gate before entering the dashboard.
              </p>
            </div>

            {error ? (
              <div
                className="mb-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-900"
                role="alert"
              >
                <p className="font-bold">Access denied</p>
                <p className="mt-0.5">{error}</p>
              </div>
            ) : null}

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-xs font-black uppercase tracking-wider text-olive-700 mb-2">
                  Select Role
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setRole("architect")}
                    className={`rounded-xl px-4 py-3 text-sm font-bold transition border ${
                      role === "architect"
                        ? "border-olive-800 bg-olive-800 text-lime-50"
                        : "border-lime-700/20 bg-white text-olive-950 hover:border-lime-600"
                    }`}
                  >
                    Architect
                  </button>
                  <button
                    type="button"
                    onClick={() => setRole("staff")}
                    className={`rounded-xl px-4 py-3 text-sm font-bold transition border ${
                      role === "staff"
                        ? "border-olive-800 bg-olive-800 text-lime-50"
                        : "border-lime-700/20 bg-white text-olive-950 hover:border-lime-600"
                    }`}
                  >
                    Staff
                  </button>
                </div>
              </div>

              <div>
                <label
                  htmlFor="password"
                  className="block text-xs font-black uppercase tracking-wider text-olive-700"
                >
                  Password
                </label>
                <div className="relative mt-2">
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    required
                    autoComplete="current-password"
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                    placeholder="Enter access password"
                    disabled={isPending}
                    className="block w-full rounded-xl border border-lime-700/20 bg-white px-4 py-3 pr-12 text-sm text-olive-950 outline-none transition focus:border-lime-600 focus:ring-2 focus:ring-lime-600/20 disabled:opacity-60"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((visible) => !visible)}
                    disabled={isPending}
                    className="absolute inset-y-0 right-0 px-3 text-xs font-bold uppercase tracking-wide text-olive-700 transition hover:text-olive-950 disabled:opacity-50"
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? "Hide" : "Show"}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={isPending || !password.trim()}
                className="login-submit w-full rounded-xl px-4 py-3.5 text-sm font-bold text-lime-50 transition disabled:cursor-not-allowed disabled:opacity-50"
              >
                {isPending ? (
                  <span className="flex items-center justify-center gap-2">
                    <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                    Verifying access...
                  </span>
                ) : (
                  "Enter dashboard"
                )}
              </button>
            </form>

            <p className="mt-8 text-center text-xs leading-5 text-olive-700">
              DM Architect · Design + Interiors
            </p>
          </div>
        </section>
      </div>
    </div>
  );
}
