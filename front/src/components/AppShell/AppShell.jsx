import Header from "../Header/Header.jsx";
import { useAuth } from "../../hooks/useAuth.js";
import "./AppShell.css";

function AppShell({ children }) {
  const { user, isAuthenticated, logout } = useAuth();

  return (
    <div className="app-shell">
      <Header
        user={user}
        isAuthenticated={isAuthenticated}
        onLogout={logout}
      />
      {children}
    </div>
  );
}

export default AppShell;
