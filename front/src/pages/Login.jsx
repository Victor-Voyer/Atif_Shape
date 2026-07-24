import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { login as loginRequest } from "../services/authApi.js";
import { getErrorMessage } from "../services/api.js";
import { useAuth } from "../hooks/useAuth.js";
import "../components/Login.css";

function Login() {
  const { loginSuccess } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const data = await loginRequest(email, password);
      if (data?.success) {
        loginSuccess(data.data, data.token);
        navigate("/");
      } else {
        setError(data?.message || "Échec de la connexion.");
      }
    } catch (err) {
      setError(
        getErrorMessage(err, "Une erreur est survenue pendant la connexion.")
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="login-main">
      <div className="card login-card">
        <div className="card-header">
          <div>
            <h2 className="card-title">Connexion</h2>
            <p className="card-caption">
              Accédez à votre tableau de bord et suivez votre évolution.
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="login-form">
          <div className="login-field">
            <label htmlFor="email" className="login-label">
              Adresse e-mail
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="vous@example.com"
              className="login-input"
            />
          </div>

          <div className="login-field">
            <label htmlFor="password" className="login-label">
              Mot de passe
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="••••••••"
              className="login-input"
            />
          </div>

          {error && <p className="login-error">{error}</p>}

          <button type="submit" disabled={loading} className="login-submit">
            {loading ? "Connexion..." : "Se connecter"}
          </button>

          <Link to="/register" className="login-toggle">
            Pas encore de compte ? Créer un compte
          </Link>
        </form>
      </div>
    </main>
  );
}

export default Login;
