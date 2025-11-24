import db from "../../models/index.js";

const { UserWeight } = db;

function normalizeDate(date) {
  return new Date(date);
}
// Nombre de jours passés depuis la première mesure
export async function getDaysSinceFirstMeasure(userId) {
  // On récupère UNIQUEMENT la toute première mesure de l'utilisateur
  const firstMeasure = await UserWeight.findOne({
    where: {
      user_id: userId,
    },
    order: [["measured_at", "ASC"]],
  });

  if (!firstMeasure) return 0;

  const firstDate = normalizeDate(firstMeasure.measured_at);
  const now = new Date();

  const diffMs = now.getTime() - firstDate.getTime();
  let diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  // Version inclusive : si la première mesure est aujourd’hui,
  // on considère qu’il suit son poids depuis 1 jour.
  diffDays += 1;

  // On évite de renvoyer des valeurs négatives en cas de problème de date
  return diffDays < 0 ? 0 : diffDays;
}

// Nombre de mesures faites
export async function getMeasuresCount(userId) {
  const measures = await UserWeight.findAll({
    where: {
      user_id: userId,
    },
  });
  return measures.length;
}

// Poids perdu/pris les 7 derniers jours
export async function getWeightLastWeek(userId) {
  const oneWeekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);

  const measures = await UserWeight.findAll({
    where: {
      user_id: userId,
    },
    order: [["measured_at", "ASC"]],
  });

  const lastWeekMeasures = measures.filter(
    (m) => normalizeDate(m.measured_at) >= oneWeekAgo
  );

  if (lastWeekMeasures.length < 2) {
    return 0;
  }

  const firstWeight = lastWeekMeasures[0].weight;
  const lastWeight = lastWeekMeasures[lastWeekMeasures.length - 1].weight;

  return Number((lastWeight - firstWeight).toFixed(1));
}

// Poids perdu/pris le dernier mois (4 semaines = 28 jours)
export async function getWeightLastMonth(userId) {
  const fourWeeksAgo = new Date(Date.now() - 28 * 24 * 60 * 60 * 1000);

  const measures = await UserWeight.findAll({
    where: {
      user_id: userId,
    },
    order: [["measured_at", "ASC"]],
  });

  const lastMonthMeasures = measures.filter(
    (m) => normalizeDate(m.measured_at) >= fourWeeksAgo
  );

  if (lastMonthMeasures.length < 2) {
    return 0;
  }

  const firstWeight = lastMonthMeasures[0].weight;
  const lastWeight = lastMonthMeasures[lastMonthMeasures.length - 1].weight;

  return Number((lastWeight - firstWeight).toFixed(1));
}