import { useMemo, useState } from "react";
import WeightChart from "../../components/WeightChart/WeightChart.jsx";
import WeightForm from "../../components/WeightForm/WeightForm.jsx";
import StatsPanel from "../../components/StatsPanel/StatsPanel.jsx";
import { useAuth } from "../../hooks/useAuth.js";
import { useUserStats } from "../../hooks/useUserStats.js";
import { useCreateWeight } from "../../hooks/useCreateWeight.js";
import "./Dashboard.css";

function formatDateLabel(isoDate) {
  if (!isoDate) return "";
  const d = new Date(isoDate);
  return d.toLocaleDateString("fr-FR", {
    day: "2-digit",
    month: "short",
  });
}

function Dashboard() {
  const { user } = useAuth();
  const { weights, stats, targetWeight, loading, error, refetch } =
    useUserStats(user?.id);
  const [newWeight, setNewWeight] = useState("");
  const {
    submit,
    loading: addLoading,
    error: addError,
  } = useCreateWeight(user?.id, () => {
    setNewWeight("");
    refetch();
  });

  const handleAddWeight = async (event) => {
    event.preventDefault();
    await submit(newWeight);
  };

  const chartData = useMemo(() => {
    if (!weights || weights.length === 0) return [];
    const sorted = [...weights].sort(
      (a, b) => new Date(a.measured_at) - new Date(b.measured_at)
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
            (a, b) => new Date(b.measured_at) - new Date(a.measured_at)
          )[0].weight
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

        <WeightForm
          value={newWeight}
          onChange={setNewWeight}
          onSubmit={handleAddWeight}
          loading={addLoading}
          error={addError}
        />

        {loading ? (
          <div className="empty-state">Chargement des données...</div>
        ) : error ? (
          <div className="empty-state empty-state--error">{error}</div>
        ) : (
          <WeightChart data={chartData} targetWeight={targetWeight} />
        )}
      </section>

      <StatsPanel
        stats={stats}
        targetWeight={targetWeight}
        latestWeight={latestWeight}
      />
    </main>
  );
}

export default Dashboard;
