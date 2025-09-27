import React, { useEffect } from "react";
import { Navigate } from "react-router-dom";
import { routes } from "@/routerV2";

const RedirectToScan: React.FC = () => {
  useEffect(() => {
    // Log pour analytics/tracking si nécessaire
    console.log("Redirection vers /app/scan depuis route deprecated");
  }, []);

  return <Navigate to={routes.b2c.scan()} replace />;
};

export default RedirectToScan;