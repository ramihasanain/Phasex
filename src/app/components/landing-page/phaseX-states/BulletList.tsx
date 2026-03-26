export const BulletList = ({
  keys,
  variant,
  color,
  t,
}: {
  keys: string[];
  variant?: "normal" | "medium";
  color: string;
  t: (key: string) => string;
}) => (
  <div className="space-y-2">
    {keys.map((key) => (
      <div key={key} className="flex items-center gap-2">
        <div
          className="w-1.5 h-1.5 rounded-full"
          style={{ background: color }}
        />
        <span
          className={
            variant === "medium"
              ? "text-sm text-gray-300 font-medium"
              : "text-sm text-gray-300"
          }
        >
          {t(key)}
        </span>
      </div>
    ))}
  </div>
);
