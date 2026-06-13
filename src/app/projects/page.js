import { getSupabaseAdmin } from "@/lib/supabase";
import { projects as mockProjects } from "../data";
import {
  PageHeader,
  Panel,
  PrimaryButton,
  ProgressBar,
  SecondaryButton,
  StatusPill,
} from "../_components/ui";
import { ActionButton } from "../_components/action-modal";
import { DeleteButton } from "../_components/delete-button";
import { deleteProject } from "../actions";

export default async function ProjectsPage() {
  const supabase = getSupabaseAdmin();
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
        action={<PrimaryButton action="add-project">Add project</PrimaryButton>}
        eyebrow="Project management"
        title="Organized job files for design, site execution, crew ownership, and turnover."
      >
        Each project carries its client, responsible architect, site engineer,
        foreman, crew count, budget, progress, risk, and next milestone.
      </PageHeader>

      <div className="grid gap-6 px-5 py-6 lg:grid-cols-[1fr_340px] lg:px-8">
        <Panel
          action={<SecondaryButton action="export-report">Export report</SecondaryButton>}
          subtitle="Sorted by field urgency and delivery phase."
          title="Project Register"
        >
          <div className="overflow-x-auto">
            <table className="w-full min-w-[980px] border-collapse text-left">
              <thead className="bg-[#eef8df] text-xs uppercase tracking-wide text-olive-700">
                <tr>
                  <th className="px-4 py-3">Project</th>
                  <th className="px-4 py-3">Team</th>
                  <th className="px-4 py-3">Phase</th>
                  <th className="px-4 py-3">Crew</th>
                  <th className="px-4 py-3">Cost</th>
                  <th className="px-4 py-3">Progress</th>
                  <th className="px-4 py-3">Risk</th>
                  <th className="px-4 py-3">Due</th>
                  <th className="px-4 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-lime-900/10 bg-white">
                {projects.map((project) => (
                  <tr key={project.slug}>
                    <td className="px-4 py-4">
                      <p className="font-black text-olive-950">
                        {project.name}
                      </p>
                      <p className="text-sm text-olive-700">
                        {project.client} / {project.location}
                      </p>
                    </td>
                    <td className="px-4 py-4 text-sm">
                      <p className="font-bold text-olive-950">
                        {project.architect}
                      </p>
                      <p className="text-olive-700">{project.siteEngineer}</p>
                      <p className="text-olive-700">{project.foreman}</p>
                    </td>
                    <td className="px-4 py-4 text-sm font-bold text-olive-800">
                      {project.phase}
                    </td>
                    <td className="px-4 py-4 text-sm font-black text-olive-950">
                      {project.crew}
                    </td>
                    <td className="px-4 py-4 text-sm">
                      <p className="font-bold text-olive-950">
                        {project.budget}
                      </p>
                      <p className="text-olive-700">Spent {project.spent}</p>
                    </td>
                    <td className="px-4 py-4">
                      <div className="min-w-36">
                        <div className="mb-2 flex justify-between text-sm">
                          <span className="font-bold text-olive-800">
                            {project.progress}%
                          </span>
                        </div>
                        <ProgressBar value={project.progress} />
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <StatusPill
                        tone={
                          project.risk === "High"
                            ? "danger"
                            : project.risk === "Medium"
                              ? "warn"
                              : "good"
                        }
                      >
                        {project.risk}
                      </StatusPill>
                    </td>
                    <td className="px-4 py-4 text-sm">
                      <p className="font-bold text-olive-950">{project.due}</p>
                      <p className="text-olive-700">{project.status}</p>
                    </td>
                    <td className="px-4 py-4 text-sm text-right">
                      <div className="flex items-center justify-end gap-2">
                        <ActionButton
                          action="edit-project"
                          variant="secondary"
                          targetId={project.slug}
                          initialValues={{
                            "Project name": project.name,
                            "Client": project.client,
                            "Location": project.location,
                            "Phase": project.phase,
                            "Foreman": project.foreman,
                            "Site engineer": project.siteEngineer,
                            "Architect": project.architect,
                            "Crew count": project.crew,
                            "Budget": project.budget,
                            "Spent": project.spent,
                            "Progress": project.progress,
                            "Due date": project.due,
                            "Status": project.status,
                            "Next milestone": project.nextMilestone,
                            "Risk": project.risk,
                          }}
                        >
                          Edit
                        </ActionButton>
                        <DeleteButton
                          id={project.slug}
                          onDelete={deleteProject}
                          confirmMessage={`Are you sure you want to delete project "${project.name}"?`}
                        />
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Panel>

        <div className="space-y-6">
          <Panel subtitle="Milestones needing coordination." title="Next Site Decisions">
            <div className="space-y-3">
              {projects.map((project) => (
                <div className="rounded-md bg-[#f0f8e6] p-3" key={project.slug}>
                  <p className="font-bold text-olive-950">
                    {project.nextMilestone}
                  </p>
                  <p className="mt-1 text-sm text-olive-700">
                    {project.name} / {project.phase}
                  </p>
                </div>
              ))}
            </div>
          </Panel>

          <Panel subtitle="How the work portfolio is distributed." title="Phase Mix">
            <div className="space-y-3 text-sm">
              {["Design Development", "Construction", "Interior Works", "Turnover"].map(
                (phase) => (
                  <div
                    className="flex items-center justify-between rounded-md border border-lime-900/10 bg-white px-3 py-2"
                    key={phase}
                  >
                    <span className="font-bold text-olive-950">{phase}</span>
                    <span className="text-olive-700">
                      {projects.filter((project) => project.phase === phase).length}
                    </span>
                  </div>
                ),
              )}
            </div>
          </Panel>
        </div>
      </div>
    </main>
  );
}
