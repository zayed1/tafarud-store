import { createClient } from "@/lib/supabase/server";
import { getLocale, getTranslations } from "next-intl/server";
import Breadcrumb from "@/components/ui/Breadcrumb";
import AnimatedSection from "@/components/ui/AnimatedSection";
import type { Metadata } from "next";
import { BASE_URL } from "@/lib/config";

export const revalidate = 60;

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  return {
    title: locale === "ar" ? "الخصوصية والشروط | متجر التفرّد" : "Privacy & Terms | Tafarud Store",
    alternates: { canonical: `${BASE_URL}/${locale}/privacy` },
  };
}

async function getPageContent(): Promise<Record<string, string>> {
  try {
    const supabase = await createClient();
    const { data } = await supabase
      .from("store_settings")
      .select("key, value")
      .in("key", ["privacy_ar", "privacy_en", "terms_ar", "terms_en"]);
    const kv: Record<string, string> = {};
    (data || []).forEach((r) => { kv[r.key] = r.value as string; });
    return kv;
  } catch {
    return {};
  }
}

// Default hardcoded content as fallback
const DEFAULT_PRIVACY_AR = `نحن في متجر التفرّد نحترم خصوصيتك ونلتزم بحماية بياناتك الشخصية. توضح هذه السياسة كيفية جمع واستخدام وحماية معلوماتك.

المعلومات التي نجمعها
نجمع المعلومات التي تقدمها لنا مباشرة عند استخدام خدماتنا، مثل الاسم والبريد الإلكتروني وعنوان التوصيل عند إتمام عملية الشراء.

كيف نستخدم المعلومات
نستخدم المعلومات المجمعة لمعالجة الطلبات، تحسين خدماتنا، والتواصل معك بشأن طلباتك ومنتجاتنا الجديدة.

حماية المعلومات
نتخذ إجراءات أمنية مناسبة لحماية معلوماتك الشخصية من الوصول غير المصرح به أو التعديل أو الإفصاح أو الإتلاف.

ملفات تعريف الارتباط
نستخدم ملفات تعريف الارتباط لتحسين تجربة التصفح وتذكر تفضيلاتك.`;

const DEFAULT_PRIVACY_EN = `At Tafarud Store, we respect your privacy and are committed to protecting your personal data. This policy explains how we collect, use, and protect your information.

Information We Collect
We collect information you provide directly when using our services, such as name, email, and shipping address during purchases.

How We Use Information
We use collected information to process orders, improve our services, and communicate with you about your orders and new products.

Information Protection
We implement appropriate security measures to protect your personal information from unauthorized access, modification, disclosure, or destruction.

Cookies
We use cookies to enhance your browsing experience and remember your preferences.`;

const DEFAULT_TERMS_AR = `باستخدامك لمتجر التفرّد، فإنك توافق على الشروط والأحكام التالية. يرجى قراءتها بعناية.

الاستخدام
يُسمح باستخدام المتجر للأغراض المشروعة فقط. يُحظر أي استخدام ينتهك القوانين المعمول بها.

المنتجات والأسعار
نبذل قصارى جهدنا لتوفير معلومات دقيقة عن المنتجات والأسعار. نحتفظ بالحق في تعديل الأسعار دون إشعار مسبق.

الملكية الفكرية
جميع المحتويات المعروضة في المتجر محمية بموجب قوانين الملكية الفكرية. يُحظر نسخ أو توزيع أي محتوى دون إذن مسبق.

التواصل
لأي استفسارات حول هذه الشروط، يرجى التواصل معنا عبر صفحة "من نحن".`;

const DEFAULT_TERMS_EN = `By using Tafarud Store, you agree to the following terms and conditions. Please read them carefully.

Usage
The store may only be used for lawful purposes. Any use that violates applicable laws is prohibited.

Products and Pricing
We strive to provide accurate product and pricing information. We reserve the right to modify prices without prior notice.

Intellectual Property
All content displayed in the store is protected by intellectual property laws. Copying or distributing any content without prior permission is prohibited.

Contact
For any inquiries about these terms, please contact us through the "About Us" page.`;

export default async function PrivacyPage() {
  const [locale, t, content] = await Promise.all([
    getLocale(),
    getTranslations("common"),
    getPageContent(),
  ]);

  const isAr = locale === "ar";
  const privacyText = isAr
    ? (content.privacy_ar || DEFAULT_PRIVACY_AR)
    : (content.privacy_en || DEFAULT_PRIVACY_EN);
  const termsText = isAr
    ? (content.terms_ar || DEFAULT_TERMS_AR)
    : (content.terms_en || DEFAULT_TERMS_EN);

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-12 sm:py-16">
      <Breadcrumb
        items={[
          { label: t("home"), href: `/${locale}` },
          { label: t("privacyTerms") },
        ]}
      />

      <AnimatedSection>
        <h1 className="text-4xl font-bold text-dark mb-8">{t("privacyTerms")}</h1>
      </AnimatedSection>

      <div className="prose prose-lg max-w-none space-y-8">
        {/* Privacy Policy */}
        <section>
          <h2 className="text-2xl font-bold text-dark mb-4">{t("privacy")}</h2>
          <div className="text-dark-light leading-relaxed whitespace-pre-wrap">
            {privacyText}
          </div>
        </section>

        <hr className="border-border" />

        {/* Terms & Conditions */}
        <section>
          <h2 className="text-2xl font-bold text-dark mb-4">{t("terms")}</h2>
          <div className="text-dark-light leading-relaxed whitespace-pre-wrap">
            {termsText}
          </div>
        </section>
      </div>
    </div>
  );
}
