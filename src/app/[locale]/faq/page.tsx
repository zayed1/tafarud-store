import { createClient } from "@/lib/supabase/server";
import { getLocale, getTranslations } from "next-intl/server";
import { getLocalizedField } from "@/lib/utils";
import AnimatedSection from "@/components/ui/AnimatedSection";
import FAQAccordion from "@/components/store/FAQAccordion";
import type { Metadata } from "next";
import { BASE_URL } from "@/lib/config";

export const revalidate = 60;

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  return {
    title: locale === "ar" ? "الأسئلة الشائعة | متجر التفرّد" : "FAQ | Tafarud Store",
    description: locale === "ar" ? "إجابات على أكثر الأسئلة شيوعاً حول متجر التفرّد" : "Answers to frequently asked questions about Tafarud Store",
    alternates: { canonical: `${BASE_URL}/${locale}/faq` },
  };
}

interface FAQ {
  id: string;
  question_ar: string;
  question_en: string;
  answer_ar: string;
  answer_en: string;
  sort_order: number;
}

async function getFAQs(): Promise<FAQ[]> {
  try {
    const supabase = await createClient();
    const { data } = await supabase.from("faqs").select("*").eq("is_active", true).order("sort_order");
    return data || [];
  } catch {
    return [];
  }
}

export default async function FAQPage() {
  const [faqs, locale, t] = await Promise.all([
    getFAQs(),
    getLocale(),
    getTranslations("common"),
  ]);

  const items = faqs.map((faq) => ({
    id: faq.id,
    question: getLocalizedField(faq, "question", locale),
    answer: getLocalizedField(faq, "answer", locale),
  }));

  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: { "@type": "Answer", text: item.answer },
    })),
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-12 sm:py-16">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
      <AnimatedSection>
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-primary/5 rounded-full border border-primary/10 mb-4">
            <span className="w-1.5 h-1.5 bg-primary rounded-full" />
            <span className="text-primary text-sm font-medium">{t("faq")}</span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold text-dark">{t("faq")}</h1>
          <p className="text-muted mt-3">{t("faqDesc")}</p>
        </div>
      </AnimatedSection>

      {items.length === 0 ? (
        <p className="text-muted text-center py-12">{t("noResults")}</p>
      ) : (
        <FAQAccordion items={items} />
      )}
    </div>
  );
}
