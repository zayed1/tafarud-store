import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "متجر التفرّد | Tafarud Store",
  description:
    "متجر التفرّد – نافذتكم إلى إصداراتنا الإبداعية ومنتجاتنا الثقافية. كتب، أدب، ثقافة، تنمية ذاتية.",
  keywords: [
    "متجر التفرّد",
    "Tafarud Store",
    "كتب",
    "أدب",
    "ثقافة",
    "تنمية ذاتية",
    "مجموعة التفرّد",
    "books",
    "Arabic books",
  ],
  authors: [{ name: "مجموعة التفرّد | Tafarud Group" }],
  openGraph: {
    title: "متجر التفرّد | Tafarud Store",
    description:
      "نافذتكم إلى إصداراتنا الإبداعية ومنتجاتنا الثقافية",
    siteName: "متجر التفرّد | Tafarud Store",
    type: "website",
    locale: "ar_AE",
    alternateLocale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "متجر التفرّد | Tafarud Store",
    description:
      "نافذتكم إلى إصداراتنا الإبداعية ومنتجاتنا الثقافية",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
