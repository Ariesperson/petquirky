type TrustItem = {
  icon: string;
  title: string;
  description: string;
};

type TrustBadgesProps = {
  items: TrustItem[];
};

export function TrustBadges({ items }: TrustBadgesProps) {
  return (
    <section className="bg-primary-tint py-10">
      <div className="mx-auto grid w-full max-w-7xl gap-5 px-4 sm:grid-cols-2 sm:px-6 lg:grid-cols-4 lg:px-8">
        {items.map((item) => (
          <div key={item.title} className="flex items-center gap-4 rounded-[28px] bg-white/55 px-5 py-4">
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-primary/10 text-3xl text-primary">
              {item.icon}
            </div>
            <div>
              <p className="text-sm font-semibold text-dark">{item.title}</p>
              <p className="mt-1 text-xs text-muted">{item.description}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
