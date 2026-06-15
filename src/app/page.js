import Link from "next/link";
import { getSupabaseAdmin } from "@/lib/supabase";
import { contractItems as mockContractItems, projects as mockProjects, schedule as mockSchedule, serviceRequests as mockServiceRequests } from "./data";
import {
  PageHeader,
  Panel,
  PrimaryButton,
  ProgressBar,
  SecondaryButton,
  StatCard,
  StatusPill,
} from "./_components/ui";

const workspaces = [
  ["Projects", "/projects", "Track job status, team ownership, risk, milestones, and project cost.", "01", "icon-projects"],
  ["Manpower", "/manpower", "Check how many men are assigned, who the foreman is, and where crews are deployed.", "02", "icon-manpower"],
  ["Contracts", "/contracts", "Review billing, change orders, supplier POs, retention, and receivables.", "03", "icon-contracts"],
  ["Services", "/services", "Log office requests, procurement tasks, client approvals, and site issues.", "04", "icon-services"],
  ["Payroll", "/payroll", "Review salaries, attendance, cash advances, deductions, balances, and net release.", "05", "icon-payroll"],
];

const riskWeight = {
  High: 3,
  Medium: 2,
  Low: 1,
};

function riskTone(risk) {
  if (risk === "High") return "danger";
  if (risk === "Medium") return "warn";
  return "good";
}

