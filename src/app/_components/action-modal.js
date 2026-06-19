"use client";

import { useEffect, useId, useState } from "react";
import Link from "next/link";
import { createPortal } from "react-dom";
import { supabase } from "@/lib/supabase";
import { projects as mockProjects } from "../data";
import { customConfirm } from "./confirm-modal";
import {
  createProject,
  createWorkOrder,
  assignCrew,
  createBilling,
  logRequest,
  addPayrollEmployee,
  recordCashAdvance,
  approvePayroll,
  assignSelectedRequests,
  submitDailyReport,
  updateProject,
  updateEmployee,
  createManpower,
  updateManpower,
  createScheduleEvent,
  updateScheduleEvent,
} from "../actions";

const actionSubmitters = {
  "daily-report": submitDailyReport,
  "new-project": createProject,
  "add-project": createProject,
  "work-order": createWorkOrder,
  "assign-crew": assignCrew,
  "new-billing": createBilling,
  "log-request": logRequest,
  "assign-selected": assignSelectedRequests,
  "add-payroll-employee": addPayrollEmployee,
  "record-ca": recordCashAdvance,
  "approve-payroll": approvePayroll,
  "edit-project": updateProject,
  "edit-employee": updateEmployee,
  "add-manpower": createManpower,
  "edit-manpower": updateManpower,
  "add-schedule": createScheduleEvent,
  "edit-schedule": updateScheduleEvent,
};

