const accent = "#00e5a0";
const accentG = "rgba(0,229,160,";

type NavLinkItem = {
  label: string;
  href: string;
  action?: () => void;
};

export default function MobileNavLink({
  link,
  onNavigate,
}: {
  link: NavLinkItem;
  onNavigate: () => void;
}) {
  const isSpecial = !!link.action;

  return (
    <a
      href={link.href}
      onClick={(e) => {
        e.preventDefault();
        onNavigate();
      }}
      className={`block py-2 px-4 rounded-lg transition-colors text-sm cursor-pointer ${
        isSpecial
          ? "font-bold"
          : "text-gray-400 hover:text-white hover:bg-white/5"
      }`}
      style={
        isSpecial
          ? {
              color: accent,
              background: `${accentG}0.06)`,
              border: `1px solid ${accentG}0.15)`,
            }
          : undefined
      }
    >
      {link.label} {isSpecial && <span className="text-[8px] ml-1">✦</span>}
    </a>
  );
}
