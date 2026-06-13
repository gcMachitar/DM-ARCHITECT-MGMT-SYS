import { getSupabaseAdmin } from "@/lib/supabase";
import { manpower as mockManpower, projects as mockProjects } from "../data";
import {
  PageHeader,
  Panel,
  PrimaryButton,
  SecondaryButton,
  ProgressBar,
  StatCard,
  StatusPill,
} from "../_components/ui";
import { DeleteButton } from "../_components/delete-button";
import { deleteManpower } from "../actions";

export default async function ManpowerPage() {
  const supabase = getSupabaseAdmin();
  const { data: dbManpower } = await supabase.from("manpower").select("*");
  const manpower = dbManpower && dbManpower.length > 0
    ? dbManpower
    : mockManpower.map((m, index) => ({ id: `mock-${index}`, ...m }));

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

  const deployed = manpower.reduce((sum, group) => sum + (group.deployed || 0), 0);
  const standby = manpower.reduce((sum, group) => sum + (group.standby || 0), 0);


  return (
    <main>
      <PageHeader
        action={
          <div className="flex gap-2">
            <SecondaryButton action="add-manpower">Add trade group</SecondaryButton>
            <PrimaryButton action="assign-crew">Assign crew</PrimaryButton>
          </div>
        }
        eyebrow="Manpower and foremen"
        title="Know exactly how many men are assigned, who leads them, and where each crew is needed."
      >
        Built for daily site deployment, trade balancing, standby tracking, and
        foreman accountability.
      </PageHeader>

      <div className="space-y-6 px-5 py-6 lg:px-8">
        <section className="grid gap-4 md:grid-cols-3">
          <StatCard label="Deployed today" note="Across active jobs" value={deployed} />
          <StatCard label="Available standby" note="Can be reassigned" value={standby} />
          <StatCard label="Foremen active" note="Site accountability" value="4" tone="dark" />
        </section>

        <section className="grid gap-6 xl:grid-cols-[0.9fr_1.1fr]">
          <Panel subtitle="Trade availability and site load." title="Crew Allocation">
            <div className="space-y-4">
              {manpower.map((group) => (
                <div
                  className="rounded-lg border border-lime-900/10 bg-[#f8fcf1] p-4"
                  key={group.id || group.trade}
                >
                  <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                    <div>
                      <p className="text-lg font-black text-olive-950">
                        {group.trade}
                      </p>
                      <p className="text-sm text-olive-700">
                        Lead: {group.lead} / {group.projects}
                      </p>
                    </div>
                    <StatusPill tone={group.standby === 0 ? "warn" : "good"}>
                      {group.standby} standby
                    </StatusPill>
                  </div>
                  <div className="mt-4">
                    <div className="mb-2 flex justify-between text-sm">
                      <span className="font-bold text-olive-800">
                        {group.deployed} deployed
                      </span>
                      <span className="text-olive-700">{group.total} total</span>
                    </div>
                    <ProgressBar value={group.total > 0 ? (group.deployed / group.total) * 100 : 0} />
                  </div>
                  
                  <div className="mt-4 flex items-center justify-between gap-3 border-t border-lime-900/5 pt-3">
                    <SecondaryButton
                      action="edit-manpower"
                      targetId={group.id}
                      initialValues={{
                        "Trade": group.trade,
                        "Total": group.total,
                        "Deployed": group.deployed,
                        "Lead foreman": group.lead,
                        "Projects": group.projects,
                      }}
                      className="rounded-md border border-lime-700/25 bg-white/70 px-3 py-1.5 text-xs font-bold text-olive-800 transition hover:bg-lime-50"
                    >
                      Edit
                    </SecondaryButton>
                    <DeleteButton
                      id={group.id}
                      onDelete={deleteManpower}
                      confirmMessage={`Are you sure you want to delete the ${group.trade} crew?`}
                    />
                  </div>
                </div>
              ))}
            </div>
          </Panel>

          <Panel subtitle="Manpower per project and responsible field lead." title="Site Deployment Board">
            <div className="grid gap-4 md:grid-cols-2">
              {projects.map((project) => (
                <article
                  className="rounded-lg border border-lime-900/10 bg-white p-4"
                  key={project.slug}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <h2 className="font-black text-olive-950">
                        {project.name}
                      </h2>
                      <p className="text-sm text-olive-700">
                        {project.location}
                      </p>
                    </div>
                    <p className="text-2xl font-black text-olive-950">
                      {project.crew}
                    </p>
                  </div>
                  <dl className="mt-4 space-y-3 text-sm">
                    <div className="flex justify-between gap-3">
                      <dt className="text-olive-600">Foreman</dt>
                      <dd className="font-bold text-olive-950">
                        {project.foreman}
                      </dd>
                    </div>
                    <div className="flex justify-between gap-3">
                      <dt className="text-olive-600">Site engineer</dt>
                      <dd className="font-bold text-olive-950">
                        {project.siteEngineer}
                      </dd>
                    </div>
                    <div className="flex justify-between gap-3">
                      <dt className="text-olive-600">Phase</dt>
                      <dd className="font-bold text-olive-950">
                        {project.phase}
                      </dd>
                    </div>
                  </dl>
                </article>
              ))}
            </div>
          </Panel>
        </section>
      </div>
    </main>
  );
}
