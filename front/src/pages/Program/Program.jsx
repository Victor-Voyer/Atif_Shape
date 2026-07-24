import { useAuth } from "../../hooks/useAuth.js";
import { useUserProgram } from "../../hooks/useUserProgram.js";
import "./Program.css";

const DIRECTION_LABELS = {
  lose: "Perte de poids",
  gain: "Prise de muscle",
  maintain: "Maintien du poids",
};

function Program() {
  const { user } = useAuth();
  const { program, loading, error } = useUserProgram(user?.id);

  return (
    <main>
      <section className="card">
        <div className="card-header">
          <div>
            <h2 className="card-title">Programme sportif</h2>
            <p className="card-caption">
              Un programme généré selon votre objectif, votre IMC et votre âge.
            </p>
          </div>
        </div>

        {loading ? (
          <div className="empty-state">Génération de votre programme...</div>
        ) : error ? (
          <div className="empty-state empty-state--error">{error}</div>
        ) : (
          <>
            <div className="program-summary">
              <span className="program-direction">
                {DIRECTION_LABELS[program?.direction] ?? "Maintien du poids"}
              </span>
              <p className="program-focus">{program?.focusSummary}</p>
              <p className="program-frequency">
                {program?.sessionsPerWeek} séance
                {program?.sessionsPerWeek > 1 ? "s" : ""} par semaine
              </p>
            </div>

            <div className="program-sessions">
              {program?.sessions?.map((session, index) => (
                <div className="program-session" key={index}>
                  <div className="program-session-header">
                    <span className="program-session-type">{session.type}</span>
                    <span className="program-session-intensity">
                      {session.intensity}
                    </span>
                  </div>
                  <div className="program-session-focus">{session.focus}</div>
                  <p className="program-session-description">
                    {session.description}
                  </p>
                  <div className="program-session-duration">
                    {session.durationMinutes} min
                  </div>
                </div>
              ))}
            </div>

            <p className="program-disclaimer">{program?.disclaimer}</p>
          </>
        )}
      </section>
    </main>
  );
}

export default Program;
