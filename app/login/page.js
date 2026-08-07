"use client";

import { useActionState, useState } from "react";
import { useRouter } from "next/navigation";
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
  const [showTesterPicker, setShowTesterPicker] = useState(false);

  // CEO, Manager, and Employee already have a fully resolved redirectTo
  // from the server (Manager's department is looked up server-side now).
  // Only Tester needs a client-side follow-up: which role to simulate.
  if (state.ok && !showTesterPicker) {
    if (state.role === ROLES.TESTER) {
      setShowTesterPicker(true);
      return null;
    }
    router.push(state.redirectTo);
    return null;
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

        {!showTesterPicker ? (
          <form action={formAction} className="flex flex-col gap-4">
            <TextField
              id="userId"
              name="userId"
              label="User ID"
              placeholder="65286"
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
          <TesterRolePicker />
        )}
      </div>
    </div>
  );
}

function TesterRolePicker() {
  const router = useRouter();

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
