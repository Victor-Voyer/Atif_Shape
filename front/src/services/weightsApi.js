import api from "./api.js";

export async function createWeight(userId, weight) {
  const response = await api.post(`/users/${userId}/weights`, { weight });
  return response.data;
}
