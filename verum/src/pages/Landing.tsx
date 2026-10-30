import { Hero } from "@/components/sections/Hero";
import { UniversalSearch } from "@/components/sections/UniversalSearch";
import { VacancySection } from "@/components/sections/VacancySection";
import { StatsSection } from "@/components/sections/StatsSection";
import { TestimonialsSection } from "@/components/sections/TestimonialsSection";
import { CtaBand } from "@/components/sections/CtaBand";
import { Divider } from "@/components/ui/Divider";

export function Landing() {
  return (
    <>
      <Hero />
      <UniversalSearch />
      <Divider />
      <VacancySection />
      <Divider />
      <StatsSection />
      <Divider />
      <TestimonialsSection />
      <Divider />
      <CtaBand />
    </>
  );
}
