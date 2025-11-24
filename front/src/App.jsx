import { useEffect, useState } from "react";
import "./App.css";
import Login from "./components/Login.jsx";
import Dashboard from "./components/Dashboard.jsx";
import Profile from "./components/Profile.jsx";
import LogoAtifShape from "./assets/Logo-Atif-Shape.png";

function App() {
  const [token, setToken] = useState(null);
  const [user, setUser] = useState(null);
  const [view, setView] = useState("dashboard"); // 'dashboard' | 'profile'

  useEffect(() => {
    const storedToken = window.localStorage.getItem("atif_token");
    const storedUser = window.localStorage.getItem("atif_user");

    if (storedToken && storedUser) {
      try {
        setToken(storedToken);
        setUser(JSON.parse(storedUser));
      } catch {
        window.localStorage.removeItem("atif_token");
        window.localStorage.removeItem("atif_user");
      }
    }
  }, []);

  const handleLoginSuccess = (userData, jwt) => {
    setToken(jwt);
    setUser(userData);
    setView("dashboard");
    window.localStorage.setItem("atif_token", jwt);
    window.localStorage.setItem("atif_user", JSON.stringify(userData));
  };

  const handleUserUpdated = (updatedUser) => {
    setUser(updatedUser);
    window.localStorage.setItem("atif_user", JSON.stringify(updatedUser));
  };

  const handleLogout = () => {
    setToken(null);
    setUser(null);
    window.localStorage.removeItem("atif_token");
    window.localStorage.removeItem("atif_user");
  };

  const isAuthenticated = Boolean(token && user);

  return (
    <div className="app-shell">
      <header className="app-header">
        <div className="app-header-title">
          <img
            src={LogoAtifShape}
            alt="Atif Shape"
            className="app-logo"
          />
          <h1 className="app-title">
            Atif'
            <span className="app-title-italic">Shape</span>
          </h1>
        </div>

        {isAuthenticated && (
          <div className="app-header-right">
            <nav className="nav-toggle">
              <button
                type="button"
                className={`nav-toggle-btn ${
                  view === "dashboard" ? "nav-toggle-btn-active" : ""
                }`}
                onClick={() => setView("dashboard")}
              >
                Poids
              </button>
              <button
                type="button"
                className={`nav-toggle-btn ${
                  view === "profile" ? "nav-toggle-btn-active" : ""
                }`}
                onClick={() => setView("profile")}
              >
                Profil
              </button>
            </nav>

            <div className="user-box">
              <div className="user-chip">
                <span className="user-dot" />
                <span>{user?.username || user?.first_name || "Utilisateur"}</span>
              </div>
              <button className="logout-button" type="button" onClick={handleLogout}>
                <span className="logout-icon" />
                Déconnexion
              </button>
            </div>
          </div>
        )}
      </header>

      {!isAuthenticated ? (
        <Login onLoginSuccess={handleLoginSuccess} />
      ) : view === "profile" ? (
        <Profile user={user} onUserUpdated={handleUserUpdated} />
      ) : (
        <Dashboard user={user} token={token} />
      )}
    </div>
  );
}

export default App;