const actionCopy = {
  "add-schedule": {
    title: "Add Schedule Event",
    description: "Add a meeting, site visit, or task to the office calendar.",
    fields: ["Time", "Event / Meeting", "Location"],
    result: "Schedule event added.",
  },
  "edit-schedule": {
    title: "Edit Schedule Event",
    description: "Update the time, event details, or location of an existing schedule.",
    fields: ["Time", "Event / Meeting", "Location"],
    result: "Schedule event updated.",
  },
  "add-manpower": {
    title: "Add Manpower Group",
    description: "Create a new trade, define total count, lead foreman, and active projects.",
    fields: ["Trade", "Total", "Deployed", "Lead foreman", "Projects"],
    result: "Manpower group added.",
  },
  "edit-manpower": {
    title: "Edit Manpower Group",
    description: "Update trade details, total headcount, deployed count, lead foreman, and active projects.",
    fields: ["Trade", "Total", "Deployed", "Lead foreman", "Projects"],
    result: "Manpower group updated.",
  },
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
  "edit-project": {
    title: "Edit Project Details",
    description:
      "Update project metadata, scope, team assignments, progress, and financial information.",
    fields: [
      "Project name",
      "Client",
      "Location",
      "Phase",
      "Foreman",
      "Site engineer",
      "Architect",
      "Crew count",
      "Budget",
      "Spent",
      "Progress",
      "Due date",
      "Status",
      "Next milestone",
      "Risk",
    ],
    result: "Project details updated.",
  },
  "edit-employee": {
    title: "Edit Employee Details",
    description:
      "Update employee assignment, rate, role, days worked, overtime, deductions, and payment methods.",
    fields: [
      "Employee name",
      "Role",
      "Project / department",
      "Daily rate",
      "Days worked",
      "Overtime",
      "Deductions",
      "Cash advance",
      "CA balance",
      "Release method",
      "Receipt status",
      "Status",
    ],
    result: "Employee details updated.",
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
  targetId,
  initialValues,
}) {
  const modalId = useId();
  const [open, setOpen] = useState(false);
  const [values, setValues] = useState(initialValues || {});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const copy = actionCopy[action] || actionCopy["work-order"];
  const hasValues = Object.keys(values).length > 0;
  const [projectsList, setProjectsList] = useState([]);
  const [employeesList, setEmployeesList] = useState([]);

  useEffect(() => {
    async function fetchProjects() {
      try {
        const { data, error } = await supabase.from("projects").select("name").order("name", { ascending: true });
        if (error) throw error;
        if (data && data.length > 0) {
          setProjectsList(data.map(p => p.name));
        } else {
          setProjectsList(mockProjects.map(p => p.name));
        }
      } catch (err) {
        console.error("Failed to fetch projects for dropdown:", err);
        setProjectsList(mockProjects.map(p => p.name));
      }
    }
    fetchProjects();
  }, []);

  useEffect(() => {
    async function fetchEmployees() {
      try {
        const { data, error } = await supabase.from("employees").select("name").order("name", { ascending: true });
        if (error) throw error;
        if (data && data.length > 0) {
          setEmployeesList(data.map(e => e.name));
        } else {
          setEmployeesList(["Ramon Bautista", "Joey Santos", "Arnel Cruz", "Mila Reyes", "Dennis Lim"]);
        }
      } catch (err) {
        console.error("Failed to fetch employees for dropdown:", err);
        setEmployeesList(["Ramon Bautista", "Joey Santos", "Arnel Cruz", "Mila Reyes", "Dennis Lim"]);
      }
    }
    fetchEmployees();
  }, []);

  useEffect(() => {
    if (open) {
      const newValues = { ...(initialValues || {}) };
      copy.fields.forEach(field => {
        if (["Project", "Project / department"].includes(field) && !newValues[field]) {
          const defaultVal = field === "Project / department" ? "Main Office" : "General";
          const firstProj = projectsList.length > 0 ? projectsList[0] : defaultVal;
          newValues[field] = firstProj;
        }
        if (field === "Employee" && !newValues[field]) {
          newValues[field] = employeesList.length > 0 ? employeesList[0] : "";
        }
      });
      setValues(newValues);
    }
  }, [open, projectsList, employeesList, initialValues, copy.fields]);

  function closeModal() {
    setOpen(false);
    setValues({});
  }

  async function handleClose() {
    if (hasValues && !isSubmitting) {
      if (await customConfirm("You have unsaved changes. Discard?")) {
        closeModal();
      }
    } else {
      closeModal();
    }
  }
  const baseClass =
    variant === "secondary"
      ? "rounded-md border border-lime-700/25 bg-white/70 px-3 py-2 text-sm font-bold text-olive-800 transition hover:bg-lime-50"
      : "rounded-md bg-olive-900 px-4 py-2 text-sm font-bold text-lime-50 shadow-sm shadow-lime-900/20 transition hover:bg-[#1b3013]";

  async function saveDraft() {
    setIsSubmitting(true);
    window.dispatchEvent(new CustomEvent("dm-sync-start"));
    try {
      const submitter = actionSubmitters[action];
      if (submitter) {
        let result;
        if (targetId) {
          result = await submitter(targetId, values);
        } else {
          result = await submitter(values);
        }
        if (result && result.timestamp) {
          window.dispatchEvent(new CustomEvent("dm-sync-success", { detail: result }));
        }
      }
    } catch (err) {
      console.error("Action submission failed:", err);
      window.dispatchEvent(new CustomEvent("dm-toast", {
        detail: { message: "Failed to save action: " + err.message, type: "error" }
      }));
      window.dispatchEvent(new CustomEvent("dm-sync-error"));
      setIsSubmitting(false);
      return;
    }

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

    setIsSubmitting(false);
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
        handleClose();
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
          handleClose();
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
              onClick={handleClose}
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
                {(() => {
                  const isCurrency = ["Amount", "Budget", "Spent", "CA amount", "Deduct per payroll"].includes(field);
                  const isNumber = ["Crew count", "Total", "Deployed", "Standby", "Progress", "Number of men", "Days worked", "Daily rate", "Overtime", "Cash advance", "CA balance", "Deductions"].includes(field);
                  const isDate = ["Due date", "Target start", "Due"].includes(field);
                  const isTime = ["Time"].includes(field);
                  const isProjectSelect = ["Project", "Project / department"].includes(field);
                  const isEmployeeSelect = field === "Employee";
                  
                  if (isProjectSelect) {
                    const optionsList = [...projectsList];
                    const defaultVal = field === "Project / department" ? "Main Office" : "General";
                    if (!optionsList.includes(defaultVal)) {
                      optionsList.unshift(defaultVal);
                    }
                    return (
                      <select
                        className="mt-1 w-full rounded-md border border-lime-700/20 bg-white px-3 py-2.5 text-sm text-olive-950 outline-none focus:border-lime-600 focus:ring-1 focus:ring-lime-600"
                        onChange={(event) =>
                          setValues((current) => ({
                            ...current,
                            [field]: event.target.value,
                          }))
                        }
                        value={values[field] || ""}
                        required
                      >
                        {optionsList.map((name) => (
                          <option key={name} value={name}>
                            {name}
                          </option>
                        ))}
                      </select>
                    );
                  }

                  if (isEmployeeSelect) {
                    const optionsList = [...employeesList];
                    return (
                      <select
                        className="mt-1 w-full rounded-md border border-lime-700/20 bg-white px-3 py-2.5 text-sm text-olive-950 outline-none focus:border-lime-600 focus:ring-1 focus:ring-lime-600"
                        onChange={(event) =>
                          setValues((current) => ({
                            ...current,
                            [field]: event.target.value,
                          }))
                        }
                        value={values[field] || ""}
                        required
                      >
                        {optionsList.map((name) => (
                          <option key={name} value={name}>
                            {name}
                          </option>
                        ))}
                      </select>
                    );
                  }

                  let type = "text";
                  if (isNumber) type = "number";
                  if (isDate) type = "date";
                  if (isTime) type = "time";

                  let placeholder = `Enter ${field.toLowerCase()}`;
                  if (isCurrency) placeholder = "e.g., 1.5M or 500K";

                  const handleBlur = (e) => {
                    let val = e.target.value;
                    if (isCurrency && val) {
                      // Basic auto-formatter for currency if they just type numbers
                      if (/^\d+$/.test(val)) {
                        const num = parseInt(val, 10);
                        if (num >= 1000000) val = (num / 1000000).toFixed(1).replace(/\.0$/, '') + 'M';
                        else if (num >= 1000) val = (num / 1000).toFixed(0) + 'K';
                        else val = String(num);
                        setValues((prev) => ({ ...prev, [field]: 'PHP ' + val }));
                      } else if (!val.toUpperCase().startsWith('PHP ')) {
                        // Just ensure PHP prefix if they didn't add it
                        setValues((prev) => ({ ...prev, [field]: 'PHP ' + val.toUpperCase() }));
                      }
                    }
                  };

                  return (
                    <input
                      type={type}
                      min={isNumber ? "0" : undefined}
                      max={field === "Progress" ? "100" : undefined}
                      className="mt-1 w-full rounded-md border border-lime-700/20 bg-white px-3 py-2.5 text-sm text-olive-950 outline-none focus:border-lime-600 focus:ring-1 focus:ring-lime-600 invalid:border-red-500 invalid:text-red-600"
                      onChange={(event) =>
                        setValues((current) => ({
                          ...current,
                          [field]: event.target.value,
                        }))
                      }
                      onBlur={handleBlur}
                      placeholder={placeholder}
                      value={values[field] || ""}
                      required
                    />
                  );
                })()}
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
              onClick={handleClose}
              type="button"
            >
              Cancel
            </button>
            <button
              className="rounded-md bg-olive-900 px-4 py-2 text-sm font-bold text-lime-50 disabled:cursor-not-allowed disabled:opacity-45 flex items-center justify-center gap-2"
              disabled={!hasValues || isSubmitting}
              onClick={saveDraft}
              type="button"
            >
              {isSubmitting ? (
                <>
                  <span className="inline-block h-3.5 w-3.5 animate-spin rounded-full border-2 border-current border-t-transparent" />
                  Saving...
                </>
              ) : copy.fileName ? (
                "Save and download"
              ) : (
                "Save"
              )}
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
          setValues(initialValues || {});
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
