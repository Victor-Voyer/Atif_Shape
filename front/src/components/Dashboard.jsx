import { useEffect, useMemo, useState } from "react";
import api from "../services/api.js";
import WeightChart from "./WeightChart.jsx";
import "./Dashboard.css";

function formatDateLabel(isoDate) {
  if (!isoDate) return "";
  const d = new Date(isoDate);
  return d.toLocaleDateString("fr-FR", {
    day: "2-digit",
    month: "short",
  });
}

function Dashboard({ user }) {
  const [weights, setWeights] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [newWeight, setNewWeight] = useState("");
  const [addLoading, setAddLoading] = useState(false);
  const [addError, setAddError] = useState(null);
  const [reloadKey, setReloadKey] = useState(0);

  useEffect(() => {
    if (!user?.id) return;

    let cancelled = false;

    const load = async () => {
      setLoading(true);
      setError(null);
      try {
        const [userRes, statsRes] = await Promise.all([
          api.get(`/users/${user.id}`),
          api.get(`/users/${user.id}/stats`),
        ]);

        if (cancelled) return;

        const rawUser = userRes.data?.data;
        const rawStats = statsRes.data?.data;

        setWeights(rawUser?.user_weights ?? []);
        setStats(rawStats ?? null);
      } catch (err) {
        if (cancelled) return;
        const message =
          err.response?.data?.message ||
          "Impossible de récupérer vos données de poids.";
        setError(message);
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    load();

    return () => {
      cancelled = true;
    };
  }, [user?.id, reloadKey]);

  const handleAddWeight = async (event) => {
    event.preventDefault();
    setAddError(null);

    const parsed = parseFloat(newWeight.replace(",", "."));
    if (Number.isNaN(parsed) || parsed <= 0) {
      setAddError("Merci d’entrer un poids valide (nombre positif).");
      return;
    }

    setAddLoading(true);
    try {
      await api.post("/users", { weight: parsed });
      setNewWeight("");
      setReloadKey((key) => key + 1);
    } catch (err) {
      const message =
        err.response?.data?.message ||
        "Impossible d’enregistrer ce nouveau poids.";
      setAddError(message);
    } finally {
      setAddLoading(false);
    }
  };

  const chartData = useMemo(() => {
    if (!weights || weights.length === 0) return [];
    const sorted = [...weights].sort(
      (a, b) => new Date(a.measured_at) - new Date(b.measured_at),
    );
    return sorted.map((item) => ({
      date: formatDateLabel(item.measured_at),
      weight: Number(item.weight),
    }));
  }, [weights]);

  const latestWeight =
    weights && weights.length
      ? Number(
          [...weights].sort(
            (a, b) => new Date(b.measured_at) - new Date(a.measured_at),
          )[0].weight,
        )
      : null;

  return (
    <main className="layout-split">
      <section className="card">
        <div className="card-header">
          <div>
            <h2 className="card-title">Évolution du poids</h2>
            <p className="card-caption">
              Visualisez la tendance de votre poids sur la durée.
            </p>
          </div>
        </div>

        <form
          onSubmit={handleAddWeight}
          className="weight-form"
        >
          <div className="weight-form-group">
            <label
              htmlFor="new-weight"
              className="weight-form-label"
            >
              Nouveau poids (kg)
            </label>
            <input
              id="new-weight"
              type="number"
              step="0.1"
              min="0"
              value={newWeight}
              onChange={(e) => setNewWeight(e.target.value)}
              className="weight-form-input"
              placeholder="Ex : 72.4"
            />
          </div>
          <button
            type="submit"
            className="weight-form-button"
            disabled={addLoading}
          >
            {addLoading ? "Ajout..." : "Ajouter"}
          </button>
        </form>
        {addError && (
          <p className="form-error">
            {addError}
          </p>
        )}

        {loading ? (
          <div className="empty-state">Chargement des données...</div>
        ) : error ? (
          <div className="empty-state" style={{ color: "#b91c1c" }}>
            {error}
          </div>
        ) : (
          <WeightChart data={chartData} />
        )}
      </section>

      <aside className="card card-summary">
        <div className="card-header">
          <div>
            <h2 className="card-title">Résumé</h2>
          </div>
        </div>

        {/* Ligne 1 : infos générales */}
        <div className="stats-row">
          <div className="stat-card">
            <div className="stat-label">Poids de départ</div>
            <div className="stat-value">
              {stats?.startingWeight != null ? `${stats.startingWeight} kg` : "—"}
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-label">Dernier poids</div>
            <div className="stat-value">
              {latestWeight != null ? `${latestWeight} kg` : "—"}
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-label">Mesures</div>
            <div className="stat-value">
              {stats?.measuresCount != null ? stats.measuresCount : "—"}
            </div>
            {stats?.measuresCount != null &&
              stats.measuresCount > 0 &&
              stats?.daysSinceFirstMeasure != null && (
                <div className="stat-sub">
                  {stats.daysSinceFirstMeasure <= 1
                    ? "Depuis 1 jour"
                    : `Depuis ${stats.daysSinceFirstMeasure} jours`}
                </div>
              )}
          </div>
        </div>

        {/* Ligne IMC */}
        <div className="stats-row">
          <div className="stat-card">
            <div className="stat-label">IMC (Indice de masse corporelle)</div>
            <div className="stat-value">
              {stats?.imc?.bmi != null ? `${stats.imc.bmi}` : "—"}
            </div>
            <div className="stat-trend">
              {stats?.imc?.category
                ? stats.imc.category
                : "En attente de vos mesures et de votre taille."}
            </div>
          </div>
        </div>

        {/* Ligne 2 : Poids min / max sur la même ligne */}
        <div className="stats-row">
          <div className="stat-card">
            <div className="stat-label">Poids min.</div>
            <div className="stat-value">
              {stats?.minWeight != null ? `${stats.minWeight} kg` : "—"}
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-label">Poids max.</div>
            <div className="stat-value">
              {stats?.maxWeight != null ? `${stats.maxWeight} kg` : "—"}
            </div>
          </div>
        </div>

        {/* Ligne 3 : Évolution sur 7 jours (pleine largeur) */}
        <div className="stats-row">
          <div className="stat-card">
            <div className="stat-label">Évolution sur 7 jours</div>
            <div
              className={`stat-trend ${
                stats?.weightLastWeek && stats.weightLastWeek > 0 ? "negative" : ""
              }`}
            >
              {stats?.weightLastWeek == null
                ? "—"
                : `${stats.weightLastWeek > 0 ? "+" : ""}${stats.weightLastWeek} kg`}
            </div>
          </div>
        </div>

        {/* Ligne 4 : Évolution sur 30 jours (pleine largeur) */}
        <div className="stats-row">
          <div className="stat-card">
            <div className="stat-label">Évolution sur 30 jours</div>
            <div
              className={`stat-trend ${
                stats?.weightLastMonth && stats.weightLastMonth > 0 ? "negative" : ""
              }`}
            >
              {stats?.weightLastMonth == null
                ? "—"
                : `${stats.weightLastMonth > 0 ? "+" : ""}${stats.weightLastMonth} kg`}
            </div>
          </div>
        </div>
      </aside>
    </main>
  );
}

export default Dashboard;


