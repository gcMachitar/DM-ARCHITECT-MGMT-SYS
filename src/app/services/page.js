import { getSupabaseAdmin } from "@/lib/supabase";
import { serviceRequests as mockServiceRequests } from "../data";
import {
  PageHeader,
  Panel,
  PrimaryButton,
  SecondaryButton,
  StatCard,
  StatusPill,
} from "../_components/ui";

const serviceLines = [
  ["Architectural Design", "Concepts, schematic plans, design development, and permit sets.", "4 scopes"],
  ["Project Management", "Site coordination, meeting records, schedule tracking, and owner reports.", "7 sites"],
  ["Construction Contracting", "Labor deployment, foreman supervision, procurement, and execution.", "56 workers"],
  ["Interior Fit-Out", "Finish boards, joinery, ceiling, lighting, and turnover punch lists.", "3 scopes"],
];

export default async function ServicesPage() {
  const supabase = getSupabaseAdmin();
  const { data: dbRequests } = await supabase.from("service_requests").select("*");
  const serviceRequests = dbRequests && dbRequests.length > 0
    ? dbRequests.map(r => [r.task, r.project, r.owner, r.due, r.stage])
    : mockServiceRequests;
  return (
    <main>
      <PageHeader
        action={<PrimaryButton action="log-request">Log request</PrimaryButton>}
        eyebrow="Services and requests"
        title="A service desk for the architecture office and the construction field team."
      >
        Convert design questions, procurement needs, site problems, client
        approvals, and turnover tasks into visible work.
      </PageHeader>

      <div className="space-y-6 px-5 py-6 lg:px-8">
        <section className="grid gap-4 md:grid-cols-4">
          <StatCard label="Open requests" note="5 in queue" value="18" />
          <StatCard label="Due today" note="Needs action" value="4" tone="dark" />
          <StatCard label="Procurement" note="Materials pending" value="6" />
          <StatCard label="Design reviews" note="Architect desk" value="3" />
        </section>

        <section className="grid gap-6 xl:grid-cols-[0.9fr_1.1fr]">
          <Panel subtitle="Services the firm can manage from this system." title="Service Lines">
            <div className="grid gap-4">
              {serviceLines.map(([name, description, count]) => (
                <article
                  className="rounded-lg border border-lime-900/10 bg-[#f8fcf1] p-4"
                  key={name}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <h2 className="font-black text-olive-950">{name}</h2>
                      <p className="mt-2 text-sm leading-6 text-olive-700">
                        {description}
                      </p>
                    </div>
                    <StatusPill tone="good">{count}</StatusPill>
                  </div>
                </article>
              ))}
            </div>
          </Panel>

          <Panel
            action={<SecondaryButton action="assign-selected">Assign selected</SecondaryButton>}
            subtitle="Work that should not disappear inside chat messages."
            title="Request Queue"
          >
            <div className="overflow-x-auto">
              <table className="w-full min-w-[720px] border-collapse text-left">
                <thead className="bg-[#eef8df] text-xs uppercase tracking-wide text-olive-700">
                  <tr>
                    <th className="px-4 py-3">Request</th>
                    <th className="px-4 py-3">Project</th>
                    <th className="px-4 py-3">Owner</th>
                    <th className="px-4 py-3">Due</th>
                    <th className="px-4 py-3">Stage</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-lime-900/10 bg-white">
                  {serviceRequests.map(([task, project, owner, due, stage], index) => (
                    <tr key={task}>
                      <td className="px-4 py-4 font-black text-olive-950">
                        {task}
                      </td>
                      <td className="px-4 py-4 text-sm text-olive-700">
                        {project}
                      </td>
                      <td className="px-4 py-4 text-sm font-bold text-olive-800">
                        {owner}
                      </td>
                      <td className="px-4 py-4">
                        <StatusPill tone={due === "Today" ? "warn" : "neutral"}>
                          {due}
                        </StatusPill>
                      </td>
                      <td className="px-4 py-4 text-sm text-olive-700">
                        {stage || (index % 2 === 0 ? "Review" : "In progress")}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Panel>
        </section>
      </div>
    </main>
  );
}
