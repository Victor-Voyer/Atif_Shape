import db from "../../models/index.js";
const { UserWeight } = db;

export function calculateIMC(weightKg, heightCm) {
  if (!weightKg || !heightCm) {
    throw new Error("Poids et taille sont obligatoires pour calculer l’IMC.");
  }

  const heightM = heightCm / 100;
  const imc = weightKg / (heightM * heightM);

  let category = "";
  if (imc < 18.5) category = "Insuffisance pondérale";
  else if (imc < 25) category = "Corpulence normale";
  else if (imc < 30) category = "Surpoids";
  else category = "Obésité";

  return {
    bmi: Number(imc.toFixed(1)),
    category,
  };
}

export async function calculateMaxWeight( id ) {
    const maxWeight = await UserWeight.max("weight",{
        where: {
            user_id: id,
        },
    });
    return maxWeight;
}

export async function calculateMinWeight( id ) {
    const minWeight = await UserWeight.min("weight",{ 
      where: { 
        user_id: id 
      } 
    });
    return minWeight;
}

// Progression vers le poids objectif fixé par l'utilisateur
export function calculateGoalProgress(startingWeight, currentWeight, targetWeight) {
  if (targetWeight == null || currentWeight == null || startingWeight == null) {
    return null;
  }

  const start = Number(startingWeight);
  const current = Number(currentWeight);
  const target = Number(targetWeight);

  const remaining = Number((current - target).toFixed(1));
  const direction = target < start ? "lose" : target > start ? "gain" : "maintain";
  const reached = Math.abs(remaining) < 0.05;

  const totalDistance = start - target;
  let progressPercent;
  if (reached || totalDistance === 0) {
    progressPercent = 100;
  } else {
    const traveled = start - current;
    progressPercent = Math.round((traveled / totalDistance) * 100);
    progressPercent = Math.max(0, Math.min(100, progressPercent));
  }

  return {
    targetWeight: target,
    remaining: Math.abs(remaining),
    direction,
    reached,
    progressPercent,
  };
}

// Premier poids enregistré pour l'utilisateur (poids de départ, ne change jamais)
export async function getStartingWeight(id) {
  const firstMeasure = await UserWeight.findOne({
    where: {
      user_id: id,
    },
    order: [["measured_at", "ASC"]],
  });

  if (!firstMeasure) {
    return null;
  }

  return firstMeasure.weight;
}