export default async function OverviewPage() {
  const supabase = getSupabaseAdmin();

  // Fetch from Supabase with safe error handling and fallback
  const { data: dbProjects } = await supabase.from("projects").select("*").order("id", { ascending: true });
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

  const { data: dbSchedules } = await supabase.from("schedules").select("*").order("id", { ascending: true });
  const schedule = dbSchedules && dbSchedules.length > 0
    ? dbSchedules.map(s => [s.time, s.item, s.place])
    : mockSchedule;

  const { data: dbRequests } = await supabase.from("service_requests").select("*").order("id", { ascending: true });
  const serviceRequests = dbRequests && dbRequests.length > 0
    ? dbRequests.map(r => [r.task, r.project, r.owner, r.due, r.stage])
    : mockServiceRequests;

  const { data: dbContracts } = await supabase.from("contracts").select("*").order("id", { ascending: true });
  const contractItems = dbContracts && dbContracts.length > 0
    ? dbContracts.map(c => [c.item, c.project, c.amount, c.status])
    : mockContractItems;

  const urgent = projects.filter((project) => project.risk !== "Low").length;
  const totalCrew = projects.reduce((sum, project) => sum + project.crew, 0);
  const averageProgress = projects.length > 0
    ? Math.round(projects.reduce((sum, project) => sum + project.progress, 0) / projects.length)
    : 0;
  const priorityProjects = [...projects].sort((first, second) => {
    const riskDiff = riskWeight[second.risk] - riskWeight[first.risk];
    return riskDiff || first.progress - second.progress;
  });
  const topPriority = priorityProjects[0] || { name: "No active projects", nextMilestone: "N/A" };


  return (
    <main>
      <PageHeader
        action={<PrimaryButton action="work-order">Create work order</PrimaryButton>}
        eyebrow="Executive overview"
        title="A calmer command center for architecture, project management, and contracting."
      >
        See the current site load, design deliverables, manpower pressure,
        billing movement, and the next decisions needed by the team.
      </PageHeader>

      <div className="space-y-6 px-5 py-6 lg:px-8">
        <Panel subtitle="Start with the area of work you need to manage." title="Choose a Workspace">
          <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
            {workspaces.map(([label, href, description, number, icon], index) => (
              <Link
                className="group reveal-card rounded-lg border border-lime-900/10 bg-[#f8fcf1] p-4 transition hover:-translate-y-0.5 hover:bg-lime-50 hover:shadow-md focus:outline-none focus-visible:ring-2 focus-visible:ring-olive-800"
                href={href}
                key={href}
                style={{ animationDelay: `${index * 80}ms` }}
              >
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <span aria-hidden="true" className="icon-tile">
                      <span className={`workspace-icon ${icon}`} />
                    </span>
                    <p className="font-black text-olive-950">{label}</p>
                  </div>
                  <span className="rounded-md bg-white px-2 py-1 text-xs font-black text-olive-700 ring-1 ring-lime-900/10 transition group-hover:bg-lime-100">
                    {number}
                  </span>
                </div>
                <p className="mt-2 text-sm leading-6 text-olive-700">
                  {description}
                </p>
              </Link>
            ))}
          </div>
        </Panel>

        <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <StatCard
            icon="icon-projects"
            label="Active projects"
            note={`${urgent} need review`}
            value={projects.length}
          />
          <StatCard
            icon="icon-manpower"
            label="Men deployed"
            note="Across priority jobs"
            value={totalCrew}
          />
          <StatCard
            icon="icon-progress"
            label="Average progress"
            note="Portfolio completion"
            value={`${averageProgress}%`}
          />
          <StatCard
            icon="icon-risk"
            label="Risk items"
            note="Need review today"
            tone="dark"
            value={urgent}
          />
        </section>

        <Panel subtitle="The fastest way to decide where attention goes next." title="Today's Operating Focus">
          <div className="grid gap-4 lg:grid-cols-[1fr_1.2fr_1fr]">
            <div className="focus-card rounded-lg border border-red-900/10 bg-red-50 p-4">
              <div className="flex items-center gap-3">
                <span aria-hidden="true" className="icon-tile danger">
                  <span className="workspace-icon icon-risk" />
                </span>
                <p className="text-xs font-black uppercase tracking-wide text-red-900">
                  Highest risk
                </p>
              </div>
              <h2 className="mt-3 text-xl font-black text-olive-950">
                {topPriority.name}
              </h2>
              <p className="mt-2 text-sm leading-6 text-olive-700">
                {topPriority.nextMilestone}
              </p>
            </div>
            <div className="focus-card rounded-lg border border-lime-900/10 bg-[#f8fcf1] p-4">
              <div className="flex items-center gap-3">
                <span aria-hidden="true" className="icon-tile">
                  <span className="workspace-icon icon-progress" />
                </span>
                <p className="text-xs font-black uppercase tracking-wide text-olive-700">
                  Site pressure
                </p>
              </div>
              <div className="mt-3 grid grid-cols-3 gap-3 text-center">
                <div className="metric-tile rounded-md bg-white p-3 ring-1 ring-lime-900/10">
                  <p className="text-2xl font-black text-olive-950">
                    {schedule.length}
                  </p>
                  <p className="mt-1 text-xs font-bold text-olive-700">events</p>
                </div>
                <div className="metric-tile rounded-md bg-white p-3 ring-1 ring-lime-900/10">
                  <p className="text-2xl font-black text-olive-950">
                    {serviceRequests.length}
                  </p>
                  <p className="mt-1 text-xs font-bold text-olive-700">tasks</p>
                </div>
                <div className="metric-tile rounded-md bg-white p-3 ring-1 ring-lime-900/10">
                  <p className="text-2xl font-black text-olive-950">
                    {contractItems.length}
                  </p>
                  <p className="mt-1 text-xs font-bold text-olive-700">desk items</p>
                </div>
              </div>
            </div>
            <div className="focus-card rounded-lg border border-yellow-900/10 bg-yellow-50 p-4">
              <div className="flex items-center gap-3">
                <span aria-hidden="true" className="icon-tile warn">
                  <span className="workspace-icon icon-schedule" />
                </span>
                <p className="text-xs font-black uppercase tracking-wide text-yellow-900">
                  Next check-in
                </p>
              </div>
              <p className="mt-3 text-xl font-black text-olive-950">
                {schedule[0][0]}
              </p>
              <p className="mt-2 text-sm leading-6 text-olive-700">
                {schedule[0][1]} / {schedule[0][2]}
              </p>
            </div>
          </div>
        </Panel>

        <section className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
          <Panel
            action={<SecondaryButton href="/projects">Open projects</SecondaryButton>}
            subtitle="Progress, owner, crew, and next milestone at a glance."
            title="Priority Project Board"
          >
            <div className="grid gap-4 md:grid-cols-2">
              {priorityProjects.map((project) => (
                <article
                  className="project-card rounded-lg border border-lime-900/10 bg-[#f8fcf1] p-4"
                  key={project.slug}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <h2 className="font-black text-olive-950">
                        {project.name}
                      </h2>
                      <p className="mt-1 text-sm text-olive-700">
                        {project.client} / {project.location}
                      </p>
                    </div>
                    <StatusPill
                      tone={riskTone(project.risk)}
                    >
                      {project.risk}
                    </StatusPill>
                  </div>
                  <div className="mt-4">
                    <div className="mb-2 flex justify-between text-sm">
                      <span className="font-bold text-olive-800">
                        {project.phase}
                      </span>
                      <span className="font-black text-olive-950">
                        {project.progress}%
                      </span>
                    </div>
                    <ProgressBar
                      label={`${project.name} progress`}
                      value={project.progress}
                    />
                  </div>
                  <dl className="mt-4 grid grid-cols-2 gap-3 text-sm">
                    <div>
                      <dt className="text-olive-600">Foreman</dt>
                      <dd className="font-bold text-olive-950">
                        {project.foreman}
                      </dd>
                    </div>
                    <div>
                      <dt className="text-olive-600">Crew</dt>
                      <dd className="font-bold text-olive-950">
                        {project.crew} men
                      </dd>
                    </div>
                    <div className="col-span-2">
                      <dt className="text-olive-600">Next milestone</dt>
                      <dd className="font-bold text-olive-950">
                        {project.nextMilestone}
                      </dd>
                    </div>
                  </dl>
                </article>
              ))}
            </div>
          </Panel>

          <div className="space-y-6">
            <Panel subtitle="What the office and site teams should act on." title="Today's Schedule">
              <div className="space-y-3">
                {schedule.map(([time, item, place]) => (
                  <div
                    className="grid grid-cols-[72px_1fr] gap-3 rounded-md bg-[#f0f8e6] p-3"
                    key={`${time}-${item}`}
                  >
                    <p className="text-sm font-black text-olive-950">{time}</p>
                    <div>
                      <p className="text-sm font-bold text-olive-950">{item}</p>
                      <p className="text-xs text-olive-700">{place}</p>
                    </div>
                  </div>
                ))}
              </div>
            </Panel>

            <Panel subtitle="Billing, revisions, permits, and procurement." title="Action Queue">
              <div className="space-y-3">
                {serviceRequests.slice(0, 4).map(([task, project, owner, due]) => (
                  <div
                    className="rounded-md border border-lime-900/10 bg-white p-3"
                    key={task}
                  >
                    <div className="flex items-center justify-between gap-3">
                      <p className="font-bold text-olive-950">{task}</p>
                      <StatusPill>{due}</StatusPill>
                    </div>
                    <p className="mt-1 text-sm text-olive-700">
                      {project} / {owner}
                    </p>
                  </div>
                ))}
              </div>
            </Panel>
          </div>
        </section>

        <Panel subtitle="Financial paperwork that needs movement." title="Contract Desk Snapshot">
          <div className="grid gap-3 lg:grid-cols-4">
            {contractItems.map(([item, project, amount, status]) => (
              <div
                className="rounded-lg border border-lime-900/10 bg-[#f8fcf1] p-4"
                key={item}
              >
                <p className="font-black text-olive-950">{item}</p>
                <p className="mt-1 text-sm text-olive-700">{project}</p>
                <p className="mt-4 text-xl font-black text-olive-950">
                  {amount}
                </p>
                <p className="mt-1 text-sm font-semibold text-olive-700">
                  {status}
                </p>
              </div>
            ))}
          </div>
        </Panel>
      </div>
    </main>
  );
}
