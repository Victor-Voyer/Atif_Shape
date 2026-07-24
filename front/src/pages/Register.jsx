import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { login as loginRequest, register as registerRequest } from "../services/authApi.js";
import { getErrorMessage } from "../services/api.js";
import { useAuth } from "../hooks/useAuth.js";
import { GENDERS } from "@shared/constants.js";
import "../components/Login.css";

function Register() {
  const { loginSuccess } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [gender, setGender] = useState(GENDERS.MALE);
  const [username, setUsername] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [birthdate, setBirthdate] = useState("");
  const [height, setHeight] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError(null);
    setLoading(true);

    try {
      await registerRequest({
        email,
        password,
        gender,
        username,
        first_name: firstName,
        last_name: lastName,
        birthdate,
        height: height ? Number(height) : undefined,
      });

      const data = await loginRequest(email, password);
      if (data?.success) {
        loginSuccess(data.data, data.token);
        navigate("/");
      } else {
        setError(data?.message || "Échec de la connexion après inscription.");
      }
    } catch (err) {
      setError(
        getErrorMessage(err, "Une erreur est survenue pendant l'inscription.")
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
            <h2 className="card-title">Inscription</h2>
            <p className="card-caption">
              Créez un compte pour commencer à suivre votre poids.
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
            <label htmlFor="gender" className="login-label">
              Sexe
            </label>
            <div className="login-radio-group">
              <label className="login-radio-option">
                <input
                  type="radio"
                  name="gender"
                  value={GENDERS.MALE}
                  checked={gender === GENDERS.MALE}
                  onChange={() => setGender(GENDERS.MALE)}
                />
                Homme
              </label>
              <label className="login-radio-option">
                <input
                  type="radio"
                  name="gender"
                  value={GENDERS.FEMALE}
                  checked={gender === GENDERS.FEMALE}
                  onChange={() => setGender(GENDERS.FEMALE)}
                />
                Femme
              </label>
            </div>
          </div>

          <div className="login-field">
            <label htmlFor="username" className="login-label">
              Nom d&apos;utilisateur
            </label>
            <input
              id="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              placeholder="aki_shape_92"
              className="login-input"
            />
          </div>

          <div className="login-grid-2">
            <div className="login-field">
              <label htmlFor="first-name" className="login-label">
                Prénom
              </label>
              <input
                id="first-name"
                type="text"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                required
                placeholder="Aki"
                className="login-input"
              />
            </div>

            <div className="login-field">
              <label htmlFor="last-name" className="login-label">
                Nom
              </label>
              <input
                id="last-name"
                type="text"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                required
                placeholder="Shape"
                className="login-input"
              />
            </div>
          </div>

          <div className="login-grid-main-side">
            <div className="login-field">
              <label htmlFor="birthdate" className="login-label">
                Date de naissance
              </label>
              <input
                id="birthdate"
                type="date"
                value={birthdate}
                onChange={(e) => setBirthdate(e.target.value)}
                required
                className="login-input-date"
              />
            </div>

            <div className="login-field">
              <label htmlFor="height" className="login-label">
                Taille (cm)
              </label>
              <input
                id="height"
                type="number"
                min="100"
                max="300"
                value={height}
                onChange={(e) => setHeight(e.target.value)}
                required
                placeholder="170"
                className="login-input"
              />
            </div>
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
            {loading ? "Inscription..." : "S'inscrire"}
          </button>

          <Link to="/login" className="login-toggle">
            Déjà un compte ? Se connecter
          </Link>
        </form>
      </div>
    </main>
  );
}

export default Register;
