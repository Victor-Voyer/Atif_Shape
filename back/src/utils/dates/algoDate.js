function normalizeDate(date) {
  return new Date(date);
}

export function getWeekStart(date = new Date()) {
  const d = normalizeDate(date);
  const day = d.getDay();
  const diff = (day === 0 ? -6 : 1) - day;
  d.setDate(d.getDate() + diff);
  d.setHours(0, 0, 0, 0);
  return d.toISOString().slice(0, 10);
}

export function getAge(birthdate) {
  if (!birthdate) return null;

  const birth = normalizeDate(birthdate);
  const today = new Date();

  let age = today.getFullYear() - birth.getFullYear();
  const monthDiff = today.getMonth() - birth.getMonth();
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
    age -= 1;
  }

  return age;
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
