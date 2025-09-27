import React, { useEffect } from "react";
import { Navigate } from "react-router-dom";
import { routes } from "@/routerV2";

const RedirectToEntreprise: React.FC = () => {
  useEffect(() => {
    // Log pour analytics/tracking si nécessaire
    console.log("Redirection vers /entreprise depuis /b2b/landing deprecated");
  }, []);

  return <Navigate to={routes.public.b2bLanding()} replace />;
};

export default RedirectToEntreprise;