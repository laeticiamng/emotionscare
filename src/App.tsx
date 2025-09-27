import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import AppProviders from './AppProviders';
import Index from './pages/Index';

function App() {
  return (
    <AppProviders>
      <Router>
        <Routes>
          <Route path="/" element={<Index />} />
        </Routes>
      </Router>
    </AppProviders>
  );
}

export default App;