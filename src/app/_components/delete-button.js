"use client";

import { useTransition } from "react";

export function DeleteButton({ id, onDelete, confirmMessage = "Are you sure you want to delete this?" }) {
  const [isPending, startTransition] = useTransition();

  const handleDelete = () => {
    if (confirm(confirmMessage)) {
      startTransition(async () => {
        try {
          await onDelete(id);
        } catch (err) {
          alert("Failed to delete: " + err.message);
        }
      });
    }
  };

  return (
    <button
      onClick={handleDelete}
      disabled={isPending}
      className="rounded-md border border-red-200 bg-red-50 px-2 py-1 text-xs font-bold text-red-700 transition hover:bg-red-100 hover:text-red-950 disabled:opacity-50"
    >
      {isPending ? "Deleting..." : "Delete"}
    </button>
  );
}
