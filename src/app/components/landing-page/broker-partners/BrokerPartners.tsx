import { useLanguage } from "@/app/contexts/LanguageContext";
import { SectionTitle } from "../section-title/SectionTitle";
import { useState } from "react";
import BrokerPartnersCard from "./BrokerPartnersCard";
import { brokers } from "./utils/brokers";

const BrokerPartners = () => {
  const [flippedBroker, setFlippedBroker] = useState<number | null>(null);

  const { t } = useLanguage();

  return (
    <section className="py-20 relative z-10">
      <div className="container mx-auto px-4">
        <SectionTitle sub={t("brokerPartnersSub")}>
          {t("brokerPartnersTitle")}
        </SectionTitle>

        <div className="max-w-6xl mx-auto grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {brokers.map((broker, i) => (
            <BrokerPartnersCard
              key={`${broker.name}-${i}`}
              broker={broker}
              index={i}
              flipped={flippedBroker === i}
              onToggle={() => setFlippedBroker(flippedBroker === i ? null : i)}
              t={t}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default BrokerPartners;
