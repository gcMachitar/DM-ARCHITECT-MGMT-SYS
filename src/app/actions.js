'use server'

import { getSupabaseAdmin } from "@/lib/supabase";
import { revalidatePath } from "next/cache";

// Helper to get admin client (runs on server)
const getClient = () => getSupabaseAdmin();

export async function createProject(values) {
  const supabase = getClient();
  const name = values["Project name"] || "Untitled Project";
  const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
  const client = values["Client"] || "Client Pending";
  const location = values["Location"] || values["Target start"] || "Site Pending";

  const { error } = await supabase.from("projects").insert({
    slug,
    name,
    client,
    location,
    phase: "Design Development",
    foreman: "Site pending",
    site_engineer: "For assignment",
    architect: "Ar. Denise Mercado",
    crew: 0,
    budget: "PHP 0",
    spent: "PHP 0",
    progress: 0,
    due: values["Target start"] || "TBD",
    status: "Planning",
    next_milestone: "Client kickoff meeting",
    risk: "Low",
  });

  if (error) {
    console.error("Error creating project:", error);
    throw new Error(error.message);
  }

  revalidatePath("/");
  revalidatePath("/projects");
  return { success: true };
}

export async function createWorkOrder(values) {
  const supabase = getClient();
  const task = values["Task"] || "New work order";
  const project = values["Project"] || "General";
  const owner = values["Owner"] || "Management";

  const { error } = await supabase.from("service_requests").insert({
    task,
    project,
    owner,
    due: "Today",
    stage: "Review",
  });

  if (error) {
    console.error("Error creating work order:", error);
    throw new Error(error.message);
  }

  revalidatePath("/");
  revalidatePath("/services");
  return { success: true };
}

export async function assignCrew(values) {
  const supabase = getClient();
  const projectName = values["Project"];
  const tradeName = values["Trade"];
  const count = parseInt(values["Number of men"]) || 0;

  if (projectName) {
    // 1. Update project crew count
    const { data: project } = await supabase
      .from("projects")
      .select("crew")
      .eq("name", projectName)
      .single();

    if (project) {
      await supabase
        .from("projects")
        .update({ crew: project.crew + count })
        .eq("name", projectName);
    }
  }

  if (tradeName) {
    // 2. Update manpower trade balance
    const { data: tradeGroup } = await supabase
      .from("manpower")
      .select("deployed, standby, total")
      .eq("trade", tradeName)
      .single();

    if (tradeGroup) {
      const newDeployed = Math.min(tradeGroup.total, tradeGroup.deployed + count);
      const newStandby = Math.max(0, tradeGroup.total - newDeployed);
      await supabase
        .from("manpower")
        .update({
          deployed: newDeployed,
          standby: newStandby,
        })
        .eq("trade", tradeName);
    }
  }

  revalidatePath("/");
  revalidatePath("/projects");
  revalidatePath("/manpower");
  return { success: true };
}

export async function createBilling(values) {
  const supabase = getClient();
  const project = values["Project"] || "General";
  const item = values["Billing description"] || "Progress Billing";
  const amount = values["Amount"] || "PHP 0";

  const { error } = await supabase.from("contracts").insert({
    item,
    project,
    amount,
    status: "For approval",
    owner: "Management",
  });

  if (error) {
    console.error("Error creating billing:", error);
    throw new Error(error.message);
  }

  revalidatePath("/");
  revalidatePath("/contracts");
  return { success: true };
}

export async function logRequest(values) {
  const supabase = getClient();
  const task = values["Request"] || "New service request";
  const project = values["Project"] || "General";
  const owner = values["Assigned team"] || "Office";

  const { error } = await supabase.from("service_requests").insert({
    task,
    project,
    owner,
    due: "Tomorrow",
    stage: "Review",
  });

  if (error) {
    console.error("Error logging request:", error);
    throw new Error(error.message);
  }

  revalidatePath("/");
  revalidatePath("/services");
  return { success: true };
}

