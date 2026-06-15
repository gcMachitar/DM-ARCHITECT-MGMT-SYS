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
import { DeleteButton } from "../_components/delete-button";
import { StatusDropdown } from "../_components/status-dropdown";
import { deleteServiceRequest, updateServiceRequest } from "../actions";
import { ProjectFilter } from "../_components/project-filter";

const serviceLines = [
  ["Architectural Design", "Concepts, schematic plans, design development, and permit sets.", "4 scopes"],
  ["Project Management", "Site coordination, meeting records, schedule tracking, and owner reports.", "7 sites"],
  ["Construction Contracting", "Labor deployment, foreman supervision, procurement, and execution.", "56 workers"],
  ["Interior Fit-Out", "Finish boards, joinery, ceiling, lighting, and turnover punch lists.", "3 scopes"],
];

export default async function ServicesPage(props) {
  const searchParams = await props.searchParams;
  const currentProjectName = searchParams?.project || "";

  const supabase = getSupabaseAdmin();
  const { data: dbRequests } = await supabase.from("service_requests").select("*").order("id", { ascending: true });
  const allServiceRequests = dbRequests && dbRequests.length > 0
    ? dbRequests.map(r => ({ id: r.id, task: r.task, project: r.project, owner: r.owner, due: r.due, stage: r.stage }))
    : mockServiceRequests.map(([task, project, owner, due, stage], index) => ({ id: `mock-${index}`, task, project, owner, due, stage }));

  const serviceRequests = currentProjectName
    ? allServiceRequests.filter(r => r.project === currentProjectName)
    : allServiceRequests;

  const { data: dbProjects } = await supabase.from("projects").select("*").order("id", { ascending: true });
  const allProjects = dbProjects && dbProjects.length > 0
    ? dbProjects.map(p => ({ slug: p.slug, name: p.name }))
    : [];

  return (
    <main>
      <PageHeader
        action={
          <div className="flex gap-2 items-center">
            <ProjectFilter projects={allProjects} />
            <PrimaryButton action="log-request">Log request</PrimaryButton>
          </div>
        }
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
                    <th className="px-4 py-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-lime-900/10 bg-white">
                  {serviceRequests.map((r, index) => (
                    <tr key={r.id || r.task}>
                      <td className="px-4 py-4 font-black text-olive-950">
                        {r.task}
                      </td>
                      <td className="px-4 py-4 text-sm text-olive-700">
                        {r.project}
                      </td>
                      <td className="px-4 py-4 text-sm font-bold text-olive-800">
                        {r.owner}
                      </td>
                      <td className="px-4 py-4">
                        {(() => {
                          const isDate = !isNaN(Date.parse(r.due));
                          const isOverdue = isDate && new Date(r.due) < new Date(new Date().setHours(0,0,0,0));
                          const tone = isOverdue ? "danger" : r.due === "Today" ? "warn" : "neutral";
                          return (
                            <StatusPill tone={tone}>
                              {isOverdue ? "Overdue" : r.due}
                            </StatusPill>
                          );
                        })()}
                      </td>
                      <td className="px-4 py-4 text-sm">
                        <StatusDropdown
                          id={r.id}
                          currentValue={r.stage || (index % 2 === 0 ? "Review" : "In progress")}
                          options={["Review", "In progress", "Done"]}
                          onUpdate={updateServiceRequest}
                        />
                      </td>
                      <td className="px-4 py-4 text-sm text-right">
                        <DeleteButton
                          id={r.id}
                          onDelete={deleteServiceRequest}
                          confirmMessage={`Are you sure you want to delete request "${r.task}"?`}
                        />
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
