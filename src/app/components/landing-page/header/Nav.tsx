import NavLink from "./NavLink";

type NavLinkItem = {
  label: string;
  href: string;
  action?: () => void;
};

export default function Nav({
  navLinks,
  scrollToSection,
}: {
  navLinks: NavLinkItem[];
  scrollToSection: (href: string) => void;
}) {
  return (
    <nav className="hidden lg:flex items-center gap-6">
      {navLinks.map((link, i) => (
        <NavLink
          key={`${link.href}-${link.label}`}
          link={link}
          index={i}
          scrollToSection={scrollToSection}
        />
      ))}
    </nav>
  );
}
