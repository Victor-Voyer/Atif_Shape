import { EQUIPMENT_VALUES, FITNESS_LEVEL_VALUES, MIN_SESSIONS_PER_WEEK, MAX_SESSIONS_PER_WEEK } from "../../../../shared/constants.js";

export const LOW_IMPACT_IMC_CATEGORIES = ["Surpoids", "Obésité"];
export const SENIOR_AGE_THRESHOLD = 55;
const INTENSITY_SCALE = ["Faible", "Modérée", "Élevée"];
const DEFAULT_SESSIONS_PER_WEEK = 3;

export const DAY_PATTERNS = {
  2: ["Lundi", "Jeudi"],
  3: ["Lundi", "Mercredi", "Vendredi"],
  4: ["Lundi", "Mardi", "Jeudi", "Vendredi"],
  5: ["Lundi", "Mardi", "Mercredi", "Vendredi", "Samedi"],
  6: ["Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi", "Samedi"],
};

const GAIN_POOL = [
  { type: "Musculation", focus: "Haut du corps", baseDuration: 45, baseIntensity: "Élevée", exerciseSlots: 3 },
  { type: "Musculation", focus: "Bas du corps", baseDuration: 45, baseIntensity: "Élevée", exerciseSlots: 3 },
  { type: "Cardio", focus: "Récupération active", baseDuration: 20, baseIntensity: "Faible", exerciseSlots: 1 },
  { type: "Musculation", focus: "Full body", baseDuration: 45, baseIntensity: "Élevée", exerciseSlots: 3 },
];

const LOSE_LOW_IMPACT_POOL = [
  { type: "Cardio", focus: "Faible impact", baseDuration: 30, baseIntensity: "Faible", exerciseSlots: 1 },
  { type: "Renforcement", focus: "Full body léger", baseDuration: 30, baseIntensity: "Faible", exerciseSlots: 3 },
  { type: "Cardio", focus: "Faible impact", baseDuration: 30, baseIntensity: "Modérée", exerciseSlots: 1 },
];

const LOSE_STANDARD_POOL = [
  { type: "Cardio", focus: "HIIT", baseDuration: 25, baseIntensity: "Élevée", exerciseSlots: 1 },
  { type: "Renforcement", focus: "Full body", baseDuration: 40, baseIntensity: "Modérée", exerciseSlots: 3 },
  { type: "Cardio", focus: "Continu", baseDuration: 35, baseIntensity: "Modérée", exerciseSlots: 1 },
  { type: "Renforcement", focus: "Full body", baseDuration: 40, baseIntensity: "Modérée", exerciseSlots: 3 },
];

const MAINTAIN_POOL = [
  { type: "Cardio", focus: "Continu", baseDuration: 30, baseIntensity: "Modérée", exerciseSlots: 1 },
  { type: "Renforcement", focus: "Full body", baseDuration: 40, baseIntensity: "Modérée", exerciseSlots: 3 },
  { type: "Mobilité", focus: "Étirements & souplesse", baseDuration: 25, baseIntensity: "Faible", exerciseSlots: 2 },
];

export const RECOVERY_TEMPLATE = {
  type: "Mobilité",
  focus: "Récupération",
  baseDuration: 20,
  baseIntensity: "Faible",
  exerciseSlots: 1,
};

export function clampSessionsPerWeek(value) {
  const n = Number(value);
  if (!Number.isFinite(n)) return DEFAULT_SESSIONS_PER_WEEK;
  return Math.min(MAX_SESSIONS_PER_WEEK, Math.max(MIN_SESSIONS_PER_WEEK, Math.round(n)));
}

export function adjustIntensity(baseIntensity, level) {
  const idx = INTENSITY_SCALE.indexOf(baseIntensity);
  if (idx === -1) return baseIntensity;
  if (level === "beginner") return INTENSITY_SCALE[Math.max(0, idx - 1)];
  if (level === "advanced") return INTENSITY_SCALE[Math.min(INTENSITY_SCALE.length - 1, idx + 1)];
  return baseIntensity;
}

export function adjustDuration(baseDuration, level) {
  if (level === "beginner") return Math.max(15, baseDuration - 10);
  if (level === "advanced") return baseDuration + 10;
  return baseDuration;
}

export function adjustSets(baseSets, level) {
  if (baseSets <= 1) return baseSets;
  if (level === "beginner") return Math.max(2, baseSets - 1);
  if (level === "advanced") return baseSets + 1;
  return baseSets;
}

export function adjustExerciseForLevel(rawExercise, { level, durationMinutes }) {
  return {
    exerciseId: rawExercise.id ?? rawExercise.exerciseId ?? null,
    name: rawExercise.name,
    sets: adjustSets(rawExercise.default_sets ?? rawExercise.sets, level),
    reps: rawExercise.default_reps ?? rawExercise.reps ?? `${durationMinutes} min`,
  };
}

function focusSummaryFor(direction, isLowImpact) {
  if (direction === "gain") {
    return "Prise de muscle : priorité à la musculation, cardio léger en complément.";
  }
  if (direction === "lose") {
    return isLowImpact
      ? "Perte de poids en douceur : cardio à faible impact et renforcement léger pour préserver les articulations."
      : "Perte de poids : cardio intense et renforcement musculaire pour maximiser la dépense calorique.";
  }
  return "Maintien du poids : équilibre entre cardio, renforcement et mobilité.";
}

export function generateProgramStructure({ direction, imcCategory, age, sessionsPerWeek, equipment, level } = {}) {
  const normalizedDirection = ["lose", "gain"].includes(direction) ? direction : "maintain";
  const normalizedEquipment = EQUIPMENT_VALUES.includes(equipment) ? equipment : "none";
  const normalizedLevel = FITNESS_LEVEL_VALUES.includes(level) ? level : "beginner";
  const isSenior = typeof age === "number" && age >= SENIOR_AGE_THRESHOLD;
  const isLowImpact = LOW_IMPACT_IMC_CATEGORIES.includes(imcCategory);
  const targetCount = clampSessionsPerWeek(sessionsPerWeek);

  const pool =
    normalizedDirection === "gain"
      ? GAIN_POOL
      : normalizedDirection === "lose"
        ? isLowImpact
          ? LOSE_LOW_IMPACT_POOL
          : LOSE_STANDARD_POOL
        : MAINTAIN_POOL;

  const days = DAY_PATTERNS[targetCount] ?? DAY_PATTERNS[DEFAULT_SESSIONS_PER_WEEK];
  const templates = Array.from({ length: targetCount }, (_, index) => pool[index % pool.length]);

  if (isSenior && !templates.some((template) => template.type === "Mobilité")) {
    templates[templates.length - 1] = RECOVERY_TEMPLATE;
  }

  const sessions = templates.map((template, index) => ({
    day: days[index],
    type: template.type,
    focus: template.focus,
    durationMinutes: adjustDuration(template.baseDuration, normalizedLevel),
    intensity: adjustIntensity(template.baseIntensity, normalizedLevel),
    exerciseSlots: template.exerciseSlots,
  }));

  return {
    direction: normalizedDirection,
    level: normalizedLevel,
    equipment: normalizedEquipment,
    sessionsPerWeek: sessions.length,
    focusSummary: focusSummaryFor(normalizedDirection, isLowImpact),
    sessions,
    disclaimer:
      "Programme indicatif généré automatiquement, à adapter selon votre ressenti. Consultez un professionnel de santé avant de débuter une nouvelle activité physique.",
  };
}
