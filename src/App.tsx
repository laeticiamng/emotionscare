
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from '@/components/Layout';
import DashboardPage from '@/pages/DashboardPage';
import ScanPage from '@/pages/ScanPage';
import VRSessionPage from '@/pages/VRSessionPage';
import MusicDrawer from '@/components/music/MusicDrawer';
import { MusicProvider } from '@/contexts/MusicContext';
import { AuthProvider } from '@/contexts/AuthContext';
import { Toaster } from '@/components/ui/toaster';

function App() {
  return (
    <AuthProvider>
      <MusicProvider>
        <Router>
          <Layout>
            <Routes>
              <Route path="/" element={<DashboardPage />} />
              <Route path="/dashboard" element={<DashboardPage />} />
              <Route path="/scan" element={<ScanPage />} />
              <Route path="/vr-session" element={<VRSessionPage />} />
            </Routes>
          </Layout>
          <MusicDrawer />
          <Toaster />
        </Router>
      </MusicProvider>
    </AuthProvider>
  );
}

export default App;
