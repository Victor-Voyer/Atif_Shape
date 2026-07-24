import { useCallback, useState } from "react";
import { generateProgram } from "../services/programApi.js";
import { getErrorMessage } from "../services/api.js";

export function useGenerateProgram(userId) {
  const [program, setProgram] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const generate = useCallback(
    async (preferences) => {
      if (!userId) return;
      setLoading(true);
      setError(null);
      try {
        const response = await generateProgram(userId, preferences);
        setProgram(response?.data ?? null);
      } catch (err) {
        setError(getErrorMessage(err, "Impossible de générer votre programme sportif."));
      } finally {
        setLoading(false);
      }
    },
    [userId]
  );

  return { program, loading, error, generate };
}
