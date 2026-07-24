import { useEffect, useState } from "react";
import { updateUser as updateUserRequest } from "../services/usersApi.js";
import { getErrorMessage } from "../services/api.js";
import { useAuth } from "../hooks/useAuth.js";
import { GENDERS } from "@shared/constants.js";
import "../components/Profile.css";

function toInputDate(value) {
  if (!value) return "";
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return "";
  return d.toISOString().slice(0, 10);
}

function buildInitial(user) {
  return {
    gender: user?.gender || GENDERS.MALE,
    username: user?.username || "",
    first_name: user?.first_name || "",
    last_name: user?.last_name || "",
    birthdate: toInputDate(user?.birthdate),
    height: user?.height ?? "",
    target_weight: user?.target_weight ?? "",
    email: user?.email || "",
  };
}

function Profile() {
  const { user, updateUser } = useAuth();
  const [form, setForm] = useState(() => buildInitial(user));
  const [initial, setInitial] = useState(() => buildInitial(user));
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  useEffect(() => {
    const next = buildInitial(user);
    setForm(next);
    setInitial(next);
  }, [user]);

  const handleChange = (field) => (event) => {
    const value = event.target.value;
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError(null);
    setSuccess(null);

    const payload = {};
    for (const key of Object.keys(form)) {
      const current = form[key];
      const initialValue = initial[key];
      if (current !== "" && current !== initialValue) {
        payload[key] = current;
      }
    }

    if (Object.keys(payload).length === 0) {
      setError("Aucune modification détectée.");
      return;
    }

    setSaving(true);
    try {
      const response = await updateUserRequest(user.id, payload);
      const updatedUser = response?.data;
      if (updatedUser) {
        updateUser(updatedUser);
        setSuccess("Profil mis à jour avec succès.");
      } else {
        setSuccess("Profil mis à jour.");
      }
    } catch (err) {
      setError(
        getErrorMessage(err, "Impossible de mettre à jour votre profil.")
      );
    } finally {
      setSaving(false);
    }
  };

  return (
    <main>
      <section className="card">
        <div className="card-header">
          <div>
            <h2 className="card-title">Profil</h2>
            <p className="card-caption">
              Modifiez vos informations personnelles en toute simplicité.
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="profile-form">
          <div className="profile-grid">
            <div className="profile-field">
              <label className="profile-label" htmlFor="gender">
                Genre
              </label>
              <select
                id="gender"
                value={form.gender}
                onChange={handleChange("gender")}
                className="profile-input"
              >
                <option value={GENDERS.MALE}>Homme</option>
                <option value={GENDERS.FEMALE}>Femme</option>
              </select>
            </div>

            <div className="profile-field">
              <label className="profile-label" htmlFor="username">
                Nom d’utilisateur
              </label>
              <input
                id="username"
                type="text"
                value={form.username}
                onChange={handleChange("username")}
                className="profile-input"
              />
            </div>

            <div className="profile-field">
              <label className="profile-label" htmlFor="first_name">
                Prénom
              </label>
              <input
                id="first_name"
                type="text"
                value={form.first_name}
                onChange={handleChange("first_name")}
                className="profile-input"
              />
            </div>

            <div className="profile-field">
              <label className="profile-label" htmlFor="last_name">
                Nom
              </label>
              <input
                id="last_name"
                type="text"
                value={form.last_name}
                onChange={handleChange("last_name")}
                className="profile-input"
              />
            </div>

            <div className="profile-field">
              <label className="profile-label" htmlFor="birthdate">
                Date de naissance
              </label>
              <input
                id="birthdate"
                type="date"
                value={form.birthdate}
                onChange={handleChange("birthdate")}
                className="profile-input"
              />
            </div>

            <div className="profile-field">
              <label className="profile-label" htmlFor="height">
                Taille (cm)
              </label>
              <input
                id="height"
                type="number"
                min="100"
                max="300"
                value={form.height}
                onChange={handleChange("height")}
                className="profile-input"
              />
            </div>

            <div className="profile-field">
              <label className="profile-label" htmlFor="target_weight">
                Objectif de poids (kg)
              </label>
              <input
                id="target_weight"
                type="number"
                step="0.1"
                min="1"
                max="500"
                value={form.target_weight}
                onChange={handleChange("target_weight")}
                className="profile-input"
                placeholder="Ex : 70"
              />
            </div>

            <div className="profile-field">
              <label className="profile-label" htmlFor="email">
                Email
              </label>
              <input
                id="email"
                type="email"
                value={form.email}
                onChange={handleChange("email")}
                className="profile-input"
              />
            </div>
          </div>

          {error && <p className="form-error">{error}</p>}
          {success && <p className="form-success">{success}</p>}

          <button type="submit" className="profile-submit" disabled={saving}>
            {saving ? "Enregistrement..." : "Enregistrer les modifications"}
          </button>
        </form>
      </section>
    </main>
  );
}

export default Profile;
