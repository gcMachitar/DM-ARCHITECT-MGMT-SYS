"use client";

import { useEffect, useId, useState } from "react";
import Link from "next/link";
import { createPortal } from "react-dom";

const actionCopy = {
  "daily-report": {
    title: "Daily Site Report",
    description:
      "Prepare a same-day report for attendance, progress notes, site issues, photos, and next actions.",
    fields: ["Project", "Prepared by", "Weather / site condition"],
    result: "Daily report draft opened for review.",
  },
  "new-project": {
    title: "New Project",
    description:
      "Start a job file with client details, project scope, location, budget, and responsible team.",
    fields: ["Project name", "Client", "Location"],
    result: "Project intake draft created.",
  },
  "work-order": {
    title: "Create Work Order",
    description:
      "Assign a concrete task to design, site, purchasing, accounting, or a foreman.",
    fields: ["Task", "Project", "Owner"],
    result: "Work order added to the action queue.",
  },
  "add-project": actionCopyPlaceholder("New Project"),
  "assign-crew": {
    title: "Assign Crew",
    description:
      "Move workers between standby and site deployment while keeping the foreman accountable.",
    fields: ["Project", "Trade", "Number of men"],
    result: "Crew assignment staged for approval.",
  },
  "new-billing": {
    title: "New Billing",
    description:
      "Create a billing item tied to project progress, contract value, and supporting documents.",
    fields: ["Project", "Billing description", "Amount"],
    result: "Billing item added to the contract desk.",
  },
  "download-ledger": {
    title: "Download Ledger",
    description:
      "Generate a contract ledger summary for billing, change orders, supplier POs, and retention.",
    fields: ["Date range", "Project filter", "Prepared for"],
    result: "Ledger export prepared.",
    fileName: "dm-contract-ledger.txt",
  },
  "export-report": {
    title: "Export Project Report",
    description:
      "Create a management report containing project phase, team ownership, manpower, cost, risk, and milestone status.",
    fields: ["Report type", "Project filter", "Recipient"],
    result: "Project report export prepared.",
    fileName: "dm-project-report.txt",
  },
  "log-request": {
    title: "Log Request",
    description:
      "Capture design questions, procurement needs, site issues, client approvals, and turnover tasks.",
    fields: ["Request", "Project", "Assigned team"],
    result: "Request logged in the service queue.",
  },
  "assign-selected": {
    title: "Assign Selected Requests",
    description:
      "Batch assign visible service requests to the responsible person or department.",
    fields: ["Assigned to", "Priority", "Due date"],
    result: "Selected requests assigned.",
  },
  "add-payroll-employee": {
    title: "Add Payroll Employee",
    description:
      "Create a payroll line with employee details, assignment, days worked, rate, overtime, and release method.",
    fields: ["Employee name", "Role", "Project / department", "Daily rate"],
    result: "Payroll employee draft added for review.",
  },
  "record-ca": {
    title: "Record Cash Advance",
    description:
      "Log a cash advance request, repayment schedule, approving person, and supporting receipt reference.",
    fields: ["Employee", "CA amount", "Approved by", "Deduct per payroll"],
    result: "Cash advance draft recorded.",
  },
  "approve-payroll": {
    title: "Approve Payroll Run",
    description:
      "Confirm attendance, deductions, cash advances, net release, and approval owner before payout.",
    fields: ["Payroll period", "Approved by", "Release date"],
    result: "Payroll run marked as staged for release.",
  },
  "generate-payslip": {
    title: "Generate Payslip",
    description:
      "Prepare a payslip or cash acknowledgement receipt with gross pay, deductions, CA balance, and net pay.",
    fields: ["Employee", "Receipt type", "Prepared by"],
    result: "Payslip receipt prepared.",
    fileName: "dm-payroll-payslip.txt",
  },
  "export-payroll": {
    title: "Export Payroll Register",
    description:
      "Prepare a payroll export for accounting review, bank upload, cash release, or site payout reconciliation.",
    fields: ["Payroll period", "Export format", "Prepared for"],
    result: "Payroll register export prepared.",
    fileName: "dm-payroll-register.txt",
  },
  "ca-receipt": {
    title: "Cash Advance Receipt",
    description:
      "Generate a receipt for a cash advance release or deduction acknowledgement.",
    fields: ["Employee", "CA amount", "Receipt purpose"],
    result: "Cash advance receipt prepared.",
    fileName: "dm-cash-advance-receipt.txt",
  },
};

function actionCopyPlaceholder(title) {
  return {
    title,
    description:
      "Start a complete job record with the information the office and field teams need.",
    fields: ["Project name", "Client", "Target start"],
    result: "Draft record created.",
  };
}

