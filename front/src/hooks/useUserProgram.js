import { useCallback, useEffect, useState } from "react";
import { getUserProgram } from "../services/programApi.js";
import { getErrorMessage } from "../services/api.js";

export function useUserProgram(userId) {
  const [program, setProgram] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [reloadKey, setReloadKey] = useState(0);

  const refetch = useCallback(() => {
    setReloadKey((key) => key + 1);
  }, []);

  useEffect(() => {
    if (!userId) return;

    let cancelled = false;

    const load = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await getUserProgram(userId);
        if (cancelled) return;
        setProgram(response?.data ?? null);
      } catch (err) {
        if (cancelled) return;
        setError(
          getErrorMessage(err, "Impossible de récupérer votre programme sportif.")
        );
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    load();

    return () => {
      cancelled = true;
    };
  }, [userId, reloadKey]);

  return { program, loading, error, refetch };
}
