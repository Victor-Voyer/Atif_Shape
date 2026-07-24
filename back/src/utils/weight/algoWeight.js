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

export function calculateMaxWeight(weights) {
  if (!weights || weights.length === 0) return null;
  return Math.max(...weights.map((w) => Number(w.weight)));
}

export function calculateMinWeight(weights) {
  if (!weights || weights.length === 0) return null;
  return Math.min(...weights.map((w) => Number(w.weight)));
}

export function getStartingWeight(weights) {
  if (!weights || weights.length === 0) return null;
  const sorted = [...weights].sort(
    (a, b) => new Date(a.measured_at) - new Date(b.measured_at)
  );
  return sorted[0].weight;
}

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
