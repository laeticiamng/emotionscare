
import React, { useEffect } from "react";
import { RouterProvider } from "react-router-dom";
import { router } from "./router";
import { Analytics } from "./utils/analytics"; // Keep this if analytics is used
import "./App.css";
import { Toaster } from "sonner";

function App() {
  useEffect(() => {
    // Initialize analytics or any other app-wide setup here
    Analytics.initialize();
  }, []);

  return (
    <>
      <RouterProvider router={router} />
      <Toaster position="top-right" />
    </>
  );
}

export default App;
