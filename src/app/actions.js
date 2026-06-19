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
  return { success: true, timestamp: new Date().toISOString(), user: 'Admin' };
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
  return { success: true, timestamp: new Date().toISOString(), user: 'Admin' };
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
  return { success: true, timestamp: new Date().toISOString(), user: 'Admin' };
}

function parseCurrency(str) {
  if (!str) return 0;
  let val = String(str).replace(/[^0-9.MKk]/g, '').toUpperCase();
  let mult = 1;
  if (val.includes('M')) { mult = 1000000; val = val.replace('M', ''); }
  else if (val.includes('K')) { mult = 1000; val = val.replace('K', ''); }
  return parseFloat(val || 0) * mult;
}

function formatCurrency(num) {
  if (num >= 1000000) return 'PHP ' + (num / 1000000).toFixed(1).replace(/\.0$/, '') + 'M';
  if (num >= 1000) return 'PHP ' + (num / 1000).toFixed(0) + 'K';
  return 'PHP ' + num;
}

export async function createBilling(values) {
  const supabase = getClient();
  const project = values["Project"] || "General";
  const item = values["Billing description"] || "Progress Billing";
  const amountStr = values["Amount"] || "PHP 0";

  const { error } = await supabase.from("contracts").insert({
    item,
    project,
    amount: amountStr,
    status: "For approval",
    owner: "Management",
  });

  if (error) {
    console.error("Error creating billing:", error);
    throw new Error(error.message);
  }

  // Update project spent metric
  if (project !== "General") {
    const { data: projData } = await supabase.from("projects").select("spent").eq("name", project).single();
    if (projData) {
      const currentSpent = parseCurrency(projData.spent);
      const addedAmount = parseCurrency(amountStr);
      const newSpent = formatCurrency(currentSpent + addedAmount);
      await supabase.from("projects").update({ spent: newSpent }).eq("name", project);
    }
  }

  revalidatePath("/");
  revalidatePath("/contracts");
  revalidatePath("/projects");
  return { success: true, timestamp: new Date().toISOString(), user: 'Admin' };
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
  return { success: true, timestamp: new Date().toISOString(), user: 'Admin' };
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
  return { success: true, timestamp: new Date().toISOString(), user: 'Admin' };
}

export async function recordCashAdvance(values) {
  const supabase = getClient();
  const name = values["Employee"];
  const amount = parseInt(values["CA amount"]) || 0;
  const deduct = parseInt(values["Deduct per payroll"]) || 0;

  const { data: employee } = await supabase
    .from("employees")
    .select("ca_balance, cash_advance, project")
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
    
    // Cross-table update: Automatically add to the specific project's "Spent" budget
    if (employee.project && employee.project !== "Unassigned") {
      // First, get current project spent amount
      const { data: projData } = await supabase
        .from("projects")
        .select("spent")
        .eq("name", employee.project)
        .single();
        
      if (projData) {
        // We assume CA is an operational expense for the project.
        await supabase
          .from("projects")
          .update({ spent: projData.spent + amount })
          .eq("name", employee.project);
      }
    }
  }

  revalidatePath("/");
  revalidatePath("/payroll");
  return { success: true, timestamp: new Date().toISOString(), user: 'Admin' };
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
  return { success: true, timestamp: new Date().toISOString(), user: 'Admin' };
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
  return { success: true, timestamp: new Date().toISOString(), user: 'Admin' };
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
  return { success: true, timestamp: new Date().toISOString(), user: 'Admin' };
}

