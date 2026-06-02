import {
  PageHeader,
  Panel,
  PrimaryButton,
  ProgressBar,
  SecondaryButton,
  StatCard,
  StatusPill,
} from "../_components/ui";

const payrollPeriod = {
  label: "May 16-31, 2026",
  releaseDate: "June 5, 2026",
  status: "For review",
};

const employees = [
  {
    name: "Ramon Bautista",
    role: "Foreman",
    project: "Alabang Residence",
    days: 12,
    rate: 1450,
    overtime: 2400,
    cashAdvance: 5000,
    caBalance: 8500,
    deductions: 1260,
    releaseMethod: "Bank transfer",
    receiptStatus: "Needs payslip",
    status: "CA active",
  },
  {
    name: "Joey Santos",
    role: "Mason",
    project: "Makati Fit-out",
    days: 11,
    rate: 950,
    overtime: 1200,
    cashAdvance: 0,
    caBalance: 0,
    deductions: 780,
    releaseMethod: "Cash pickup",
    receiptStatus: "Ready",
    status: "Ready",
  },
  {
    name: "Arnel Cruz",
    role: "Electrician",
    project: "Tagaytay Villas",
    days: 10,
    rate: 1100,
    overtime: 1800,
    cashAdvance: 3000,
    caBalance: 3000,
    deductions: 920,
    releaseMethod: "Bank transfer",
    receiptStatus: "Needs payslip",
    status: "CA active",
  },
  {
    name: "Mila Reyes",
    role: "Admin Assistant",
    project: "Main Office",
    days: 13,
    rate: 1050,
    overtime: 0,
    cashAdvance: 1500,
    caBalance: 1500,
    deductions: 890,
    releaseMethod: "Bank transfer",
    receiptStatus: "Ready",
    status: "Ready",
  },
  {
    name: "Dennis Lim",
    role: "Painter",
    project: "BGC Office",
    days: 9,
    rate: 900,
    overtime: 700,
    cashAdvance: 4000,
    caBalance: 6400,
    deductions: 650,
    releaseMethod: "Cash pickup",
    receiptStatus: "Hold",
    status: "Review",
  },
];

const payrollTasks = [
  ["Approve site attendance", "Foremen must confirm final day counts.", "Today"],
  ["Validate cash advances", "Match CA slips against payroll deductions.", "Today"],
  ["Prepare payout file", "Export net pay list for bank or cash release.", "June 4"],
  ["Archive signed payslips", "Attach employee acknowledgements after release.", "June 5"],
];

const receiptOptions = [
  ["Payslip", "Employee copy with gross pay, CA, deductions, net pay, and release method.", "generate-payslip"],
  ["CA receipt", "Acknowledgement for cash advanced or deducted from this payroll.", "ca-receipt"],
  ["Payroll register", "Accounting copy for payout approval and reconciliation.", "export-payroll"],
];

function peso(amount) {
  return new Intl.NumberFormat("en-PH", {
    currency: "PHP",
    maximumFractionDigits: 0,
    style: "currency",
  }).format(amount);
}

function grossPay(employee) {
  return employee.days * employee.rate + employee.overtime;
}

function totalDeductions(employee) {
  return employee.cashAdvance + employee.deductions;
}

function netPay(employee) {
  return grossPay(employee) - totalDeductions(employee);
}

function statusTone(status) {
  if (status === "CA active") return "warn";
  if (status === "Review") return "danger";
  return "good";
}

function receiptTone(status) {
  if (status === "Hold") return "danger";
  if (status === "Needs payslip") return "warn";
  return "good";
}

