import { Sidebar } from "@/components/layout/sidebar";
import { ContentHeader } from "@/components/layout/content-header";

/**
 * Shared shell for every role dashboard: fixed 256px sidebar (per
 * 02_Design.md section 8) + a content header, wrapping the page body.
 * Layout order follows section 7: Sidebar -> Content Header -> (page
 * content: Filters -> KPIs -> Charts -> Tables, supplied by each page).
 */
export function AppShell({ role, title, subtitle, children }) {
  return (
    <div className="min-h-screen bg-gray-workspace">
      <Sidebar role={role} />
      <div className="ml-64 flex min-h-screen flex-col">
        <ContentHeader title={title} subtitle={subtitle} />
        <main className="flex flex-1 flex-col gap-8 p-8">{children}</main>
      </div>
    </div>
  );
}
