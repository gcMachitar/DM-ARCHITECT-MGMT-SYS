import { getSupabaseAdmin } from "@/lib/supabase";
import { projects, manpower, contractItems, serviceRequests, schedule } from "@/app/data";

const initialEmployees = [
  {
    name: "Ramon Bautista",
    role: "Foreman",
    project: "Alabang Residence",
    days: 12,
    rate: 1450,
    overtime: 2400,
    cash_advance: 5000,
    ca_balance: 8500,
    deductions: 1260,
    release_method: "Bank transfer",
    receipt_status: "Needs payslip",
    status: "CA active",
  },
  {
    name: "Joey Santos",
    role: "Mason",
    project: "Makati Fit-out",
    days: 11,
    rate: 950,
    overtime: 1200,
    cash_advance: 0,
    ca_balance: 0,
    deductions: 780,
    release_method: "Cash pickup",
    receipt_status: "Ready",
    status: "Ready",
  },
  {
    name: "Arnel Cruz",
    role: "Electrician",
    project: "Tagaytay Villas",
    days: 10,
    rate: 1100,
    overtime: 1800,
    cash_advance: 3000,
    ca_balance: 3000,
    deductions: 920,
    release_method: "Bank transfer",
    receipt_status: "Needs payslip",
    status: "CA active",
  },
  {
    name: "Mila Reyes",
    role: "Admin Assistant",
    project: "Main Office",
    days: 13,
    rate: 1050,
    overtime: 0,
    cash_advance: 1500,
    ca_balance: 1500,
    deductions: 890,
    release_method: "Bank transfer",
    receipt_status: "Ready",
    status: "Ready",
  },
  {
    name: "Dennis Lim",
    role: "Painter",
    project: "BGC Office",
    days: 9,
    rate: 900,
    overtime: 700,
    cash_advance: 4000,
    ca_balance: 6400,
    deductions: 650,
    release_method: "Cash pickup",
    receipt_status: "Hold",
    status: "Review",
  },
];

export async function GET() {
  const supabase = getSupabaseAdmin();

  const results = {};

  try {
    // 1. Seed Projects
    const { data: existingProjects } = await supabase.from("projects").select("id").limit(1);
    if (!existingProjects || existingProjects.length === 0) {
      const formattedProjects = projects.map(p => ({
        slug: p.slug,
        name: p.name,
        client: p.client,
        location: p.location,
        phase: p.phase,
        foreman: p.foreman,
        site_engineer: p.siteEngineer,
        architect: p.architect,
        crew: p.crew,
        budget: p.budget,
        spent: p.spent,
        progress: p.progress,
        due: p.due,
        status: p.status,
        next_milestone: p.nextMilestone,
        risk: p.risk,
      }));
      const { error } = await supabase.from("projects").insert(formattedProjects);
      results.projects = error ? `Error: ${error.message}` : "Seeded projects";
    } else {
      results.projects = "Projects already seeded";
    }

    // 2. Seed Manpower
    const { data: existingManpower } = await supabase.from("manpower").select("id").limit(1);
    if (!existingManpower || existingManpower.length === 0) {
      const { error } = await supabase.from("manpower").insert(manpower);
      results.manpower = error ? `Error: ${error.message}` : "Seeded manpower";
    } else {
      results.manpower = "Manpower already seeded";
    }

    // 3. Seed Contracts
    const { data: existingContracts } = await supabase.from("contracts").select("id").limit(1);
    if (!existingContracts || existingContracts.length === 0) {
      const formattedContracts = contractItems.map(([item, project, amount, status], index) => ({
        item,
        project,
        amount,
        status,
        owner: index % 2 === 0 ? "Accounting" : "Management",
      }));
      const { error } = await supabase.from("contracts").insert(formattedContracts);
      results.contracts = error ? `Error: ${error.message}` : "Seeded contracts";
    } else {
      results.contracts = "Contracts already seeded";
    }

    // 4. Seed Service Requests
    const { data: existingRequests } = await supabase.from("service_requests").select("id").limit(1);
    if (!existingRequests || existingRequests.length === 0) {
      const formattedRequests = serviceRequests.map(([task, project, owner, due], index) => ({
        task,
        project,
        owner,
        due,
        stage: index % 2 === 0 ? "Review" : "In progress",
      }));
      const { error } = await supabase.from("service_requests").insert(formattedRequests);
      results.service_requests = error ? `Error: ${error.message}` : "Seeded service requests";
    } else {
      results.service_requests = "Service requests already seeded";
    }

    // 5. Seed Schedules
    const { data: existingSchedules } = await supabase.from("schedules").select("id").limit(1);
    if (!existingSchedules || existingSchedules.length === 0) {
      const formattedSchedules = schedule.map(([time, item, place]) => ({
        time,
        item,
        place,
      }));
      const { error } = await supabase.from("schedules").insert(formattedSchedules);
      results.schedules = error ? `Error: ${error.message}` : "Seeded schedules";
    } else {
      results.schedules = "Schedules already seeded";
    }

    // 6. Seed Employees
    const { data: existingEmployees } = await supabase.from("employees").select("id").limit(1);
    if (!existingEmployees || existingEmployees.length === 0) {
      const { error } = await supabase.from("employees").insert(initialEmployees);
      results.employees = error ? `Error: ${error.message}` : "Seeded employees";
    } else {
      results.employees = "Employees already seeded";
    }

    return Response.json({ success: true, results });
  } catch (err) {
    return Response.json({ success: false, error: err.message }, { status: 500 });
  }
}
