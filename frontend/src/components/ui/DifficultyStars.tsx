export function DifficultyStars({ value }: { value: number }) {
  return (
    <span className="tracking-widest text-sm">
      {Array.from({ length: 5 }).map((_, i) => (
        <span key={i} style={{ color: i < value ? '#c084fc' : '#1e1e2e' }}>★</span>
      ))}
    </span>
  );
}
