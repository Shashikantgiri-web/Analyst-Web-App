export function EmployeeTable({ employees }) {
  if (!employees || employees.length === 0) {
    return <p className="text-[14px] text-gray-500">No employees found.</p>;
  }

  return (
    <div className="overflow-x-auto rounded-xl border border-gray-200 bg-white shadow-sm">
      <table className="w-full text-[13px]">
        <thead>
          <tr className="border-b border-gray-200 bg-gray-workspace text-left text-gray-500">
            <th className="px-4 py-3 font-medium">Employee Code</th>
            <th className="px-4 py-3 font-medium">Job Title</th>
            <th className="px-4 py-3 font-medium">Performance</th>
            <th className="px-4 py-3 font-medium">Salary</th>
            <th className="px-4 py-3 font-medium">Years</th>
          </tr>
        </thead>
        <tbody>
          {employees.map((emp) => (
            <tr key={emp.id} className="border-b border-gray-100 last:border-0">
              <td className="px-4 py-3 text-navy-dark">{emp.employeeCode}</td>
              <td className="px-4 py-3 text-navy-dark">{emp.jobTitle ?? "—"}</td>
              <td className="px-4 py-3 text-navy-dark">
                {emp.performanceScore?.toFixed(1) ?? "—"}
              </td>
              <td className="px-4 py-3 text-navy-dark">
                {emp.monthlySalary
                  ? `₹${Number(emp.monthlySalary).toLocaleString()}`
                  : "—"}
              </td>
              <td className="px-4 py-3 text-navy-dark">
                {emp.yearsAtCompany ?? "—"}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
