import Image from "next/image";
import { useTranslations } from "next-intl";
import { FeatureSection } from "../web/FutureSection";

function About() {
  const t = useTranslations("home.about");

  return (
    <div className="my-8">
      <div className="flex flex-col lg:flex-row items-center gap-8 lg:gap-12">
        <div className="w-full lg:w-1/2 relative aspect-square lg:aspect-auto lg:h-125">
          <Image
            src="/about.webp"
            alt="about-image"
            fill
            className="object-contain"
            sizes="(max-width: 1024px) 100vw, 50vw"
          />
        </div>
        <div className="w-full lg:w-1/2 space-y-4">
          <h3 className="text-2xl font-semibold">{t("subtitle")}</h3>
          <p className="text-muted-foreground leading-relaxed">{t("p1")}</p>
          <p className="text-muted-foreground leading-relaxed">{t("p2")}</p>
          <p className="text-muted-foreground leading-relaxed">{t("p3")}</p>
        </div>
      </div>
      <FeatureSection />
    </div>
  );
}

export default About;
