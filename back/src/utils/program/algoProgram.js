const LOW_IMPACT_IMC_CATEGORIES = ["Surpoids", "Obésité"];
const SENIOR_AGE_THRESHOLD = 55;

function buildSession(type, focus, durationMinutes, intensity, description) {
  return { type, focus, durationMinutes, intensity, description };
}

function buildGainSessions(isSenior) {
  const intensity = isSenior ? "Modérée" : "Élevée";
  const sessions = [
    buildSession("Musculation", "Haut du corps", 45, intensity, "Développé, tirage, épaules, bras."),
    buildSession("Musculation", "Bas du corps", 45, intensity, "Squat, fentes, mollets, ischios."),
    buildSession("Cardio léger", "Récupération active", 20, "Faible", "Marche rapide ou vélo à faible intensité."),
  ];
  if (!isSenior) {
    sessions.push(
      buildSession("Musculation", "Full body", 45, intensity, "Mouvements polyarticulaires, tout le corps.")
    );
  }
  return sessions;
}

function buildLoseSessions(isLowImpact, isSenior) {
  if (isLowImpact) {
    return [
      buildSession("Cardio", "Faible impact", 30, "Faible", "Marche rapide, vélo ou natation."),
      buildSession(
        "Renforcement",
        "Full body léger",
        30,
        "Faible",
        "Exercices au poids du corps, sans impact articulaire."
      ),
      buildSession("Cardio", "Faible impact", 30, "Modérée", "Vélo ou elliptique, allure soutenue."),
    ];
  }
  return [
    buildSession(
      "Cardio",
      isSenior ? "Continu" : "HIIT",
      isSenior ? 30 : 25,
      isSenior ? "Modérée" : "Élevée",
      isSenior ? "Course lente, vélo ou natation." : "Alternance efforts courts et récupération."
    ),
    buildSession("Renforcement", "Full body", 40, "Modérée", "Circuit poids du corps ou charges légères."),
    buildSession("Cardio", "Continu", 35, "Modérée", "Course, vélo ou rameur à allure régulière."),
    buildSession("Renforcement", "Full body", 40, "Modérée", "Circuit poids du corps ou charges légères."),
  ];
}

function buildMaintainSessions() {
  return [
    buildSession("Cardio", "Continu", 30, "Modérée", "Course, vélo ou natation à allure régulière."),
    buildSession("Renforcement", "Full body", 40, "Modérée", "Circuit poids du corps ou charges légères."),
    buildSession("Mobilité", "Étirements & souplesse", 25, "Faible", "Stretching, yoga ou mobilité articulaire."),
  ];
}

export function generateProgram({ direction, imcCategory, age }) {
  const isSenior = typeof age === "number" && age >= SENIOR_AGE_THRESHOLD;
  const isLowImpact = LOW_IMPACT_IMC_CATEGORIES.includes(imcCategory);
  const normalizedDirection = direction ?? "maintain";

  let sessions;
  let focusSummary;

  if (normalizedDirection === "gain") {
    sessions = buildGainSessions(isSenior);
    focusSummary = "Prise de muscle : priorité à la musculation, cardio léger en complément.";
  } else if (normalizedDirection === "lose") {
    sessions = buildLoseSessions(isLowImpact, isSenior);
    focusSummary = isLowImpact
      ? "Perte de poids en douceur : cardio à faible impact et renforcement léger pour préserver les articulations."
      : "Perte de poids : cardio intense et renforcement musculaire pour maximiser la dépense calorique.";
  } else {
    sessions = buildMaintainSessions();
    focusSummary = "Maintien du poids : équilibre entre cardio, renforcement et mobilité.";
  }

  if (isSenior && normalizedDirection !== "maintain") {
    sessions.push(
      buildSession("Mobilité", "Récupération", 20, "Faible", "Étirements doux et mobilité articulaire.")
    );
  }

  return {
    direction: normalizedDirection,
    sessionsPerWeek: sessions.length,
    focusSummary,
    sessions,
    disclaimer:
      "Programme indicatif généré automatiquement, à adapter selon votre ressenti. Consultez un professionnel de santé avant de débuter une nouvelle activité physique.",
  };
}
