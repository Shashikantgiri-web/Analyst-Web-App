import Link from "next/link";

export const metadata = {
  title: "About",
  description:
    "How the Employee Performance Analytics platform turns HR data into role-based dashboards for CEOs, managers, and employees.",
  robots: { index: true, follow: true },
};

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gray-workspace px-4 py-16">
      <div className="mx-auto max-w-2xl">
        <div className="mb-8 flex items-center gap-2">
          <div className="h-8 w-8 rounded-md bg-orange" />
          <span className="text-[18px] font-bold text-navy-dark">
            Performance Analytics
          </span>
        </div>

        <div className="rounded-xl border border-gray-200 bg-white p-8 shadow-sm">
          <h1 className="text-[24px] font-bold text-navy-dark">
            About this platform
          </h1>
          <p className="mt-4 text-[14px] leading-relaxed text-gray-600">
            This platform turns raw HR data into role-scoped performance
            dashboards. An analysis team cleans employee data in Excel,
            builds DAX-driven measures in Power BI, and pushes the results
            into PostgreSQL via a Python ETL pipeline. This app then reads
            that data and shows each person exactly the slice
            they&apos;re allowed to see: company-wide for the CEO,
            department-wide for managers, and individual for employees.
          </p>

          <Link
            href="/login"
            className="mt-6 inline-flex h-11 items-center justify-center rounded-lg
              bg-orange px-6 text-[14px] font-semibold text-white"
          >
            Back to login
          </Link>
        </div>
      </div>
    </div>
  );
}
