import { useTranslations } from "next-intl";
import { MotionProduct } from "../products/MotionProduct";

export default function TopProducts() {
  const t = useTranslations("home.topProducts");

  return (
    <section className="my-12">
      <div className="relative">
        {/* Header */}
        <div className="mb-8 text-center">
          <h2 className="text-3xl font-semibold tracking-tight md:text-4xl">
            {t("title")}
          </h2>
          <div className="mx-auto mt-3 h-px max-w-xs bg-gradient-to-r from-transparent via-border to-transparent" />
        </div>

        {/* Slider */}
        <MotionProduct />

        {/* Bottom divider */}
        <div className="mt-8 h-px bg-gradient-to-r from-transparent via-border to-transparent" />
      </div>
    </section>
  );
}
