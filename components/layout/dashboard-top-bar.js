import { logoutAction } from "@/actions/logout";

export function DashboardTopBar({ title, subtitle }) {
  return (
    <div className="flex items-center justify-between border-b border-gray-200 pb-4">
      <div>
        <h1 className="text-[30px] font-bold text-navy-dark">{title}</h1>
        {subtitle && (
          <p className="mt-1 text-[14px] text-gray-500">{subtitle}</p>
        )}
      </div>
      <form action={logoutAction}>
        <button
          type="submit"
          className="h-10 rounded-lg border border-gray-200 bg-white px-4 text-[13px]
            font-medium text-navy-dark hover:border-orange hover:text-orange"
        >
          Log out
        </button>
      </form>
    </div>
  );
}
