import { Navigate, NavLink, Route, Routes } from "react-router-dom";
import "./App.css";
import Login from "./pages/Login/Login.jsx";
import Register from "./pages/Register/Register.jsx";
import Dashboard from "./pages/Dashboard/Dashboard.jsx";
import Profile from "./pages/Profile/Profile.jsx";
import LogoAkiShape from "./assets/Logo-AkiShape.png";
import { useAuth } from "./hooks/useAuth.js";

function ProtectedRoute({ children }) {
  const { isAuthenticated, ready } = useAuth();
  if (!ready) return null;
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  return children;
}

function PublicOnlyRoute({ children }) {
  const { isAuthenticated, ready } = useAuth();
  if (!ready) return null;
  if (isAuthenticated) return <Navigate to="/" replace />;
  return children;
}

function AppShell({ children }) {
  const { user, isAuthenticated, logout } = useAuth();

  return (
    <div className="app-shell">
      <header className="app-header">
        <div className="app-header-title">
          <img src={LogoAkiShape} alt="AkiShape" className="app-logo" />
          <h1 className="app-title hidden">
            Aki
            <span className="app-title-italic">Shape</span>
          </h1>
        </div>

        {isAuthenticated && (
          <div className="app-header-right">
            <nav className="nav-toggle">
              <NavLink
                to="/"
                end
                className={({ isActive }) =>
                  `nav-toggle-btn ${isActive ? "nav-toggle-btn-active" : ""}`
                }
              >
                Poids
              </NavLink>
              <NavLink
                to="/profile"
                className={({ isActive }) =>
                  `nav-toggle-btn ${isActive ? "nav-toggle-btn-active" : ""}`
                }
              >
                Profil
              </NavLink>
            </nav>

            <div className="user-box">
              <div className="user-chip">
                <span className="user-dot" />
                <span>{user?.username || user?.first_name || "Utilisateur"}</span>
              </div>
              <button className="logout-button" type="button" onClick={logout}>
                <span className="logout-icon" />
                Déconnexion
              </button>
            </div>
          </div>
        )}
      </header>

      {children}
    </div>
  );
}

function App() {
  return (
    <AppShell>
      <Routes>
        <Route
          path="/login"
          element={
            <PublicOnlyRoute>
              <Login />
            </PublicOnlyRoute>
          }
        />
        <Route
          path="/register"
          element={
            <PublicOnlyRoute>
              <Register />
            </PublicOnlyRoute>
          }
        />
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </AppShell>
  );
}

export default App;
