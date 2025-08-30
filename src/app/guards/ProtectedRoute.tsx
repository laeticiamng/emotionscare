import { Suspense } from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useFlags } from "@/core/flags";
import { usePrivacy } from "@/core/privacy";
import { AsyncState, NoCamVariant, NoMicVariant, SimHRVariant, EmptyFeature } from "@/components/transverse";

interface ProtectedRouteProps {
  role: "any" | "consumer" | "employee" | "manager";
  neededFlags?: string[];
  sensorGates?: Array<"cam" | "mic" | "hr" | "push">;
}

export default function ProtectedRoute({
  role, 
  neededFlags = [], 
  sensorGates = []
}: ProtectedRouteProps) {
  const { isAuthenticated, user, isLoading } = useAuth();
  const flags = useFlags();
  const privacy = usePrivacy();
  const location = useLocation();

  // Loading state
  if (isLoading) {
    return (
      <main data-testid="page-root">
        <AsyncState.Loading />
      </main>
    );
  }

  // Authentication check
  if (!isAuthenticated) {
    const redirectUrl = `${location.pathname}${location.search}`;
    return <Navigate to={`/login?redirect=${encodeURIComponent(redirectUrl)}`} replace />;
  }

  // Role-based access control
  const userRole = user?.role || user?.user_metadata?.role;
  const allowed = role === "any" || 
                  userRole === role || 
                  (role === "employee" && userRole === "manager");
  
  if (!allowed) {
    return <Navigate to="/403" replace />;
  }

  // Feature flag checks
  for (const flag of neededFlags) {
    if (!flags.has(flag)) {
      return <EmptyFeature flagName={flag} />;
    }
  }

  // Sensor gate checks with fallback variants
  const deniedSensor = sensorGates.find(sensor => privacy[sensor] === false);
  if (deniedSensor === "hr") return <SimHRVariant />;
  if (deniedSensor === "cam") return <NoCamVariant />;
  if (deniedSensor === "mic") return <NoMicVariant />;

  return (
    <Suspense fallback={<AsyncState.Loading />}>
      <Outlet />
    </Suspense>
  );
}