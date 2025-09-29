// Export Routes as both type and runtime value for components that need it
export const Routes = {
  HOME: "/",
  DASHBOARD: "/dashboard", 
  B2C_DASHBOARD: "/b2c/dashboard",
  B2B_USER_DASHBOARD: "/b2b/user/dashboard",
  B2B_ADMIN_DASHBOARD: "/b2b/admin/dashboard",
  // Add other route constants as needed
} as const;