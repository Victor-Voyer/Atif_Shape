import {
  EQUIPMENT_VALUES,
  FITNESS_LEVEL_VALUES,
  MIN_SESSIONS_PER_WEEK,
  MAX_SESSIONS_PER_WEEK,
} from "../../../../shared/constants.js";

const LOW_IMPACT_IMC_CATEGORIES = ["Surpoids", "Obésité"];
const SENIOR_AGE_THRESHOLD = 55;
const INTENSITY_SCALE = ["Faible", "Modérée", "Élevée"];
const DEFAULT_SESSIONS_PER_WEEK = 3;

const GAIN_POOL = [
  {
    type: "Musculation",
    focus: "Haut du corps",
    baseDuration: 45,
    baseIntensity: "Élevée",
    descriptions: {
      none: "Pompes, dips sur chaise, tirage élastique, gainage.",
      home: "Haltères : développé, rowing, élévations latérales.",
      gym: "Développé couché, tirage poulie, machines épaules/bras.",
    },
  },
  {
    type: "Musculation",
    focus: "Bas du corps",
    baseDuration: 45,
    baseIntensity: "Élevée",
    descriptions: {
      none: "Squats, fentes, pont fessier au poids du corps.",
      home: "Squats et fentes lestés aux haltères, mollets.",
      gym: "Presse à cuisses, leg curl, squat guidé.",
    },
  },
  {
    type: "Cardio léger",
    focus: "Récupération active",
    baseDuration: 20,
    baseIntensity: "Faible",
    descriptions: {
      none: "Marche rapide en extérieur.",
      home: "Vélo d'appartement à faible intensité.",
      gym: "Vélo ou tapis de course, allure légère.",
    },
  },
  {
    type: "Musculation",
    focus: "Full body",
    baseDuration: 45,
    baseIntensity: "Élevée",
    descriptions: {
      none: "Circuit pompes, squats, gainage, burpees.",
      home: "Circuit haltères, tout le corps.",
      gym: "Superset machines guidées, tout le corps.",
    },
  },
];

const LOSE_LOW_IMPACT_POOL = [
  {
    type: "Cardio",
    focus: "Faible impact",
    baseDuration: 30,
    baseIntensity: "Faible",
    descriptions: {
      none: "Marche rapide en extérieur.",
      home: "Vélo d'appartement ou corde à sauter douce.",
      gym: "Vélo, elliptique ou natation.",
    },
  },
  {
    type: "Renforcement",
    focus: "Full body léger",
    baseDuration: 30,
    baseIntensity: "Faible",
    descriptions: {
      none: "Exercices au poids du corps, sans impact articulaire.",
      home: "Élastiques et poids légers, sans impact.",
      gym: "Machines guidées à charge légère.",
    },
  },
  {
    type: "Cardio",
    focus: "Faible impact",
    baseDuration: 30,
    baseIntensity: "Modérée",
    descriptions: {
      none: "Marche rapide en côte ou escaliers.",
      home: "Vélo d'appartement, allure soutenue.",
      gym: "Vélo ou elliptique, allure soutenue.",
    },
  },
];

const LOSE_STANDARD_POOL = [
  {
    type: "Cardio",
    focus: "HIIT",
    baseDuration: 25,
    baseIntensity: "Élevée",
    descriptions: {
      none: "Alternance sprint/marche, burpees, jumping jacks.",
      home: "Corde à sauter, circuit haltères légers.",
      gym: "Vélo ou rameur en fractionné.",
    },
  },
  {
    type: "Renforcement",
    focus: "Full body",
    baseDuration: 40,
    baseIntensity: "Modérée",
    descriptions: {
      none: "Circuit poids du corps : pompes, squats, gainage.",
      home: "Circuit haltères ou élastiques, tout le corps.",
      gym: "Circuit machines guidées, tout le corps.",
    },
  },
  {
    type: "Cardio",
    focus: "Continu",
    baseDuration: 35,
    baseIntensity: "Modérée",
    descriptions: {
      none: "Course ou marche rapide en extérieur.",
      home: "Vélo d'appartement à allure régulière.",
      gym: "Course, vélo ou rameur à allure régulière.",
    },
  },
  {
    type: "Renforcement",
    focus: "Full body",
    baseDuration: 40,
    baseIntensity: "Modérée",
    descriptions: {
      none: "Circuit poids du corps : pompes, squats, gainage.",
      home: "Circuit haltères ou élastiques, tout le corps.",
      gym: "Circuit machines guidées, tout le corps.",
    },
  },
];

const MAINTAIN_POOL = [
  {
    type: "Cardio",
    focus: "Continu",
    baseDuration: 30,
    baseIntensity: "Modérée",
    descriptions: {
      none: "Course ou marche rapide en extérieur.",
      home: "Vélo d'appartement à allure régulière.",
      gym: "Course, vélo ou natation à allure régulière.",
    },
  },
  {
    type: "Renforcement",
    focus: "Full body",
    baseDuration: 40,
    baseIntensity: "Modérée",
    descriptions: {
      none: "Circuit poids du corps : pompes, squats, gainage.",
      home: "Circuit haltères ou élastiques, tout le corps.",
      gym: "Circuit machines guidées, tout le corps.",
    },
  },
  {
    type: "Mobilité",
    focus: "Étirements & souplesse",
    baseDuration: 25,
    baseIntensity: "Faible",
    descriptions: {
      none: "Stretching ou yoga au sol.",
      home: "Stretching ou yoga avec tapis.",
      gym: "Cours collectif stretching/yoga si disponible.",
    },
  },
];

const RECOVERY_TEMPLATE = {
  type: "Mobilité",
  focus: "Récupération",
  baseDuration: 20,
  baseIntensity: "Faible",
  descriptions: {
    none: "Étirements doux au sol.",
    home: "Étirements doux avec tapis.",
    gym: "Étirements doux, éventuellement sauna ou piscine.",
  },
};

function clampSessionsPerWeek(value) {
  const n = Number(value);
  if (!Number.isFinite(n)) return DEFAULT_SESSIONS_PER_WEEK;
  return Math.min(MAX_SESSIONS_PER_WEEK, Math.max(MIN_SESSIONS_PER_WEEK, Math.round(n)));
}

function adjustIntensity(baseIntensity, level) {
  const idx = INTENSITY_SCALE.indexOf(baseIntensity);
  if (idx === -1) return baseIntensity;
  if (level === "beginner") return INTENSITY_SCALE[Math.max(0, idx - 1)];
  if (level === "advanced") return INTENSITY_SCALE[Math.min(INTENSITY_SCALE.length - 1, idx + 1)];
  return baseIntensity;
}

function adjustDuration(baseDuration, level) {
  if (level === "beginner") return Math.max(15, baseDuration - 10);
  if (level === "advanced") return baseDuration + 10;
  return baseDuration;
}

function buildSession(template, { equipment, level }) {
  return {
    type: template.type,
    focus: template.focus,
    durationMinutes: adjustDuration(template.baseDuration, level),
    intensity: adjustIntensity(template.baseIntensity, level),
    description: template.descriptions[equipment] ?? template.descriptions.none,
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

export function generateProgram({
  direction,
  imcCategory,
  age,
  sessionsPerWeek,
  equipment,
  level,
} = {}) {
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

  const context = { equipment: normalizedEquipment, level: normalizedLevel };
  const sessions = Array.from({ length: targetCount }, (_, index) =>
    buildSession(pool[index % pool.length], context)
  );

  if (isSenior && !sessions.some((session) => session.type === "Mobilité")) {
    sessions[sessions.length - 1] = buildSession(RECOVERY_TEMPLATE, context);
  }

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