export async function addPayrollEmployee(values) {
  const supabase = getClient();
  const name = values["Employee name"] || "New Employee";
  const role = values["Role"] || "Laborer";
  const project = values["Project / department"] || "Main Office";
  const rate = parseInt(values["Daily rate"]) || 800;

  const { error } = await supabase.from("employees").insert({
    name,
    role,
    project,
    days: 0,
    rate,
    overtime: 0,
    cash_advance: 0,
    ca_balance: 0,
    deductions: 0,
    release_method: "Cash pickup",
    receipt_status: "Ready",
    status: "Ready",
  });

  if (error) {
    console.error("Error adding payroll employee:", error);
    throw new Error(error.message);
  }

  revalidatePath("/payroll");
  return { success: true };
}

export async function recordCashAdvance(values) {
  const supabase = getClient();
  const name = values["Employee"];
  const amount = parseInt(values["CA amount"]) || 0;
  const deduct = parseInt(values["Deduct per payroll"]) || 0;

  const { data: employee } = await supabase
    .from("employees")
    .select("ca_balance, cash_advance")
    .eq("name", name)
    .single();

  if (employee) {
    const { error } = await supabase
      .from("employees")
      .update({
        ca_balance: employee.ca_balance + amount,
        cash_advance: deduct,
      })
      .eq("name", name);

    if (error) {
      console.error("Error recording cash advance:", error);
      throw new Error(error.message);
    }
  }

  revalidatePath("/payroll");
  return { success: true };
}

export async function approvePayroll(values) {
  const supabase = getClient();
  // Mark all reviews as staging/ready
  const { error } = await supabase
    .from("employees")
    .update({ status: "Ready" })
    .eq("status", "Review");

  if (error) {
    console.error("Error approving payroll:", error);
    throw new Error(error.message);
  }

  revalidatePath("/payroll");
  return { success: true };
}

export async function assignSelectedRequests(values) {
  const supabase = getClient();
  const assignedTo = values["Assigned to"];
  const dueDate = values["Due date"] || "Today";

  // Bulk update all requests that are currently in 'Review' stage
  const { error } = await supabase
    .from("service_requests")
    .update({
      owner: assignedTo,
      due: dueDate,
      stage: "In progress",
    })
    .eq("stage", "Review");

  if (error) {
    console.error("Error bulk assigning requests:", error);
    throw new Error(error.message);
  }

  revalidatePath("/");
  revalidatePath("/services");
  return { success: true };
}

export async function submitDailyReport(values) {
  const supabase = getClient();
  const project = values["Project"] || "General";
  const preparedBy = values["Prepared by"] || "Anonymous";
  const weather = values["Weather / site condition"] || "Sunny";

  // If a daily_reports table exists, we can save it. If not, insert as request or log.
  // We will assume a table daily_reports could exist or we log it under service_requests as a placeholder.
  // Let's write to a daily_reports table (which we'll add to the schema).
  const { error } = await supabase.from("service_requests").insert({
    task: `Daily Site Report (Weather: ${weather})`,
    project,
    owner: preparedBy,
    due: "Today",
    stage: "Review",
  });

  if (error) {
    console.error("Error logging daily report:", error);
    throw new Error(error.message);
  }

  revalidatePath("/");
  revalidatePath("/services");
  return { success: true };
}

export async function login(values) {
  const { ACCESS_PASSWORD, AUTH_COOKIE_NAME, AUTH_SESSION_MAX_AGE } =
    await import("@/lib/auth-config");

  const password = values.password?.trim();

  if (!password || password !== ACCESS_PASSWORD) {
    throw new Error("Incorrect access password");
  }

  const { cookies } = await import("next/headers");
  const cookieStore = await cookies();
  cookieStore.set(AUTH_COOKIE_NAME, "true", {
    path: "/",
    maxAge: AUTH_SESSION_MAX_AGE,
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
  });

  return { success: true };
}

export async function logout() {
  const { AUTH_COOKIE_NAME } = await import("@/lib/auth-config");
  const { cookies } = await import("next/headers");
  const cookieStore = await cookies();
  cookieStore.delete(AUTH_COOKIE_NAME);

  const { redirect } = await import("next/navigation");
  redirect("/login");
}

