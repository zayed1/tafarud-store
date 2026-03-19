import { getLocale, getTranslations } from "next-intl/server";
import Breadcrumb from "@/components/ui/Breadcrumb";
import AnimatedSection from "@/components/ui/AnimatedSection";
import type { Metadata } from "next";
import { BASE_URL } from "@/lib/config";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  return {
    title: locale === "ar" ? "الخصوصية والشروط | متجر التفرّد" : "Privacy & Terms | Tafarud Store",
    alternates: { canonical: `${BASE_URL}/${locale}/privacy` },
  };
}

export default async function PrivacyPage() {
  const locale = await getLocale();
  const t = await getTranslations("common");

  const isAr = locale === "ar";

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
          <div className="text-dark-light leading-relaxed space-y-4">
            {isAr ? (
              <>
                <p>نحن في متجر التفرّد نحترم خصوصيتك ونلتزم بحماية بياناتك الشخصية. توضح هذه السياسة كيفية جمع واستخدام وحماية معلوماتك.</p>
                <h3 className="text-lg font-semibold text-dark">المعلومات التي نجمعها</h3>
                <p>نجمع المعلومات التي تقدمها لنا مباشرة عند استخدام خدماتنا، مثل الاسم والبريد الإلكتروني وعنوان التوصيل عند إتمام عملية الشراء.</p>
                <h3 className="text-lg font-semibold text-dark">كيف نستخدم المعلومات</h3>
                <p>نستخدم المعلومات المجمعة لمعالجة الطلبات، تحسين خدماتنا، والتواصل معك بشأن طلباتك ومنتجاتنا الجديدة.</p>
                <h3 className="text-lg font-semibold text-dark">حماية المعلومات</h3>
                <p>نتخذ إجراءات أمنية مناسبة لحماية معلوماتك الشخصية من الوصول غير المصرح به أو التعديل أو الإفصاح أو الإتلاف.</p>
                <h3 className="text-lg font-semibold text-dark">ملفات تعريف الارتباط</h3>
                <p>نستخدم ملفات تعريف الارتباط لتحسين تجربة التصفح وتذكر تفضيلاتك.</p>
              </>
            ) : (
              <>
                <p>At Tafarud Store, we respect your privacy and are committed to protecting your personal data. This policy explains how we collect, use, and protect your information.</p>
                <h3 className="text-lg font-semibold text-dark">Information We Collect</h3>
                <p>We collect information you provide directly when using our services, such as name, email, and shipping address during purchases.</p>
                <h3 className="text-lg font-semibold text-dark">How We Use Information</h3>
                <p>We use collected information to process orders, improve our services, and communicate with you about your orders and new products.</p>
                <h3 className="text-lg font-semibold text-dark">Information Protection</h3>
                <p>We implement appropriate security measures to protect your personal information from unauthorized access, modification, disclosure, or destruction.</p>
                <h3 className="text-lg font-semibold text-dark">Cookies</h3>
                <p>We use cookies to enhance your browsing experience and remember your preferences.</p>
              </>
            )}
          </div>
        </section>

        <hr className="border-border" />

        {/* Terms & Conditions */}
        <section>
          <h2 className="text-2xl font-bold text-dark mb-4">{t("terms")}</h2>
          <div className="text-dark-light leading-relaxed space-y-4">
            {isAr ? (
              <>
                <p>باستخدامك لمتجر التفرّد، فإنك توافق على الشروط والأحكام التالية. يرجى قراءتها بعناية.</p>
                <h3 className="text-lg font-semibold text-dark">الاستخدام</h3>
                <p>يُسمح باستخدام المتجر للأغراض المشروعة فقط. يُحظر أي استخدام ينتهك القوانين المعمول بها.</p>
                <h3 className="text-lg font-semibold text-dark">المنتجات والأسعار</h3>
                <p>نبذل قصارى جهدنا لتوفير معلومات دقيقة عن المنتجات والأسعار. نحتفظ بالحق في تعديل الأسعار دون إشعار مسبق.</p>
                <h3 className="text-lg font-semibold text-dark">الملكية الفكرية</h3>
                <p>جميع المحتويات المعروضة في المتجر محمية بموجب قوانين الملكية الفكرية. يُحظر نسخ أو توزيع أي محتوى دون إذن مسبق.</p>
                <h3 className="text-lg font-semibold text-dark">التواصل</h3>
                <p>لأي استفسارات حول هذه الشروط، يرجى التواصل معنا عبر صفحة &quot;من نحن&quot;.</p>
              </>
            ) : (
              <>
                <p>By using Tafarud Store, you agree to the following terms and conditions. Please read them carefully.</p>
                <h3 className="text-lg font-semibold text-dark">Usage</h3>
                <p>The store may only be used for lawful purposes. Any use that violates applicable laws is prohibited.</p>
                <h3 className="text-lg font-semibold text-dark">Products and Pricing</h3>
                <p>We strive to provide accurate product and pricing information. We reserve the right to modify prices without prior notice.</p>
                <h3 className="text-lg font-semibold text-dark">Intellectual Property</h3>
                <p>All content displayed in the store is protected by intellectual property laws. Copying or distributing any content without prior permission is prohibited.</p>
                <h3 className="text-lg font-semibold text-dark">Contact</h3>
                <p>For any inquiries about these terms, please contact us through the &quot;About Us&quot; page.</p>
              </>
            )}
          </div>
        </section>
      </div>
    </div>
  );
}
