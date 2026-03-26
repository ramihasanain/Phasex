import { Logo } from "../../Logo";

const accent = "#00e5a0";

type Broker = {
  name: string;
  discount: string;
  url: string;
  bg: string;
  text: string;
};

export default function BrokerPartnersCard({
  broker,
  index,
  flipped,
  onToggle,
  t,
}: {
  broker: Broker;
  index: number;
  flipped: boolean;
  onToggle: () => void;
  t: (key: string) => string;
}) {
  return (
    <div
      className="relative cursor-pointer"
      style={{ perspective: "800px", height: "140px" }}
      onClick={onToggle}
    >
      <div
        className="w-full h-full relative transition-transform duration-500"
        style={{
          transformStyle: "preserve-3d",
          transform: flipped ? "rotateY(180deg)" : "rotateY(0deg)",
        }}
      >
        {/* FRONT FACE */}
        <div
          className="absolute inset-0 rounded-2xl flex flex-col items-center justify-center gap-2 border border-[#1c2230] hover:border-gray-600 transition-colors"
          style={{
            backfaceVisibility: "hidden",
            background: "#10141d",
          }}
        >
          <Logo size="sm" showText={false} animated={false} />
          <span className="text-[11px] font-black text-white tracking-wide">
            {broker.name}
          </span>
          <div
            className="px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-widest"
            style={{ background: `${accent}15`, color: accent }}
          >
            {broker.discount} {t("brokerDiscount")}
          </div>
          <p className="text-[9px] text-gray-600 font-medium">
            {t("brokerClickToReveal")}
          </p>
        </div>

        {/* BACK FACE */}
        <div
          className="absolute inset-0 rounded-2xl flex flex-col items-center justify-center gap-3 border p-4"
          style={{
            backfaceVisibility: "hidden",
            transform: "rotateY(180deg)",
            background: "linear-gradient(135deg, #10141d, #161c2a)",
            borderColor: `${accent}40`,
          }}
        >
          <div
            className="text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full"
            style={{ background: `${accent}15`, color: accent }}
          >
            {t("brokerReferralOffer")}
          </div>
          <div className="text-2xl font-black" style={{ color: accent }}>
            {broker.discount}
          </div>
          <a
            href={broker.url}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full py-2.5 rounded-xl text-[11px] font-black uppercase tracking-widest text-center text-black transition-transform hover:scale-105 no-underline block"
            style={{ background: accent }}
            onClick={(e) => e.stopPropagation()}
          >
            {t("brokerSignUp")}
          </a>
        </div>
      </div>
    </div>
  );
}

