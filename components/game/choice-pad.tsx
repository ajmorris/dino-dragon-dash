type ChoicePadProps = {
  options: number[];
  wrong: number[];
  onChoose: (value: number) => void;
};

export function ChoicePad({ options, wrong, onChoose }: ChoicePadProps) {
  return (
    <div className="grid grid-cols-1 gap-2" role="group" aria-label="Five answers">
      {options.map((value, index) => {
        const missed = wrong.includes(value);
        return (
          <button
            key={`${index}-${value}`}
            type="button"
            disabled={missed}
            aria-label={missed ? `${value}, not this one` : String(value)}
            onClick={() => onChoose(value)}
            className={`min-h-16 rounded-2xl text-3xl font-bold shadow-[0_4px_0_color-mix(in_srgb,var(--ink)_18%,transparent)] select-none active:translate-y-0.5 active:shadow-none disabled:translate-y-0 disabled:opacity-45 disabled:shadow-none disabled:line-through ${
              missed
                ? "bg-[color-mix(in_srgb,var(--card-fill)_70%,var(--muted))] text-[var(--ink-soft)]"
                : "bg-[var(--card-fill)] text-[var(--ink)]"
            }`}
          >
            {value}
          </button>
        );
      })}
    </div>
  );
}
