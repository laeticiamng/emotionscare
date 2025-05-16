
import { useEffect } from "react";
import { Outlet } from "react-router-dom";
import "./App.css";
import { AuthProvider } from "./contexts/AuthContext";

function App() {
  useEffect(() => {
    document.title = "Emotion App";
  }, []);

  return (
    <AuthProvider>
      <div className="min-h-screen bg-background">
        <Outlet />
      </div>
    </AuthProvider>
  );
}

export default App;