export async function login(values) {
  const { ARCHITECT_PASSWORD, STAFF_PASSWORD, AUTH_COOKIE_NAME, AUTH_SESSION_MAX_AGE } =
    await import("@/lib/auth-config");

  const password = values.password?.trim();
  const requestedRole = values.role; // "architect" or "staff"

  let userRole = null;
  if (requestedRole === "architect" && password === ARCHITECT_PASSWORD) {
    userRole = "architect";
  } else if (requestedRole === "staff" && password === STAFF_PASSWORD) {
    userRole = "staff";
  }

  if (!userRole) {
    throw new Error("Incorrect access password for the selected role");
  }

  const { cookies } = await import("next/headers");
  const cookieStore = await cookies();
  cookieStore.set(AUTH_COOKIE_NAME, userRole, {
    path: "/",
    maxAge: AUTH_SESSION_MAX_AGE,
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
  });

  return { success: true, timestamp: new Date().toISOString(), user: userRole };
}

export async function logout() {
  const { AUTH_COOKIE_NAME } = await import("@/lib/auth-config");
  const { cookies } = await import("next/headers");
  const cookieStore = await cookies();
  
  // Delete the new role-based cookie
  cookieStore.delete(AUTH_COOKIE_NAME);
  
  // Also delete the old legacy cookie just in case it exists
  cookieStore.delete("dm_authenticated");

  const { redirect } = await import("next/navigation");
  redirect("/login");
}

export async function deleteProject(slug) {
  const supabase = getClient();
  const { data: project } = await supabase.from("projects").select("name").eq("slug", slug).single();

  const { error } = await supabase.from("projects").delete().eq("slug", slug);
  if (error) {
    console.error("Error deleting project:", error);
    throw new Error(error.message);
  }

  if (project) {
    await supabase.from("contracts").delete().eq("project", project.name);
    await supabase.from("service_requests").delete().eq("project", project.name);
  }

  revalidatePath("/");
  revalidatePath("/projects");
  revalidatePath("/manpower");
  revalidatePath("/contracts");
  revalidatePath("/services");
  return { success: true, timestamp: new Date().toISOString(), user: 'Admin' };
}

export async function updateProject(slug, values) {
  const supabase = getClient();
  
  // Map fields to match database columns
  const dbData = {
    name: values["Project name"],
    client: values["Client"],
    location: values["Location"],
    phase: values["Phase"],
    foreman: values["Foreman"],
    site_engineer: values["Site engineer"],
    architect: values["Architect"],
    crew: parseInt(values["Crew count"]) || 0,
    budget: values["Budget"],
    spent: values["Spent"],
    progress: parseInt(values["Progress"]) || 0,
    due: values["Due date"],
    status: values["Status"],
    next_milestone: values["Next milestone"],
    risk: values["Risk"]
  };

  // Filter out undefined fields to allow partial updates
  Object.keys(dbData).forEach(key => {
    if (dbData[key] === undefined) {
      delete dbData[key];
    }
  });

  const { error } = await supabase.from("projects").update(dbData).eq("slug", slug);
  if (error) {
    console.error("Error updating project:", error);
    throw new Error(error.message);
  }
  revalidatePath("/");
  revalidatePath("/projects");
  revalidatePath("/manpower");
  return { success: true, timestamp: new Date().toISOString(), user: 'Admin' };
}

export async function deleteContract(id) {
  const supabase = getClient();
  const { error } = await supabase.from("contracts").delete().eq("id", id);
  if (error) {
    console.error("Error deleting contract:", error);
    throw new Error(error.message);
  }
  revalidatePath("/");
  revalidatePath("/contracts");
  return { success: true, timestamp: new Date().toISOString(), user: 'Admin' };
}

export async function updateContract(id, values) {
  console.log("updateContract called with ID:", id, "values:", values, "type:", typeof values);
  const supabase = getClient();
  let dbData = typeof values === "string" ? { status: values } : {
    item: values["Billing description"] || values["Item"],
    project: values["Project"],
    amount: values["Amount"],
    status: values["Status"],
    owner: values["Owner"]
  };

  // Cross-role workflow: When Architect approves, flag it explicitly for Staff payment
  if (dbData.status === "Approved") {
    dbData.status = "Approved - Ready for Payment";
  }

  Object.keys(dbData).forEach(key => {
    if (dbData[key] === undefined) {
      delete dbData[key];
    }
  });

  const { error } = await supabase.from("contracts").update(dbData).eq("id", id);
  if (error) {
    console.error("Error updating contract:", error);
    throw new Error(error.message);
  }
  revalidatePath("/");
  revalidatePath("/contracts");
  return { success: true, timestamp: new Date().toISOString(), user: 'Admin' };
}

