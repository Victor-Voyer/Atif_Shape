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

