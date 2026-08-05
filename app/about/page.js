export const metadata = {
  title: "About",
  description:
    "How the Employee Performance Analytics platform turns HR data into role-based dashboards for CEOs, managers, and employees.",
  robots: { index: true, follow: true },
};

export default function AboutPage() {
  return (
    <main className="mx-auto max-w-2xl p-8">
      <h1 className="text-[30px] font-bold text-navy-dark">
        About this platform
      </h1>
      <p className="mt-4 text-[14px] leading-relaxed text-gray-600">
        This platform turns raw HR data into role-scoped performance
        dashboards. An analysis team cleans employee data in Excel, builds
        DAX-driven measures in Power BI, and pushes the results into
        PostgreSQL via a Python ETL pipeline. This app then reads that data
        and shows each person exactly the slice they&apos;re allowed to see:
        company-wide for the CEO, department-wide for managers, and
        individual for employees.
      </p>
    </main>
  );
}
