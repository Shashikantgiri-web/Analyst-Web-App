// Mirrors the `roles` lookup table in 11_Database_Design.md.
// role_name values must match the database exactly (case-sensitive).
export const ROLES = {
  CEO: "CEO",
  MANAGER: "Manager",
  EMPLOYEE: "Employee",
  TESTER: "Tester",
};

export const ROLE_HOME_ROUTE = {
  [ROLES.CEO]: "/ceo",
  [ROLES.MANAGER]: "/manage",
  [ROLES.EMPLOYEE]: "/employee",
  [ROLES.TESTER]: "/test",
};
