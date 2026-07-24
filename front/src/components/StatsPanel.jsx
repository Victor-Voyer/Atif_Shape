function StatsPanel({ stats, targetWeight, latestWeight }) {
  return (
    <aside className="card card-summary">
      <div className="card-header">
        <div>
          <h2 className="card-title">Résumé</h2>
        </div>
      </div>

      <div className="stats-row">
        <div className="stat-card goal-card">
          <div className="stat-label">Objectif de poids</div>
          {targetWeight == null ? (
            <div className="stat-sub">
              Aucun objectif défini. Renseignez-en un dans votre profil.
            </div>
          ) : (
            <>
              <div className="stat-value">{targetWeight} kg</div>
              {stats?.goal ? (
                <>
                  <div className="goal-progress-bar">
                    <div
                      className="goal-progress-fill"
                      style={{ width: `${stats.goal.progressPercent}%` }}
                    />
                  </div>
                  <div className="stat-sub">
                    {stats.goal.reached
                      ? "Objectif atteint 🎉"
                      : `${stats.goal.remaining} kg ${
                          stats.goal.direction === "lose" ? "à perdre" : "à prendre"
                        } · ${stats.goal.progressPercent}% de l'objectif`}
                  </div>
                </>
              ) : (
                <div className="stat-sub">
                  Ajoutez une mesure de poids pour suivre votre progression.
                </div>
              )}
            </>
          )}
        </div>
      </div>

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
  );
}

export default StatsPanel;
