import "./WeightForm.css";

function WeightForm({ value, onChange, onSubmit, loading, error }) {
  return (
    <>
      <form onSubmit={onSubmit} className="weight-form">
        <div className="weight-form-group">
          <label htmlFor="new-weight" className="weight-form-label">
            Nouveau poids (kg)
          </label>
          <input
            id="new-weight"
            type="number"
            step="0.1"
            min="0"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className="weight-form-input"
            placeholder="Ex : 72.4"
          />
        </div>
        <button type="submit" className="weight-form-button" disabled={loading}>
          {loading ? "Ajout..." : "Ajouter"}
        </button>
      </form>
      {error && <p className="form-error">{error}</p>}
    </>
  );
}

export default WeightForm;
