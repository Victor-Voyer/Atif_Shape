import db from "../models/index.js";

const { UserWeight } = db;

export async function createWeight(userId, weight) {
  return UserWeight.create({
    weight,
    user_id: userId,
  });
}

export async function getWeightsByUserId(userId) {
  return UserWeight.findAll({
    where: { user_id: userId },
    order: [["measured_at", "ASC"]],
  });
}
