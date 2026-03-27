type NewsletterProps = {
  title: string;
  description: string;
  placeholder: string;
  ctaLabel: string;
};

export function Newsletter({
  title,
  description,
  placeholder,
  ctaLabel,
}: NewsletterProps) {
  return (
    <section className="bg-[#fcf9f8] py-20">
      <div className="mx-auto w-full max-w-5xl px-4 sm:px-6 lg:px-8">
        <div className="relative overflow-hidden rounded-[36px] bg-[#211917] px-6 py-14 text-center shadow-[0_26px_70px_rgba(33,25,23,0.24)] sm:px-10">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(216,90,48,0.32),transparent_36%),radial-gradient(circle_at_bottom_right,rgba(255,138,101,0.18),transparent_30%)]" />
          <div className="relative mx-auto max-w-2xl">
            <h2 className="font-heading text-4xl font-extrabold tracking-[-0.03em] text-white">
              {title}
            </h2>
            <p className="mt-4 text-base leading-7 text-white/72">{description}</p>
            <form className="mt-8 flex flex-col gap-3 sm:flex-row">
              <input
                type="email"
                placeholder={placeholder}
                className="min-w-0 flex-1 rounded-full border border-white/10 bg-white/10 px-6 py-4 text-white outline-none placeholder:text-white/45 focus:border-primary focus:bg-white/14"
              />
              <button
                type="submit"
                className="rounded-full bg-[linear-gradient(135deg,#d85a30,#ff8a65)] px-7 py-4 text-sm font-semibold text-white transition hover:scale-[1.02]"
              >
                {ctaLabel}
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
