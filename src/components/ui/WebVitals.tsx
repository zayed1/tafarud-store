"use client";

import { useReportWebVitals } from "next/web-vitals";

export default function WebVitals() {
  useReportWebVitals((metric) => {
    // Log to console in development
    if (process.env.NODE_ENV === "development") {
      const { name, value, rating } = metric;
      const color = rating === "good" ? "green" : rating === "needs-improvement" ? "orange" : "red";
      // eslint-disable-next-line no-console
      console.log(`%c[${name}] ${Math.round(value)}ms (${rating})`, `color: ${color}`);
    }
  });

  return null;
}
