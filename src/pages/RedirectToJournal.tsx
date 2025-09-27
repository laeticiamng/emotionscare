import React, { useEffect } from "react";
import { Navigate } from "react-router-dom";
import { routes } from "@/routerV2";

const RedirectToJournal: React.FC = () => {
  useEffect(() => {
    // Log pour analytics/tracking si nécessaire
    console.log("Redirection vers /app/journal depuis route deprecated");
  }, []);

  return <Navigate to={routes.b2c.journal()} replace />;
};

export default RedirectToJournal;