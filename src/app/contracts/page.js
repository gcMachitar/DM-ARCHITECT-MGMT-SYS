import { getSupabaseAdmin } from "@/lib/supabase";
import { contractItems as mockContractItems, projects as mockProjects } from "../data";
import {
  PageHeader,
  Panel,
  PrimaryButton,
  SecondaryButton,
  StatCard,
  StatusPill,
} from "../_components/ui";
import { DeleteButton } from "../_components/delete-button";
import { StatusDropdown } from "../_components/status-dropdown";
import { deleteContract, updateContract } from "../actions";

export default async function ContractsPage() {
  const supabase = getSupabaseAdmin();
  const { data: dbContracts } = await supabase.from("contracts").select("*");
  const contractItems = dbContracts && dbContracts.length > 0
    ? dbContracts.map(c => ({ id: c.id, item: c.item, project: c.project, amount: c.amount, status: c.status, owner: c.owner }))
    : mockContractItems.map(([item, project, amount, status, owner], index) => ({ id: `mock-${index}`, item, project, amount, status, owner }));

  const { data: dbProjects } = await supabase.from("projects").select("*");
  const projects = dbProjects && dbProjects.length > 0
    ? dbProjects.map(p => ({
        slug: p.slug,
        name: p.name,
        client: p.client,
        location: p.location,
        phase: p.phase,
        foreman: p.foreman,
        siteEngineer: p.site_engineer,
        architect: p.architect,
        crew: p.crew,
        budget: p.budget,
        spent: p.spent,
        progress: p.progress,
        due: p.due,
        status: p.status,
        nextMilestone: p.next_milestone,
        risk: p.risk,
      }))
    : mockProjects;
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
                    <th className="px-4 py-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-lime-900/10 bg-white">
                  {contractItems.map((c, index) => (
                    <tr key={c.id || c.item}>
                      <td className="px-4 py-4 font-black text-olive-950">
                        {c.item}
                      </td>
                      <td className="px-4 py-4 text-sm text-olive-700">
                        {c.project}
                      </td>
                      <td className="px-4 py-4 text-sm font-black text-olive-950">
                        {c.amount}
                      </td>
                      <td className="px-4 py-4">
                        <StatusDropdown
                          id={c.id}
                          currentValue={c.status}
                          options={["Drafting", "Client review", "For approval", "Accounting"]}
                          onUpdate={updateContract}
                        />
                      </td>
                      <td className="px-4 py-4 text-sm font-bold text-olive-800">
                        {c.owner || (index % 2 === 0 ? "Accounting" : "Management")}
                      </td>
                      <td className="px-4 py-4 text-sm text-right">
                        <DeleteButton
                          id={c.id}
                          onDelete={deleteContract}
                          confirmMessage={`Are you sure you want to delete billing item "${c.item}"?`}
                        />
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
