import Link from "next/link";

interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface BreadcrumbProps {
  items: BreadcrumbItem[];
}

export default function Breadcrumb({ items }: BreadcrumbProps) {
  return (
    <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-sm text-muted mb-8 overflow-x-auto">
      {items.map((item, index) => (
        <span key={index} className="flex items-center gap-2 flex-shrink-0">
          {index > 0 && (
            <svg className="w-4 h-4 rtl:rotate-180 text-border" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          )}
          {item.href ? (
            <Link href={item.href} className="hover:text-primary transition-colors">
              {item.label}
            </Link>
          ) : (
            <span className="text-dark font-medium truncate">{item.label}</span>
          )}
        </span>
      ))}
    </nav>
  );
}
