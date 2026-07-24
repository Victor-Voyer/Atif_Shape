import "./UserMenu.css";

function UserMenu({ user, onLogout }) {
  return (
    <div className="user-box">
      <div className="user-chip">
        <span className="user-dot" />
        <span>{user?.username || user?.first_name || "Utilisateur"}</span>
      </div>
      <button className="logout-button" type="button" onClick={onLogout}>
        <span className="logout-icon" />
        Déconnexion
      </button>
    </div>
  );
}

export default UserMenu;
