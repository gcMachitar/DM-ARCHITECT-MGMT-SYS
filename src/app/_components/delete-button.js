"use client";

import { useTransition } from "react";
import { customConfirm } from "./confirm-modal";

export function DeleteButton({ id, onDelete, confirmMessage = "Are you sure you want to delete this?" }) {
  const [isPending, startTransition] = useTransition();

  const handleDelete = async () => {
    if (await customConfirm(confirmMessage)) {
      startTransition(async () => {
        try {
          await onDelete(id);
        } catch (err) {
          window.dispatchEvent(new CustomEvent("dm-toast", {
            detail: { message: "Failed to delete: " + err.message, type: "error" }
          }));
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
