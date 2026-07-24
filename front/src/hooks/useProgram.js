import { useCallback, useEffect, useState } from "react";
import {
  getProgram,
  generateProgram,
  toggleSessionComplete,
  swapExercise,
  excludeExercise,
} from "../services/programApi.js";
import { getErrorMessage } from "../services/api.js";

export function useProgram(userId) {
  const [program, setProgram] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [actionError, setActionError] = useState(null);
  const [busy, setBusy] = useState(false);
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
        const response = await getProgram(userId);
        if (cancelled) return;
        setProgram(response?.data ?? null);
      } catch (err) {
        if (cancelled) return;
        setError(getErrorMessage(err, "Impossible de récupérer votre programme sportif."));
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

  const generate = useCallback(
    async (preferences) => {
      if (!userId) return;
      setActionError(null);
      setBusy(true);
      try {
        const response = await generateProgram(userId, preferences);
        setProgram(response?.data ?? null);
      } catch (err) {
        setActionError(getErrorMessage(err, "Impossible de générer votre programme sportif."));
      } finally {
        setBusy(false);
      }
    },
    [userId]
  );

  const toggleComplete = useCallback(
    async (sessionId) => {
      if (!userId) return;
      setActionError(null);
      setBusy(true);
      try {
        await toggleSessionComplete(userId, sessionId);
        await getProgram(userId).then((response) => setProgram(response?.data ?? null));
      } catch (err) {
        setActionError(getErrorMessage(err, "Impossible de mettre à jour la séance."));
      } finally {
        setBusy(false);
      }
    },
    [userId]
  );

  const swap = useCallback(
    async (sessionId, sessionExerciseId) => {
      if (!userId) return;
      setActionError(null);
      setBusy(true);
      try {
        await swapExercise(userId, sessionId, sessionExerciseId);
        await getProgram(userId).then((response) => setProgram(response?.data ?? null));
      } catch (err) {
        setActionError(getErrorMessage(err, "Impossible de remplacer cet exercice."));
      } finally {
        setBusy(false);
      }
    },
    [userId]
  );

  const exclude = useCallback(
    async (sessionId, sessionExerciseId) => {
      if (!userId) return;
      setActionError(null);
      setBusy(true);
      try {
        await excludeExercise(userId, sessionId, sessionExerciseId);
        await getProgram(userId).then((response) => setProgram(response?.data ?? null));
      } catch (err) {
        setActionError(getErrorMessage(err, "Impossible de retirer cet exercice."));
      } finally {
        setBusy(false);
      }
    },
    [userId]
  );

  return {
    program,
    loading,
    error,
    actionError,
    busy,
    generate,
    toggleComplete,
    swap,
    exclude,
    refetch,
  };
}