export default function PayrollPage() {
  const grossTotal = employees.reduce((sum, employee) => sum + grossPay(employee), 0);
  const caDeducted = employees.reduce((sum, employee) => sum + employee.cashAdvance, 0);
  const caOutstanding = employees.reduce((sum, employee) => sum + employee.caBalance, 0);
  const netTotal = employees.reduce((sum, employee) => sum + netPay(employee), 0);
  const employeesWithCA = employees.filter((employee) => employee.caBalance > 0);
  const receiptsNeeded = employees.filter(
    (employee) => employee.receiptStatus !== "Ready"
  ).length;
  const bankRelease = employees
    .filter((employee) => employee.releaseMethod === "Bank transfer")
    .reduce((sum, employee) => sum + netPay(employee), 0);
  const cashRelease = netTotal - bankRelease;
  const readiness = Math.round(
    (employees.filter((employee) => employee.status !== "Review").length /
      employees.length) *
      100
  );

  return (
    <main>
      <PageHeader
        action={
          <div className="flex flex-wrap gap-2">
            <PrimaryButton action="approve-payroll">Approve run</PrimaryButton>
            <SecondaryButton action="export-payroll">Export register</SecondaryButton>
            <SecondaryButton href="/">Back to overview</SecondaryButton>
          </div>
        }
        eyebrow="Payroll control"
        title="Employee payroll, cash advances, deductions, and release readiness."
      >
        Review gross pay, CA deductions, outstanding balances, net payout, and
        approval tasks before releasing salaries for the current cut-off.
      </PageHeader>

      <div className="space-y-6 px-5 py-6 lg:px-8">
        <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <StatCard
            icon="icon-contracts"
            label="Gross payroll"
            note={payrollPeriod.label}
            value={peso(grossTotal)}
          />
          <StatCard
            icon="icon-risk"
            label="CA deducted"
            note={`${employeesWithCA.length} employees`}
            value={peso(caDeducted)}
          />
          <StatCard
            icon="icon-progress"
            label="Net release"
            note={payrollPeriod.releaseDate}
            value={peso(netTotal)}
          />
          <StatCard
            icon="icon-services"
            label="CA balance"
            note="After this payroll"
            tone="dark"
            value={peso(caOutstanding)}
          />
        </section>

        <Panel
          action={<PrimaryButton action="add-payroll-employee">Add employee</PrimaryButton>}
          subtitle="Quick actions for payroll maintenance, receipts, and release preparation."
          title="Payroll Tools"
        >
          <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
            <div className="focus-card rounded-lg border border-lime-900/10 bg-[#f8fcf1] p-4">
              <p className="text-xs font-black uppercase tracking-wide text-olive-700">
                Bank release
              </p>
              <p className="mt-3 text-2xl font-black text-olive-950">
                {peso(bankRelease)}
              </p>
              <p className="mt-1 text-sm text-olive-700">For transfer list</p>
            </div>
            <div className="focus-card rounded-lg border border-lime-900/10 bg-[#f8fcf1] p-4">
              <p className="text-xs font-black uppercase tracking-wide text-olive-700">
                Cash release
              </p>
              <p className="mt-3 text-2xl font-black text-olive-950">
                {peso(cashRelease)}
              </p>
              <p className="mt-1 text-sm text-olive-700">Needs signed receipt</p>
            </div>
            <div className="focus-card rounded-lg border border-yellow-900/10 bg-yellow-50 p-4">
              <p className="text-xs font-black uppercase tracking-wide text-yellow-900">
                Receipt follow-up
              </p>
              <p className="mt-3 text-2xl font-black text-olive-950">
                {receiptsNeeded}
              </p>
              <p className="mt-1 text-sm text-olive-700">Missing or on hold</p>
            </div>
            <div className="flex flex-col gap-2 rounded-lg border border-lime-900/10 bg-white p-4">
              <PrimaryButton action="record-ca">Record CA</PrimaryButton>
              <SecondaryButton action="generate-payslip">Generate payslip</SecondaryButton>
              <SecondaryButton action="ca-receipt">CA receipt</SecondaryButton>
            </div>
          </div>
        </Panel>

        <section className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
          <Panel
            action={<SecondaryButton action="generate-payslip">Batch payslips</SecondaryButton>}
            subtitle="Per-employee payroll with cash advance handling."
            title="Payroll Register"
          >
            <div className="overflow-x-auto">
              <table className="min-w-[1080px] w-full border-separate border-spacing-0 text-left text-sm">
                <thead>
                  <tr className="text-xs uppercase tracking-wide text-olive-700">
                    <th className="border-b border-lime-900/10 p-3">Employee</th>
                    <th className="border-b border-lime-900/10 p-3">Assignment</th>
                    <th className="border-b border-lime-900/10 p-3 text-right">Gross</th>
                    <th className="border-b border-lime-900/10 p-3 text-right">CA</th>
                    <th className="border-b border-lime-900/10 p-3 text-right">Other</th>
                    <th className="border-b border-lime-900/10 p-3 text-right">Net Pay</th>
                    <th className="border-b border-lime-900/10 p-3">Release</th>
                    <th className="border-b border-lime-900/10 p-3">Status</th>
                    <th className="border-b border-lime-900/10 p-3 text-right">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {employees.map((employee) => (
                    <tr className="payroll-row" key={employee.name}>
                      <td className="border-b border-lime-900/10 p-3">
                        <p className="font-black text-olive-950">{employee.name}</p>
                        <p className="mt-1 text-xs text-olive-700">
                          {employee.role} / {employee.days} days @ {peso(employee.rate)}
                        </p>
                      </td>
                      <td className="border-b border-lime-900/10 p-3 font-semibold text-olive-800">
                        {employee.project}
                      </td>
                      <td className="border-b border-lime-900/10 p-3 text-right font-bold text-olive-950">
                        {peso(grossPay(employee))}
                      </td>
                      <td className="border-b border-lime-900/10 p-3 text-right">
                        <p className="font-bold text-olive-950">
                          {peso(employee.cashAdvance)}
                        </p>
                        {employee.caBalance > 0 ? (
                          <p className="mt-1 text-xs text-olive-700">
                            Bal. {peso(employee.caBalance)}
                          </p>
                        ) : null}
                      </td>
                      <td className="border-b border-lime-900/10 p-3 text-right font-bold text-olive-950">
                        {peso(employee.deductions)}
                      </td>
                      <td className="border-b border-lime-900/10 p-3 text-right text-base font-black text-olive-950">
                        {peso(netPay(employee))}
                      </td>
                      <td className="border-b border-lime-900/10 p-3">
                        <p className="font-bold text-olive-950">
                          {employee.releaseMethod}
                        </p>
                        <div className="mt-1">
                          <StatusPill tone={receiptTone(employee.receiptStatus)}>
                            {employee.receiptStatus}
                          </StatusPill>
                        </div>
                      </td>
                      <td className="border-b border-lime-900/10 p-3">
                        <StatusPill tone={statusTone(employee.status)}>
                          {employee.status}
                        </StatusPill>
                      </td>
                      <td className="border-b border-lime-900/10 p-3 text-right">
                        <SecondaryButton action="generate-payslip">
                          Receipt
                        </SecondaryButton>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Panel>

          <div className="space-y-6">
            <Panel
              subtitle={`${payrollPeriod.status} / release on ${payrollPeriod.releaseDate}`}
              title="Run Readiness"
              action={<SecondaryButton action="approve-payroll">Approve</SecondaryButton>}
            >
              <div className="rounded-lg border border-lime-900/10 bg-[#f8fcf1] p-4">
                <div className="mb-2 flex items-center justify-between text-sm">
                  <span className="font-bold text-olive-800">Payroll clean-up</span>
                  <span className="font-black text-olive-950">{readiness}%</span>
                </div>
                <ProgressBar label="Payroll readiness" value={readiness} />
              </div>

              <div className="mt-4 space-y-3">
                {payrollTasks.map(([task, detail, due]) => (
                  <div
                    className="rounded-md border border-lime-900/10 bg-white p-3"
                    key={task}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <p className="font-bold text-olive-950">{task}</p>
                      <StatusPill>{due}</StatusPill>
                    </div>
                    <p className="mt-1 text-sm leading-6 text-olive-700">
                      {detail}
                    </p>
                  </div>
                ))}
              </div>
            </Panel>

            <Panel
              subtitle="Track who still owes the company after deductions."
              title="Cash Advance Ledger"
              action={<SecondaryButton action="record-ca">New CA</SecondaryButton>}
            >
              <div className="space-y-3">
                {employeesWithCA.map((employee) => (
                  <div
                    className="rounded-md border border-yellow-900/10 bg-yellow-50 p-3"
                    key={employee.name}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="font-black text-olive-950">
                          {employee.name}
                        </p>
                        <p className="mt-1 text-sm text-olive-700">
                          Deduct {peso(employee.cashAdvance)} this cut-off
                        </p>
                      </div>
                      <p className="text-right text-sm font-black text-yellow-900">
                        {peso(employee.caBalance)}
                      </p>
                    </div>
                    <div className="mt-3 flex flex-wrap gap-2">
                      <SecondaryButton action="ca-receipt">
                        CA receipt
                      </SecondaryButton>
                      <SecondaryButton action="record-ca">
                        Adjust CA
                      </SecondaryButton>
                    </div>
                  </div>
                ))}
              </div>
            </Panel>
          </div>
        </section>

        <Panel
          subtitle="Choose the document that matches the payroll transaction."
          title="Receipt & Export Options"
        >
          <div className="grid gap-3 md:grid-cols-3">
            {receiptOptions.map(([title, description, action]) => (
              <div
                className="focus-card rounded-lg border border-lime-900/10 bg-[#f8fcf1] p-4"
                key={title}
              >
                <p className="font-black text-olive-950">{title}</p>
                <p className="mt-2 text-sm leading-6 text-olive-700">
                  {description}
                </p>
                <div className="mt-4">
                  <SecondaryButton action={action}>Prepare</SecondaryButton>
                </div>
              </div>
            ))}
          </div>
        </Panel>
      </div>
    </main>
  );
}
