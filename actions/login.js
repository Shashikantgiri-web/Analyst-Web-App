"use server";

import { verifyCredentials } from "@/services/auth.service";
import { getDepartmentSlug } from "@/services/department.service";
import { createSession } from "@/lib/session";
import { loginSchema } from "@/utils/validation";
import { ROLES } from "@/constants/roles";

/**
 * Login server action. Verifies userId + email + password against
 * employee_accounts.password_hash (bcrypt) and, on success, issues our own
 * signed session cookie -- see lib/session.js. No Supabase Auth involved.
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

  if (result.status === "locked") {
    const minsLeft = Math.max(
      1,
      Math.ceil((new Date(result.lockedUntil) - new Date()) / 60000)
    );
    return {
      ok: false,
      message: `Too many failed attempts. Try again in ${minsLeft} minute(s).`,
    };
  }

  if (result.status !== "ok") {
    return { ok: false, message: "User not found/Unauthorized." };
  }

  await createSession({
    accountId: result.accountId,
    employeeId: result.employeeId,
    departmentId: result.departmentId,
    role: result.role,
  });

  // CEO and Employee go straight to their fixed route. Manager now has a
  // real department_id on their account, so we resolve it here instead of
  // asking them to pick one. Tester still picks which role to simulate --
  // that's a genuine choice, not something derivable from their account.
  let redirectTo = "/login";

  if (result.role === ROLES.CEO) {
    redirectTo = "/ceo";
  } else if (result.role === ROLES.EMPLOYEE) {
    redirectTo = `/employee/${result.employeeId}`;
  } else if (result.role === ROLES.MANAGER) {
    const slug = await getDepartmentSlug(result.departmentId);
    redirectTo = slug ? `/manage/${slug}` : "/login";
  }
  // Tester: redirectTo stays "/login" here -- the client shows the role
  // picker and navigates itself once the user chooses.

  return {
    ok: true,
    role: result.role,
    redirectTo,
  };
}
