type KeypadProps = {
  onDigit: (digit: string) => void;
  onClear: () => void;
  onGo: () => void;
  canGo: boolean;
};

const digits = ["1", "2", "3", "4", "5", "6", "7", "8", "9"];

export function Keypad({ onDigit, onClear, onGo, canGo }: KeypadProps) {
  return (
    <div className="grid grid-cols-3 gap-2" role="group" aria-label="Answer keypad">
      {digits.map((digit) => (
        <Key key={digit} label={digit} onPress={() => onDigit(digit)} />
      ))}
      <Key label="Clear" onPress={onClear} tone="quiet" ariaLabel="Clear" />
      <Key label="0" onPress={() => onDigit("0")} />
      <Key label="Go" onPress={onGo} tone="go" disabled={!canGo} ariaLabel="Check answer" />
    </div>
  );
}

function Key({
  label,
  onPress,
  tone = "digit",
  disabled = false,
  ariaLabel,
}: {
  label: string;
  onPress: () => void;
  tone?: "digit" | "quiet" | "go";
  disabled?: boolean;
  ariaLabel?: string;
}) {
  const toneClass =
    tone === "go"
      ? "bg-primary text-primary-foreground disabled:opacity-40"
      : tone === "quiet"
        ? "bg-[color-mix(in_srgb,var(--card-fill)_70%,var(--muted))] text-lg text-[var(--ink-soft)]"
        : "bg-[var(--card-fill)] text-[var(--ink)]";

  return (
    <button
      type="button"
      aria-label={ariaLabel ?? label}
      disabled={disabled}
      onClick={onPress}
      className={`min-h-16 rounded-2xl text-3xl font-bold shadow-[0_4px_0_color-mix(in_srgb,var(--ink)_18%,transparent)] select-none active:translate-y-0.5 active:shadow-none disabled:active:translate-y-0 ${toneClass}`}
    >
      {label}
    </button>
  );
}