export async function deleteServiceRequest(id) {
  const supabase = getClient();
  const { error } = await supabase.from("service_requests").delete().eq("id", id);
  if (error) {
    console.error("Error deleting service request:", error);
    throw new Error(error.message);
  }
  revalidatePath("/");
  revalidatePath("/services");
  return { success: true, timestamp: new Date().toISOString(), user: 'Admin' };
}

export async function updateServiceRequest(id, values) {
  console.log("updateServiceRequest called with ID:", id, "values:", values, "type:", typeof values);
  const supabase = getClient();
  const dbData = typeof values === "string" ? { stage: values } : {
    task: values["Task"] || values["Request"],
    project: values["Project"],
    owner: values["Owner"] || values["Assigned team"] || values["Assigned to"],
    due: values["Due date"] || values["Due"],
    stage: values["Stage"]
  };

  Object.keys(dbData).forEach(key => {
    if (dbData[key] === undefined) {
      delete dbData[key];
    }
  });

  const { error } = await supabase.from("service_requests").update(dbData).eq("id", id);
  if (error) {
    console.error("Error updating service request:", error);
    throw new Error(error.message);
  }
  revalidatePath("/");
  revalidatePath("/services");
  return { success: true, timestamp: new Date().toISOString(), user: 'Admin' };
}

export async function deleteEmployee(id) {
  const supabase = getClient();
  const { error } = await supabase.from("employees").delete().eq("id", id);
  if (error) {
    console.error("Error deleting employee:", error);
    throw new Error(error.message);
  }
  revalidatePath("/payroll");
  return { success: true, timestamp: new Date().toISOString(), user: 'Admin' };
}

export async function updateEmployee(id, values) {
  const supabase = getClient();
  const dbData = {
    name: values["Employee name"] || values["Name"],
    role: values["Role"],
    project: values["Project / department"] || values["Project"],
    days: parseInt(values["Days worked"]) || 0,
    rate: parseInt(values["Daily rate"]) || 0,
    overtime: parseInt(values["Overtime"]) || 0,
    cash_advance: parseInt(values["Cash advance"]) || 0,
    ca_balance: parseInt(values["CA balance"]) || 0,
    deductions: parseInt(values["Deductions"]) || 0,
    release_method: values["Release method"],
    receipt_status: values["Receipt status"],
    status: values["Status"]
  };

  Object.keys(dbData).forEach(key => {
    if (dbData[key] === undefined) {
      delete dbData[key];
    }
  });

  const { error } = await supabase.from("employees").update(dbData).eq("id", id);
  if (error) {
    console.error("Error updating employee:", error);
    throw new Error(error.message);
  }
  revalidatePath("/payroll");
  return { success: true, timestamp: new Date().toISOString(), user: 'Admin' };
}

export async function createManpower(values) {
  const supabase = getClient();
  const trade = values["Trade"] || "General labor";
  const total = parseInt(values["Total"]) || 0;
  const deployed = parseInt(values["Deployed"]) || 0;
  const standby = values["Standby"] !== undefined ? parseInt(values["Standby"]) : Math.max(0, total - deployed);
  const lead = values["Lead foreman"] || values["Lead"] || "Site foreman";
  const projects = values["Projects"] || "Unassigned";

  const { error } = await supabase.from("manpower").insert({
    trade,
    total,
    deployed,
    standby,
    lead,
    projects,
  });

  if (error) {
    console.error("Error creating manpower:", error);
    throw new Error(error.message);
  }

  revalidatePath("/");
  revalidatePath("/manpower");
  return { success: true, timestamp: new Date().toISOString(), user: 'Admin' };
}

