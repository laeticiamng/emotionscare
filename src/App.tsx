
import { ThemeProvider } from "@/components/theme/ThemeProvider";
import { AudioProvider } from "@/contexts/AudioContext";
import { Toaster } from "@/components/ui/toaster";
import AppRouter from "./AppRouter";
import { LayoutProvider } from "./contexts/LayoutContext";
import { SidebarProvider } from "./contexts/SidebarContext";
import { MusicProvider } from "./contexts/MusicContext";

function App() {
  return (
    <ThemeProvider defaultTheme="system" storageKey="vite-ui-theme">
      <LayoutProvider>
        <SidebarProvider>
          <MusicProvider>
            <AudioProvider>
              <AppRouter />
              <Toaster />
            </AudioProvider>
          </MusicProvider>
        </SidebarProvider>
      </LayoutProvider>
    </ThemeProvider>
  );
}

export default App;
