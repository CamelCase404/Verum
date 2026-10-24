import { motion } from "framer-motion";
import type { ReactNode } from "react";

const EASE = [0.16, 0.84, 0.44, 1] as const;

export function PageHero({
  eyebrow,
  title,
  lede,
  centered = false,
  children,
}: {
  eyebrow?: string;
  title: ReactNode;
  lede?: string;
  centered?: boolean;
  children?: ReactNode;
}) {
  return (
    <section className={`pt-20 pb-14 ${centered ? "text-center" : ""}`}>
      <div className="wrap">
        <div className={`max-w-[720px] ${centered ? "mx-auto" : ""}`}>
          {eyebrow && (
            <motion.span
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: EASE }}
              className="block text-[11px] uppercase tracking-[0.14em] font-semibold text-ink-3 mb-4"
            >
              {eyebrow}
            </motion.span>
          )}
          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1, ease: EASE }}
            className="font-semibold tracking-[-0.042em] leading-[1.05] text-[clamp(28px,6vw,54px)] mb-5"
          >
            {title}
          </motion.h1>
          {lede && (
            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.25, ease: EASE }}
              className="text-[18px] leading-relaxed text-ink-2"
            >
              {lede}
            </motion.p>
          )}
          {children}
        </div>
      </div>
    </section>
  );
}

export function SectionHead({
  eyebrow,
  title,
  lede,
  centered = false,
}: {
  eyebrow?: string;
  title: string;
  lede?: string;
  centered?: boolean;
}) {
  return (
    <div className={`mb-12 ${centered ? "text-center mx-auto" : ""} max-w-[660px]`}>
      {eyebrow && (
        <span className="block text-[11px] uppercase tracking-[0.14em] font-semibold text-ink-3 mb-4">
          {eyebrow}
        </span>
      )}
      <h2 className="font-semibold tracking-[-0.038em] leading-[1.1] text-[clamp(24px,4.4vw,40px)] mb-3">
        {title}
      </h2>
      {lede && <p className="text-[16.5px] leading-relaxed text-ink-2">{lede}</p>}
    </div>
  );
}
