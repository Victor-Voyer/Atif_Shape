import { useCallback, useEffect, useState } from "react";
import { getUserById, getUserStats } from "../services/usersApi.js";
import { getErrorMessage } from "../services/api.js";

export function useUserStats(userId) {
  const [weights, setWeights] = useState([]);
  const [stats, setStats] = useState(null);
  const [targetWeight, setTargetWeight] = useState(null);
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
        const [userRes, statsRes] = await Promise.all([
          getUserById(userId),
          getUserStats(userId),
        ]);

        if (cancelled) return;

        setWeights(userRes?.data?.user_weights ?? []);
        setStats(statsRes?.data ?? null);
        setTargetWeight(userRes?.data?.target_weight ?? null);
      } catch (err) {
        if (cancelled) return;
        setError(
          getErrorMessage(err, "Impossible de récupérer vos données de poids.")
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

  return {
    weights,
    stats,
    targetWeight,
    loading,
    error,
    refetch,
  };
}
