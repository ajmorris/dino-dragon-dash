import { MascotScene } from "@/components/game/mascot-scene";
import { themes, type ThemeId } from "@/lib/theme";

type ThemePickerProps = {
  onChoose: (theme: ThemeId) => void;
};

export function ThemePicker({ onChoose }: ThemePickerProps) {
  return (
    <div className="mx-auto flex w-full max-w-3xl flex-col gap-6 py-6">
      <header className="text-center">
        <p className="text-sm font-bold tracking-wide text-[var(--ink-soft)] uppercase">
          Timed multiplication
        </p>
        <h1 className="dash-title mt-1 text-5xl text-[var(--ink)] sm:text-6xl">Dino Dragon Dash</h1>
        <p className="mt-3 text-xl text-[var(--ink-soft)]">Who are you today?</p>
      </header>
      <div className="grid gap-4 sm:grid-cols-2">
        <ThemeCard theme="dinosaur" onChoose={onChoose} />
        <ThemeCard theme="dragon" onChoose={onChoose} />
      </div>
    </div>
  );
}

function ThemeCard({
  theme,
  onChoose,
}: {
  theme: ThemeId;
  onChoose: (theme: ThemeId) => void;
}) {
  const details = themes[theme];
  const cardStyle =
    theme === "dinosaur"
      ? { background: "#e7f6cf", borderColor: "#3e8f32" }
      : { background: "#f8e6fb", borderColor: "#8d4eb8" };

  return (
    <button
      type="button"
      onClick={() => onChoose(theme)}
      className="dash-card flex min-h-64 flex-col items-center gap-2 px-4 py-5 text-center active:translate-y-1 active:shadow-none"
      style={cardStyle}
    >
      <MascotScene theme={theme} className="mx-auto w-36" />
      <span className="relative">
        <span className="dash-title block text-4xl text-[var(--ink)]">{details.name}</span>
        <span className="mt-1 block text-lg text-[var(--ink-soft)]">Play as {details.player}</span>
        <span className="mt-1 block text-base text-[var(--ink)]">{details.cardLine}</span>
      </span>
    </button>
  );
}
