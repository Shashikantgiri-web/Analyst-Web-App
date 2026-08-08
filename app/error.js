"use client";

export default function GlobalError({ reset }) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-gray-workspace px-4 text-center">
      <h1 className="text-[24px] font-bold text-navy-dark">
        Something went wrong
      </h1>
      <p className="text-[14px] text-gray-500">
        Please try again -- if this keeps happening, contact support.
      </p>
      <button
        onClick={reset}
        className="h-11 rounded-lg bg-orange px-6 text-[14px] font-semibold text-white"
      >
        Try again
      </button>
    </div>
  );
}
