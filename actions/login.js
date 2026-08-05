"use server";

import { createClient } from "@/lib/supabase/server";
import { resolveAccountForCurrentUser } from "@/services/auth.service";
import { loginSchema } from "@/utils/validation";
import { ROLE_HOME_ROUTE } from "@/constants/roles";

/**
 * Login server action. Mirrors the logic in App_detail.md:
 *  1. Validate input (never trust the client).
 *  2. Authenticate against Supabase Auth (email + password).
 *  3. Cross-check the employee_accounts ("access") table for userId + email
 *     + role. No match at any step -> "User not found/Unauthorized."
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
  const supabase = await createClient();

  const { error: authError } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (authError) {
    // Deliberately generic — never reveal whether the email exists.
    return { ok: false, message: "User not found/Unauthorized." };
  }

  const result = await resolveAccountForCurrentUser({ userId, email });

  if (result.status !== "ok") {
    await supabase.auth.signOut();
    return { ok: false, message: "User not found/Unauthorized." };
  }

  return {
    ok: true,
    role: result.role,
    employeeId: result.employeeId,
    redirectTo: ROLE_HOME_ROUTE[result.role] ?? "/login",
  };
}
