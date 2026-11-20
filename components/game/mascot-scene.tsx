import { themes, type ThemeId } from "@/lib/theme";

type MascotSceneProps = {
  theme: ThemeId;
  pals?: number;
  celebrate?: boolean;
  className?: string;
};

const palCap = 8;

export function MascotScene({ theme, pals = 0, celebrate = false, className }: MascotSceneProps) {
  const shown = Math.max(0, Math.min(pals, palCap));
  const extra = pals > palCap ? pals - palCap : 0;
  const label = theme === "dinosaur" ? "A friendly dinosaur" : "A friendly dragon";

  return (
    <div className={className}>
      <div className={celebrate ? "dash-float" : undefined} aria-hidden={false} role="img" aria-label={label}>
        <Creature theme={theme} celebrate={celebrate} />
      </div>
      {shown > 0 ? (
        <div className="mt-1 flex items-end justify-center gap-1" aria-hidden="true">
          {Array.from({ length: shown }, (_, index) => (
            <div
              key={index}
              className={index === shown - 1 ? "dash-pop" : undefined}
              style={{ width: 36, height: 36 }}
            >
              <Creature theme={theme} />
            </div>
          ))}
          {extra > 0 ? (
            <span className="dash-title pb-1 text-sm text-[var(--ink-soft)]">+{extra}</span>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}

function Creature({ theme, celebrate = false }: { theme: ThemeId; celebrate?: boolean }) {
  return theme === "dinosaur" ? (
    <Dinosaur celebrate={celebrate} />
  ) : (
    <Dragon celebrate={celebrate} />
  );
}

function Dinosaur({ celebrate }: { celebrate: boolean }) {
  const palette = themes.dinosaur;
  return (
    <svg viewBox="0 0 240 180" className="block h-auto w-full">
      <ellipse cx="120" cy="164" rx="70" ry="10" fill="#5d8a32" opacity="0.35" />
      <path d="M58 118c-28-6-40-28-24-40 10 16 22 24 40 28" fill={palette.body} />
      <ellipse cx="112" cy="112" rx="62" ry="42" fill={palette.body} />
      <ellipse cx="122" cy="124" rx="38" ry="24" fill={palette.belly} />
      <path d="M78 78c8-16 18-22 28-18 2 10-6 20-16 26" fill={palette.spot} />
      <path d="M108 74c8-14 20-16 26-8 0 10-8 16-18 18" fill={palette.accent} />
      <path d="M136 78c6-12 16-12 20-4-2 8-10 12-18 12" fill={palette.spot} />
      <ellipse cx="164" cy="78" rx="40" ry="32" fill={palette.body} />
      <ellipse cx="196" cy="88" rx="22" ry="14" fill={palette.body} />
      <circle cx="168" cy="70" r="9" fill="#fffaf0" />
      <circle cx="171" cy="71" r="4.5" fill="#24301c" />
      <circle cx="172.5" cy="69.5" r="1.5" fill="#fffaf0" />
      <ellipse cx="150" cy="84" rx="6" ry="4" fill={palette.cheek} opacity="0.9" />
      <path d="M172 90c8 8 20 8 28-2" fill="none" stroke="#24301c" strokeWidth="3" strokeLinecap="round" />
      <circle cx="206" cy="84" r="2" fill="#24301c" />
      <path d="M132 112c10 16 8 22-2 24" fill="none" stroke={palette.spot} strokeWidth="8" strokeLinecap="round" />
      <path d="M96 146c-4 16-2 20 8 20" fill="none" stroke={palette.body} strokeWidth="14" strokeLinecap="round" />
      <path d="M128 148c4 16 8 18 16 14" fill="none" stroke={palette.body} strokeWidth="14" strokeLinecap="round" />
      <path d="M84 162h28" stroke="#3e6b28" strokeWidth="4" strokeLinecap="round" />
      <path d="M124 164h30" stroke="#3e6b28" strokeWidth="4" strokeLinecap="round" />
      {celebrate ? <Sparkle cx={40} cy={48} color={palette.accent} /> : null}
    </svg>
  );
}

function Dragon({ celebrate }: { celebrate: boolean }) {
  const palette = themes.dragon;
  return (
    <svg viewBox="0 0 240 180" className="block h-auto w-full">
      <ellipse cx="120" cy="164" rx="70" ry="10" fill="#6a3d86" opacity="0.28" />
      <path d="M64 70c-28 10-36 46-6 52 8-18 16-28 34-34" fill={palette.spot} />
      <path d="M168 64c30 6 42 36 16 54-10-16-18-26-40-32" fill={palette.spot} />
      <path d="M46 124c-26 4-34-16-16-26 8 10 16 14 28 14" fill={palette.body} />
      <path d="M40 112c-6 10 2 14 10 8" fill={palette.accent} />
      <ellipse cx="116" cy="114" rx="60" ry="40" fill={palette.body} />
      <ellipse cx="124" cy="126" rx="36" ry="22" fill={palette.belly} />
      <ellipse cx="168" cy="80" rx="38" ry="30" fill={palette.body} />
      <ellipse cx="198" cy="90" rx="20" ry="13" fill={palette.body} />
      <path d="M156 54l8 16 14-10-6 16 8 4-18 2 2 14-10-12-12 8 4-14-16-2 14-6z" fill={palette.accent} />
      <circle cx="172" cy="72" r="9" fill="#fffaf0" />
      <circle cx="175" cy="73" r="4.5" fill="#3a2348" />
      <circle cx="176.5" cy="71.5" r="1.5" fill="#fffaf0" />
      <ellipse cx="156" cy="86" rx="6" ry="4" fill={palette.cheek} />
      <path d="M176 92c8 7 18 6 26-2" fill="none" stroke="#3a2348" strokeWidth="3" strokeLinecap="round" />
      <circle cx="208" cy="86" r="2" fill="#3a2348" />
      <path d="M100 148c-2 16 2 20 12 18" fill="none" stroke={palette.body} strokeWidth="14" strokeLinecap="round" />
      <path d="M132 150c6 14 12 16 18 12" fill="none" stroke={palette.body} strokeWidth="14" strokeLinecap="round" />
      {celebrate ? (
        <>
          <Sparkle cx={34} cy={46} color={palette.accent} />
          <Sparkle cx={210} cy={40} color="#fff6c9" />
        </>
      ) : null}
    </svg>
  );
}

function Sparkle({ cx, cy, color }: { cx: number; cy: number; color: string }) {
  return (
    <path
      d={`M${cx} ${cy - 10}l2.2 6.2 6.6 1.4-6.6 1.4-2.2 6.2-2.2-6.2-6.6-1.4 6.6-1.4z`}
      fill={color}
    />
  );
}
