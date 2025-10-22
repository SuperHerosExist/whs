import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from '@/contexts/AuthContext';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';

// Auth pages
import { SignIn } from '@/components/auth/SignIn';
import { SignUp } from '@/components/auth/SignUp';

// Public pages
import { Home } from '@/pages/Home';
import { About } from '@/pages/About';
import { Roster } from '@/pages/Roster';
import { Team } from '@/pages/Team';
import { Schedule } from '@/pages/Schedule';
import { Stats } from '@/pages/Stats';
import { Contact } from '@/pages/Contact';

// Protected pages
import { PlayerDashboard } from '@/pages/PlayerDashboard';
import { CoachDashboard } from '@/pages/CoachDashboard';
import { PlayerProfile } from '@/pages/PlayerProfile';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="flex flex-col min-h-screen">
          <Header />
          <main className="flex-grow">
            <Routes>
              {/* Public routes */}
              <Route path="/" element={<Home />} />
              <Route path="/about" element={<About />} />
              <Route path="/roster" element={<Roster />} />
              <Route path="/team" element={<Team />} />
              <Route path="/schedule" element={<Schedule />} />
              <Route path="/stats" element={<Stats />} />
              <Route path="/contact" element={<Contact />} />

              {/* Auth routes */}
              <Route path="/signin" element={<SignIn />} />
              <Route path="/signup" element={<SignUp />} />

              {/* Protected player routes */}
              <Route
                path="/player/dashboard"
                element={
                  <ProtectedRoute requiredRole="player">
                    <PlayerDashboard />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/player/profile"
                element={
                  <ProtectedRoute requiredRole="player">
                    <PlayerProfile />
                  </ProtectedRoute>
                }
              />

              {/* Protected coach routes */}
              <Route
                path="/coach/dashboard"
                element={
                  <ProtectedRoute requiredRole="coach">
                    <CoachDashboard />
                  </ProtectedRoute>
                }
              />

              {/* Catch all - redirect to home */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
