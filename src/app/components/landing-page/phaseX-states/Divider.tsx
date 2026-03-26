export const Divider = ({ color }: { color: string }) => (
  <div
    className="h-[1px] w-full"
    style={{
      background: `linear-gradient(90deg, transparent, ${color}40, transparent)`,
    }}
  />
);
