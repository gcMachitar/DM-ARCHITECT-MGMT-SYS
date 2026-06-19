import { cookies } from "next/headers";
import Link from "next/link";
import { AUTH_COOKIE_NAME } from "@/lib/auth-config";
import { PageHeader, Panel, StatusPill } from "../_components/ui";

export default async function GuidePage(props) {
  const searchParams = await props.searchParams;
  const cookieStore = await cookies();
  
  // Get active role from cookie to set the default tab, override with query param if present
  const cookieRole = cookieStore.get(AUTH_COOKIE_NAME)?.value || "architect";
  const activeRole = searchParams.role || cookieRole;

  return (
    <main>
      <PageHeader
        eyebrow="Firm Operating System Guide"
        title="Operations Command & Workflow Guide"
      >
        A practical walkthrough showing how to use the dashboard to manage projects, deploy manpower, log contract billings, and process weekly payroll.
      </PageHeader>

      <div className="space-y-6 px-5 py-6 lg:px-8">
        {/* Role Toggle Selector */}
        <div className="flex gap-2 rounded-lg bg-lime-900/10 p-1.5 max-w-md">
          <Link
            href="/guide?role=architect"
            className={`flex-1 text-center py-2 text-sm font-bold rounded-md transition ${
              activeRole === "architect"
                ? "bg-[#eef8df] text-olive-950 shadow-sm"
                : "text-olive-900 hover:bg-lime-100/50"
            }`}
          >
            Architect Workflow
          </Link>
          <Link
            href="/guide?role=staff"
            className={`flex-1 text-center py-2 text-sm font-bold rounded-md transition ${
              activeRole === "staff"
                ? "bg-[#eef8df] text-olive-950 shadow-sm"
                : "text-olive-900 hover:bg-lime-100/50"
            }`}
          >
            Staff Workflow
          </Link>
        </div>

        {/* Integration Summary Box */}
        <section className="rounded-xl border border-lime-700/20 bg-white/80 p-5 shadow-sm backdrop-blur-md">
          <h2 className="text-sm font-black uppercase tracking-wider text-olive-800">
            System Automations & Cross-Role Sync
          </h2>
          <p className="mt-2 text-sm leading-6 text-olive-700">
            The firm dashboard isn't just an isolated database—different sections talk to each other to save time and prevent double-entry error:
          </p>
          <div className="mt-4 grid gap-4 sm:grid-cols-3">
            <div className="rounded-lg bg-[#f8fcf1] p-4 border border-lime-900/5">
              <span className="text-xs font-black text-lime-700 uppercase tracking-wide">01 / Cost Sync</span>
              <h3 className="mt-1 font-bold text-olive-950">Spent Budget Updates</h3>
              <p className="mt-1.5 text-xs leading-5 text-olive-700">
                Adding a **New Billing** in Contracts or recording a **Cash Advance** for a worker automatically adds to that project's total **Spent** budget metric in real time.
              </p>
            </div>
            <div className="rounded-lg bg-[#f8fcf1] p-4 border border-lime-900/5">
              <span className="text-xs font-black text-lime-700 uppercase tracking-wide">02 / Payout Handoff</span>
              <h3 className="mt-1 font-bold text-olive-950">Contract Status Flags</h3>
              <p className="mt-1.5 text-xs leading-5 text-olive-700">
                When an Architect marks a billing item as "Approved", the system transforms its status to **"Approved - Ready for Payment"**, instantly alerting Staff to release funds.
              </p>
            </div>
            <div className="rounded-lg bg-[#f8fcf1] p-4 border border-lime-900/5">
              <span className="text-xs font-black text-lime-700 uppercase tracking-wide">03 / Workforce Shift</span>
              <h3 className="mt-1 font-bold text-olive-950">Manpower Allocations</h3>
              <p className="mt-1.5 text-xs leading-5 text-olive-700">
                Executing the **Assign Crew** action shifts workers from standby status directly to active site deployment, automatically recalculating project headcount.
              </p>
            </div>
          </div>
        </section>

        {/* Core Guide Content Panels */}
        {activeRole === "architect" ? (
          <div className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
            <Panel subtitle="Step-by-step instructions for managing design and site execution." title="Architect Operations">
              <ol className="divide-y divide-lime-900/10">
                <li className="py-4 first:pt-0">
                  <div className="flex items-start gap-3">
                    <span className="grid h-6 w-6 shrink-0 place-items-center rounded-full bg-olive-900 text-xs font-black text-lime-50">1</span>
                    <div>
                      <h3 className="font-bold text-olive-950">Create a New Project Job File</h3>
                      <p className="mt-1.5 text-sm leading-6 text-olive-700">
                        Start a project by clicking the **New Project** button in the header. Fill in the **Project name**, **Client name**, and **Location**. Once saved, this generates a unique URL slug and initializes the project status to *Planning* with a default milestone.
                      </p>
                    </div>
                  </div>
                </li>
                
                <li className="py-4">
                  <div className="flex items-start gap-3">
                    <span className="grid h-6 w-6 shrink-0 place-items-center rounded-full bg-olive-900 text-xs font-black text-lime-50">2</span>
                    <div>
                      <h3 className="font-bold text-olive-950">Deploy Site Crew</h3>
                      <p className="mt-1.5 text-sm leading-6 text-olive-700">
                        Navigate to the **Manpower** workspace. Click the **Assign Crew** button. Select the target project, select the trade (Masonry, Electrical, Carpentry, Painting, Foremen, or specify a Custom trade), and input the number of workers to move. The dashboard subtracts these from standby and deploys them to the site.
                      </p>
                    </div>
                  </div>
                </li>

                <li className="py-4">
                  <div className="flex items-start gap-3">
                    <span className="grid h-6 w-6 shrink-0 place-items-center rounded-full bg-olive-900 text-xs font-black text-lime-50">3</span>
                    <div>
                      <h3 className="font-bold text-olive-950">Approve Billings & Change Orders</h3>
                      <p className="mt-1.5 text-sm leading-6 text-olive-700">
                        Go to the **Contracts** page to review outstanding items in the Ledger. For any item waiting for review, click the dropdown under the Status column and change it to **Approved**. This flags the item as *Approved - Ready for Payment* for the administrative staff to release.
                      </p>
                    </div>
                  </div>
                </li>

                <li className="py-4 last:pb-0">
                  <div className="flex items-start gap-3">
                    <span className="grid h-6 w-6 shrink-0 place-items-center rounded-full bg-olive-900 text-xs font-black text-lime-50">4</span>
                    <div>
                      <h3 className="font-bold text-olive-950">Manage Calendar and Site Events</h3>
                      <p className="mt-1.5 text-sm leading-6 text-olive-700">
                        On the main dashboard **Overview** page, use the **Today's Schedule** panel to add site coordination events, safety meetings, or walkthroughs by clicking **Add Event**. Fill in the time, event text, and site location.
                      </p>
                    </div>
                  </div>
                </li>
              </ol>
            </Panel>

            <div className="space-y-6">
              <Panel subtitle="Fields, numbers, and formatting." title="Input Cheat Sheet">
                <div className="space-y-4 text-sm leading-6">
                  <div>
                    <h4 className="font-bold text-olive-950">Project Names & Slug Generation</h4>
                    <p className="text-olive-700">
                      When naming projects, write them cleanly (e.g., `Apokon Residence`). The system automatically converts this to `apokon-residence` for clean links.
                    </p>
                  </div>
                  <div>
                    <h4 className="font-bold text-olive-950">Budget Currencies</h4>
                    <p className="text-olive-700">
                      Input budgets using standard abbreviations (e.g., `PHP 8.4M` or `PHP 500K`). The calculations automatically parse these suffixes to increment expenses.
                    </p>
                  </div>
                  <div>
                    <h4 className="font-bold text-olive-950">Site Risk Assessment</h4>
                    <p className="text-olive-700">
                      Label project risks as **High**, **Medium**, or **Low**. High and Medium risk projects automatically float to the top of your dashboard Overview feed.
                    </p>
                  </div>
                </div>
              </Panel>

              <Panel subtitle="Active role tools." title="Navigation Access">
                <p className="text-sm leading-6 text-olive-700">
                  As an **Architect**, you have unique access to:
                </p>
                <ul className="mt-3 space-y-2 text-sm font-semibold text-olive-900">
                  <li className="flex items-center gap-2">
                    <span className="h-1.5 w-1.5 rounded-full bg-lime-600" />
                    Projects (Full scope editing and deletes)
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="h-1.5 w-1.5 rounded-full bg-lime-600" />
                    Manpower (Full trade count adjustments)
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="h-1.5 w-1.5 rounded-full bg-lime-600" />
                    Contracts Approval Desk
                  </li>
                </ul>
              </Panel>
            </div>
          </div>
        ) : (
          <div className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
            <Panel subtitle="Step-by-step instructions for back-office payroll, advances, and service requests." title="Staff Operations">
              <ol className="divide-y divide-lime-900/10">
                <li className="py-4 first:pt-0">
                  <div className="flex items-start gap-3">
                    <span className="grid h-6 w-6 shrink-0 place-items-center rounded-full bg-olive-900 text-xs font-black text-lime-50">1</span>
                    <div>
                      <h3 className="font-bold text-olive-950">Register New Staff / Workers</h3>
                      <p className="mt-1.5 text-sm leading-6 text-olive-700">
                        Go to **Payroll & Employees** and click the **Add New Employee** button. Input the employee name, select their role (Masonry, Electrical, Carpentry, Painting, Foremen, or specify a Custom role), current project assignment, and daily rate. They will immediately be added to the directory list.
                      </p>
                    </div>
                  </div>
                </li>

                <li className="py-4">
                  <div className="flex items-start gap-3">
                    <span className="grid h-6 w-6 shrink-0 place-items-center rounded-full bg-olive-900 text-xs font-black text-lime-50">2</span>
                    <div>
                      <h3 className="font-bold text-olive-950">Issue Cash Advances (CA)</h3>
                      <p className="mt-1.5 text-sm leading-6 text-olive-700">
                        Click **Record CA** on the payroll page. Select the worker's name, input the total advance cash amount, and set the deduction amount for the current cutoff. The system deducts this from their net payout and tracks the remaining balance.
                      </p>
                    </div>
                  </div>
                </li>

                <li className="py-4">
                  <div className="flex items-start gap-3">
                    <span className="grid h-6 w-6 shrink-0 place-items-center rounded-full bg-olive-900 text-xs font-black text-lime-50">3</span>
                    <div>
                      <h3 className="font-bold text-olive-950">Run and Export Payroll</h3>
                      <p className="mt-1.5 text-sm leading-6 text-olive-700">
                        Input days worked and overtime on the employee list. Click **Batch Approve Payroll** to lock in payouts. Under the **Receipt & Export Options** section at the bottom, select **Prepare** on any item to generate clean text register outputs or individual worker payslips.
                      </p>
                    </div>
                  </div>
                </li>

                <li className="py-4">
                  <div className="flex items-start gap-3">
                    <span className="grid h-6 w-6 shrink-0 place-items-center rounded-full bg-olive-900 text-xs font-black text-lime-50">4</span>
                    <div>
                      <h3 className="font-bold text-olive-950">Log Site Service Requests</h3>
                      <p className="mt-1.5 text-sm leading-6 text-olive-700">
                        Under **Services**, log client inquiries, procurement updates, or permit delays. If multiple requests are pending, click **Assign Selected Requests** to batch assign them to a team and set target completion dates.
                      </p>
                    </div>
                  </div>
                </li>
              </ol>
            </Panel>

            <div className="space-y-6">
              <Panel subtitle="Calculations and formatting." title="Payroll Cheat Sheet">
                <div className="space-y-4 text-sm leading-6">
                  <div>
                    <h4 className="font-bold text-olive-950">Gross Pay Calculation</h4>
                    <p className="text-olive-700">
                      Calculated automatically: `Gross = (Days Worked × Daily Rate) + Overtime`. Deductions and cash advances subtract from this total to compute the final `Net Payout`.
                    </p>
                  </div>
                  <div>
                    <h4 className="font-bold text-olive-950">Log New Billings</h4>
                    <p className="text-olive-700">
                      When logging progress billings or change orders, go to **Contracts** &rarr; click **New billing**. Select the correct project, enter the exact billing text, and the amount (e.g. `PHP 150K`).
                    </p>
                  </div>
                  <div>
                    <h4 className="font-bold text-olive-950">Worker Release Methods</h4>
                    <p className="text-olive-700">
                      Assign release methods as **Bank transfer** or **Cash pickup**. The system group metrics automatically so you know how much cash to withdraw from the bank for envelope handoffs.
                    </p>
                  </div>
                </div>
              </Panel>

              <Panel subtitle="Active role tools." title="Navigation Access">
                <p className="text-sm leading-6 text-olive-700">
                  As administrative **Staff**, you have unique access to:
                </p>
                <ul className="mt-3 space-y-2 text-sm font-semibold text-olive-900">
                  <li className="flex items-center gap-2">
                    <span className="h-1.5 w-1.5 rounded-full bg-lime-600" />
                    Payroll & Worker Directories
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="h-1.5 w-1.5 rounded-full bg-lime-600" />
                    Cash Advance ledger and deductions
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="h-1.5 w-1.5 rounded-full bg-lime-600" />
                    Office Service Queue
                  </li>
                </ul>
              </Panel>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
