function normalizeDate(date) {
  return new Date(date);
}

export function getDaysSinceFirstMeasure(weights) {
  if (!weights || weights.length === 0) return 0;

  const sorted = [...weights].sort(
    (a, b) => new Date(a.measured_at) - new Date(b.measured_at)
  );
  const firstDate = normalizeDate(sorted[0].measured_at);
  const now = new Date();

  const diffMs = now.getTime() - firstDate.getTime();
  let diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  diffDays += 1;

  return diffDays < 0 ? 0 : diffDays;
}

export function getMeasuresCount(weights) {
  return weights?.length ?? 0;
}

export function getWeightDelta(weights, days) {
  if (!weights || weights.length === 0) return 0;

  const since = new Date(Date.now() - days * 24 * 60 * 60 * 1000);
  const periodMeasures = [...weights]
    .filter((m) => normalizeDate(m.measured_at) >= since)
    .sort((a, b) => new Date(a.measured_at) - new Date(b.measured_at));

  if (periodMeasures.length < 2) {
    return 0;
  }

  const firstWeight = periodMeasures[0].weight;
  const lastWeight = periodMeasures[periodMeasures.length - 1].weight;

  return Number((lastWeight - firstWeight).toFixed(1));
}