export function ActionButton({
  action,
  children,
  className,
  href,
  variant = "primary",
}) {
  const modalId = useId();
  const [open, setOpen] = useState(false);
  const [values, setValues] = useState({});
  const copy = actionCopy[action] || actionCopy["work-order"];
  const hasValues = Object.values(values).some((value) => value.trim());
  const baseClass =
    variant === "secondary"
      ? "rounded-md border border-lime-700/25 bg-white/70 px-3 py-2 text-sm font-bold text-olive-800 transition hover:bg-lime-50"
      : "rounded-md bg-olive-900 px-4 py-2 text-sm font-bold text-lime-50 shadow-sm shadow-lime-900/20 transition hover:bg-[#1b3013]";

  function closeModal() {
    setOpen(false);
    setValues({});
  }

  function saveDraft() {
    const draft = {
      action,
      title: copy.title,
      values,
      savedAt: new Date().toISOString(),
    };

    let current = [];
    try {
      current = JSON.parse(
        window.localStorage.getItem("dm-action-drafts") || "[]",
      );
    } catch {
      current = [];
    }

    window.localStorage.setItem(
      "dm-action-drafts",
      JSON.stringify([draft, ...current].slice(0, 20)),
    );

    if (copy.fileName) {
      const lines = [
        copy.title,
        `Prepared: ${new Date().toLocaleString()}`,
        "",
        ...copy.fields.map(
          (field) => `${field}: ${values[field] || "Not set"}`,
        ),
      ];
      const blob = new Blob([lines.join("\n")], {
        type: "text/plain",
      });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = copy.fileName;
      document.body.appendChild(link);
      link.click();
      link.remove();
      URL.revokeObjectURL(url);
    }

    closeModal();
  }

  useEffect(() => {
    function handleModalOpen(event) {
      if (event.detail !== modalId) {
        closeModal();
      }
    }

    window.addEventListener("dm-action-open", handleModalOpen);
    return () => window.removeEventListener("dm-action-open", handleModalOpen);
  }, [modalId]);

  useEffect(() => {
    if (!open) return undefined;

    function handleKeyDown(event) {
      if (event.key === "Escape") {
        closeModal();
      }
    }

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [open]);

  if (href) {
    return (
      <Link className={className || baseClass} href={href}>
        {children}
      </Link>
    );
  }

  const actionWindow = (
    <div
      className="fixed inset-0 z-[9999] grid place-items-center bg-olive-950/45 p-4 backdrop-blur-sm"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) {
          closeModal();
        }
      }}
      role="presentation"
    >
      <div
        aria-modal="true"
        className="w-[min(94vw,760px)] rounded-lg border border-lime-700/20 bg-[#f8fcf1] shadow-2xl"
        role="dialog"
      >
        <div className="border-b border-lime-900/10 p-5">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-xs font-black uppercase tracking-wide text-olive-700">
                Action window
              </p>
              <h2 className="mt-2 text-2xl font-black text-olive-950">
                {copy.title}
              </h2>
              <p className="mt-2 max-w-2xl text-sm leading-6 text-olive-700">
                {copy.description}
              </p>
            </div>
            <button
              aria-label="Cancel action"
              className="rounded-md border border-lime-700/25 bg-white px-3 py-2 text-sm font-black text-olive-800 transition hover:bg-lime-50"
              onClick={closeModal}
              type="button"
            >
              Cancel
            </button>
          </div>
        </div>

        <div className="p-5">
          <div className="grid gap-4 sm:grid-cols-2">
            {copy.fields.map((field) => (
              <label className="block" key={field}>
                <span className="text-xs font-bold uppercase tracking-wide text-olive-700">
                  {field}
                </span>
                <input
                  className="mt-1 w-full rounded-md border border-lime-700/20 bg-white px-3 py-2.5 text-sm text-olive-950 outline-none focus:border-lime-600"
                  onChange={(event) =>
                    setValues((current) => ({
                      ...current,
                      [field]: event.target.value,
                    }))
                  }
                  placeholder={`Enter ${field.toLowerCase()}`}
                  value={values[field] || ""}
                />
              </label>
            ))}
          </div>
        </div>

        <div className="border-t border-lime-900/10 bg-[#f8fcf1] p-5">
          {!hasValues ? (
            <p className="mb-3 text-xs font-semibold text-olive-700">
              Enter at least one field to save a draft.
            </p>
          ) : null}
          <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
            <button
              className="rounded-md border border-lime-700/25 bg-white px-4 py-2 text-sm font-bold text-olive-800"
              onClick={closeModal}
              type="button"
            >
              Cancel
            </button>
            <button
              className="rounded-md bg-olive-900 px-4 py-2 text-sm font-bold text-lime-50 disabled:cursor-not-allowed disabled:opacity-45"
              disabled={!hasValues}
              onClick={saveDraft}
              type="button"
            >
              {copy.fileName ? "Save and download" : "Save draft"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <>
      <button
        className={className || baseClass}
        onClick={() => {
          window.dispatchEvent(
            new CustomEvent("dm-action-open", { detail: modalId }),
          );
          setValues({});
          setOpen(true);
        }}
        type="button"
      >
        {children}
      </button>

      {open && typeof document !== "undefined"
        ? createPortal(actionWindow, document.body)
        : null}
    </>
  );
}
