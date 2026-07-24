import api from "./api.js";

export async function getUserById(id) {
  const response = await api.get(`/users/${id}`);
  return response.data;
}

export async function updateUser(id, payload) {
  const response = await api.put(`/users/${id}`, payload);
  return response.data;
}

export async function deleteUser(id) {
  const response = await api.delete(`/users/${id}`);
  return response.data;
}

export async function getUserStats(id) {
  const response = await api.get(`/users/${id}/stats`);
  return response.data;
}
