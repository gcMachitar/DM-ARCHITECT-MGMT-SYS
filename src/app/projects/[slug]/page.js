import { getSupabaseAdmin } from "@/lib/supabase";
import Link from "next/link";
import { notFound } from "next/navigation";
import { PageHeader, Panel, PrimaryButton, SecondaryButton, StatCard, StatusPill, ProgressBar } from "../../_components/ui";
import { ActionButton } from "../../_components/action-modal";
import { DeleteButton } from "../../_components/delete-button";
import { deleteContract, updateContract, deleteServiceRequest, updateServiceRequest } from "../../actions";
import { StatusDropdown } from "../../_components/status-dropdown";

export default async function ProjectDetailPage(props) {
  const params = await props.params;
  const slug = params.slug;
  const searchParams = await props.searchParams;
  const tab = searchParams.tab || "overview";

  const supabase = getSupabaseAdmin();
  const { data: project } = await supabase.from("projects").select("*").eq("slug", slug).single();

  if (!project) {
    notFound();
  }

  const tabs = [
    { id: "overview", label: "Overview" },
    { id: "manpower", label: "Manpower" },
    { id: "contracts", label: "Contracts" },
    { id: "services", label: "Services" },
  ];

  return (
    <main>
      <PageHeader
        eyebrow={`Project: ${project.client}`}
        title={project.name}
        action={
          <ActionButton
            action="edit-project"
            targetId={project.slug}
            initialValues={{
              "Project name": project.name,
              "Client": project.client,
              "Location": project.location,
              "Phase": project.phase,
              "Foreman": project.foreman,
              "Site engineer": project.site_engineer,
              "Architect": project.architect,
              "Crew count": project.crew,
              "Budget": project.budget,
              "Spent": project.spent,
              "Progress": project.progress,
              "Due date": project.due,
              "Status": project.status,
              "Next milestone": project.next_milestone,
              "Risk": project.risk,
            }}
            variant="primary"
          >
            Edit project
          </ActionButton>
        }
      >
        {project.location} — Current Phase: {project.phase}
      </PageHeader>
      
      <div className="border-b border-lime-900/10 bg-[#edf7e4] px-5 lg:px-8">
        <nav className="-mb-px flex space-x-8" aria-label="Tabs">
          {tabs.map((t) => (
            <Link
              key={t.id}
              href={`/projects/${slug}?tab=${t.id}`}
              className={`
                whitespace-nowrap border-b-2 py-4 px-1 text-sm font-bold
                ${
                  tab === t.id
                    ? "border-olive-900 text-olive-900"
                    : "border-transparent text-olive-700 hover:border-lime-700/30 hover:text-olive-800"
                }
              `}
            >
              {t.label}
            </Link>
          ))}
        </nav>
      </div>

      <div className="space-y-6 px-5 py-6 lg:px-8">
        {tab === "overview" && <OverviewTab project={project} />}
        {tab === "manpower" && <ManpowerTab project={project} />}
        {tab === "contracts" && <ContractsTab project={project} />}
        {tab === "services" && <ServicesTab project={project} />}
      </div>
    </main>
  );
}

function OverviewTab({ project }) {
  return (
    <div className="space-y-6">
      <section className="grid gap-4 md:grid-cols-4">
        <StatCard label="Progress" value={`${project.progress}%`} />
        <StatCard label="Phase" value={project.phase} />
        <StatCard label="Due" value={project.due} />
        <StatCard label="Risk" value={project.risk} tone={project.risk === "High" ? "dark" : "light"} />
      </section>

      <div className="grid gap-6 md:grid-cols-2">
        <Panel title="Metadata & Team" subtitle="Key stakeholders and responsibilities">
          <dl className="mt-2 space-y-4 text-sm">
            <div className="flex justify-between gap-3 border-b border-lime-900/5 pb-2">
              <dt className="text-olive-600">Architect</dt>
              <dd className="font-bold text-olive-950">{project.architect}</dd>
            </div>
            <div className="flex justify-between gap-3 border-b border-lime-900/5 pb-2">
              <dt className="text-olive-600">Site Engineer</dt>
              <dd className="font-bold text-olive-950">{project.site_engineer}</dd>
            </div>
            <div className="flex justify-between gap-3 border-b border-lime-900/5 pb-2">
              <dt className="text-olive-600">Foreman</dt>
              <dd className="font-bold text-olive-950">{project.foreman}</dd>
            </div>
            <div className="flex justify-between gap-3 pb-2">
              <dt className="text-olive-600">Status</dt>
              <dd className="font-bold text-olive-950">{project.status}</dd>
            </div>
          </dl>
        </Panel>

        <Panel title="Milestones" subtitle="Project timeline indicators">
          <div className="mt-4">
            <div className="mb-2 flex justify-between text-sm">
              <span className="font-bold text-olive-800">Overall Progress</span>
              <span className="text-olive-700">{project.progress}%</span>
            </div>
            <ProgressBar value={project.progress} />
          </div>
          <div className="mt-6 rounded-md bg-[#f0f8e6] p-4">
            <p className="text-xs font-bold uppercase tracking-wide text-olive-700">Next Milestone</p>
            <p className="mt-1 font-black text-olive-950 text-lg">{project.next_milestone}</p>
          </div>
        </Panel>
      </div>
    </div>
  );
}

