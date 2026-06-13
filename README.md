# DM Architect Management System (DM AMS)

## Overview

The DM Architect Management System (DM AMS) is a web-based project and operations management platform developed to streamline the administration of architectural projects, construction sites, manpower deployment, billing/contracts, and payroll processing. The system enables project managers, architects, and administrators to efficiently track active projects, manage manpower allocation, handle client service requests, track contractor billing, and approve employee payrolls through a centralized operational dashboard.

The system is designed specifically for architectural firm operations, ensuring clear coordination between site progress, manpower resources, and client accounting.

---

## Key Features

### Dashboard

* Real-time project tracking and progress monitoring
* Key performance indicator (KPI) highlights (Active Projects, Total Manpower, Billing/Contract totals, Open Service Requests)
* Integrated site scheduling and calendar activities
* Quick access to daily site logs and service requests

### Project Management

* Manage all architectural and construction projects in a centralized system
* Track project phases (e.g., Design Development, Construction, Handover), status, risk level, and milestones
* Monitor project financials (allocated budgets versus actual spent costs)
* Assign project teams including Architects, Site Engineers, Foremen, and crew counts

### Manpower Management

* Centralize trade directories (e.g., Mason, Electrician, Painter, Foreman)
* Track total headcounts, deployed personnel, and standby crew levels
* Deploy specific trade groups to active projects with automated balance recalculation

### Contract & Billing Management

* Record progress billing, contract values, and financial milestones
* Categorize billing ownership between Accounting and Management
* Support billing approvals and status tracking ("For approval", "Approved")

### Services & Work Orders

* Create, log, and assign service requests or work orders
* Classify tasks by status ("Review", "In progress") and project associations
* Support bulk worker assignment and due date scheduling
* Record and submit daily weather and site condition reports

### Payroll & Employee Management

* Maintain complete employee files with role assignments, daily rates, and release preferences (Bank transfer, Cash pickup)
* Track days worked, overtime, and cash advance (CA) balances
* Issue cash advances and set deduction rates per payroll cycle
* Review and approve payroll summaries to prepare ready payslips

---

## Technology Stack

### Frontend & Backend Framework

* Next.js (App Router, Server Actions, API Routes)
* React.js

### Styling

* Tailwind CSS (with CSS post-processing)

### Database & Auth

* Supabase (PostgreSQL)

### Development Tools

* Visual Studio Code
* Git
* GitHub

---

## System Workflow

Project Creation → Manpower Deployment → Work Order / Service Request Logging → Contract Billing → Employee Payroll & Cash Advance → Dashboard Analytics & Reporting

All actions in the system run on Next.js Server Actions and update the database in real time, automatically revalidating views to ensure consistent data across pages.

---

## Installation Guide

### Clone the Repository

```bash
git clone <repository-url>
cd dm-architect-mgmt-sys
```

### Install Dependencies

```bash
npm install
```

### Configure Environment Variables

Create a `.env.local` file in the root directory and add your Supabase credentials:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
```

*Note: Access to the operations dashboard is secured using a gate password configured in `src/lib/auth-config.js` (defaults to `dm-operations`).*

### Run Development Server

```bash
npm run dev
```

Open:

```text
http://localhost:3000
```

---

## User Roles

### Administrator / Management

The administrator and management team can:

* Create, modify, and delete projects
* Deploy manpower crew members and edit trade distributions
* File billing contracts and track financial claims
* Create, update, and bulk-assign work orders/service requests
* Manage employee rosters, issue cash advances, and approve payroll cycles
* Track global schedules and project completion risks

---

## Database Tables

### projects

Stores project information (names, clients, locations, phases, budget, spent, progress, foreman, site engineers, crew numbers, risk).

### manpower

Stores trade groups, headcounts (total, deployed, standby), leads, and project assignments.

### contracts

Stores billing contracts, amounts, statuses, and ownership (Management/Accounting).

### service_requests

Stores service requests, task items, owners, due dates, stages, and daily site reports.

### employees

Stores payroll employees, daily rates, days worked, overtime, cash advance balances, deductions, and payment statuses.

### schedules

Stores calendar schedules (time, item, place).

---

## Future Enhancements

* Client-facing portal for real-time project updates, drawings, and milestones
* Automated PDF invoice and excel timesheet generation
* SMS and email alerts for site warnings, project delays, or payroll updates
* Digital biometric logs for automatic integration with employee days worked
* Detailed profit-and-loss charts and visual analytics dashboards

---

## Developers

Ar. Denise Mercado - Lead Architect & Developer

System Analysis and Design

2026
