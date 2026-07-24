import db from "../models/index.js";
import { getWeightsByUserId } from "./weights.service.js";
import {
  calculateIMC,
  calculateMaxWeight,
  calculateMinWeight,
  getStartingWeight,
  calculateGoalProgress,
} from "../utils/weight/algoWeight.js";
import {
  getDaysSinceFirstMeasure,
  getMeasuresCount,
  getWeightDelta,
} from "../utils/dates/algoDate.js";

const { User } = db;

export async function getUserStats(userId) {
  const [weights, user] = await Promise.all([
    getWeightsByUserId(userId),
    User.findByPk(userId),
  ]);

  const startingWeight = getStartingWeight(weights);
  const maxWeight = calculateMaxWeight(weights);
  const minWeight = calculateMinWeight(weights);
  const daysSinceFirst = getDaysSinceFirstMeasure(weights);
  const measuresCount = getMeasuresCount(weights);
  const diffWeek = getWeightDelta(weights, 7);
  const diffMonth = getWeightDelta(weights, 28);

  const latestWeightRow =
    weights.length > 0
      ? [...weights].sort(
          (a, b) => new Date(b.measured_at) - new Date(a.measured_at)
        )[0]
      : null;

  let imc = null;
  if (user && user.height && latestWeightRow?.weight) {
    try {
      imc = calculateIMC(Number(latestWeightRow.weight), Number(user.height));
    } catch {
      imc = null;
    }
  }

  const goal =
    user && user.target_weight != null && latestWeightRow
      ? calculateGoalProgress(
          startingWeight,
          latestWeightRow.weight,
          user.target_weight
        )
      : null;

  return {
    imc,
    startingWeight,
    maxWeight,
    minWeight,
    daysSinceFirstMeasure: daysSinceFirst,
    measuresCount,
    weightLastWeek: diffWeek,
    weightLastMonth: diffMonth,
    goal,
  };
}