function ManpowerTab({ project }) {
  return (
    <div className="max-w-2xl">
      <Panel title="Site Deployment Board" subtitle="Manpower and responsible field lead.">
        <article className="rounded-lg border border-lime-900/10 bg-white p-4">
          <div className="flex items-start justify-between gap-3">
            <div>
              <h2 className="font-black text-olive-950">{project.name}</h2>
              <p className="text-sm text-olive-700">{project.location}</p>
            </div>
            <div className="text-right">
              <p className="text-2xl font-black text-olive-950">{project.crew}</p>
              <p className="text-xs font-bold uppercase tracking-wide text-olive-700">Men Deployed</p>
            </div>
          </div>
          <dl className="mt-6 space-y-4 text-sm">
            <div className="flex justify-between gap-3 border-b border-lime-900/5 pb-3">
              <dt className="text-olive-600">Foreman</dt>
              <dd className="font-bold text-olive-950">{project.foreman}</dd>
            </div>
            <div className="flex justify-between gap-3 border-b border-lime-900/5 pb-3">
              <dt className="text-olive-600">Site engineer</dt>
              <dd className="font-bold text-olive-950">{project.site_engineer}</dd>
            </div>
            <div className="flex justify-between gap-3 pb-3">
              <dt className="text-olive-600">Phase</dt>
              <dd className="font-bold text-olive-950">{project.phase}</dd>
            </div>
          </dl>
          <div className="mt-4 border-t border-lime-900/5 pt-4">
            <ActionButton
              action="edit-project"
              targetId={project.slug}
              initialValues={{
                "Project name": project.name,
                "Client": project.client,
                "Location": project.location,
                "Phase": project.phase,
                "Foreman": project.foreman,
                "Site engineer": project.site_engineer,
                "Architect": project.architect,
                "Crew count": project.crew,
                "Budget": project.budget,
                "Spent": project.spent,
                "Progress": project.progress,
                "Due date": project.due,
                "Status": project.status,
                "Next milestone": project.next_milestone,
                "Risk": project.risk,
              }}
              variant="secondary"
            >
              Edit project manpower
            </ActionButton>
          </div>
        </article>
      </Panel>
    </div>
  );
}

async function ContractsTab({ project }) {
  const supabase = getSupabaseAdmin();
  const { data: contractItems } = await supabase.from("contracts").select("*").eq("project", project.name).order("id", { ascending: true });

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2">
        <Panel title="Cost Pulse" subtitle="Budget versus actual spend">
          <div className="mt-2 grid grid-cols-2 gap-4">
            <div className="rounded-md border border-lime-900/10 bg-[#f8fcf1] p-4">
              <p className="text-sm font-bold uppercase tracking-wide text-olive-600">Budget</p>
              <p className="mt-1 text-2xl font-black text-olive-950">{project.budget}</p>
            </div>
            <div className="rounded-md border border-lime-900/10 bg-[#f8fcf1] p-4">
              <p className="text-sm font-bold uppercase tracking-wide text-olive-600">Spent</p>
              <p className="mt-1 text-2xl font-black text-olive-950">{project.spent}</p>
            </div>
          </div>
        </Panel>
      </div>

      <Panel
        action={<PrimaryButton action="new-billing">New billing</PrimaryButton>}
        title="Contracts & Billings"
        subtitle="Financial items for this project"
      >
        <div className="overflow-x-auto">
          <table className="w-full min-w-[760px] border-collapse text-left">
            <thead className="bg-[#eef8df] text-xs uppercase tracking-wide text-olive-700">
              <tr>
                <th className="px-4 py-3">Item</th>
                <th className="px-4 py-3">Amount</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Owner</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-lime-900/10 bg-white">
              {contractItems?.map((c) => (
                <tr key={c.id}>
                  <td className="px-4 py-4 font-black text-olive-950">{c.item}</td>
                  <td className="px-4 py-4 text-sm font-black text-olive-950">{c.amount}</td>
                  <td className="px-4 py-4">
                    <StatusDropdown
                      id={c.id}
                      currentValue={c.status}
                      options={["Drafting", "Client review", "For approval", "Accounting"]}
                      onUpdate={updateContract}
                    />
                  </td>
                  <td className="px-4 py-4 text-sm font-bold text-olive-800">{c.owner}</td>
                  <td className="px-4 py-4 text-sm text-right">
                    <DeleteButton
                      id={c.id}
                      onDelete={deleteContract}
                      confirmMessage={`Are you sure you want to delete billing item "${c.item}"?`}
                    />
                  </td>
                </tr>
              ))}
              {(!contractItems || contractItems.length === 0) && (
                <tr>
                  <td colSpan="5" className="px-4 py-8 text-center text-sm text-olive-700">
                    No contract items found for this project.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Panel>
    </div>
  );
}

async function ServicesTab({ project }) {
  const supabase = getSupabaseAdmin();
  const { data: serviceRequests } = await supabase.from("service_requests").select("*").eq("project", project.name).order("id", { ascending: true });

  return (
    <Panel
      action={<PrimaryButton action="log-request">Log request</PrimaryButton>}
      title="Services & Requests"
      subtitle="Service items for this project"
    >
      <div className="overflow-x-auto">
        <table className="w-full min-w-[720px] border-collapse text-left">
          <thead className="bg-[#eef8df] text-xs uppercase tracking-wide text-olive-700">
            <tr>
              <th className="px-4 py-3">Request</th>
              <th className="px-4 py-3">Owner</th>
              <th className="px-4 py-3">Due</th>
              <th className="px-4 py-3">Stage</th>
              <th className="px-4 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-lime-900/10 bg-white">
            {serviceRequests?.map((r) => (
              <tr key={r.id}>
                <td className="px-4 py-4 font-black text-olive-950">{r.task}</td>
                <td className="px-4 py-4 text-sm font-bold text-olive-800">{r.owner}</td>
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
                    currentValue={r.stage}
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
            {(!serviceRequests || serviceRequests.length === 0) && (
              <tr>
                <td colSpan="5" className="px-4 py-8 text-center text-sm text-olive-700">
                  No service requests found for this project.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </Panel>
  );
}
