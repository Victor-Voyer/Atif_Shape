import { useMemo, useState } from "react";
import api from "../services/api.js";
import "./Profile.css";

function toInputDate(value) {
  if (!value) return "";
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return "";
  return d.toISOString().slice(0, 10);
}

function Profile({ user, onUserUpdated }) {
  const initial = useMemo(
    () => ({
      gender: user?.gender || "male",
      username: user?.username || "",
      first_name: user?.first_name || "",
      last_name: user?.last_name || "",
      age: toInputDate(user?.age),
      height: user?.height ?? "",
      email: user?.email || "",
    }),
    [user],
  );

  const [form, setForm] = useState(initial);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

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
      const response = await api.put(`/users/${user.id}`, payload);
      const updatedUser = response.data?.data;
      if (updatedUser) {
        onUserUpdated(updatedUser);
        setSuccess("Profil mis à jour avec succès.");
      } else {
        setSuccess("Profil mis à jour.");
      }
    } catch (err) {
      const message =
        err.response?.data?.message ||
        "Impossible de mettre à jour votre profil.";
      setError(message);
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

        <form
          onSubmit={handleSubmit}
          className="profile-form"
        >
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
                <option value="male">Homme</option>
                <option value="female">Femme</option>
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
              <label className="profile-label" htmlFor="age">
                Date de naissance
              </label>
              <input
                id="age"
                type="date"
                value={form.age}
                onChange={handleChange("age")}
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

          <button
            type="submit"
            className="profile-submit"
            disabled={saving}
          >
            {saving ? "Enregistrement..." : "Enregistrer les modifications"}
          </button>
        </form>
      </section>
    </main>
  );
}

export default Profile;


