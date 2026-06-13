"use client";

import { useEffect, useState, useTransition } from "react";

export function StatusDropdown({ id, currentValue, options, onUpdate, label }) {
  const [isPending, startTransition] = useTransition();
  const [localValue, setLocalValue] = useState(currentValue);

  useEffect(() => {
    setLocalValue(currentValue);
  }, [currentValue]);

  const handleChange = (e) => {
    const val = e.target.value;
    setLocalValue(val);
    startTransition(async () => {
      try {
        await onUpdate(id, val);
      } catch (err) {
        setLocalValue(currentValue);
        alert("Failed to update status: " + err.message);
      }
    });
  };

  return (
    <div className="flex items-center gap-1.5">
      {label && <span className="text-xs text-olive-700">{label}:</span>}
      <select
        value={localValue || ""}
        onChange={handleChange}
        disabled={isPending}
        className="rounded-md border border-lime-700/20 bg-white px-2 py-1 text-xs font-semibold text-olive-900 outline-none focus:border-lime-600 disabled:opacity-50"
      >
        {options.map((opt) => (
          <option key={opt} value={opt}>
            {opt}
          </option>
        ))}
      </select>
    </div>
  );
}
