export default function Toggle({
  enabled,
  onChange,
}: {
  enabled: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <button
      type="button"
      onClick={() => onChange(!enabled)}
      className={`relative w-10 h-5 rounded-full transition-colors duration-200 ${
        enabled ? "bg-orange-500" : "bg-accent"
      }`}
    >
      <span
        className={`absolute top-0.5 w-4 h-4 rounded-full bg-white transition-all duration-200 ${
          enabled ? "right-0.5" : "left-0.5"
        }`}
      />
    </button>
  );
}