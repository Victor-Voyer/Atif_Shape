import api from "./api.js";

export async function getUserProgram(id) {
  const response = await api.get(`/users/${id}/program`);
  return response.data;
}
