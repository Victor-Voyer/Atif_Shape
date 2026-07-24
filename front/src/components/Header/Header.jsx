import LogoAkiShape from "../../assets/Logo-AkiShape.png";
import Nav from "../Nav/Nav.jsx";
import UserMenu from "../UserMenu/UserMenu.jsx";
import "./Header.css";

function Header({ user, isAuthenticated, onLogout }) {
  return (
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
          <Nav />
          <UserMenu user={user} onLogout={onLogout} />
        </div>
      )}
    </header>
  );
}

export default Header;
