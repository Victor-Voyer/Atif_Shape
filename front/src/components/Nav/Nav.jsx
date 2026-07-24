import { NavLink } from "react-router-dom";
import "./Nav.css";

function Nav() {
  return (
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
        to="/program"
        className={({ isActive }) =>
          `nav-toggle-btn ${isActive ? "nav-toggle-btn-active" : ""}`
        }
      >
        Programme
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
  );
}

export default Nav;
