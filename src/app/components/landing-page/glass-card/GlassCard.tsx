const accent = "#00e5a0";

export const GlassCard = ({
  children,
  className = "",
  glow,
}: {
  children: React.ReactNode;
  className?: string;
  glow?: string;
}) => (
  <div
    className={`rounded-2xl relative overflow-hidden ${className}`}
    style={{
      background:
        "linear-gradient(160deg, rgba(14,20,33,0.9) 0%, rgba(8,12,22,0.95) 100%)",
      border: `1px solid ${glow || accent}18`,
      boxShadow: `0 15px 50px rgba(0,0,0,0.3), 0 0 30px ${glow || accent}06`,
    }}
  >
    {children}
  </div>
);
