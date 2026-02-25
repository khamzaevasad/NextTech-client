import { useTranslations } from "next-intl";
import { LogoCloud } from "../web/LogoCloud";

export default function TopStores() {
  const t = useTranslations("home.topStores");

  return (
    <div className="my-8">
      <section className="relative mx-auto max-w-3xl">
        <h2 className="text-center text-4xl font-semibold mt-6 tracking-tight md:text-3xl">
          {t("title")}
        </h2>
        <div className="mask-[linear-gradient(to_right,transparent,black,transparent)] mx-auto my-5 h-px max-w-sm bg-border" />
        <LogoCloud />
        <div className="mask-[linear-gradient(to_right,transparent,black,transparent)] mt-5 h-px bg-border" />
      </section>
    </div>
  );
}
