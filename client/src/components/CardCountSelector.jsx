export default function CardCountSelector({ count, onChange }) {
  const options = [1, 2, 3, 4, 5, 6];

  return (
    <div className="card-count-selector-container">
      <label className="input-label">Number of Flashcards</label>
      <div className="card-count-options">
        {options.map((num) => (
          <button
            key={num}
            type="button"
            className={`count-option-btn ${count === num ? 'selected' : ''}`}
            onClick={() => onChange(num)}
            aria-label={`Generate ${num} flashcards`}
          >
            {num}
          </button>
        ))}
      </div>
    </div>
  );
}
