import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "متجر التفرّد | Tafarud Store",
  description:
    "متجر التفرّد – نافذتكم إلى إصداراتنا الإبداعية ومنتجاتنا الثقافية",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
