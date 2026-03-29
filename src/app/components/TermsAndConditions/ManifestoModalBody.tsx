import { motion } from "motion/react";
import { BookOpen } from "lucide-react";
import { manifestoParagraphClass } from "./manifestoParagraphClass";

type ManifestoSection = {
    title: string;
    paragraphs: string[];
    states?: string[];
    highlights?: string[];
    after?: string[];
};

export function ManifestoModalBody({
    sections,
    accent,
    accentG,
    signatureLine,
}: {
    sections: ManifestoSection[];
    accent: string;
    accentG: string;
    signatureLine: string;
}) {
    return (
        <>
            {sections.map((section, i) => (
                <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.05 }}
                    className="rounded-xl p-5"
                    style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.04)" }}
                >
                    <h3 className="text-base font-black mb-4 flex items-center gap-2" style={{ color: accent }}>
                        <BookOpen className="w-4 h-4 flex-shrink-0" />
                        {section.title}
                    </h3>
                    {section.paragraphs.map((p, j) => (
                        <p key={j} className={`text-[13px] leading-relaxed mb-1.5 ${manifestoParagraphClass(p)}`}>
                            {p}
                        </p>
                    ))}
                    {section.states ? (
                        <div className="flex flex-wrap gap-2 my-3">
                            {section.states.map((s, j) => (
                                <span
                                    key={j}
                                    className="px-3 py-1.5 rounded-lg text-[12px] font-bold"
                                    style={{ background: `${accentG}0.1)`, color: accent, border: `1px solid ${accentG}0.2)` }}
                                >
                                    {s}
                                </span>
                            ))}
                        </div>
                    ) : null}
                    {section.highlights ? (
                        <div className="my-3 space-y-1">
                            {section.highlights.map((h, j) => (
                                <p key={j} className="text-[14px] font-black" style={{ color: accent }}>
                                    {h}
                                </p>
                            ))}
                        </div>
                    ) : null}
                    {section.after
                        ? section.after.map((a, j) => (
                              <p key={j} className="text-[13px] text-gray-400 leading-relaxed mt-1.5">
                                  {a}
                              </p>
                          ))
                        : null}
                </motion.div>
            ))}

            <div className="text-center py-6">
                <motion.p
                    className="text-2xl font-black mb-2"
                    style={{ color: accent }}
                    animate={{
                        textShadow: [`0 0 20px ${accentG}0.3)`, `0 0 40px ${accentG}0.5)`, `0 0 20px ${accentG}0.3)`],
                    }}
                    transition={{ duration: 3, repeat: Infinity }}
                >
                    PHASEX
                </motion.p>
                <p className="text-sm text-gray-500 font-medium italic">{signatureLine}</p>
            </div>
        </>
    );
}
