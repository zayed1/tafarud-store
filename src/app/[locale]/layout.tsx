import { NextIntlClientProvider, hasLocale } from "next-intl";
import { notFound } from "next/navigation";
import { routing } from "@/i18n/routing";
import Header from "@/components/layout/Header";
import AnnouncementBar from "@/components/store/AnnouncementBar";
import Footer from "@/components/layout/Footer";
import BackToTop from "@/components/ui/BackToTop";
import PageTransition from "@/components/ui/PageTransition";
import { ToastProvider } from "@/components/ui/Toast";
import WebVitals from "@/components/ui/WebVitals";
import { BASE_URL } from "@/lib/config";
import { createClient } from "@/lib/supabase/server";
import MaintenanceGate from "@/components/store/MaintenanceGate";

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  const messages = (await import(`../../messages/${locale}.json`)).default;
  const dir = locale === "ar" ? "rtl" : "ltr";

  // Check maintenance mode (skip for admin pages)
  let isMaintenanceMode = false;
  try {
    const supabase = await createClient();
    const { data } = await supabase.from("store_settings").select("value").eq("key", "maintenance_mode").single();
    if (data?.value === true || data?.value === "true") isMaintenanceMode = true;
  } catch { /* not in maintenance */ }

  return (
    <html lang={locale} dir={dir} suppressHydrationWarning id="top">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=IBM+Plex+Sans+Arabic:wght@400;600;700&family=Inter:wght@400;600;700&display=swap" rel="stylesheet" />
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#0D8070" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <link rel="apple-touch-icon" href="/main/iconn.png" />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              try {
                if (localStorage.theme === 'dark' || (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
                  document.documentElement.classList.add('dark');
                }
                var dt = localStorage.getItem('design-theme');
                if (dt && dt !== 'classic') {
                  document.documentElement.classList.add('theme-' + dt);
                }
              } catch (e) {}
              if ('serviceWorker' in navigator) {
                navigator.serviceWorker.register('/sw.js').catch(() => {});
              }
            `,
          }}
        />
      </head>
      <body className="antialiased min-h-screen flex flex-col">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Organization",
              name: "متجر التفرّد - Tafarud Store",
              url: BASE_URL,
              contactPoint: {
                "@type": "ContactPoint",
                telephone: "+971504677161",
                contactType: "customer service",
                availableLanguage: ["Arabic", "English"],
              },
              sameAs: ["https://altafarud.com"],
            }),
          }}
        />
        <NextIntlClientProvider locale={locale} messages={messages}>
          <ToastProvider>
            <MaintenanceGate isEnabled={isMaintenanceMode}>
              <a
                href="#main-content"
                className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:start-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-primary focus:text-white focus:rounded-lg focus:shadow-lg focus:text-sm focus:font-medium"
              >
                {locale === "ar" ? "تخطي إلى المحتوى" : "Skip to content"}
              </a>
              <AnnouncementBar />
              <Header />
              <main id="main-content" className="flex-1" role="main" aria-label={locale === "ar" ? "المحتوى الرئيسي" : "Main content"}>
                <PageTransition>{children}</PageTransition>
              </main>
              <Footer />
              <BackToTop />
              <WebVitals />
            </MaintenanceGate>
          </ToastProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
