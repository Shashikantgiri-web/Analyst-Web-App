"use server";

import { verifyCredentials } from "@/services/auth.service";
import { createSession } from "@/lib/session";
import { loginSchema } from "@/utils/validation";
import { ROLE_HOME_ROUTE } from "@/constants/roles";

/**
 * Login server action. Verifies userId + email + password via Supabase Auth,
 * cross-checks employee_accounts, and on success issues our own
 * signed session cookie -- see lib/session.js.
 */
export async function loginAction(_prevState, formData) {
  const parsed = loginSchema.safeParse({
    userId: formData.get("userId"),
    email: formData.get("email"),
    password: formData.get("password"),
  });

  if (!parsed.success) {
    return {
      ok: false,
      message: parsed.error.issues[0]?.message ?? "Invalid input.",
    };
  }

  const { userId, email, password } = parsed.data;
  const result = await verifyCredentials({ userId, email, password });

  if (result.status !== "ok") {
    // TEMPORARY: includes debug reason in the response. Remove before
    // going back to production traffic -- this leaks auth internals.
    return {
      ok: false,
      message: `User not found/Unauthorized. [debug: ${result.status} / ${result.reason}]`,
    };
  }

  await createSession({
    accountId: result.accountId,
    employeeId: result.employeeId,
    departmentId: result.departmentId,
    role: result.role,
  });

  return {
    ok: true,
    role: result.role,
    redirectTo: ROLE_HOME_ROUTE[result.role] ?? "/login",
  };
}
