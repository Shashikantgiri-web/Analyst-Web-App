"use client";

import { useActionState, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { loginAction } from "@/actions/login";
import { TextField } from "@/components/ui/text-field";
import { Button } from "@/components/ui/button";
import { ROLES } from "@/constants/roles";

const initialState = { ok: false, message: null };

export default function LoginPage() {
  const router = useRouter();
  const [state, formAction, isPending] = useActionState(
    loginAction,
    initialState
  );
  const [pendingRole, setPendingRole] = useState(null);

  // Once auth + access-table checks succeed, Manager and Tester roles need
  // one more choice before we redirect (App_detail.md: "show a div box to
  // select the department" / "select which role to test").
  if (state.ok && !pendingRole) {
    if (state.role === ROLES.MANAGER || state.role === ROLES.TESTER) {
      setPendingRole(state);
      return null;
    }
    router.push(state.redirectTo);
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-workspace px-4">
      <div className="w-full max-w-sm rounded-xl border border-gray-200 bg-white p-8 shadow-sm">
        <div className="mb-6 flex items-center gap-2">
          <div className="h-8 w-8 rounded-md bg-orange" />
          <span className="text-[18px] font-bold text-navy-dark">
            Performance Analytics
          </span>
        </div>

        {!pendingRole ? (
          <form action={formAction} className="flex flex-col gap-4">
            <TextField
              id="userId"
              name="userId"
              label="User ID"
              placeholder="EMP-0001"
              autoComplete="username"
            />
            <TextField
              id="email"
              name="email"
              type="email"
              label="Email"
              placeholder="you@company.com"
              autoComplete="email"
            />
            <TextField
              id="password"
              name="password"
              type="password"
              label="Password"
              placeholder="••••••••"
              autoComplete="current-password"
            />

            {state.message && (
              <p className="text-[13px] text-red-600">{state.message}</p>
            )}

            <Button type="submit" disabled={isPending}>
              {isPending ? "Checking…" : "Sign in"}
            </Button>
          </form>
        ) : (
          <RoleFollowUp state={pendingRole} />
        )}
      </div>
    </div>
  );
}

function RoleFollowUp({ state }) {
  const router = useRouter();

  if (state.role === ROLES.MANAGER) {
    return (
      <DepartmentSelect
        onSelect={(slug) => router.push(`/manage/${slug}`)}
      />
    );
  }

  // Tester: choose which role to simulate.
  return (
    <div className="flex flex-col gap-3">
      <p className="text-[14px] font-medium text-navy-dark">
        Which role do you want to test?
      </p>
      {["ceo", "manager", "employee"].map((slug) => (
        <button
          key={slug}
          onClick={() => router.push(`/test/${slug}`)}
          className="h-11 rounded-lg border border-gray-200 bg-white text-[14px]
            font-medium text-navy-dark hover:border-orange hover:text-orange"
        >
          {slug.charAt(0).toUpperCase() + slug.slice(1)}
        </button>
      ))}
    </div>
  );
}

function DepartmentSelect({ onSelect }) {
  const [slug, setSlug] = useState("");

  // Department list is fetched from /manage server layer in Phase 2 —
  // for Phase 1 this is a placeholder set covering the schema's scope.
  const departments = [
    { slug: "engineering", label: "Engineering" },
    { slug: "sales", label: "Sales" },
    { slug: "hr", label: "Human Resources" },
    { slug: "finance", label: "Finance" },
  ];

  return (
    <div className="flex flex-col gap-3">
      <p className="text-[14px] font-medium text-navy-dark">
        Select your department
      </p>
      <select
        value={slug}
        onChange={(e) => setSlug(e.target.value)}
        className="h-11 rounded-lg border border-gray-300 bg-white px-3 text-[14px]"
      >
        <option value="" disabled>
          Choose a department…
        </option>
        {departments.map((d) => (
          <option key={d.slug} value={d.slug}>
            {d.label}
          </option>
        ))}
      </select>
      <Button disabled={!slug} onClick={() => onSelect(slug)}>
        Continue
      </Button>
    </div>
  );
}