export async function updateManpower(id, values) {
  const supabase = getClient();
  const { data: current } = await supabase.from("manpower").select("total, deployed").eq("id", id).single();
  const newTotal = values["Total"] !== undefined ? (parseInt(values["Total"]) || 0) : (current?.total || 0);
  const newDeployed = values["Deployed"] !== undefined ? (parseInt(values["Deployed"]) || 0) : (current?.deployed || 0);
  const standby = Math.max(0, newTotal - newDeployed);

  const dbData = {
    trade: values["Trade"],
    total: values["Total"] !== undefined ? newTotal : undefined,
    deployed: values["Deployed"] !== undefined ? newDeployed : undefined,
    standby,
    lead: values["Lead foreman"] || values["Lead"],
    projects: values["Projects"],
  };

  Object.keys(dbData).forEach(key => {
    if (dbData[key] === undefined) {
      delete dbData[key];
    }
  });

  const { error } = await supabase.from("manpower").update(dbData).eq("id", id);
  if (error) {
    console.error("Error updating manpower:", error);
    throw new Error(error.message);
  }

  revalidatePath("/");
  revalidatePath("/manpower");
  return { success: true, timestamp: new Date().toISOString(), user: 'Admin' };
}

export async function deleteManpower(id) {
  const supabase = getClient();
  const { error } = await supabase.from("manpower").delete().eq("id", id);
  if (error) {
    console.error("Error deleting manpower:", error);
    throw new Error(error.message);
  }

  revalidatePath("/");
  revalidatePath("/manpower");
  return { success: true, timestamp: new Date().toISOString(), user: 'Admin' };
}

export async function createScheduleEvent(values) {
  const supabase = getClient();
  const time = values["Time"] || "08:00";
  const item = values["Event / Meeting"] || "New Event";
  const place = values["Location"] || "Main office";

  const { error } = await supabase.from("schedules").insert({
    time,
    item,
    place,
  });

  if (error) {
    console.error("Error creating schedule:", error);
    throw new Error(error.message);
  }

  revalidatePath("/");
  return { success: true, timestamp: new Date().toISOString(), user: 'Admin' };
}

export async function updateScheduleEvent(id, values) {
  const supabase = getClient();
  const dbData = {
    time: values["Time"],
    item: values["Event / Meeting"],
    place: values["Location"],
  };

  Object.keys(dbData).forEach(key => {
    if (dbData[key] === undefined) {
      delete dbData[key];
    }
  });

  const { error } = await supabase.from("schedules").update(dbData).eq("id", id);
  if (error) {
    console.error("Error updating schedule:", error);
    throw new Error(error.message);
  }

  revalidatePath("/");
  return { success: true, timestamp: new Date().toISOString(), user: 'Admin' };
}

export async function deleteScheduleEvent(id) {
  const supabase = getClient();
  const { error } = await supabase.from("schedules").delete().eq("id", id);
  if (error) {
    console.error("Error deleting schedule:", error);
    throw new Error(error.message);
  }

  revalidatePath("/");
  return { success: true, timestamp: new Date().toISOString(), user: 'Admin' };
}

export async function getProjectsList() {
  const supabase = getClient();
  const { data, error } = await supabase.from("projects").select("name").order("name", { ascending: true });
  if (error) {
    console.error("Error fetching projects for dropdown list:", error);
    throw new Error(error.message);
  }
  return (data || []).map(p => p.name);
}

export async function getEmployeesList() {
  const supabase = getClient();
  const { data, error } = await supabase.from("employees").select("name").order("name", { ascending: true });
  if (error) {
    console.error("Error fetching employees for dropdown list:", error);
    throw new Error(error.message);
  }
  return (data || []).map(e => e.name);
}



