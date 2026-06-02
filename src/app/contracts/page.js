import { contractItems, projects } from "../data";
import {
  PageHeader,
  Panel,
  PrimaryButton,
  SecondaryButton,
  StatCard,
  StatusPill,
} from "../_components/ui";

export default function ContractsPage() {
  return (
    <main>
      <PageHeader
        action={<PrimaryButton action="new-billing">New billing</PrimaryButton>}
        eyebrow="Construction and contract control"
        title="Track billings, change orders, supplier commitments, and project cost movement."
      >
        A working contract desk for management approvals, accounting handoff,
        purchase orders, retention, and client-facing documentation.
      </PageHeader>

      <div className="space-y-6 px-5 py-6 lg:px-8">
        <section className="grid gap-4 md:grid-cols-4">
          <StatCard label="Pending billing" note="Needs signature" value="5" />
          <StatCard label="Change orders" note="3 client reviews" value="7" />
          <StatCard label="Supplier POs" note="Open commitments" value="12" />
          <StatCard label="Receivables" note="Current month" value="PHP 4.8M" tone="dark" />
        </section>

        <section className="grid gap-6 xl:grid-cols-[1fr_360px]">
          <Panel
            action={<SecondaryButton action="download-ledger">Download ledger</SecondaryButton>}
            subtitle="Money items moving between project team, accounting, suppliers, and clients."
            title="Contract Action Ledger"
          >
            <div className="overflow-x-auto">
              <table className="w-full min-w-[760px] border-collapse text-left">
                <thead className="bg-[#eef8df] text-xs uppercase tracking-wide text-olive-700">
                  <tr>
                    <th className="px-4 py-3">Item</th>
                    <th className="px-4 py-3">Project</th>
                    <th className="px-4 py-3">Amount</th>
                    <th className="px-4 py-3">Status</th>
                    <th className="px-4 py-3">Owner</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-lime-900/10 bg-white">
                  {contractItems.map(([item, project, amount, status], index) => (
                    <tr key={item}>
                      <td className="px-4 py-4 font-black text-olive-950">
                        {item}
                      </td>
                      <td className="px-4 py-4 text-sm text-olive-700">
                        {project}
                      </td>
                      <td className="px-4 py-4 text-sm font-black text-olive-950">
                        {amount}
                      </td>
                      <td className="px-4 py-4">
                        <StatusPill tone={index === 1 ? "warn" : "neutral"}>
                          {status}
                        </StatusPill>
                      </td>
                      <td className="px-4 py-4 text-sm font-bold text-olive-800">
                        {index % 2 === 0 ? "Accounting" : "Management"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Panel>

          <Panel subtitle="Budget versus actual spend by active project." title="Cost Pulse">
            <div className="space-y-3">
              {projects.map((project) => (
                <div
                  className="rounded-md border border-lime-900/10 bg-[#f8fcf1] p-3"
                  key={project.slug}
                >
                  <p className="font-bold text-olive-950">{project.name}</p>
                  <div className="mt-2 grid grid-cols-2 gap-2 text-sm">
                    <div>
                      <p className="text-olive-600">Budget</p>
                      <p className="font-black text-olive-950">
                        {project.budget}
                      </p>
                    </div>
                    <div>
                      <p className="text-olive-600">Spent</p>
                      <p className="font-black text-olive-950">
                        {project.spent}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Panel>
        </section>
      </div>
    </main>
  );
}
