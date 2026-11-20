import { Button } from "@/components/ui/button";

type MuteButtonProps = {
  muted: boolean;
  onToggle: () => void;
  compact?: boolean;
};

export function MuteButton({ muted, onToggle, compact = false }: MuteButtonProps) {
  return (
    <Button
      type="button"
      variant="outline"
      size="touch"
      aria-pressed={muted}
      onClick={onToggle}
      className={compact ? "h-14 min-h-14 px-4 text-base" : undefined}
    >
      {muted ? "Quiet" : "Sound"}
    </Button>
  );
}
