import { redirect } from "next/navigation";
import { getSession } from "@/lib/session";
import { ROLES } from "@/constants/roles";
import {
  getCeoOverview,
  getManagerOverview,
  getEmployeeOverview,
} from "@/services/dashboard.service";
import {
  listDepartments,
  getDepartmentIdForSlug,
} from "@/services/department.service";
import { listEmployeesBasic } from "@/services/employee.service";
import { CeoOverviewView } from "@/components/dashboards/ceo-overview-view";
import { ManagerOverviewView } from "@/components/dashboards/manager-overview-view";
import { EmployeeOverviewView } from "@/components/dashboards/employee-overview-view";
import { TestPicker } from "@/components/dashboards/test-picker";

const VALID_TEST_ROLES = ["ceo", "manager", "employee"];

export async function generateMetadata({ params }) {
  const { slug } = await params;
  return { title: `Test: ${slug}` };
}

export default async function TestRolePage({ params, searchParams }) {
  const { slug } = await params;
  const search = await searchParams;
  const session = await getSession();

  if (!session || session.role !== ROLES.TESTER) {
    redirect("/login");
  }

  if (!VALID_TEST_ROLES.includes(slug)) {
    redirect("/login");
  }

  return (
    <main className="p-8 flex flex-col gap-8">
      <div>
        <h1 className="text-[30px] font-bold text-navy-dark capitalize">
          Simulating: {slug}
        </h1>
        <p className="mt-1 text-[14px] text-gray-500">
          Testers get read access to all three dashboard tiers for QA.
        </p>
      </div>

      {slug === "ceo" && <CeoTestView />}
      {slug === "manager" && <ManagerTestView deptSlug={search?.dept} />}
      {slug === "employee" && <EmployeeTestView empId={search?.emp} />}
    </main>
  );
}

async function CeoTestView() {
  const overview = await getCeoOverview();
  return <CeoOverviewView overview={overview} />;
}

async function ManagerTestView({ deptSlug }) {
  const departments = await listDepartments();

  if (!deptSlug) {
    return (
      <TestPicker
        label="Which department do you want to preview?"
        paramName="dept"
        options={departments.map((d) => ({ value: d.slug, label: d.name }))}
      />
    );
  }

  const departmentId = await getDepartmentIdForSlug(deptSlug);
  if (!departmentId) {
    return <p className="text-[14px] text-red-600">Unknown department.</p>;
  }

  const overview = await getManagerOverview(departmentId);
  return <ManagerOverviewView overview={overview} />;
}

async function EmployeeTestView({ empId }) {
  const employees = await listEmployeesBasic();

  if (!empId) {
    return (
      <TestPicker
        label="Which employee do you want to preview?"
        paramName="emp"
        options={employees.map((e) => ({
          value: e.id,
          label: `${e.employeeCode} · ${e.name}`,
        }))}
      />
    );
  }

  const overview = await getEmployeeOverview(empId);
  return <EmployeeOverviewView overview={overview} />;
}
