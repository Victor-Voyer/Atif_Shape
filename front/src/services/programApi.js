import api from "./api.js";

export async function getProgram(id) {
  const response = await api.get(`/users/${id}/program`);
  return response.data;
}

export async function generateProgram(id, preferences) {
  const response = await api.post(`/users/${id}/program`, preferences);
  return response.data;
}

export async function toggleSessionComplete(id, sessionId) {
  const response = await api.post(`/users/${id}/program/sessions/${sessionId}/complete`);
  return response.data;
}

export async function swapExercise(id, sessionId, sessionExerciseId) {
  const response = await api.post(
    `/users/${id}/program/sessions/${sessionId}/exercises/${sessionExerciseId}/swap`
  );
  return response.data;
}

export async function excludeExercise(id, sessionId, sessionExerciseId) {
  const response = await api.delete(
    `/users/${id}/program/sessions/${sessionId}/exercises/${sessionExerciseId}`
  );
  return response.data;
}
