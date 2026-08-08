import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-gray-workspace px-4 text-center">
      <h1 className="text-[48px] font-bold text-navy-dark">404</h1>
      <p className="text-[14px] text-gray-500">
        This page doesn&apos;t exist, or you don&apos;t have access to it.
      </p>
      <Link
        href="/login"
        className="h-11 rounded-lg bg-orange px-6 text-[14px] font-semibold
          leading-[44px] text-white"
      >
        Back to login
      </Link>
    </div>
  );
}
