import "./globals.css";
import { Toaster } from "sonner";

export const metadata = {
  title: {
    default: "Employee Performance Analytics",
    template: "%s | Employee Performance Analytics",
  },
  description:
    "Role-based performance analytics dashboard for CEO, managers, and employees.",
  robots: { index: false, follow: false }, // internal app -- flip on for /about only if made public
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full flex flex-col bg-gray-workspace text-navy-dark">
        {children}
        <Toaster richColors position="top-right" />
      </body>
    </html>
  );
}
