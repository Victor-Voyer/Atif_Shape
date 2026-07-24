import { useState } from "react";
import { useAuth } from "../../hooks/useAuth.js";
import { useProgram } from "../../hooks/useProgram.js";
import {
  EQUIPMENT_OPTIONS,
  FITNESS_LEVELS,
  MIN_SESSIONS_PER_WEEK,
  MAX_SESSIONS_PER_WEEK,
} from "@shared/constants.js";
import "./Program.css";

const DIRECTION_LABELS = {
  lose: "Perte de poids",
  gain: "Prise de muscle",
  maintain: "Maintien du poids",
};

const EQUIPMENT_LABELS = {
  [EQUIPMENT_OPTIONS.NONE]: "Aucun matériel",
  [EQUIPMENT_OPTIONS.HOME]: "Équipement maison",
  [EQUIPMENT_OPTIONS.GYM]: "Salle de sport",
};

const LEVEL_LABELS = {
  [FITNESS_LEVELS.BEGINNER]: "Débutant",
  [FITNESS_LEVELS.INTERMEDIATE]: "Intermédiaire",
  [FITNESS_LEVELS.ADVANCED]: "Avancé",
};

const DEFAULT_PREFERENCES = {
  sessionsPerWeek: 3,
  equipment: EQUIPMENT_OPTIONS.NONE,
  level: FITNESS_LEVELS.BEGINNER,
};

function Program() {
  const { user } = useAuth();
  const { program, loading, error, actionError, busy, generate, toggleComplete, swap, exclude } =
    useProgram(user?.id);
  const [preferences, setPreferences] = useState(DEFAULT_PREFERENCES);
  const [syncedProgram, setSyncedProgram] = useState(null);

  if (program && program !== syncedProgram) {
    setSyncedProgram(program);
    setPreferences({
      sessionsPerWeek: program.sessionsPerWeek,
      equipment: program.equipment,
      level: program.level,
    });
  }

  const handleChange = (field) => (event) => {
    const value = event.target.value;
    setPreferences((prev) => ({
      ...prev,
      [field]: field === "sessionsPerWeek" ? Number(value) : value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (program) {
      const confirmed = window.confirm(
        "Régénérer ton programme remplace toutes tes séances actuelles et ta progression de la semaine. Continuer ?"
      );
      if (!confirmed) return;
    }
    await generate(preferences);
  };

  return (
    <main>
      <section className="card">
        <div className="card-header">
          <div>
            <h2 className="card-title">Programme sportif</h2>
            <p className="card-caption">
              Dis-nous tes préférences, on te génère un programme selon ton objectif.
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="program-form">
          <div className="program-form-grid">
            <div className="program-form-field">
              <label className="program-form-label" htmlFor="sessionsPerWeek">
                Séances par semaine
              </label>
              <select
                id="sessionsPerWeek"
                value={preferences.sessionsPerWeek}
                onChange={handleChange("sessionsPerWeek")}
                className="program-form-input"
              >
                {Array.from(
                  { length: MAX_SESSIONS_PER_WEEK - MIN_SESSIONS_PER_WEEK + 1 },
                  (_, i) => MIN_SESSIONS_PER_WEEK + i
                ).map((count) => (
                  <option key={count} value={count}>
                    {count}
                  </option>
                ))}
              </select>
            </div>

            <div className="program-form-field">
              <label className="program-form-label" htmlFor="equipment">
                Équipement disponible
              </label>
              <select
                id="equipment"
                value={preferences.equipment}
                onChange={handleChange("equipment")}
                className="program-form-input"
              >
                {Object.values(EQUIPMENT_OPTIONS).map((option) => (
                  <option key={option} value={option}>
                    {EQUIPMENT_LABELS[option]}
                  </option>
                ))}
              </select>
            </div>

            <div className="program-form-field">
              <label className="program-form-label" htmlFor="level">
                Niveau
              </label>
              <select
                id="level"
                value={preferences.level}
                onChange={handleChange("level")}
                className="program-form-input"
              >
                {Object.values(FITNESS_LEVELS).map((option) => (
                  <option key={option} value={option}>
                    {LEVEL_LABELS[option]}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {actionError && <p className="form-error">{actionError}</p>}

          <button type="submit" className="program-form-submit" disabled={busy}>
            {busy ? "Génération..." : program ? "Régénérer mon programme" : "Générer mon programme"}
          </button>
        </form>

        {loading ? (
          <div className="empty-state">Chargement de votre programme...</div>
        ) : error ? (
          <div className="empty-state empty-state--error">{error}</div>
        ) : !program ? (
          <div className="empty-state">
            Renseigne tes préférences puis génère ton programme personnalisé.
          </div>
        ) : (
          <div className="program-result">
            <div className="program-summary">
              <span className="program-direction">
                {DIRECTION_LABELS[program.direction] ?? "Maintien du poids"}
              </span>
              <p className="program-focus">{program.focusSummary}</p>
              <p className="program-frequency">
                {program.sessionsPerWeek} séance
                {program.sessionsPerWeek > 1 ? "s" : ""} par semaine ·{" "}
                {EQUIPMENT_LABELS[program.equipment]} · {LEVEL_LABELS[program.level]}
              </p>
            </div>

            <div className="program-sessions">
              {program.sessions.map((session) => (
                <div className="program-session" key={session.id}>
                  <div className="program-session-header">
                    <span className="program-session-day">{session.day}</span>
                    <span className="program-session-intensity">{session.intensity}</span>
                  </div>
                  <div className="program-session-focus">
                    {session.type} · {session.focus} · {session.durationMinutes} min
                  </div>

                  <ul className="program-session-exercises">
                    {session.exercises.map((exercise) => (
                      <li key={exercise.id} className="program-exercise-row">
                        <span>
                          {exercise.sets} série{exercise.sets > 1 ? "s" : ""} de {exercise.reps}{" "}
                          {exercise.name}
                        </span>
                        <span className="program-exercise-actions">
                          <button
                            type="button"
                            className="program-exercise-action"
                            disabled={busy}
                            onClick={() => swap(session.id, exercise.id)}
                          >
                            Remplacer
                          </button>
                          <button
                            type="button"
                            className="program-exercise-action program-exercise-action--danger"
                            disabled={busy}
                            onClick={() => exclude(session.id, exercise.id)}
                          >
                            Retirer
                          </button>
                        </span>
                      </li>
                    ))}
                  </ul>

                  <label className="program-session-complete">
                    <input
                      type="checkbox"
                      checked={session.completedThisWeek}
                      disabled={busy}
                      onChange={() => toggleComplete(session.id)}
                    />
                    Séance faite cette semaine
                  </label>
                </div>
              ))}
            </div>

            <p className="program-disclaimer">{program.disclaimer}</p>
          </div>
        )}
      </section>
    </main>
  );
}

export default Program;
