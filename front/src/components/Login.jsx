import { useState } from "react";
import api from "../services/api.js";
import "./Login.css";

function Login({ onLoginSuccess }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [gender, setGender] = useState("male");
  const [username, setUsername] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [birthdate, setBirthdate] = useState("");
  const [height, setHeight] = useState("");
  const [mode, setMode] = useState("login"); // "login" | "register"
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError(null);
    setLoading(true);

    try {
      if (mode === "login") {
        const response = await api.post("/auth/login", {
          email,
          password,
        });

        if (response.data?.success) {
          const user = response.data.data;
          const token = response.data.token;
          onLoginSuccess(user, token);
        } else {
          setError(response.data?.message || "Échec de la connexion.");
        }
      } else {
        // Inscription, puis connexion automatique
        await api.post("/auth/register", {
          email,
          password,
          gender,
          username,
          first_name: firstName,
          last_name: lastName,
          age: birthdate,
          height: height ? Number(height) : undefined,
        });

        const response = await api.post("/auth/login", {
          email,
          password,
        });

        if (response.data?.success) {
          const user = response.data.data;
          const token = response.data.token;
          onLoginSuccess(user, token);
        } else {
          setError(response.data?.message || "Échec de la connexion après inscription.");
        }
      }
    } catch (err) {
      const apiMessage =
        err.response?.data?.errors?.[0]?.msg || err.response?.data?.message;
      const fallbackMessage =
        mode === "login"
          ? "Une erreur est survenue pendant la connexion."
          : "Une erreur est survenue pendant l'inscription.";
      const message = apiMessage || fallbackMessage;
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="login-main">
      <div className="card login-card">
        <div className="card-header">
          <div>
            <h2 className="card-title">
              {mode === "login" ? "Connexion" : "Inscription"}
            </h2>
            <p className="card-caption">
              {mode === "login"
                ? "Accédez à votre tableau de bord et suivez votre évolution."
                : "Créez un compte pour commencer à suivre votre poids."}
            </p>
          </div>
        </div>

        <form
          onSubmit={handleSubmit}
          className="login-form"
        >
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

          {mode === "register" && (
            <>
              <div className="login-field">
                <label
                  htmlFor="gender"
                  className="login-label"
                >
                  Sexe
                </label>
                <div className="login-radio-group">
                  <label className="login-radio-option">
                    <input
                      type="radio"
                      name="gender"
                      value="male"
                      checked={gender === "male"}
                      onChange={() => setGender("male")}
                    />
                    Homme
                  </label>
                  <label className="login-radio-option">
                    <input
                      type="radio"
                      name="gender"
                      value="female"
                      checked={gender === "female"}
                      onChange={() => setGender("female")}
                    />
                    Femme
                  </label>
                </div>
              </div>

              <div className="login-field">
                <label
                  htmlFor="username"
                  className="login-label"
                >
                  Nom d'utilisateur
                </label>
                <input
                  id="username"
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required={mode === "register"}
                  placeholder="atif_shape_92"
                  className="login-input"
                />
              </div>

              <div className="login-grid-2">
                <div className="login-field">
                  <label
                    htmlFor="first-name"
                    className="login-label"
                  >
                    Prénom
                  </label>
                  <input
                    id="first-name"
                    type="text"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    required={mode === "register"}
                    placeholder="Atif"
                    className="login-input"
                  />
                </div>

                <div className="login-field">
                  <label
                    htmlFor="last-name"
                    className="login-label"
                  >
                    Nom
                  </label>
                  <input
                    id="last-name"
                    type="text"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    required={mode === "register"}
                    placeholder="Shape"
                    className="login-input"
                  />
                </div>
              </div>

              <div className="login-grid-main-side">
                <div className="login-field">
                  <label
                    htmlFor="birthdate"
                    className="login-label"
                  >
                    Date de naissance
                  </label>
                  <input
                    id="birthdate"
                    type="date"
                    value={birthdate}
                    onChange={(e) => setBirthdate(e.target.value)}
                    required={mode === "register"}
                    className="login-input-date"
                  />
                </div>

                <div className="login-field">
                  <label
                    htmlFor="height"
                    className="login-label"
                  >
                    Taille (cm)
                  </label>
                  <input
                    id="height"
                    type="number"
                    min="100"
                    max="300"
                    value={height}
                    onChange={(e) => setHeight(e.target.value)}
                    required={mode === "register"}
                    placeholder="170"
                    className="login-input"
                  />
                </div>
              </div>
            </>
          )}

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

          <button
            type="submit"
            disabled={loading}
            className="login-submit"
          >
            {loading
              ? mode === "login"
                ? "Connexion..."
                : "Inscription..."
              : mode === "login"
                ? "Se connecter"
                : "S'inscrire"}
          </button>

          <button
            type="button"
            onClick={() => {
              setMode((prev) => (prev === "login" ? "register" : "login"));
              setError(null);
            }}
            className="login-toggle"
          >
            {mode === "login"
              ? "Pas encore de compte ? Créer un compte"
              : "Déjà un compte ? Se connecter"}
          </button>
        </form>
      </div>
    </main>
  );
}

export default Login;


