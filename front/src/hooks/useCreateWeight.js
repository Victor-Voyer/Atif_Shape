import { useState } from "react";
import { createWeight } from "../services/weightsApi.js";
import { getErrorMessage } from "../services/api.js";

export function useCreateWeight(userId, onSuccess) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const submit = async (weightValue) => {
    setError(null);

    const parsed = parseFloat(String(weightValue).replace(",", "."));
    if (Number.isNaN(parsed) || parsed <= 0) {
      setError("Merci d’entrer un poids valide (nombre positif).");
      return false;
    }

    setLoading(true);
    try {
      await createWeight(userId, parsed);
      onSuccess?.();
      return true;
    } catch (err) {
      setError(
        getErrorMessage(err, "Impossible d’enregistrer ce nouveau poids.")
      );
      return false;
    } finally {
      setLoading(false);
    }
  };

  return { submit, loading, error, setError };
}
