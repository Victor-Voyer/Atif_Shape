import api from "./api.js";

export async function generateProgram(id, preferences) {
  const response = await api.post(`/users/${id}/program`, preferences);
  return response.data;
}
