type ProductSpecsProps = {
  title: string;
  specifications: Record<string, string>;
  weight: number;
};

function formatLabel(key: string) {
  return key
    .replace(/([A-Z])/g, " $1")
    .replace(/^./, (character) => character.toUpperCase());
}

export function ProductSpecs({ title, specifications, weight }: ProductSpecsProps) {
  const entries = [...Object.entries(specifications), ["weight", `${weight} kg`]];

  return (
    <section className="mt-20 border-t border-[#e4d2cb]/60 pt-20">
      <h2 className="font-heading text-3xl font-extrabold text-dark">{title}</h2>
      <div className="mt-10 grid grid-cols-1 gap-x-20 gap-y-4 md:grid-cols-2">
        {entries.map(([key, value]) => (
          <div key={key} className="flex items-center justify-between border-b border-[#e4d2cb]/60 py-4">
            <span className="font-semibold text-muted">{formatLabel(key)}</span>
            <span className="font-semibold text-dark">{value}</span>
          </div>
        ))}
      </div>
    </section>
  );
}
