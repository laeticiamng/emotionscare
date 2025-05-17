
import { useEffect } from "react";
import { Outlet } from "react-router-dom";
import "./App.css";

function App() {
  useEffect(() => {
    document.title = "Emotion App";
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <Outlet />
    </div>
  );
}

export default App;
